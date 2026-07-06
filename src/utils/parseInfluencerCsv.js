/**
 * BeautyMaster — CSV Parser
 *
 * Converts raw Google Sheets CSV text into typed Influencer objects.
 * All header matching is case-insensitive to handle spreadsheet variations.
 */

import {
  createInfluencer,
  deriveTier,
  deriveScheduleGroup,
  deriveAlertFlags,
  PLATFORMS,
  CATEGORIES,
  OPINIONS,
  SHEET_STATUS,
} from '../data/beautymaster/schema.js';

// ─── Low-level CSV utilities ─────────────────────────────────────────────────

/**
 * Google Sheets CSV can include newlines inside quoted cells (e.g. "Collabo\nShared").
 * This collapses embedded newlines to a single space, and strips soft-hyphens
 * (e.g. "Agree-\nment" → "Agreement") so headers parse as single tokens.
 */
function collapseMultilineFields(text) {
  let result = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = i + 1 < text.length ? text[i + 1] : '';
    if (ch === '"') {
      if (inQuotes && next === '"') {
        result += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        result += ch;
      }
    } else if (inQuotes && ch === '\r' && next === '\n') {
      if (result.endsWith('-')) result = result.slice(0, -1);
      else result += ' ';
      i++;
    } else if (inQuotes && (ch === '\n' || ch === '\r')) {
      if (result.endsWith('-')) result = result.slice(0, -1);
      else result += ' ';
    } else {
      result += ch;
    }
  }
  return result;
}

function parseCsvRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/**
 * Convert CSV text to row objects with lowercase-normalized keys.
 * Skips leading title/blank rows by searching for the header row
 * (the first row that contains any known column name).
 */
function csvTextToObjects(csvText) {
  const lines = collapseMultilineFields(csvText).trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  // Primary: find any row with 'full name' (unambiguous influencer header marker)
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]).map(c => c.trim().toLowerCase());
    if (cells.includes('full name')) {
      headerIdx = i;
      break;
    }
  }

  // Fallback: find first row containing at least 3 of the broader markers
  if (headerIdx === -1) {
    const FALLBACK_MARKERS = ['barcode', 'store', 'platform', 'agreement', 'attend'];
    for (let i = 0; i < lines.length; i++) {
      const cells = parseCsvRow(lines[i]).map(c => c.trim().toLowerCase());
      if (FALLBACK_MARKERS.filter(m => cells.includes(m)).length >= 3) {
        headerIdx = i;
        break;
      }
    }
  }

  if (headerIdx === -1) return [];

  // Normalize all header names to lowercase for case-insensitive matching
  const headers = parseCsvRow(lines[headerIdx]).map(h => h.trim().toLowerCase());

  // eslint-disable-next-line no-console
  console.log('[BeautyMaster CSV] header row index:', headerIdx, '| headers:', headers);

  const rows = lines.slice(headerIdx + 1).map(line => {
    const values = parseCsvRow(line);
    const row = {};
    headers.forEach((header, i) => {
      row[header] = (values[i] ?? '').trim();
    });
    return row;
  });

  // eslint-disable-next-line no-console
  console.log('[BeautyMaster CSV] total data rows:', rows.length);

  return rows;
}

// ─── Field coercion helpers ───────────────────────────────────────────────────

function parseBool(val) {
  return val === 'TRUE' || val === 'true' || val === '1';
}

