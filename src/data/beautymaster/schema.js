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
 * @property {number} pollingIntervalMs - Polling interval in ms. Default: 30000
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
 * Sum invite counts (from the "Number" tab) across all stores/tiers/categories.
 *
 * @param {Object<string, Object<string, Object<string, number>>>} inviteCounts - { [store]: { [tier]: { [category]: count } } }
 * @returns {number}
 */
export function sumInviteCountsTotal(inviteCounts) {
  let sum = 0;
  for (const tiers of Object.values(inviteCounts || {})) {
    for (const categories of Object.values(tiers)) {
      for (const count of Object.values(categories)) sum += count;
    }
  }
  return sum;
}

/**
 * @param {Object} inviteCounts
 * @returns {Object<string, number>} { [store]: total }
 */
export function sumInviteCountsByStore(inviteCounts) {
  const result = {};
  for (const [store, tiers] of Object.entries(inviteCounts || {})) {
    let sum = 0;
    for (const categories of Object.values(tiers)) {
      for (const count of Object.values(categories)) sum += count;
    }
    result[store] = sum;
  }
  return result;
}

/**
 * @param {Object} inviteCounts
 * @returns {{tier1: number, tier2: number}}
 */
export function sumInviteCountsByTier(inviteCounts) {
  const result = { tier1: 0, tier2: 0 };
  for (const tiers of Object.values(inviteCounts || {})) {
    for (const [tier, categories] of Object.entries(tiers)) {
      if (result[tier] === undefined) continue;
      for (const count of Object.values(categories)) result[tier] += count;
    }
  }
  return result;
}

/**
 * @param {Object} inviteCounts
 * @returns {Object<string, number>} { [category]: total }
 */
export function sumInviteCountsByCategory(inviteCounts) {
  const result = {};
  for (const tiers of Object.values(inviteCounts || {})) {
    for (const categories of Object.values(tiers)) {
      for (const [cat, count] of Object.entries(categories)) {
        result[cat] = (result[cat] || 0) + count;
      }
    }
  }
  return result;
}

/**
 * Aggregate an Influencer array into a full analytics summary for the report view.
 *
 * @param {Influencer[]} influencers
 * @param {Object<string, Object<string, Object<string, number>>>} [inviteCounts] - from parseInviteCountsCsv(), the "Number" tab. { [store]: { [tier]: { [category]: count } } }
 * @returns {AnalyticsSummary}
 */
