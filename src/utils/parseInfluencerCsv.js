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
  CONTACT_REASONS,
  CONTACT_STATUSES,
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

export function parseCsvRow(line) {
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
/**
 * 헤더 이름 정규화 — 소문자 + 연속 공백을 한 칸으로.
 *
 * 헤더 셀 안에 줄바꿈이 있으면("Upload␣⏎Date") collapseMultilineFields가 공백으로
 * 바꾸면서 "upload  date"(공백 2칸)가 된다. 조회 키는 전부 한 칸("upload date")이라
 * 이름이 어긋나 그 열이 통째로 버려진다 — 실제로 G10 시트의 Upload Date 열 전체가
 * 조용히 null이 됐다(D+14 성과 큐가 그 날짜에 걸려 있어 기능이 통째로 죽었다).
 */
function normalizeHeader(h) {
  return h.trim().toLowerCase().replace(/\s+/g, ' ');
}

function csvTextToObjects(csvText) {
  const lines = collapseMultilineFields(csvText).trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  // Primary: find any row with 'full name' (unambiguous influencer header marker)
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]).map(normalizeHeader);
    if (cells.includes('full name')) {
      headerIdx = i;
      break;
    }
  }

  // Fallback: find first row containing at least 3 of the broader markers
  if (headerIdx === -1) {
    const FALLBACK_MARKERS = ['barcode', 'store', 'platform', 'agreement', 'attend'];
    for (let i = 0; i < lines.length; i++) {
      const cells = parseCsvRow(lines[i]).map(normalizeHeader);
      if (FALLBACK_MARKERS.filter(m => cells.includes(m)).length >= 3) {
        headerIdx = i;
        break;
      }
    }
  }

  if (headerIdx === -1) return [];

  const headers = parseCsvRow(lines[headerIdx]).map(normalizeHeader);

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

/**
 * credit used 열 해석.
 *
 * 시트는 이 칸에 사용 날짜를 적는다(TRUE/FALSE가 아니다). 날짜든 TRUE든 값이
 * 있으면 사용한 것으로 본다. 빈 칸은 미기록이므로 false — 그 구분은
 * hasCreditUsedValue가 따로 들고 있다.
 *
 * @param {string} val
 * @returns {boolean}
 */
