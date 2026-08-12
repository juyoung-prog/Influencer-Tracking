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

/** 인플루언서 재연락 사유 — 방문일 경과 후 노쇼 확인 vs 방문 전 일정변경 요청 */
export const CONTACT_REASONS = Object.freeze({
  NO_SHOW: 'no-show',
  RESCHEDULE_REQUEST: 'reschedule-request',
});

/**
 * 재연락 응답 상태 — 기다림 / 응답 / 포기, 세 값뿐이다.
 * "무응답"은 상태가 아니라 pending-reply + 경과일(lastContactDate)로 파생된다 —
 * 시스템이 계산할 수 있는 걸 사람에게 한 번 더 적게 하면 반드시 잊히고,
 * 잊히면 시트가 거짓말을 한다. (구 no-response 값은 파서가 pending-reply로 흡수)
 */
export const CONTACT_STATUSES = Object.freeze({
  PENDING_REPLY: 'pending-reply',
  REPLIED: 'replied',
  /** 종결 — 재연락을 포기했다. 이 값이 되면 해당 인원의 경보는 전부 꺼진다.
      드롭 여부 판단은 사람이 한다(노쇼 횟수 자동 추적은 시트 관리 부담으로 철회) */
  DROPPED: 'dropped',
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
  /** 노쇼 확인 연락을 보냈으나 아직 응답이 확정되지 않음 */
  NO_SHOW_UNRESOLVED: 'no-show-unresolved',
  /** 방문 전 일정변경 요청에 대한 응답이 아직 확정되지 않음 */
  RESCHEDULE_PENDING: 'reschedule-pending',
});

/** 스토어 미선택(전체)을 뜻하는 센티넬. 기존 대시보드 filters.store 규약과 같은 값 */
export const ALL_STORES = 'all';

/**
 * 인플루언서 필터 초기값 (미선택은 null).
 * 스토어는 여기에 없다 — 뷰 사이를 오갈 때 유지돼야 하는 값이라 페이지가 따로 소유한다.
 */
