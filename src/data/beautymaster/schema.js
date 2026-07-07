/**
 * BeautyMaster Influencer Dashboard — Schema
 *
 * Single source of truth for all types, constants, and derive functions.
 * This file has NO imports. All other data-layer files depend on this.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

export const TIERS = Object.freeze({
  TIER1: 'tier1',
  TIER2: 'tier2',
});

export const PLATFORMS = Object.freeze({
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
});

export const CATEGORIES = Object.freeze({
  GENERAL: 'general',
  KBEAUTY: 'kbeauty',
  SPECIFIC: 'specific',
});

export const SHEET_STATUS = Object.freeze({
  PROCESSING: 'Processing',
  DONE: 'Done',
});

export const SCHEDULE_GROUPS = Object.freeze({
  TODAY: 'today',
  UPCOMING: 'upcoming',
  PAST: 'past',
  NO_TIME: 'no-time',
});

export const OPINIONS = Object.freeze({
  USE: 'USE',
  MAYBE: 'MAYBE',
  DONT: "DON'T",
});

/** agreement 제출 후 방문 미완료 */
export const ALERT_FLAGS = Object.freeze({
  AGREEMENT_NO_ATTEND: 'agreement-no-attend',
  /** 방문 완료 후 콘텐츠 미업로드 */
  ATTEND_NO_COLLABO: 'attend-no-collabo',
  /** 콘텐츠 업로드 후 크레딧 미발송 */
  COLLABO_NO_CREDIT: 'collabo-no-credit',
  /** 크레딧 발송 후 미사용 */
  CREDIT_SHARED_NO_USED: 'credit-shared-no-used',
});

// ─── JSDoc Typedefs ──────────────────────────────────────────────────────────

/**
 * @typedef {Object} Influencer
 * @property {string} id - Derived: `${sheetStatus}_${rowIndex}`
 * @property {'Processing'|'Done'} sheetStatus
 * @property {string} store
 * @property {number} month
 * @property {string} barcode
 * @property {'tier1'|'tier2'} tier
 * @property {'Instagram'|'TikTok'} platform
 * @property {'general'|'kbeauty'|'specific'} category
 * @property {string} creditType
 * @property {string} imageUrl
 * @property {string} fullName
 * @property {string} socialAccountUrl
 * @property {string} email
 * @property {Date|null} scheduledTime
 * @property {boolean} agreement
 * @property {boolean} attend
 * @property {boolean} collaboShared
 * @property {string} collaboLink
 * @property {Date|null} uploadDate
 * @property {boolean} creditShared
 * @property {boolean} creditUsed
 * @property {string} serialNumber
 * @property {'USE'|'MAYBE'|"DON'T"|null} opinion
 * @property {number|null} views
 * @property {number|null} likes
 * @property {number|null} shares
 * @property {number|null} saves
 * @property {number|null} comments
 * @property {number|null} reposts
 * @property {string} note
 * @property {string[]} alertFlags - Derived from boolean status fields
 * @property {'today'|'upcoming'|'past'|'no-time'} scheduleGroup - Derived from scheduledTime
 */

/**
 * @typedef {Object} KpiSummary
 * @property {number} total
 * @property {number} agreementCount
 * @property {number} attendCount
 * @property {number} collaboSharedCount
 * @property {number} creditSharedCount
 * @property {number} alertCount
 */

/**
 * @typedef {Object} DataSourceConfig
 * @property {string} processingCsvUrl - Google Sheets CSV URL for Processing tab
 * @property {string} doneCsvUrl - Google Sheets CSV URL for Done tab
 * @property {number} pollingIntervalMs - Polling interval in ms. Default: 60000
 */

// ─── Derive Functions (pure — no side effects) ───────────────────────────────

/**
 * G10INF2026 (10 chars) → tier1 / G10INF202620 (12 chars) → tier2
 *
 * @param {string} barcode
 * @returns {'tier1'|'tier2'}
 */
export function deriveTier(barcode) {
  if (!barcode) return TIERS.TIER1;
  return barcode.length === 12 ? TIERS.TIER2 : TIERS.TIER1;
}