function parseDate(val) {
  if (!val) return null;
  // Handle "M/D/YYYY HHam" / "M/D/YYYY H:MMpm" formats from Google Sheets
  const ampmMatch = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (ampmMatch) {
    const [, mo, dy, yr, hr, mn = '0', meridiem] = ampmMatch;
    let hour = parseInt(hr, 10);
    if (meridiem.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (meridiem.toLowerCase() === 'am' && hour === 12) hour = 0;
    return new Date(parseInt(yr, 10), parseInt(mo, 10) - 1, parseInt(dy, 10), hour, parseInt(mn, 10), 0);
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

function parseNum(val) {
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function parseMonth(val) {
  if (!val) return 0;
  // Handle "2026-07" → 7
  const dashMatch = val.match(/\d{4}-(\d{1,2})/);
  if (dashMatch) return parseInt(dashMatch[1], 10);
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

function normalizeSocialUrl(raw, platform) {
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  const username = raw.replace(/^@/, '').trim();
  if (!username) return '';
  const p = platform.toLowerCase();
  if (p.includes('tiktok')) return `https://www.tiktok.com/@${username}`;
  return `https://www.instagram.com/${username}`;
}

function parseOpinion(val) {
  if (!val) return null;
  const upper = val.trim().toUpperCase();
  if (upper === OPINIONS.USE) return OPINIONS.USE;
  if (upper === OPINIONS.MAYBE) return OPINIONS.MAYBE;
  if (upper === "DON'T" || upper === 'DONT') return OPINIONS.DONT;
  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Convert a raw CSV string into Influencer objects.
 *
 * Handles the single-sheet structure where Processing / Done / Planning are
 * sections separated by colored divider rows (e.g. "↓ Done ↓", "↓ Planning ↓").
 * The defaultStatus param is used until a divider row changes it.
 *
 * @param {string} csvText
 * @param {'Processing'|'Done'} [defaultStatus]
 * @returns {Influencer[]}
 */
export function parseInfluencerCsv(csvText, defaultStatus = SHEET_STATUS.PROCESSING) {
  const rows = csvTextToObjects(csvText);

  const TIME_KEYS = ['time', 'aprox. visit date', 'approx. visit date', 'visit date', 'scheduled time', 'visit time'];

  let currentStatus = defaultStatus;
  const result = [];

  for (const row of rows) {
    const fullName = row['full name'] || '';

    // Rows without a full name are either blank rows or section dividers
    if (!fullName) {
      const allVals = Object.values(row).join(' ').toLowerCase();
      if (allVals.includes('done')) {
        currentStatus = SHEET_STATUS.DONE;
      } else if (allVals.includes('planning')) {
        // Planning section is ignored — rows after this marker are Processing
        currentStatus = SHEET_STATUS.PROCESSING;
      }
      continue;
    }

    const barcode = row['barcode'] || '';
    const rawTime = TIME_KEYS.map(k => row[k]).find(v => v) || '';
    const scheduledTime = parseDate(rawTime);

    const partial = {
      id: `${currentStatus}_${result.length}`,
      sheetStatus: currentStatus,
      store: row['store'] || '',
      month: parseMonth(row['month']),
      barcode,
      tier: deriveTier(barcode),
      platform: row['platform'] || PLATFORMS.INSTAGRAM,
      category: (row['category'] || '').toLowerCase().replace(/[-\s]/g, '') || CATEGORIES.GENERAL,
      creditType: row['type'] || '',
      imageUrl: row['image'] || '',
      fullName,
      socialAccountUrl: normalizeSocialUrl(row['social account'], row['platform'] || ''),
      email: row['email'] || '',
      scheduledTime,
      agreement: parseBool(row['agreement']),
      attend: parseBool(row['attend']),
      collaboShared: parseBool(row['collabo shared']),
      collaboLink: row['collabo link'] || '',
      uploadDate: parseDate(row['upload date']),
      creditShared: parseBool(row['credit shared']),
      creditUsed: parseBool(row['credit used']),
      serialNumber: row['serial #'] || row['serial#'] || '',
      opinion: parseOpinion(row['opinion']),
      views: parseNum(row['views']),
      likes: parseNum(row['likes']),
      shares: parseNum(row['shares']),
      saves: parseNum(row['saves']),
      comments: parseNum(row['comments']),
      reposts: parseNum(row['reposts']),
      note: row['note'] || '',
      scheduleGroup: deriveScheduleGroup(scheduledTime),
    };

    const influencer = createInfluencer(partial);
    influencer.alertFlags = deriveAlertFlags(influencer);
    result.push(influencer);
  }

  // eslint-disable-next-line no-console
  console.log('[BeautyMaster CSV] parsed:', result.length, 'influencers');
  return result;
}
