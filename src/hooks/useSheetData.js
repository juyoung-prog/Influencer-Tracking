/**
 * BeautyMaster — Sheet Data Hook
 *
 * Manages localStorage config + delegates CSV polling to useCsvPolling.
 * When no config is saved, returns empty state without starting any fetch.
 *
 * Config format (v2 — multi-source):
 * { sources: [{label, processingCsvUrl, doneCsvUrl}], pollingIntervalMs, defaultStore }
 *
 * Old single-source configs are automatically migrated on load.
 */

import { useState, useCallback } from 'react';
import { useCsvPolling } from './useCsvPolling.js';
import { createKpiSummary } from '../data/beautymaster/schema.js';

const STORAGE_KEY = 'beautymaster:sheetConfig';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Migrate old single-source format → new multi-source format
    if (parsed.processingCsvUrl !== undefined) {
      return {
        sources: [{
          label: 'Main',
          processingCsvUrl: parsed.processingCsvUrl,
          doneCsvUrl: parsed.doneCsvUrl || '',
        }],
        pollingIntervalMs: parsed.pollingIntervalMs || 60000,
        defaultStore: parsed.defaultStore || 'all',
      };
    }
    return parsed;
  } catch {
    return null;
  }
}

const EMPTY_STATE = {
  influencers: [],
  kpi: createKpiSummary(),
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
 *   lastSyncedAt: Date|null,
 *   isSyncing: boolean,
 *   error: Error|null,
 *   refresh: function,
 *   config: object|null,
 *   saveConfig: (config: object) => void
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
    pollingIntervalMs: config?.pollingIntervalMs ?? 60000,
  };

  const polling = useCsvPolling(pollingConfig);

  if (!config) {
    return { ...EMPTY_STATE, config: null, saveConfig };
  }

  return { ...polling, config, saveConfig };
}
