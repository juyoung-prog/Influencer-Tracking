/**
 * BeautyMaster — Sheet Data Hook
 *
 * Manages localStorage config + delegates CSV polling to useCsvPolling.
 * When no config is saved, returns empty state without starting any fetch.
 *
 * Config format (v2 — multi-source):
 * { sources: [{label, processingCsvUrl, doneCsvUrl}], inviteCountsUrl, pollingIntervalMs, defaultStore }
 *
 * Old single-source configs are automatically migrated on load.
 */

import { useState, useCallback } from 'react';
import { useCsvPolling } from './useCsvPolling.js';
import { createKpiSummary } from '../data/beautymaster/schema.js';

const STORAGE_KEY = 'beautymaster:sheetConfig';

// Shipped default — GA/FL 매장 시트는 고정이라 코드에 기본값으로 내장.
// 관리자가 localStorage에 직접 설정을 저장한 적이 없으면 이 값을 그대로 사용하므로,
// 최초 진입 시 설정 화면 없이 바로 대시보드가 보인다.
const SHEET_ID = '1FEdoUfToSKGJ8oVyDIaj15Oo2YRLasj_kfhlsHkwFI4';

// Links tab — per-store document links (Tier 1/2 Consent Form, Influencer List).
// These change every time a new store opens, so they live in a sheet the team
// can edit directly instead of a code deploy. Published separately from the
// main GA/FL sheet, hence the different published-doc ID.
const STORE_DOCS_PUBLISHED_ID = '2PACX-1vRSMqj2N_FR2RsX9_KMl9ZQzaSjL1HI9GwdDu4GoIh3_t2LGsBEs3JjPidf4hyVQMPdPEYO4HanQRjt';
const STORE_DOCS_URL = `https://docs.google.com/spreadsheets/d/e/${STORE_DOCS_PUBLISHED_ID}/pub?output=csv&gid=1605380523`;

// Influencer Tracking List — the one document link that does NOT vary by
// store, so it's a fixed constant rather than a column in the Links tab.
// Same underlying sheet as the GA/FL sources above (SHEET_ID, gid=0) — a
// plain edit link, not a "Publish to web" link, so people with edit access
// can actually edit it (Publish to web is always read-only for everyone).
const INFLUENCER_TRACKING_LIST_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=0`;

const DEFAULT_CONFIG = {
  sources: [
    { label: 'GA', processingCsvUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0` },
    { label: 'FL', processingCsvUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=1776175069` },
  ],
  inviteCountsUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=778920622`,
  storeDocsUrl: STORE_DOCS_URL,
  pollingIntervalMs: 30000,
  defaultStore: 'all',
};

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    // Migrate old single-source format → new multi-source format
    if (parsed.processingCsvUrl !== undefined) {
      return {
        ...DEFAULT_CONFIG,
        sources: [{
          label: 'Main',
          processingCsvUrl: parsed.processingCsvUrl,
          doneCsvUrl: parsed.doneCsvUrl || '',
        }],
        inviteCountsUrl: parsed.inviteCountsUrl || DEFAULT_CONFIG.inviteCountsUrl,
        pollingIntervalMs: parsed.pollingIntervalMs || 30000,
        defaultStore: parsed.defaultStore || 'all',
      };
    }
    // Merge onto DEFAULT_CONFIG so fields added later (e.g. inviteCountsUrl) are
    // picked up even for configs saved before that field existed.
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

const EMPTY_STATE = {
  influencers: [],
  kpi: createKpiSummary(),
  inviteCounts: {},
  storeDocs: {},
  lastSyncedAt: null,
  isSyncing: false,
  error: null,
  refresh: () => {},
};

/**
 * useSheetData hook
 *
 * @returns {{
 *   influencers: Influencer[],
 *   kpi: KpiSummary,
 *   inviteCounts: Object,
 *   storeDocs: Object,
 *   lastSyncedAt: Date|null,
 *   isSyncing: boolean,
 *   error: Error|null,
 *   refresh: function,
 *   config: object|null,
 *   saveConfig: (config: object) => void,
 *   influencerTrackingListUrl: string
 * }}
 */
export function useSheetData() {
  const [config, setConfig] = useState(loadConfig);

  const saveConfig = useCallback((newConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // localStorage unavailable — still update in-memory state
    }
    setConfig(newConfig);
  }, []);

  const pollingConfig = {
    sources: config?.sources ?? [],
    inviteCountsUrl: config?.inviteCountsUrl ?? '',
    storeDocsUrl: config?.storeDocsUrl ?? '',
    pollingIntervalMs: config?.pollingIntervalMs ?? 30000,
  };

  const polling = useCsvPolling(pollingConfig);

  if (!config) {
    return { ...EMPTY_STATE, config: null, saveConfig, influencerTrackingListUrl: INFLUENCER_TRACKING_LIST_URL };
  }

  return { ...polling, config, saveConfig, influencerTrackingListUrl: INFLUENCER_TRACKING_LIST_URL };
}