export const DEFAULT_INFLUENCER_FILTERS = Object.freeze({
  platform: null,
  tier: null,
  category: null,
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
 * @property {string} fullName - 시트에 이름이 없으면 소셜 계정을 대신 쓴다
 * @property {boolean} hasFullName - 이름 칸에 실제 값이 있었는지
 * @property {string} socialAccountUrl
 * @property {string} socialHandle - 프로필 링크에서 되짚은 핸들(@ 없이). 없으면 ''
 * @property {string} email
 * @property {Date|null} scheduledTime
 * @property {boolean} hasScheduledTimeOfDay - 시트 셀에 시각까지 적혀 있었는지.
 *   날짜만 있으면 파싱 결과가 자정이 되는데, 그걸 "12:00 AM 방문"으로 표시하면 안 된다.
 * @property {boolean} agreement
 * @property {boolean} attend
 * @property {boolean} collaboShared
 * @property {string} collaboLink
 * @property {Date|null} uploadDate
 * @property {boolean} creditShared
 * @property {boolean} creditUsed
 * @property {boolean} hasCreditUsedValue - 시트 셀에 값이 적혀 있었는지.
 *   비어 있으면 creditUsed=false가 되는데 그건 "미사용"이 아니라 "미측정"이다.
 * @property {string} serialNumber
 * @property {'USE'|'MAYBE'|"DON'T"|null} opinion
 * @property {Date|null} recordDate - 시트 Record Date 열. 성과 지표를 실제로 적은 날 —
 *   늦게 적어도 그대로 받는다. 실제 기록일이 남아야 "D+14 값이 아님"을 데이터가 말한다
 * @property {number|null} views
 * @property {number|null} likes
 * @property {number|null} shares
 * @property {number|null} saves
 * @property {number|null} comments
 * @property {number|null} reposts
 * @property {string} note
 * @property {'no-show'|'reschedule-request'|null} contactReason - Why the influencer was re-contacted about their visit date
 * @property {'pending-reply'|'replied'|'dropped'|null} contactStatus - Status of that re-contact. 'dropped' is terminal — outreach given up
 * @property {Date|null} lastContactDate - When the re-contact message was sent
 * @property {Date|null} requestedDate - New date the influencer proposed, pending confirmation into scheduledTime
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
 * 방문일이 내일인지.
 *
 * scheduleGroup은 upcoming 하나로 내일과 3주 뒤를 같이 담는다 — 화면에 "AUG 13"만
 * 뜨면 그게 코앞인지 사람이 달력을 세어 오늘과 비교해야 한다. 준비할 시간이 없는
 * 건은 오늘 다음으로 급한 건이므로 날짜 옆에서 그걸 한 번 말해 준다.
 *
 * 날짜 세 칸을 직접 비교한다 — 밀리초 차이를 86400000으로 나누면 서머타임이 있는
 * 지역에서 하루가 23·25시간이 되어 판정이 어긋난다.
 *
 * @param {Date|null} date
 * @param {Date} [today] - 테스트 주입점
 * @returns {boolean}
 */
export function isTomorrow(date, today = new Date()) {
  if (!date) return false;
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return date.getFullYear() === tomorrow.getFullYear()
    && date.getMonth() === tomorrow.getMonth()
    && date.getDate() === tomorrow.getDate();
}

/**
 * 경보 유예·만료 기준 (일 단위).
 *
 * 유예 없이 판정하면 "어제 방문했는데 오늘 업로드가 없다"까지 경보가 되어
 * 정작 오래 밀린 건이 묻힌다. 반대로 아주 오래 지난 건은 진행 중이 아니라
 * 사실상 종료된 건이라 계속 울릴 이유가 없다.
 */
export const ALERT_GRACE_DAYS = Object.freeze({
  /** 방문 예정일이 지난 뒤 이만큼은 기다린다 (당일 지각·익일 방문 등 정상 변동) */
  VISIT: 3,
  /** 방문 후 콘텐츠 업로드까지 기다리는 기간 */
  UPLOAD: 7,
  /** 업로드 후 크레딧 발송까지 기다리는 기간 */
  CREDIT: 7,
  /** 방문 예정일이 이만큼 지나면 경보를 멈춘다 (사실상 종료된 건) */
  STALE: 90,
});

/** 자정 기준 경과 일수. date가 없으면 null */
function daysSince(date, todayStart) {
  if (!date) return null;
  return Math.floor((todayStart - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000);
}

/**
 * 티어별 방문 1회의 크레딧 가치 (USD) — 미이행 손실을 금액으로 환산하는 기준.
 *
 * 시트에 단가 열이 없어 상수로 둔다 (2026-08-12 사장님 확정: T1 $100 / T2 $20).
 * 건수만으로는 "7건"이 큰지 작은지 판단할 근거가 없다 — T1 7건과 T2 7건은
 * 손실이 5배 차이인데 같은 숫자로 보인다. 단가가 바뀌면 여기 한 곳만 고친다.
 */
export const TIER_CREDIT_VALUE_USD = Object.freeze({
  [TIERS.TIER1]: 100,
  [TIERS.TIER2]: 20,
});

/**
 * 미이행 손실 리포트 — 방문시켰는데 콘텐츠를 못 받은 건의 수와 금액.
 *
 * 캠페인 리포트에 이 블록이 없으면 남는 건 upload rate(비율)뿐인데, 비율은
 * "85%면 잘 되고 있네"로 읽히고 금액은 "이거 회수해야겠네"로 읽힌다. 같은 사실인데
 * 뒤엣것만 행동으로 이어진다.
 *
 * dropped(섭외 포기)도 **뺀 게 아니라 넣는다** — 포기했다는 건 회수를 단념했다는
 * 뜻이지 손실이 없었다는 뜻이 아니다. 다만 아직 손댈 수 있는 건과 구분되도록 표시한다.
 *
 * 정렬은 금액 내림차순, 같으면 최근 순이다. 손실 보고서의 기본 순서이면서,
 * 같은 금액이면 아직 독촉이 먹힐 만한 건이 위로 온다.
 *
 * @param {Influencer[]} influencers
 * @param {Date} [today] - 테스트 주입점
 * @returns {{
 *   count: number,
 *   lostValueUsd: number,
 *   byTier: Object<string, {count: number, valueUsd: number}>,
 *   items: Array<{id: string, fullName: string, tier: string, platform: string,
 *     scheduledTime: Date|null, daysSinceVisit: number|null, valueUsd: number,
 *     isDropped: boolean, isStale: boolean}>,
 * }}
 */
export function deriveUnfulfilledReport(influencers, today = new Date()) {
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const items = (influencers || [])
    .filter(inf => isUnfulfilled(inf, today))
    .map(inf => ({
      id: inf.id,
      fullName: inf.fullName,
      tier: inf.tier,
      platform: inf.platform,
      scheduledTime: inf.scheduledTime,
      daysSinceVisit: daysSince(inf.scheduledTime, todayStart),
      valueUsd: TIER_CREDIT_VALUE_USD[inf.tier] ?? 0,
      isDropped: inf.contactStatus === CONTACT_STATUSES.DROPPED,
      isStale: isStaleVisit(inf.scheduledTime, today),
    }))
    .sort((a, b) => b.valueUsd - a.valueUsd || (a.daysSinceVisit ?? Infinity) - (b.daysSinceVisit ?? Infinity));

  const byTier = {};
  for (const item of items) {
    if (!byTier[item.tier]) byTier[item.tier] = { count: 0, valueUsd: 0 };
    byTier[item.tier].count += 1;
    byTier[item.tier].valueUsd += item.valueUsd;
  }

  return {
    count: items.length,
    lostValueUsd: items.reduce((sum, i) => sum + i.valueUsd, 0),
    byTier,
    items,
  };
}

/**
 * 업로드 후 성과(조회수·좋아요 등)를 시트에 기록하는 시점 (일 단위).
 *
 * 측정 시점을 고정해야 인플루언서 간 성과 비교가 공정해진다 — "생각날 때" 적으면
 * A는 D+5 값, B는 D+40 값이라 서로 비교할 수 없다. 피드/릴스 인게이지먼트 대부분이
 * 첫 1~2주에 쌓이므로 2주 스냅샷이면 생애 성과의 근사치로 충분하다.
 * (2026-08-03 확정 — 기록은 시트에만 하고, 대시보드는 D-day 안내·표시·시트 안내만 한다)
 */
export const PERFORMANCE_CHECK_DAYS = 14;

export const PERFORMANCE_STATES = Object.freeze({
  /** 측정일 전 — D-day 카운트다운 중 */
  WAITING: 'waiting',
  /** 측정일 도달·경과, 아직 기록 없음 — 작업 큐에 올라간다 */
  DUE: 'due',
  /** 지표가 적혔다 */
  RECORDED: 'recorded',
  /** 기록 없이 STALE(90일)을 넘긴 건 — 사실상 종료라 더 이상 재촉하지 않는다 */
  EXPIRED: 'expired',
});

/**
 * 업로드 기준 D+PERFORMANCE_CHECK_DAYS 성과 기록 상태.
 *
 * "기록됨" 판정은 recordDate만 보지 않는다 — Record Date 열이 생기기 전에 지표만
 * 적어둔 행이 있고, 그 행에 "기록하라"고 계속 재촉하면 큐를 불신하게 된다.
 * 늦은 기록도 그대로 받는다(오류 허용) — recordedAfterDays가 D+14 값이 아님을 말해 준다.
 *
 * @param {Influencer} influencer
 * @param {Date} [today] - 테스트 주입점
 * @returns {{state: 'waiting', dDay: number}
 *   | {state: 'due', daysLate: number}
 *   | {state: 'recorded', recordedAfterDays: number|null}
 *   | {state: 'expired', daysLate: number}
 *   | null} 업로드 전(잴 것이 없음)이면 null
 */
export function derivePerformanceStatus(influencer, today = new Date()) {
  const { collaboShared, uploadDate, recordDate, views, likes, shares, saves, comments, reposts } = influencer;
  if (!collaboShared || !uploadDate) return null;

  const hasMetrics = [views, likes, shares, saves, comments, reposts].some(v => v != null);
  if (recordDate || hasMetrics) {
    const recordedAfterDays = recordDate
      ? Math.floor((new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate())
        - new Date(uploadDate.getFullYear(), uploadDate.getMonth(), uploadDate.getDate())) / 86400000)
      : null;
    return { state: PERFORMANCE_STATES.RECORDED, recordedAfterDays };
  }

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const sinceUpload = daysSince(uploadDate, todayStart);
  const dDay = PERFORMANCE_CHECK_DAYS - sinceUpload;
  if (dDay > 0) return { state: PERFORMANCE_STATES.WAITING, dDay };
  if (sinceUpload > ALERT_GRACE_DAYS.STALE) return { state: PERFORMANCE_STATES.EXPIRED, daysLate: -dDay };
  return { state: PERFORMANCE_STATES.DUE, daysLate: -dDay };
}

/**
 * 조회수 기반 인게이지먼트 레이트 — (좋아요+공유+저장+댓글+리포스트) / 조회수.
 *
 * 원시 숫자 6개를 매번 사람이 해석하게 하지 않고 비율 하나로 요약한다.
 * 조회수가 없거나 0이면, 상호작용 값이 하나도 없으면 null — 미측정은 0%가 아니다.
 *
 * @param {Influencer} influencer
 * @returns {number|null} 0~1 비율
 */
export function deriveEngagementRate(influencer) {
  const { views, likes, shares, saves, comments, reposts } = influencer;
  if (views == null || views <= 0) return null;
  const interactions = [likes, shares, saves, comments, reposts].filter(v => v != null);
  if (interactions.length === 0) return null;
  return interactions.reduce((sum, v) => sum + v, 0) / views;
}

/** 중앙값 — 평균은 대박 1건이 전체를 끌어올려 "잘 되고 있다"는 착시를 만든다 */
function median(nums) {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** 표본이 이보다 작으면 순위 기반 판정(추천·평가↔숫자 어긋남)을 하지 않는다 */
const REVIEW_MIN_SAMPLE = 4;

/**
 * Analytics 성과 리포트 집계 — "이 데이터로 내리는 결정"에 맞춘 산출물만 담는다:
 * ① 재섭외(ranked) ② 캠페인 요약(totals·medianER).
 * (그룹 비교표(byGroup — Median ER·Views per $1)는 2026-08-03 사장님 판단으로 제거 —
 * 티어 비교는 칩 코호트 전환으로 충분하다고 봄. 필요해지면 git 이력에서 복원.)
 *
 * 정직성 원칙:
 * - 분모는 항상 명시한다(recordedCount of uploadedCount) — 3건 기록으로 결론 내리지 않게
 * - 미측정은 0으로 섞지 않는다 — ER을 못 낸 기록(조회수 누락)은 순위에서 빼고 수만 센다
 * - 늦은 기록은 recordedAfterDays를 그대로 싣는다 — D+14 값이 아님을 화면이 밝힌다
 *
 * 순위는 **총 반응 수(engagements = 좋아요+댓글+공유+저장+리포스트 절대량)** 내림차순이다.
 * 처음엔 ER 정렬이었는데 실데이터에서 양쪽으로 왜곡됐다: 872뷰 소형 계정(총 반응 76)이
 * 1위에 앉고, 17.5K뷰 최대 도달자(반응 385)가 꼴찌권으로 밀렸다. 조회수 기반 ER은
 * 소형 계정을 부풀리고 대형 계정을 깎는다 — engagements는 질(ER) × 도달(views)의 곱이라
 * 양쪽 왜곡이 자동으로 사라지고, 도달 가드 같은 예외 규칙도 필요 없어졌다
 * (2026-08-03 사장님 A안 채택). ER은 "질" 참고 지표로 남는다.
 *
 * 순위 기반 판정은 engagements 사분위 하나에서 나온다 (표본 4건 미만이면 전부 생략):
 * - suggestedOpinion — Opinion이 **빈** 행에만. 상위 1/4 → USE, 하위 1/4 → DON'T,
 *   중간 → MAYBE. **표시 전용이다** — 공식은 항상 시트의 Opinion이고 대시보드는 시트에
 *   쓰지 않는다. dropped(섭외 포기)는 반응이 좋아도 추천하지 않는다.
 * - needsReview — Opinion이 **있는** 행이 사분위와 강하게 어긋날 때(상위 1/4인데 DON'T /
 *   하위 1/4인데 USE). 어느 쪽이 틀렸다는 뜻이 아니라 재검토 후보다.
 *
 * 티어 코호트: 호출자가 티어로 거른 목록을 넘기면 순위·추천·배지가 그 코호트
 * 기준으로 계산된다 — T1($100 대형)과 T2($20 소형)는 다른 게임이라 섞으면 오염된다.
 * 절대량 정렬이 대형에 유리한 문제도 티어 칩이 해소한다.
 *
 * @param {Influencer[]} influencers
 * @returns {{
 *   uploadedCount: number,
 *   recordedCount: number,
 *   unrankedRecordedCount: number,
 *   totals: {views: number|null, saves: number|null, shares: number|null},
 *   medianER: number|null,
 *   ranked: Array<{id: string, fullName: string, tier: string, platform: string,
 *     views: number|null, likes: number|null, shares: number|null, saves: number|null,
 *     comments: number|null, reposts: number|null,
 *     engagements: number, er: number|null,
 *     recordedAfterDays: number|null, opinion: string|null,
 *     quartile: 'top'|'middle'|'bottom'|null,
 *     suggestedOpinion: string|null,
 *     needsReview: 'high-eng-dont'|'low-eng-use'|null}>,
 * }}
 */
export function derivePerformanceReport(influencers) {
  const uploaded = (influencers || []).filter(i => i.collaboShared);
  const recorded = uploaded.filter(i => derivePerformanceStatus(i)?.state === PERFORMANCE_STATES.RECORDED);

  const sumOf = field => {
    const vals = recorded.map(i => i[field]).filter(v => v != null);
    return vals.length === 0 ? null : vals.reduce((s, v) => s + v, 0);
  };
  const totals = { views: sumOf('views'), saves: sumOf('saves'), shares: sumOf('shares') };

  /** ER 분자와 같은 합 — 값이 있는 지표만. 전부 빈 행은 null(순위 제외, 0 아님) */
  const sumEngagements = i => {
    const vals = [i.likes, i.shares, i.saves, i.comments, i.reposts].filter(v => v != null);
    return vals.length === 0 ? null : vals.reduce((s, v) => s + v, 0);
  };

  const ranked = recorded
    .map(i => ({ influencer: i, engagements: sumEngagements(i) }))
    .filter(r => r.engagements != null)
    .sort((a, b) => b.engagements - a.engagements)
    .map(({ influencer: i, engagements }) => ({
      id: i.id,
      fullName: i.fullName,
      tier: i.tier,
      platform: i.platform,
      views: i.views,
      likes: i.likes,
      shares: i.shares,
      saves: i.saves,
      comments: i.comments,
      reposts: i.reposts,
      engagements,
      er: deriveEngagementRate(i),
      recordedAfterDays: derivePerformanceStatus(i).recordedAfterDays,
      opinion: i.opinion,
      isDropped: i.contactStatus === CONTACT_STATUSES.DROPPED,
      quartile: null,
      suggestedOpinion: null,
      needsReview: null,
    }));

  if (ranked.length >= REVIEW_MIN_SAMPLE) {
    const quartileSize = Math.max(1, Math.floor(ranked.length / 4));
    ranked.forEach((r, idx) => {
      r.quartile = idx < quartileSize ? 'top' : idx >= ranked.length - quartileSize ? 'bottom' : 'middle';
      if (r.opinion) {
        if (r.quartile === 'top' && r.opinion === OPINIONS.DONT) r.needsReview = 'high-eng-dont';
        else if (r.quartile === 'bottom' && r.opinion === OPINIONS.USE) r.needsReview = 'low-eng-use';
      } else if (!r.isDropped) {
        r.suggestedOpinion = r.quartile === 'top' ? OPINIONS.USE
          : r.quartile === 'bottom' ? OPINIONS.DONT
            : OPINIONS.MAYBE;
      }
    });
  }

  return {
    uploadedCount: uploaded.length,
    recordedCount: recorded.length,
    unrankedRecordedCount: recorded.length - ranked.length,
    totals,
    medianER: median(ranked.map(r => r.er).filter(v => v != null)),
    ranked,
  };
}

/**
 * 방문일이 너무 지나 더 이상 경보하지 않는 상태인지.
 *
 * deriveAlertFlags가 이 조건에서 단계 경보를 억제한다. 목록 섹션도 같은 판정을
 * 써야 한다 — 따로 계산하면 "경보는 없는데 어느 구간에도 못 넣는" 행이 생기고,
 * 그런 행이 Upcoming으로 흘러들어 과거 일정이 예정으로 보였다.
 *
 * @param {Date|null} scheduledTime
 * @param {Date} [today] - 테스트 주입점
 * @returns {boolean}
 */
export function isStaleVisit(scheduledTime, today = new Date()) {
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const since = daysSince(scheduledTime, todayStart);
  return since !== null && since > ALERT_GRACE_DAYS.STALE;
}

/**
 * 미이행 — 방문은 했는데 콘텐츠가 올라오지 않았고, 업로드 유예도 지난 건.
 *
 * 이 프로젝트에서 유일하게 **돈이 이미 나간** 손실이다(방문 = 시술·제품 제공 완료).
 * 노쇼는 슬롯을 비운 것뿐이지만 미이행은 지출이 회수되지 않은 것이라,
 * 다음 캠페인 초대 판단에서 같은 무게로 다루면 안 된다.
 *
 * **경보와 일부러 다르다.** ATTEND_NO_COLLABO는 여기에 `!creditShared && !isStale`을
 * 더한 것이라, 방문일이 90일을 넘으면 꺼진다 — 계속 울릴 이유가 없다는 판단은 맞지만,
 * 그 결과 손실이 확정된 건이 Stale 구간으로 조용히 흘러가 어디에도 세어지지 않았다.
 * 그래서 "울릴 것"과 "셀 것"을 나눈다: 이 판정은 경과일과 무관하게 사실만 본다.
 *
 * `creditShared`는 보지 않는다 — 크레딧까지 나갔는데 콘텐츠가 없으면 손실이 더 큰 것이지
 * 미이행이 아닌 게 아니다. 다만 단계 표시는 "뒤 단계가 완료됐으면 앞 단계를 말하지
 * 않는다"는 규칙을 따라야 하므로, 화면 라벨을 거는 쪽에서 그 조건을 얹는다.
 *
 * @param {Influencer} influencer
 * @param {Date} [today] - 테스트 주입점
 * @returns {boolean}
 */
export function isUnfulfilled(influencer, today = new Date()) {
  const { attend, collaboShared, scheduledTime } = influencer;
  if (!attend || collaboShared) return false;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const sinceVisit = daysSince(scheduledTime, todayStart);
  // 날짜가 없으면 유예를 잴 수 없다 — 경보와 같은 규약으로 "지난 것"으로 본다
  return sinceVisit === null || sinceVisit > ALERT_GRACE_DAYS.UPLOAD;
}

/**
 * 시트의 플랫폼 표기를 공식 표기로 맞춘다.
 *
 * 시트에는 "Tiktok" 처럼 제각각 적혀 있는데 필터 칩은 PLATFORMS 상수("TikTok")를 쓴다.
 * 표기가 갈리면 같은 값인데 화면에서 다르게 보인다. 필터 매칭은 소문자 비교라
 * 이 정규화가 필터 동작을 바꾸지는 않는다.
 *
 * @param {string} raw - 시트 원본. "Instagram, Tiktok" 처럼 쉼표로 여럿일 수 있다
 * @returns {string} 첫 플랫폼의 공식 표기
 */
/**
 * 표시용 이름 정규화. "aurora garcia" -> "Aurora Garcia".
 *
 * 시트에 성을 소문자로 적은 행이 섞여 있어 목록에서 그 행만 튄다. 표시 단계에서만
 * 손대고 원본(fullName)은 그대로 둔다 — 검색·정렬·키는 원본을 쓴다.
 *
 * 각 단어의 **첫 글자만** 올리고 나머지는 건드리지 않는다. 전체를 소문자로 깔고
 * 첫 글자만 올리는 흔한 구현은 이미 맞게 적힌 이름을 망가뜨린다:
 * "JMag" -> "Jmag", "MuhammadPoe" -> "Muhammadpoe", "O'Brien" -> "O'brien".
 * 첫 글자가 문자가 아니면(핸들 "_d1stylez_" 등) 그 단어는 손대지 않는다.
 *
 * @param {string} raw
 * @returns {string}
 */
export function toDisplayName(raw) {
  return (raw || '')
    .split(/(\s+)/)
    .map(part => (/^\p{L}/u.test(part) ? part[0].toLocaleUpperCase() + part.slice(1) : part))
    .join('');
}

export function normalizePlatform(raw) {
  const first = (raw || '').split(',')[0].trim();
  const key = first.toLowerCase();
  if (key.includes('tiktok')) return PLATFORMS.TIKTOK;
  if (key.includes('instagram')) return PLATFORMS.INSTAGRAM;
  return first;
}

/**
 * Evaluate boolean status combinations to produce alert flags.
 * Caller must pass a fully populated Influencer (alertFlags field ignored on input).
 *
 * 판정 원칙 두 가지:
 * 1. 뒤 단계가 완료됐으면 앞 단계 경보를 내지 않는다. 시트에 attend 체크가 빠졌더라도
 *    크레딧까지 나갔으면 실제로는 진행된 것이다. (이 처리가 없으면 목록에 "Completed"인데
 *    "277d overdue"인 행이 생긴다 — 같은 행이 서로 다른 말을 하게 된다.)
 * 2. 각 단계는 ALERT_GRACE_DAYS만큼 기다린 뒤에만 경보한다. 방문일이 STALE을 넘기면
 *    더 이상 경보하지 않는다.
 *
 * 재연락 미해결(no-show / reschedule)은 단계 진행과 독립적이므로 위 규칙과 별개로 유지한다.
 *
 * @param {Influencer} influencer
 * @param {Date} [today] - Injection point for testing; defaults to new Date()
 * @returns {string[]}
 */
export function deriveAlertFlags(influencer, today = new Date()) {
  const {
    agreement, attend, collaboShared, creditShared,
    scheduledTime, uploadDate, contactReason, contactStatus,
  } = influencer;
  const flags = [];

  /* Dropped는 종결 상태다 — 재연락 경보만이 아니라 단계 지연 경보("No visit" 등)도
     전부 끈다. 포기한 사람에게 "방문 N일 지연"을 계속 알리면 드롭 결정과 모순된다.
     행 자체는 목록에 남아 다음 캠페인 때 이력으로 확인할 수 있다. */
  if (contactStatus === CONTACT_STATUSES.DROPPED) return flags;

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const sinceVisit = daysSince(scheduledTime, todayStart);
  const isStale = isStaleVisit(scheduledTime, today);

  // 원칙 1·2 — 완료됐거나 너무 오래된 건은 단계 경보를 내지 않는다
  if (!creditShared && !isStale) {
    if (collaboShared) {
      const sinceUpload = daysSince(uploadDate, todayStart);
      if (sinceUpload === null || sinceUpload > ALERT_GRACE_DAYS.CREDIT) {
        flags.push(ALERT_FLAGS.COLLABO_NO_CREDIT);
      }
    } else if (attend) {
      // 유예 판정은 isUnfulfilled 한 곳에만 둔다 — 두 벌로 두면 한쪽만 고쳐져 갈라진다
      if (isUnfulfilled(influencer, today)) flags.push(ALERT_FLAGS.ATTEND_NO_COLLABO);
    } else if (agreement) {
      // 날짜가 없으면 "일정 미정" — 지연은 아니지만 잡아야 할 일이라 경보로 남긴다
      if (sinceVisit === null || sinceVisit > ALERT_GRACE_DAYS.VISIT) {
        flags.push(ALERT_FLAGS.AGREEMENT_NO_ATTEND);
      }
    }
  }

  // Resolved by reality once the influencer actually shows up, regardless of whether
  // Contact Status was manually updated to Replied in the sheet.
  const contactUnresolved = !attend && contactStatus === CONTACT_STATUSES.PENDING_REPLY;
  if (contactReason === CONTACT_REASONS.NO_SHOW && contactUnresolved) flags.push(ALERT_FLAGS.NO_SHOW_UNRESOLVED);
  if (contactReason === CONTACT_REASONS.RESCHEDULE_REQUEST && contactUnresolved) flags.push(ALERT_FLAGS.RESCHEDULE_PENDING);

  return flags;
}

/**
 * Collect the distinct store names present in an Influencer array.
 *
 * @param {Influencer[]} influencers
 * @returns {string[]} 중복 제거·정렬된 스토어 이름 목록
 */
export function deriveStores(influencers) {
  const unique = new Set((influencers || []).map(inf => inf.store).filter(Boolean));
  return Array.from(unique).sort();
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

  /* 값이 0인 것과 아직 아무도 적지 않은 것은 다르다.
     시트의 credit used 열은 현재 비어 있어서 creditUsed가 전부 false로 파싱된다.
     이걸 0으로 계산하면 "발급분 전량 미사용"으로 읽힌다 — 실제로는 측정 자체가 없다.
     열에 값이 하나라도 들어오면 자동으로 true가 되어 정상 계산으로 돌아간다. */
  const funnelMeasured = {
    creditUsed: influencers.some(i => i.hasCreditUsedValue),
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
    const pUpload = list.filter(i => i.collaboShared).length;
    byPlatform[p] = {
      count:      list.length,
      attendCount: pAttend,
      collaboSharedCount: pUpload,
      attendRate: safeRate(pAttend, list.length),
      uploadRate: safeRate(pUpload, pAttend),
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
    const sUpload = list.filter(i => i.collaboShared).length;
    byStore[s] = {
      count:      list.length,
      attendCount: sAttend,
      collaboSharedCount: sUpload,
      invited:    invitedByStore[s] ?? null,
      attendRate: safeRate(sAttend, list.length),
      uploadRate: safeRate(sUpload, sAttend),
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
    const cUpload = list.filter(i => i.collaboShared).length;
    byCategory[cat] = {
      count:      list.length,
      attendCount: cAttend,
      collaboSharedCount: cUpload,
      invited:    invitedByCategory[cat] ?? null,
      attendRate: safeRate(cAttend, list.length),
      uploadRate: safeRate(cUpload, cAttend),
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
    funnelMeasured,
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
    hasFullName: true,
    socialAccountUrl: '',
    socialHandle: '',
    email: '',
    scheduledTime: null,
    hasScheduledTimeOfDay: false,
    agreement: false,
    attend: false,
    collaboShared: false,
    collaboLink: '',
    uploadDate: null,
    creditShared: false,
    creditUsed: false,
    hasCreditUsedValue: false,
    serialNumber: '',
    opinion: null,
    recordDate: null,
    views: null,
    likes: null,
    shares: null,
    saves: null,
    comments: null,
    reposts: null,
    note: '',
    contactReason: null,
    contactStatus: null,
    lastContactDate: null,
    requestedDate: null,
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
    funnelMeasured: { creditUsed: false },
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
