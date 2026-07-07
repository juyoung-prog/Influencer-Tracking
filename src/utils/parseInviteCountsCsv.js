/**
 * BeautyMaster — Invite Counts CSV Parser
 *
 * Parses the "Number" tab: a wide-format sheet tracking how many influencers
 * were actually invited/contacted per store × tier × category. This is
 * separate from (and larger than) the GA/FL tabs, which only list influencers
 * who have entered the agreement/tracking pipeline.
 *
 * Expected shape (repeats per store, 2 tier blocks each):
 *   Store,Tier,Category,,
 *   G10,Tier1,General,Specific,K-Beauty
 *   ,,82,7,12
 *   ,Tier2,General,Specific,K-Beauty
 *   ,,139,21,7
 */

import { parseCsvRow } from './parseInfluencerCsv.js';
import { TIERS, CATEGORIES } from '../data/beautymaster/schema.js';

const TIER_KEYS = {
  tier1: TIERS.TIER1,
  tier2: TIERS.TIER2,
};

function normalizeCategory(label) {
  const key = label.trim().toLowerCase().replace(/[-\s]/g, '');
  if (key === 'kbeauty') return CATEGORIES.KBEAUTY;
  if (key === 'specific') return CATEGORIES.SPECIFIC;
  return CATEGORIES.GENERAL;
}

/**
 * @param {string} csvText
 * @returns {Object<string, Object<string, Object<string, number>>>} { [store]: { [tier]: { [category]: count } } }
 */
export function parseInviteCountsCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim());
  const rows = lines.map(parseCsvRow);

  const result = {};
  let currentStore = null;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const storeCell = (row[0] || '').trim();
    const tierCell = (row[1] || '').trim().toLowerCase();

    if (storeCell) currentStore = storeCell;

    const tierKey = TIER_KEYS[tierCell];
    if (!tierKey || !currentStore) continue;

    const categoryLabels = row.slice(2).map(c => c.trim()).filter(Boolean);
    const valueRow = rows[i + 1] || [];
    const values = valueRow.slice(2);

    if (!result[currentStore]) result[currentStore] = {};
    const tierCounts = {};
    categoryLabels.forEach((label, idx) => {
      const count = parseInt(values[idx], 10);
      tierCounts[normalizeCategory(label)] = isNaN(count) ? 0 : count;
    });
    result[currentStore][tierKey] = tierCounts;
  }

  return result;
}
