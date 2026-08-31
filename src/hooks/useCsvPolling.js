/**
 * BeautyMaster — CSV Polling Hook
 *
 * Fetches all configured sheet sources simultaneously, merges the results,
 * and re-fetches on a configurable interval (default 60 s).
 *
 * Stale-while-revalidate: the last successful sync is mirrored to localStorage,
 * so a page refresh paints the previous data immediately instead of a skeleton
 * while the five CSV fetches run. The cache is keyed by the source-URL set —
 * changing the sheet config in settings invalidates it rather than showing
 * another sheet's rows.
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

const CACHE_KEY = 'beautymaster:csvCache:v1';

/* JSON 왕복에서 문자열이 되는 Date 필드 — 복원 시 여기 나열된 필드만 되살린다.
   (alertFlags는 파싱 시점의 '오늘' 기준 파생값이라 캐시에서 잠깐 하루 전 기준일 수
   있지만, 첫 동기화가 곧바로 덮어쓴다.) */
const INFLUENCER_DATE_FIELDS = ['scheduledTime', 'uploadDate', 'recordDate', 'lastContactDate', 'requestedDate'];

function readCache(sourcesKey) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.sourcesKey !== sourcesKey) return null;
    const influencers = (parsed.influencers || []).map(inf => {
      const revived = { ...inf };
      INFLUENCER_DATE_FIELDS.forEach(field => {
        revived[field] = inf[field] ? new Date(inf[field]) : null;
      });
      return revived;
    });
    return {
      ...parsed,
      influencers,
      lastSyncedAt: parsed.lastSyncedAt ? new Date(parsed.lastSyncedAt) : null,
    };
  } catch {
    return null;
  }
}

function writeCache(sourcesKey, data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ sourcesKey, ...data }));
  } catch {
    // localStorage full/unavailable — polling still works, only the fast-refresh path is lost
  }
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
  // Stable key — sync is recreated only when URLs actually change
  const sourcesKey = sources
    .map(s => `${s.processingCsvUrl}|${s.doneCsvUrl || ''}`)
    .join(';;') + `|${inviteCountsUrl}|${storeDocsUrl}|${messageTemplatesUrl}`;

  /* 마운트 시 한 번만 캐시를 읽어 초기 상태를 채운다(stale-while-revalidate).
     아래 useEffect가 곧바로 sync()를 돌리므로 이 값은 첫 동기화 완료까지의 자리다. */
  const [cached] = useState(() => readCache(sourcesKey));

  const [influencers, setInfluencers] = useState(cached ? cached.influencers : []);
  const [kpi, setKpi] = useState(() => (cached ? deriveKpiSummary(cached.influencers) : createKpiSummary()));
  const [inviteCounts, setInviteCounts] = useState(cached?.inviteCounts || {});
  const [storeDocs, setStoreDocs] = useState(cached?.storeDocs || {});
  const [messageTemplates, setMessageTemplates] = useState(
    cached?.messageTemplates?.length ? cached.messageTemplates : DEFAULT_MESSAGE_TEMPLATES
  );
  const [lastSyncedAt, setLastSyncedAt] = useState(cached?.lastSyncedAt || null);
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
  const sourcesKeyRef = useRef(sourcesKey);
  useEffect(() => { sourcesKeyRef.current = sourcesKey; });

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
      activeSources.forEach((source, i) => {
        // 소스별 행 번호가 겹치므로 id에 소스 구분자를 붙인다.
        // 안 붙이면 GA의 Processing_33과 FL의 Processing_33이 같은 id가 되어
        // 목록 key가 중복되고, selectedId 조회가 엉뚱한 인플루언서를 집는다.
        const idPrefix = `${source.label || `s${i}`}_`;
        fetches.push(
          fetchCsvText(source.processingCsvUrl).then(text =>
            parseInfluencerCsv(text, SHEET_STATUS.PROCESSING, idPrefix)
          )
        );
        if (source.doneCsvUrl) {
          fetches.push(
            fetchCsvText(source.doneCsvUrl).then(text =>
              parseInfluencerCsv(text, SHEET_STATUS.DONE, idPrefix)
            )
          );
        }
      });
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

  /* 동기화가 성공할 때마다(= lastSyncedAt 갱신) 커밋된 상태를 캐시에 미러링한다.
     sync() 내부에서 쓰지 않는 이유: 클로저의 상태값이 stale이라, 부분 응답(null 결과로
     유지된 이전 값)까지 정확히 담으려면 커밋 후의 상태를 읽는 이 자리가 맞다. */
  useEffect(() => {
    if (!lastSyncedAt) return;
    writeCache(sourcesKeyRef.current, {
      influencers,
      inviteCounts,
      storeDocs,
      messageTemplates,
      lastSyncedAt: lastSyncedAt.toISOString(),
    });
  }, [lastSyncedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  return { influencers, kpi, inviteCounts, storeDocs, messageTemplates, lastSyncedAt, isSyncing, error, refresh: sync };
}