/**
 * @param {Date|null} scheduledTime
 * @returns {'today'|'upcoming'|'past'|'no-time'}
 */
export function deriveScheduleGroup(scheduledTime) {
  if (!scheduledTime) return SCHEDULE_GROUPS.NO_TIME;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const scheduledDay = new Date(
    scheduledTime.getFullYear(),
    scheduledTime.getMonth(),
    scheduledTime.getDate(),
  );
  if (scheduledDay.getTime() === todayStart.getTime()) return SCHEDULE_GROUPS.TODAY;
  if (scheduledDay > todayStart) return SCHEDULE_GROUPS.UPCOMING;
  return SCHEDULE_GROUPS.PAST;
}

/**
 * Evaluate boolean status combinations to produce alert flags.
 * Caller must pass a fully populated Influencer (alertFlags field ignored on input).
 *
 * agreement-no-attend fires only when the visit is past-due (by calendar date) or
 * has no scheduled time — future and today visits are not yet actionable.
 *
 * @param {Influencer} influencer
 * @param {Date} [today] - Injection point for testing; defaults to new Date()
 * @returns {string[]}
 */
export function deriveAlertFlags(influencer, today = new Date()) {
  const { agreement, attend, collaboShared, creditShared, creditUsed, scheduledTime } = influencer;
  const flags = [];

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const visitIsPastDue = !scheduledTime
    ? true // no date set → agreed but unscheduled, needs follow-up
    : new Date(scheduledTime.getFullYear(), scheduledTime.getMonth(), scheduledTime.getDate()) < todayStart;

  if (agreement && !attend && visitIsPastDue) flags.push(ALERT_FLAGS.AGREEMENT_NO_ATTEND);
  if (attend && !collaboShared)              flags.push(ALERT_FLAGS.ATTEND_NO_COLLABO);
  if (collaboShared && !creditShared)        flags.push(ALERT_FLAGS.COLLABO_NO_CREDIT);
  return flags;
}

/**
 * Reduce an Influencer array into a KpiSummary.
 *
 * @param {Influencer[]} influencers
 * @returns {KpiSummary}
 */
export function deriveKpiSummary(influencers) {
  return influencers.reduce((acc, inf) => {
    acc.total += 1;
    if (inf.agreement) acc.agreementCount += 1;
    if (inf.attend) acc.attendCount += 1;
    if (inf.collaboShared) acc.collaboSharedCount += 1;
    if (inf.creditShared) acc.creditSharedCount += 1;
    if (inf.alertFlags.length > 0) acc.alertCount += 1;
    return acc;
  }, createKpiSummary());
}

/**
 * Aggregate an Influencer array into a full analytics summary for the report view.
 *
 * @param {Influencer[]} influencers
 * @returns {AnalyticsSummary}
 */
