/**
 * BeautyMaster — Message Templates CSV Parser
 *
 * Parses the "Messages" tab: one row per outreach message template, editable
 * by non-engineers directly in the sheet. Header matching is case-insensitive
 * so column order or casing in the sheet doesn't break parsing.
 *
 * Expected shape:
 *   Id,Label,Track,Trigger Flag,Body
 *   no-show,No-show follow up,auto,no-show-unresolved,"Hi! We noticed..."
 *   invite,Collaboration invite,manual,,"Hi! This is Beauty Master..."
 */

import { parseCsvRow } from './parseInfluencerCsv.js';
import { MESSAGE_TRACKS } from '../data/beautymaster/messageTemplates.js';

/**
 * @param {string} csvText
 * @returns {import('../data/beautymaster/messageTemplates.js').MessageTemplate[]}
 */
export function parseMessageTemplatesCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvRow(lines[0]).map(h => h.trim().toLowerCase());
  const idIdx = headers.indexOf('id');
  const labelIdx = headers.indexOf('label');
  const trackIdx = headers.indexOf('track');
  const triggerIdx = headers.indexOf('trigger flag');
  const bodyIdx = headers.indexOf('body');
  if (labelIdx === -1 || bodyIdx === -1) return [];

  const result = [];
  lines.slice(1).forEach((line, i) => {
    const cells = parseCsvRow(line);
    const label = (cells[labelIdx] || '').trim();
    const body = (cells[bodyIdx] || '').trim();
    if (!label || !body) return;

    const rawTrack = (cells[trackIdx] || '').trim().toLowerCase();
    const track = rawTrack === MESSAGE_TRACKS.AUTO ? MESSAGE_TRACKS.AUTO : MESSAGE_TRACKS.MANUAL;
    const triggerFlag = (cells[triggerIdx] || '').trim() || null;
    const id = (cells[idIdx] || '').trim() || `row-${i}`;

    result.push({ id, label, track, triggerFlag: track === MESSAGE_TRACKS.AUTO ? triggerFlag : null, body });
  });
  return result;
}
