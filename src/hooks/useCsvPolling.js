/**
 * BeautyMaster — CSV Polling Hook
 *
 * Fetches all configured sheet sources simultaneously, merges the results,
 * and re-fetches on a configurable interval (default 60 s).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { parseInfluencerCsv } from '../utils/parseInfluencerCsv.js';
import { parseInviteCountsCsv } from '../utils/parseInviteCountsCsv.js';
import { parseStoreDocsCsv } from '../utils/parseStoreDocsCsv.js';
import { parseMessageTemplatesCsv } from '../utils/parseMessageTemplatesCsv.js';
import {
  deriveKpiSummary,
  createKpiSummary,
  SHEET_STATUS,
} from '../data/beautymaster/schema.js';
import { DEFAULT_MESSAGE_TEMPLATES } from '../data/beautymaster/messageTemplates.js';

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
 * @param {string} [config.inviteCountsUrl] - CSV URL for the "Number" tab (total invited per store/tier/category)
 * @param {string} [config.storeDocsUrl] - CSV URL for the "Links" tab (per-store consent form / Influencer List links)
 * @param {string} [config.messageTemplatesUrl] - CSV URL for the "Messages" tab (editable outreach message templates)
 * @param {number} config.pollingIntervalMs
 *
 * @returns {{
 *   influencers: Influencer[],
 *   kpi: KpiSummary,
 *   inviteCounts: Object,
 *   storeDocs: Object,
 *   messageTemplates: import('../data/beautymaster/messageTemplates.js').MessageTemplate[],
 *   lastSyncedAt: Date|null,
 *   isSyncing: boolean,
 *   error: Error|null,
 *   refresh: function
 * }}
 */
export function useCsvPolling({ sources = [], inviteCountsUrl = '', storeDocsUrl = '', messageTemplatesUrl = '', pollingIntervalMs = 30000 }) {
  const [influencers, setInfluencers] = useState([]);
  const [kpi, setKpi] = useState(createKpiSummary());
  const [inviteCounts, setInviteCounts] = useState({});
  const [storeDocs, setStoreDocs] = useState({});
  const [messageTemplates, setMessageTemplates] = useState(DEFAULT_MESSAGE_TEMPLATES);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // Keep a ref so sync() always reads the latest sources without being in deps
  const sourcesRef = useRef(sources);
  useEffect(() => { sourcesRef.current = sources; });
  const inviteCountsUrlRef = useRef(inviteCountsUrl);
  useEffect(() => { inviteCountsUrlRef.current = inviteCountsUrl; });
  const storeDocsUrlRef = useRef(storeDocsUrl);
  useEffect(() => { storeDocsUrlRef.current = storeDocsUrl; });
  const messageTemplatesUrlRef = useRef(messageTemplatesUrl);
  useEffect(() => { messageTemplatesUrlRef.current = messageTemplatesUrl; });

  // Stable key — sync is recreated only when URLs actually change
  const sourcesKey = sources
    .map(s => `${s.processingCsvUrl}|${s.doneCsvUrl || ''}`)
    .join(';;') + `|${inviteCountsUrl}|${storeDocsUrl}|${messageTemplatesUrl}`;

  const sync = useCallback(async () => {
    const activeSources = sourcesRef.current.filter(s => s.processingCsvUrl);
    const activeInviteCountsUrl = inviteCountsUrlRef.current;
    const activeStoreDocsUrl = storeDocsUrlRef.current;
    const activeMessageTemplatesUrl = messageTemplatesUrlRef.current;
    if (activeSources.length === 0 && !activeInviteCountsUrl && !activeStoreDocsUrl && !activeMessageTemplatesUrl) return;
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
      const [results, inviteCountsResult, storeDocsResult, messageTemplatesResult] = await Promise.all([
        Promise.all(fetches),
        activeInviteCountsUrl
          ? fetchCsvText(activeInviteCountsUrl).then(parseInviteCountsCsv)
          : Promise.resolve(null),
        activeStoreDocsUrl
          ? fetchCsvText(activeStoreDocsUrl).then(parseStoreDocsCsv)
          : Promise.resolve(null),
        activeMessageTemplatesUrl
          ? fetchCsvText(activeMessageTemplatesUrl).then(parseMessageTemplatesCsv)
          : Promise.resolve(null),
      ]);
      const merged = results.flat();
      setInfluencers(merged);
      setKpi(deriveKpiSummary(merged));
      if (inviteCountsResult) setInviteCounts(inviteCountsResult);
      if (storeDocsResult) setStoreDocs(storeDocsResult);
      if (messageTemplatesResult) {
        setMessageTemplates(messageTemplatesResult.length > 0 ? messageTemplatesResult : DEFAULT_MESSAGE_TEMPLATES);
      }
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

  return { influencers, kpi, inviteCounts, storeDocs, messageTemplates, lastSyncedAt, isSyncing, error, refresh: sync };
}