export function deriveAnalyticsSummary(influencers, inviteCounts = {}) {
  if (!influencers || influencers.length === 0) return createAnalyticsSummary();

  const total             = influencers.length;
  const tier1Count        = influencers.filter(i => i.tier === TIERS.TIER1).length;
  const tier2Count        = influencers.filter(i => i.tier === TIERS.TIER2).length;
  const agreementCount    = influencers.filter(i => i.agreement).length;
  const attendCount       = influencers.filter(i => i.attend).length;
  const collaboCount      = influencers.filter(i => i.collaboShared).length;
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
  const countOpinions = list => {
    const withOp = list.filter(i => i.opinion);
    return {
      use:   withOp.filter(i => i.opinion === OPINIONS.USE).length,
      maybe: withOp.filter(i => i.opinion === OPINIONS.MAYBE).length,
      dont:  withOp.filter(i => i.opinion === OPINIONS.DONT).length,
    };
  };
  const groupStats = list => {
    const ga = list.filter(i => i.attend).length;
    const agreementCount     = list.filter(i => i.agreement).length;
    const collaboSharedCount = list.filter(i => i.collaboShared).length;
    const scheduledCount     = list.filter(i => !i.attend && (i.scheduleGroup === SCHEDULE_GROUPS.TODAY || i.scheduleGroup === SCHEDULE_GROUPS.UPCOMING)).length;
    return {
      count:              list.length,
      agreementCount,
      attendCount:        ga,
      collaboSharedCount,
      scheduledCount,
      attendRate:         safeRate(ga, list.length),
      uploadRate:         safeRate(collaboSharedCount, ga),
      avgViews:           avgViews(list),
      opinionCounts:      countOpinions(list),
    };
  };

  // Opinion counts
  const opinionCounts = countOpinions(influencers);

  // Invite counts (from the "Number" tab) — total contacted, before agreement tracking starts
  const invitedTotal      = sumInviteCountsTotal(inviteCounts);
  const invitedByStore    = sumInviteCountsByStore(inviteCounts);
  const invitedByTier     = sumInviteCountsByTier(inviteCounts);
  const invitedByCategory = sumInviteCountsByCategory(inviteCounts);
  const hasInviteData     = invitedTotal > 0;

  // Funnel — "responded" (= total tracked rows) only shown as a distinct step
  // when real invite data exists; otherwise invited falls back to total (old behavior).
  const funnel = {
    invited:    hasInviteData ? invitedTotal : total,
    responded:  hasInviteData ? total : undefined,
    agreement:  agreementCount,
    attended:   attendCount,
    uploaded:   collaboCount,
    creditSent: creditSharedCount,
    creditUsed: creditUsedCount,
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
      count:      list.length,
      attendRate: safeRate(pAttend, list.length),
      uploadRate: safeRate(list.filter(i => i.collaboShared).length, pAttend),
      avgViews:   avgViews(list),
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
      count:      list.length,
      invited:    invitedByStore[s] ?? null,
      attendRate: safeRate(sAttend, list.length),
      uploadRate: safeRate(list.filter(i => i.collaboShared).length, sAttend),
      avgViews:   avgViews(list),
    };
  }

  // Group by tier
  const byTier = {
    tier1: { ...groupStats(influencers.filter(i => i.tier === TIERS.TIER1)), invited: hasInviteData ? invitedByTier.tier1 : null },
    tier2: { ...groupStats(influencers.filter(i => i.tier === TIERS.TIER2)), invited: hasInviteData ? invitedByTier.tier2 : null },
  };

  // Group by category
  const categoryMap = {};
  for (const inf of influencers) {
    const cat = inf.category || 'unknown';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(inf);
  }
  const byCategory = {};
  for (const [cat, list] of Object.entries(categoryMap)) {
    const cAttend = list.filter(i => i.attend).length;
    byCategory[cat] = {
      count:      list.length,
      invited:    invitedByCategory[cat] ?? null,
      attendRate: safeRate(cAttend, list.length),
      uploadRate: safeRate(list.filter(i => i.collaboShared).length, cAttend),
      avgViews:   avgViews(list),
    };
  }

  // Group by month
  const monthMap = {};
  for (const inf of influencers) {
    const m = inf.month || 0;
    if (!monthMap[m]) monthMap[m] = [];
    monthMap[m].push(inf);
  }
  const byMonth = {};
  for (const [m, list] of Object.entries(monthMap)) {
    const mAttend = list.filter(i => i.attend).length;
    byMonth[m] = {
      count:         list.length,
      attendedCount: mAttend,
      uploadedCount: list.filter(i => i.collaboShared).length,
      attendRate:    safeRate(mAttend, list.length),
      uploadRate:    safeRate(list.filter(i => i.collaboShared).length, mAttend),
      avgViews:      avgViews(list),
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
    funnel,
    byPlatform,
    byStore,
    byTier,
    byCategory,
    byMonth,
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
  const emptyTierStats = () => ({
    count: 0,
    invited: null,
    agreementCount: 0,
    attendCount: 0,
    collaboSharedCount: 0,
    scheduledCount: 0,
    attendRate: 0,
    uploadRate: 0,
    avgViews: null,
    opinionCounts: { use: 0, maybe: 0, dont: 0 },
  });
  return {
    total: 0,
    tier1Count: 0,
    tier2Count: 0,
    attendRate: 0,
    uploadRate: 0,
    creditUsedRate: 0,
    opinionCounts: { use: 0, maybe: 0, dont: 0 },
    funnel: { invited: 0, responded: undefined, agreement: 0, attended: 0, uploaded: 0, creditSent: 0, creditUsed: 0 },
    byPlatform: {},
    byStore: {},
    byTier: { tier1: emptyTierStats(), tier2: emptyTierStats() },
    byCategory: {},
    byMonth: {},
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
    pollingIntervalMs: 30000,
    ...overrides,
  };
}
