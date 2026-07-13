/**
 * BeautyMaster — Store Docs CSV Parser
 *
 * Parses the "Links" tab: one row per store, holding the document links that
 * change whenever a new store opens (tier consent forms, the shared
 * Influencer List). Header matching is case-insensitive so column order or
 * casing in the sheet doesn't break parsing.
 *
 * Expected shape:
 *   Store,Tier1 Consent Form Url,Tier2 Consent Form Url,Tier1 Influencer List Url,Tier2 Influencer List Url
 *   G10,https://forms.gle/...,https://forms.gle/...,https://docs.google.com/...,https://docs.google.com/...
 */

import { parseCsvRow } from './parseInfluencerCsv.js';

/**
 * @param {string} csvText
 * @returns {Object<string, {tier1ConsentFormUrl: string, tier2ConsentFormUrl: string, tier1InfluencerListUrl: string, tier2InfluencerListUrl: string}>}
 */
export function parseStoreDocsCsv(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return {};

  const headers = parseCsvRow(lines[0]).map(h => h.trim().toLowerCase());
  const storeIdx = headers.indexOf('store');
  const tier1FormIdx = headers.indexOf('tier1 consent form url');
  const tier2FormIdx = headers.indexOf('tier2 consent form url');
  const tier1ListIdx = headers.indexOf('tier1 influencer list url');
  const tier2ListIdx = headers.indexOf('tier2 influencer list url');
  if (storeIdx === -1) return {};

  const result = {};
  for (const line of lines.slice(1)) {
    const cells = parseCsvRow(line);
    const store = (cells[storeIdx] || '').trim();
    if (!store) continue;
    result[store] = {
      tier1ConsentFormUrl: (cells[tier1FormIdx] || '').trim(),
      tier2ConsentFormUrl: (cells[tier2FormIdx] || '').trim(),
      tier1InfluencerListUrl: (cells[tier1ListIdx] || '').trim(),
      tier2InfluencerListUrl: (cells[tier2ListIdx] || '').trim(),
    };
  }
  return result;
}