function parseCreditUsed(val) {
  const v = (val || '').trim();
  if (!v) return false;
  if (parseBool(v)) return true;
  if (/^(false|no|n)$/i.test(v)) return false;
  return true;
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

/**
 * 셀에 시각까지 적혀 있는지 판별한다.
 * 날짜만 있는 셀은 parseDate가 자정으로 만들어 버리는데, 이를 "12:00 AM 방문"으로
 * 표시하면 없는 정보를 있는 것처럼 보여주게 된다(실데이터 52건).
 *
 * @param {string} val - 원본 셀 값
 * @returns {boolean}
 */
function hasTimeOfDay(val) {
  if (!val) return false;
  return /\d\s*(am|pm)\b/i.test(val) || /\d{1,2}:\d{2}/.test(val);
}

/**
 * 숫자 셀 해석 — 천 단위 콤마·공백을 벗기고, K/M 접미사를 해석한다.
 *
 * 두 번 데였다: "8,794"는 parseInt가 콤마에서 멈춰 8이 됐고(ER 7350%),
 * "3.4K"는 소수점에서 멈춰 3이 됐다(ER 2866.7%). 앱이 숫자를 "3.4K"로 보여주니
 * 시트에 그대로 옮겨 적히는 건 막을 수 없다 — 파서가 흡수한다.
 *
 * 패턴에 안 맞는 값은 앞자리만 잘라 읽지 않고 null(미측정)로 둔다 —
 * 틀린 숫자는 빈 칸보다 나쁘다(불가능한 ER로 순위 1등에 올라간다).
 */
function parseNum(val) {
  const raw = (val || '').replace(/[,\s]/g, '');
  if (!raw) return null;
  const m = raw.match(/^(\d+(?:\.\d+)?)([kKmM])?$/);
  if (!m) return null;
  const multiplier = !m[2] ? 1 : m[2].toLowerCase() === 'k' ? 1000 : 1000000;
  return Math.round(parseFloat(m[1]) * multiplier);
}

function parseMonth(val) {
  if (!val) return 0;
  // Handle "2026-07" → 7
  const dashMatch = val.match(/\d{4}-(\d{1,2})/);
  if (dashMatch) return parseInt(dashMatch[1], 10);
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

/* Instagram·TikTok 핸들 문법 — 영숫자·밑줄·점만, 30자 이내.
   URL을 만드는 쪽과 URL에서 핸들을 되짚는 쪽이 같은 기준을 써야
   "링크는 있는데 핸들은 없는" 어긋남이 생기지 않는다. */
const HANDLE_PATTERN = /^[A-Za-z0-9._]{1,30}$/;

function normalizeSocialUrl(raw, platform) {
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  const username = raw.replace(/^@/, '').trim();
  /* 핸들 문법에 맞지 않는 셀은 링크를 만들지 않는다. 이 칸에는 자기소개가
     들어오는 행이 있어서("Karol en Atlanta 🇺🇸🇭🇳"), 검증 없이 URL 틀에
     끼우면 상세 패널 링크가 없는 주소로 간다. 깨진 링크보다 링크 없음이 낫다. */
  if (!HANDLE_PATTERN.test(username)) return '';
  const p = platform.toLowerCase();
  if (p.includes('tiktok')) return `https://www.tiktok.com/@${username}`;
  return `https://www.instagram.com/${username}`;
}

/**
 * Manual overrides keyed by lowercased "Full Name", for rows whose "Social Account"
 * cell can't produce the creator's real profile link:
 *
 * 1. 셀이 핸들이 아니라 자기소개인 행 — "Toni | Lifestyle + UGC Creator", "🍭Eden Era🎀".
 *    normalizeSocialUrl이 링크를 못 만든다(핸들 문법 불통과).
 * 2. 셀이 **핸들처럼 생겼지만 실제 계정이 아닌** 행 — "Wannie_N" 같은 약칭. 문법은
 *    통과하니 링크는 만들어지는데, 그 주소에 그 사람이 없다. 이쪽이 더 위험하다:
 *    깨진 링크는 눈에 띄지만 남의 계정으로 가는 링크는 조용히 틀린다.
 *
 * Verified against each creator's real profile.
 */
const SOCIAL_URL_OVERRIDES = {
  'jakkah kebbay': 'https://www.tiktok.com/@oyastormm',
  'toni ellis': 'https://www.tiktok.com/@itstimewithtoni',
  'eden mbunwe': 'https://www.tiktok.com/@its_yourgurrl_eden',
  'karima muhammadpoe': 'https://www.tiktok.com/@itskarimarima',
  'maría josé galindez': 'https://www.tiktok.com/@soymarijolife',
  'breana waynick': 'https://www.tiktok.com/@knotslater',
  'chondra styles': 'https://www.tiktok.com/@chonieb_',
  'zadie franklin': 'https://www.tiktok.com/@wellness.traveler?lang=en',
  'shamiyah harris': 'https://www.tiktok.com/@millionswithmiyah',
  'jadeen verme': 'https://www.tiktok.com/@jadeenvermee',
  'yuleidys': 'https://www.instagram.com/yuleidyspalacio',
  'rosalia serrano': 'https://www.instagram.com/rosaliaserranodina',
  'jaziah reid': 'https://www.tiktok.com/@jaziahvictor',
  /* 시트 platform은 TikTok이지만 본인 확인이 된 건 Instagram 쪽이라
     (bio "Hondureña 🇭🇳 in 📍ATL" = 셀의 "Karol en Atlanta 🇺🇸🇭🇳")
     확실한 링크를 쓴다. TikTok 후보(@karollmedinag)는 동일인 확인 불가. */
  'karol medina': 'https://www.instagram.com/karolmedinag',
  /* 셀은 "Wannie_N"(약칭)이라 tiktok.com/@Wannie_N 로 가버렸다 — 본인 계정이 아니다.
     이름·이메일(teamwannie01@gmail.com)로 확인된 실제 TikTok은 @wannienshobole. */
  'wannie nshobole': 'https://www.tiktok.com/@wannienshobole',
};

function resolveSocialUrl(fullName, raw, platform) {
  const override = SOCIAL_URL_OVERRIDES[fullName.trim().toLowerCase()];
  if (override) return override;
  return normalizeSocialUrl(raw, platform);
}

/**
 * 프로필 URL에서 순수 핸들만 뽑는다. "https://www.tiktok.com/@oyastormm" -> "oyastormm".
 *
 * 시트의 "social account" 칸을 직접 쓰지 않고 **이미 정규화된 URL**에서 되짚는 이유는,
 * 그 칸에 핸들이 아닌 자기소개가 들어온 행이 있어서다("Toni | Lifestyle + UGC Creator" 등).
 * resolveSocialUrl이 오버라이드로 그런 행을 이미 정리했으므로, 여기서 되짚으면
 * 상세 패널 링크와 목록 핸들이 언제나 같은 사람을 가리킨다.
 * URL을 못 만든 행은 핸들도 없다 — 없는 값을 만들지 않는다.
 *
 * @param {string} url
 * @returns {string} 핸들(@ 없이) 또는 ''
 */
function handleFromUrl(url) {
  if (!url) return '';
  const path = url.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const last = path.split('/').pop() || '';
  const handle = last.replace(/^@/, '').trim();
  /* normalizeSocialUrl이 만든 URL은 이미 검증됐지만, 셀에 URL을 통째로 붙여 넣은
     행과 오버라이드는 그대로 통과해 오므로 여기서도 핸들 문법을 확인한다
     (경로 끝이 핸들이 아닐 수 있다 — "?lang=en"은 위에서 벗겼어도 경로 자체가
     프로필이 아닌 URL일 수 있다). */
  return HANDLE_PATTERN.test(handle) ? handle : '';
}

function parseOpinion(val) {
  if (!val) return null;
  const upper = val.trim().toUpperCase();
  if (upper === OPINIONS.USE) return OPINIONS.USE;
  if (upper === OPINIONS.MAYBE) return OPINIONS.MAYBE;
  if (upper === "DON'T" || upper === 'DONT') return OPINIONS.DONT;
  return null;
}

function parseContactReason(val) {
  if (!val) return null;
  const norm = val.trim().toLowerCase().replace(/\s+/g, '-');
  if (norm === 'no-show') return CONTACT_REASONS.NO_SHOW;
  if (norm === 'reschedule-request' || norm === 'reschedule') return CONTACT_REASONS.RESCHEDULE_REQUEST;
  return null;
}

function parseContactStatus(val) {
  if (!val) return null;
  const norm = val.trim().toLowerCase().replace(/\s+/g, '-');
  if (norm === 'pending-reply' || norm === 'pending') return CONTACT_STATUSES.PENDING_REPLY;
  if (norm === 'replied') return CONTACT_STATUSES.REPLIED;
  /* 구 No Response 값 — 상태로는 폐기됐지만(경과일로 파생) 시트에 남은 행이
     있을 수 있다. null로 버리면 그 행의 경보가 꺼져버리므로 pending-reply로 흡수한다. */
  if (norm === 'no-response') return CONTACT_STATUSES.PENDING_REPLY;
  if (norm === 'dropped' || norm === 'drop') return CONTACT_STATUSES.DROPPED;
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
 * @param {string} [idPrefix] - 소스 구분자. 여러 시트를 병합할 때 행 번호가 겹쳐
 *   같은 id가 생기는 걸 막는다 (예: 'GA_' → 'GA_Processing_0')
 * @returns {Influencer[]}
 */
export function parseInfluencerCsv(csvText, defaultStatus = SHEET_STATUS.PROCESSING, idPrefix = '') {
  const rows = csvTextToObjects(csvText);

  const TIME_KEYS = ['time', 'aprox. visit date', 'approx. visit date', 'visit date', 'scheduled time', 'visit time'];

  let currentStatus = defaultStatus;
  const result = [];

  for (const row of rows) {
    const rawName = (row['full name'] || '').trim();
    const socialHandle = (row['social account'] || '').trim();

    /* 이름 칸이 비었다고 전부 빈 줄은 아니다.
       Done 탭에 이름만 안 적힌 실제 방문 기록이 있었다 — 바코드·소셜 계정·방문일이
       있고 attend가 TRUE인데, "이름 없음 = 빈 줄"로 보고 통째로 버려서
       인원·방문·업로드 집계가 그만큼 적게 나왔다.

       소셜 계정이 있으면 사람을 특정할 수 있으므로 그 계정을 이름 자리에 쓴다.
       (실데이터 기준 이 조건에 걸리는 행은 2건이고, 나머지 963개 빈 줄은 그대로 걸러진다.) */
    const isMarkerOrBlank = !rawName && !socialHandle;
    if (isMarkerOrBlank) {
      const allVals = Object.values(row).join(' ').toLowerCase();
      if (allVals.includes('done')) {
        currentStatus = SHEET_STATUS.DONE;
      } else if (allVals.includes('planning')) {
        // Planning section is ignored — rows after this marker are Processing
        currentStatus = SHEET_STATUS.PROCESSING;
      }
      continue;
    }

    const fullName = rawName || socialHandle;

    const barcode = row['barcode'] || '';
    const rawTime = TIME_KEYS.map(k => row[k]).find(v => v) || '';
    const scheduledTime = parseDate(rawTime);

    const socialUrl = resolveSocialUrl(fullName, row['social account'], row['platform'] || '');

    const partial = {
      id: `${idPrefix}${currentStatus}_${result.length}`,
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
      /** 시트의 full name 칸에 값이 있었는지. false면 소셜 계정을 이름 자리에 쓴 것이다 */
      hasFullName: Boolean(rawName),
      socialAccountUrl: socialUrl,
      /** 목록 행에 보여줄 핸들(@ 없이). 상세 패널 링크와 같은 출처에서 되짚은 값이다 */
      socialHandle: handleFromUrl(socialUrl),
      email: row['email'] || '',
      scheduledTime,
      hasScheduledTimeOfDay: hasTimeOfDay(rawTime),
      agreement: parseBool(row['agreement']),
      attend: parseBool(row['attend']),
      collaboShared: parseBool(row['collabo shared']),
      collaboLink: row['collabo link'] || '',
      uploadDate: parseDate(row['upload date']),
      creditShared: parseBool(row['credit shared']),
      // 이 열은 TRUE/FALSE가 아니라 사용한 **날짜**를 적는다(예: 3/10/2026).
      // parseBool만 쓰면 날짜를 못 읽어 전부 false가 되고, 퍼널이 "발급분 전량 미사용"이 된다.
      creditUsed: parseCreditUsed(row['credit used']),
      // 셀이 비어 있으면 값이 false가 되는데, 그건 "사용 안 함"이 아니라 "아직 안 적음"이다.
      // 측정이 시작됐는지를 따로 남겨 미측정을 0으로 계산하지 않는다.
      hasCreditUsedValue: Boolean((row['credit used'] || '').trim()),
      serialNumber: row['serial #'] || row['serial#'] || '',
      opinion: parseOpinion(row['opinion']),
      // 성과 지표를 적은 날 — D+14 큐 판정(derivePerformanceStatus)이 이 값으로 "기록됨"을 안다
      recordDate: parseDate(row['record date']),
      views: parseNum(row['views']),
      likes: parseNum(row['likes']),
      shares: parseNum(row['shares']),
      saves: parseNum(row['saves']),
      comments: parseNum(row['comments']),
      reposts: parseNum(row['reposts']),
      note: row['note'] || '',
      contactReason: parseContactReason(row['contact reason']),
      contactStatus: parseContactStatus(row['contact status']),
      lastContactDate: parseDate(row['last contact date']),
      requestedDate: parseDate(row['requested date']),
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