export function deriveAnalyticsSummary(influencers) {
  if (!influencers || influencers.length === 0) return createAnalyticsSummary();

  const total        = influencers.length;
  const tier1Count   = influencers.filter(i => i.tier === TIERS.TIER1).length;
  const tier2Count   = influencers.filter(i => i.tier === TIERS.TIER2).length;
  const attendCount  = influencers.filter(i => i.attend).length;
  const collaboCount = influencers.filter(i => i.collaboShared).length;
  const creditSharedCount = influencers.filter(i => i.creditShared).length;
  const creditUsedCount   = influencers.filter(i => i.creditUsed).length;

  const safeRate = (n, d) => (d === 0 ? 0 : n / d);
  const avgViews = list => {
    const valid = list.map(i => i.views).filter(v => v != null);
    return valid.length === 0 ? null : Math.round(valid.reduce((s, v) => s + v, 0) / valid.length);
  };
  const normalizePlatform = raw => {
    const p = raw.split(',')[0].trim().toLowerCase();
    if (p.includes('tiktok')) return 'TikTok';
    if (p.includes('instagram')) return 'Instagram';
    return raw.split(',')[0].trim();
  };

  // Opinion counts (only influencers where opinion has been entered)
  const withOpinion = influencers.filter(i => i.opinion);
  const opinionCounts = {
    use:   withOpinion.filter(i => i.opinion === OPINIONS.USE).length,
    maybe: withOpinion.filter(i => i.opinion === OPINIONS.MAYBE).length,
    dont:  withOpinion.filter(i => i.opinion === OPINIONS.DONT).length,
  };

  // Group by platform (primary platform)
  const platformMap = {};
  for (const inf of influencers) {
    const p = normalizePlatform(inf.platform);
    if (!platformMap[p]) platformMap[p] = [];
    platformMap[p].push(inf);
  }
  const byPlatform = {};
  for (const [p, list] of Object.entries(platformMap)) {
    const pAttend = list.filter(i => i.attend).length;
    byPlatform[p] = {
      count:       list.length,
      attendRate:  safeRate(pAttend, list.length),
      uploadRate:  safeRate(list.filter(i => i.collaboShared).length, pAttend),
      avgViews:    avgViews(list),
    };
  }

  // Group by store
  const storeMap = {};
  for (const inf of influencers) {
    if (!storeMap[inf.store]) storeMap[inf.store] = [];
    storeMap[inf.store].push(inf);
  }
  const byStore = {};
  for (const [s, list] of Object.entries(storeMap)) {
    const sAttend = list.filter(i => i.attend).length;
    byStore[s] = {
      count:       list.length,
      attendRate:  safeRate(sAttend, list.length),
      uploadRate:  safeRate(list.filter(i => i.collaboShared).length, sAttend),
      avgViews:    avgViews(list),
    };
  }

  return {
    total,
    tier1Count,
    tier2Count,
    attendRate:     safeRate(attendCount, total),
    uploadRate:     safeRate(collaboCount, attendCount),
    creditUsedRate: safeRate(creditUsedCount, creditSharedCount),
    opinionCounts,
    byPlatform,
    byStore,
    topByViews: [...influencers]
      .filter(i => i.views != null)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10),
  };
}

// ─── Factory Functions (safe defaults) ───────────────────────────────────────

/**
 * @param {Partial<Influencer>} [overrides]
 * @returns {Influencer}
 */
export function createInfluencer(overrides = {}) {
  return {
    id: '',
    sheetStatus: SHEET_STATUS.PROCESSING,
    store: '',
    month: 0,
    barcode: '',
    tier: TIERS.TIER1,
    platform: PLATFORMS.INSTAGRAM,
    category: CATEGORIES.GENERAL,
    creditType: '',
    imageUrl: '',
    fullName: '',
    socialAccountUrl: '',
    email: '',
    scheduledTime: null,
    agreement: false,
    attend: false,
    collaboShared: false,
    collaboLink: '',
    uploadDate: null,
    creditShared: false,
    creditUsed: false,
    serialNumber: '',
    opinion: null,
    views: null,
    likes: null,
    shares: null,
    saves: null,
    comments: null,
    reposts: null,
    note: '',
    alertFlags: [],
    scheduleGroup: SCHEDULE_GROUPS.NO_TIME,
    ...overrides,
  };
}

/**
 * @param {Partial<KpiSummary>} [overrides]
 * @returns {KpiSummary}
 */
export function createKpiSummary(overrides = {}) {
  return {
    total: 0,
    agreementCount: 0,
    attendCount: 0,
    collaboSharedCount: 0,
    creditSharedCount: 0,
    alertCount: 0,
    ...overrides,
  };
}

/**
 * @returns {AnalyticsSummary}
 */
export function createAnalyticsSummary() {
  return {
    total: 0,
    tier1Count: 0,
    tier2Count: 0,
    attendRate: 0,
    uploadRate: 0,
    creditUsedRate: 0,
    opinionCounts: { use: 0, maybe: 0, dont: 0 },
    byPlatform: {},
    byStore: {},
    topByViews: [],
  };
}

/**
 * @param {Partial<DataSourceConfig>} [overrides]
 * @returns {DataSourceConfig}
 */
export function createDataSourceConfig(overrides = {}) {
  return {
    processingCsvUrl: '',
    doneCsvUrl: '',
    pollingIntervalMs: 60000,
    ...overrides,
  };
}
