/**
 * BeautyMaster — CSV Polling Hook
 *
 * Fetches all configured sheet sources simultaneously, merges the results,
 * and re-fetches on a configurable interval (default 60 s).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { parseInfluencerCsv } from '../utils/parseInfluencerCsv.js';
import {
  deriveKpiSummary,
  createKpiSummary,
  SHEET_STATUS,
} from '../data/beautymaster/schema.js';

async function fetchCsvText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV fetch failed: ${res.status} — ${url}`);
  return res.text();
}

/**
 * useCsvPolling hook
 *
 * Props:
 * @param {object} config
 * @param {Array<{processingCsvUrl: string, doneCsvUrl: string}>} config.sources
 * @param {number} config.pollingIntervalMs
 *
 * @returns {{
 *   influencers: Influencer[],
 *   kpi: KpiSummary,
 *   lastSyncedAt: Date|null,
 *   isSyncing: boolean,
 *   error: Error|null,
 *   refresh: function
 * }}
 */
export function useCsvPolling({ sources = [], pollingIntervalMs = 30000 }) {
  const [influencers, setInfluencers] = useState([]);
  const [kpi, setKpi] = useState(createKpiSummary());
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // Keep a ref so sync() always reads the latest sources without being in deps
  const sourcesRef = useRef(sources);
  useEffect(() => { sourcesRef.current = sources; });

  // Stable key — sync is recreated only when URLs actually change
  const sourcesKey = sources
    .map(s => `${s.processingCsvUrl}|${s.doneCsvUrl || ''}`)
    .join(';;');

  const sync = useCallback(async () => {
    const activeSources = sourcesRef.current.filter(s => s.processingCsvUrl);
    if (activeSources.length === 0) return;
    setIsSyncing(true);
    setError(null);
    try {
      const fetches = [];
      for (const source of activeSources) {
        fetches.push(
          fetchCsvText(source.processingCsvUrl).then(text =>
            parseInfluencerCsv(text, SHEET_STATUS.PROCESSING)
          )
        );
        if (source.doneCsvUrl) {
          fetches.push(
            fetchCsvText(source.doneCsvUrl).then(text =>
              parseInfluencerCsv(text, SHEET_STATUS.DONE)
            )
          );
        }
      }
      const results = await Promise.all(fetches);
      const merged = results.flat();
      setInfluencers(merged);
      setKpi(deriveKpiSummary(merged));
      setLastSyncedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSyncing(false);
    }
  }, [sourcesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    sync();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(sync, pollingIntervalMs);
    return () => clearInterval(intervalRef.current);
  }, [sync, pollingIntervalMs]);

  return { influencers, kpi, lastSyncedAt, isSyncing, error, refresh: sync };
}
