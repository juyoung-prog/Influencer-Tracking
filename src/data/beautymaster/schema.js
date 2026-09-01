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
 * @property {string} purpose - 시트 Purpose 열. 어느 모집 프로그램의 행인지(예: 'grand opening') —
 *   한 매장이 Grand Opening·Monthly·이벤트 모집을 겹쳐 돌릴 수 있어 store만으로는 부족하다
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
 * @property {number} creditUsedCount - 사용이 **확인된** 수. 분모는 creditSharedCount이고,
 *   화면은 비율이 아니라 원시 분수로 쓴다 — 시트의 credit used 칸은 빈 행이 많아서
 *   비율을 내면 미기록이 전부 미사용으로 계산된다
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
 * 드롭 사유 — 왜 섭외를 접었는지. 시트 열이 아니라 사실에서 파생된다.
 *
 * 'other'를 두지 않는다 — 판정되지 않으면 null이고 화면은 그냥 "Dropped"만 말한다.
 * 없는 분류를 만들어 넣는 것보다 모른다고 하는 편이 정직하다.
 */
export const DROP_REASONS = Object.freeze({
  /** 방문했는데 콘텐츠가 없다 — 지출이 회수되지 않았다 */
  NO_UPLOAD: 'no-upload',
  /** 오지 않았다 — 슬롯만 비었다 */
  NO_SHOW: 'no-show',
});

/**
 * 드롭 사유 표시 어휘. 행 배지와 Dropped 구간의 필터 칩이 같은 맵을 쓴다 —
 * 같은 것이 화면에서 두 이름으로 불리면 그때부터 학습 부담이 생긴다.
 *
 * 표시 문자열이 스키마에 있는 게 예외적이긴 하다. 원래는 행 라벨을 소유하는
 * InfluencerListRow에 두려 했는데, 컴포넌트 파일에서 상수를 내보내면
 * react-refresh 규칙에 걸린다(파일이 컴포넌트만 내보내야 한다). 값 하나를 위해
 * 파일을 새로 만드는 것보다 열거형 바로 옆에 두는 편이 찾기 쉽다.
 */
export const DROP_REASON_LABEL = Object.freeze({
  [DROP_REASONS.NO_UPLOAD]: 'No upload',
  [DROP_REASONS.NO_SHOW]: 'No-show',
});

/**
 * dropped 행의 사유 판정. dropped가 아니면 null.
 *
 * 목록 배지와 섹션 필터 칩이 **같은 함수**를 써야 한다 — 두 벌로 두면 한쪽만 고쳐져서
 * "칩에는 3건인데 배지 달린 행은 2개"가 된다.
 *
 * 미이행을 먼저 본다. 방문 여부(attend)로 먼저 가르면 방문 후 미이행이 "왔으니 노쇼는
 * 아님"으로 빠져나가 아무 사유도 안 붙는다 — 정작 돈이 나간 쪽이 무표시가 된다.
 *
 * @param {Influencer} influencer
 * @param {Date} [today] - 테스트 주입점
 * @returns {'no-upload'|'no-show'|null}
 */
export function deriveDropReason(influencer, today = new Date()) {
  if (influencer.contactStatus !== CONTACT_STATUSES.DROPPED) return null;
  if (isUnfulfilled(influencer, today)) return DROP_REASONS.NO_UPLOAD;
  if (!influencer.attend) return DROP_REASONS.NO_SHOW;
  return null;
}

/**
 * 티어별 **기프트백** 1개의 가치 (USD) — 미이행 손실을 금액으로 환산하는 기준.
 *
 * 여기서 세는 손실은 방문 때 이미 건네준 기프트백이다. 보상 크레딧(쿠폰)은
 * 콘텐츠를 받은 뒤에 보내므로 미이행 건에는 **아직 나가지 않았다** — 잃은 건
 * 기프트백이고 크레딧은 붙들고 있는 상태다. 이 둘을 한 단어로 부르면
 * 화면이 "회수 못 한 크레딧"처럼 읽혀 실제와 어긋난다(2026-08-14 지적).
 *
 * 시트에 단가 열이 없어 상수로 둔다 (2026-08-14 확정: T1 $8.58 / T2 $2.65 — 기프트백
 * 원가다). 여기 있던 T1 $100 / T2 $20은 크레딧 액면가였다 — 시트 type 열의
 * "$100 Credit"에서 온 값이라 손실 환산에 쓰면 안 나간 돈을 잃은 것처럼 부풀린다.
 * 건수만으로는 "7건"이 큰지 작은지 판단할 근거가 없다 — T1 7건과 T2 7건은
 * 손실이 3배 차이인데 같은 숫자로 보인다. 단가가 바뀌면 여기 한 곳만 고친다.
 */
export const TIER_GIFT_VALUE_USD = Object.freeze({
  [TIERS.TIER1]: 8.58,
  [TIERS.TIER2]: 2.65,
});

/**
 * 인플루언서 모집 프로그램 목록 — 시트 어디에도 없는 값들이라 상수로 둔다
 * (TIER_GIFT_VALUE_USD와 같은 규약: 시트에 열이 없으면 상수 + 화면이 출처를 밝힌다).
 *
 * 프로그램의 정체성은 **store × purpose**다 (2026-08-31 사장님): 한 매장이
 * Grand Opening 다음에 Monthly·이벤트 모집을 겹쳐 돌릴 수 있어 store만으로는
 * 프로그램을 특정할 수 없다. 행 소속은 시트의 Purpose 열이 정한다(사장님이
 * 'grand opening'처럼 적음 — 대소문자·공백은 비교 시 정규화). 새 모집을 시작하면
 * 여기 항목 하나를 더하고 시트 Purpose 열에 같은 값을 적으면 리포트에 나타난다.
 *
 * - purpose: 시트 Purpose 열과 맞출 키(소문자). label: 매장 안에서 프로그램을 고르는
 *   칩에 쓸 짧은 표시명.
 * - useInviteCounts: Number 탭(초대 인원)을 이 프로그램의 분모로 쓸지. Number 탭에는
 *   purpose 축이 없어서 같은 매장의 두 프로그램에 같은 초대 수를 얹으면 거짓이 된다 —
 *   그 탭이 실제로 집계하는 프로그램(G10 그랜드 오프닝)에만 켠다.
 *
 * G10 항목:
 * - 기간: 2026-07-08 ~ 2026-09-07 (사장님 확정, 2026-08-31). 실데이터의 방문일
 *   범위와 정확히 일치한다 — 그래도 기간은 방문일 min/max로 파생하지 않는다.
 *   파생하면 늦게 잡힌 방문 한 건이 "프로그램 기간"을 바꿔버린다.
 * - 티어별 목표 인원: T1 30 / T2 70 (사장님 확정, 2026-08-31). 시트·코드 어디에도
 *   목표라는 개념이 없어서 이 리포트의 핵심(목표 대비 달성)이 비어 있었다.
 * - giftBagTierOverrides: 매장이 실수로 다른 티어의 기프트백을 건넨 방문(사장님 보고,
 *   2026-08-31 확정 — T2 방문자 5명에게 T1 백. 크레딧까지 $100 나간 건 Zadie Franklin
 *   하나고 나머지 넷은 크레딧은 $20이 맞다). 백은 시트에 열이 없어 여기서만 고칠 수 있다.
 *   키는 소문자·trim한 **전체 이름**이다 — 동명이인이 실재해서(Justice Lee/Justice Cross,
 *   Dominique Doyle/Dominique Austin) 부분 매칭이면 엉뚱한 사람이 보정된다.
 *   **크레딧 착오는 여기 넣지 않는다** — 크레딧 액면가는 시트 type 열이 진실이라
 *   시트를 고치면 자동 반영된다(Zadie Franklin 행이 이미 그렇게 $100으로 고쳐져 있다).
 *   (같은 보고에 있던 Nicole(hello@toldbynik.com)·Emanii Cater는 노쇼 확정 — 방문이
 *   없으니 백·크레딧도 없다. 보정 대상 아님.)
 */
export const INFLUENCER_PROGRAMS = Object.freeze([
  Object.freeze({
    store: 'G10',
    purpose: 'grand opening',
    label: 'Grand Opening',
    title: 'G10_Grand Opening Influencer',
    useInviteCounts: true,
    startKey: '2026-07-08',
    endKey: '2026-09-07',
    goalByTier: Object.freeze({
      [TIERS.TIER1]: 30,
      [TIERS.TIER2]: 70,
    }),
    giftBagTierOverrides: Object.freeze({
      'zadie franklin': TIERS.TIER1,
      'jakerra': TIERS.TIER1,
      'justice cross': TIERS.TIER1,
      'jayla brewster': TIERS.TIER1,
      'dominique austin': TIERS.TIER1,
    }),
  }),
]);

/**
 * 시트 type 열("$100 Credit", "$20 Credit_Tier2")에서 크레딧 액면가를 읽는다.
 *
 * 티어별 상수로 두지 않는 이유: 실데이터에 T2인데 "$100 Credit"인 행이 실재한다
 * (1행). 티어로 곱하면 그 행이 $20으로 계산돼 합계가 조용히 어긋난다 —
 * 시트가 행마다 액면가를 이미 말하고 있으므로 그 값을 그대로 쓴다.
 *
 * @param {string} creditType - 시트 type 열 원본
 * @returns {number|null} 금액을 못 읽으면 null — 0으로 단정하지 않는다
 */
export function creditValueUsd(creditType) {
  const match = (creditType || '').match(/\$\s*([\d,]+(?:\.\d+)?)/);
  return match ? Number(match[1].replace(/,/g, '')) : null;
}

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
 *     isDropped: boolean, dropReason: 'no-upload'|'no-show'|null, isStale: boolean,
 *     creditShared: boolean, creditUsed: boolean, hasCreditUsedValue: boolean}>,
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
      valueUsd: TIER_GIFT_VALUE_USD[inf.tier] ?? 0,
      isDropped: inf.contactStatus === CONTACT_STATUSES.DROPPED,
      /* 왜 접었는지 — 목록 배지와 같은 판정. 이 표에 실리는 행은 전부 방문한 사람이라
         실제로는 항상 'no-upload'다. 그래도 파생을 그대로 싣는다: 화면이 "Dropped"
         한 단어만 보여주면 읽는 사람은 노쇼로 접힌 건지 알 수 없다(실제 질문이었다). */
      dropReason: deriveDropReason(inf, today),
      isStale: isStaleVisit(inf.scheduledTime, today),
      /* 쿠폰(보상 크레딧) 상태 — 발송은 콘텐츠를 받은 뒤에 하므로 이 표의 사람들은
         대개 미발송이다. 그 "대개"가 아닌 행이 있는지 화면이 직접 말하게 한다.
         발송 여부와 사용 여부는 다른 사실이라 따로 싣고, 미측정(hasCreditUsedValue)도
         함께 싣는다 — 빈 칸을 "미사용"으로 읽으면 안 된다. */
      creditShared: inf.creditShared,
      creditUsed: inf.creditUsed,
      hasCreditUsedValue: inf.hasCreditUsedValue,
    }))
    .sort((a, b) => b.valueUsd - a.valueUsd || (a.daysSinceVisit ?? Infinity) - (b.daysSinceVisit ?? Infinity));

  /* 단가가 센트 단위($8.58)라 그냥 더하면 부동소수점 찌꺼기가 남는다
     (8.58 × 3 = 25.740000000000002). 합계는 센트로 반올림해 내보낸다 —
     화면이 자릿수를 줄여 가려주더라도 값 자체가 지저분하면 어디선가 새어나온다. */
  const cents = n => Math.round(n * 100) / 100;

  const byTier = {};
  for (const item of items) {
    if (!byTier[item.tier]) byTier[item.tier] = { count: 0, valueUsd: 0 };
    byTier[item.tier].count += 1;
    byTier[item.tier].valueUsd = cents(byTier[item.tier].valueUsd + item.valueUsd);
  }

  return {
    count: items.length,
    lostValueUsd: cents(items.reduce((sum, i) => sum + i.valueUsd, 0)),
    byTier,
    items,
  };
}

/**
 * 로컬 자정 기준 'YYYY-MM-DD'. <input type="date">의 value 형식과 같다 —
 * 날짜 컨트롤과 집계가 같은 문자열을 쓰게 해서 키가 갈라지지 않도록 한다.
 *
 * @param {Date|null} date
 * @returns {string} 날짜가 없으면 빈 문자열
 */
export function toDateKey(date) {
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * 'YYYY-MM-DD' → 로컬 자정 Date.
 *
 * new Date('2026-08-20')을 쓰지 않는 이유: 그건 UTC 자정으로 읽혀서 미국 동부에서는
 * 하루 전(8/19 20:00)이 된다. 사용자가 고른 날과 세는 날이 하루 어긋나면
 * 경계일의 방문이 조용히 빠진다.
 *
 * @param {string} value
 * @returns {Date|null} 형식이 아니면 null
 */
export function parseDateKey(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/**
 * 기간별 방문 인원 — "언제부터 언제까지 몇 명 왔나".
 *
 * 세는 대상은 attend가 찍힌 사람이고, 날짜 축에 놓는 자리는 그 사람의 방문일
 * (scheduledTime)이다. 둘 중 하나가 없으면 기간 안에 놓을 수 없는데, 그 두 경우를
 * 0으로 흡수하지 않고 따로 센다:
 * - attend는 찍혔는데 방문일이 빈 행 → `undatedCount`. 합계에서 조용히 빠지면
 *   "그 기간에 덜 왔다"로 읽힌다. 빠졌다는 사실을 화면이 말할 수 있어야 한다.
 * - 방문일은 이 기간인데 attend가 아직 안 찍힌 행 → `pendingCount`. 앞으로 올
 *   사람일 수도, 왔는데 시트에 안 적힌 것일 수도 있다. 왔다고 세지는 않되
 *   있다고는 말한다(과거 기간이면 이 수가 시트 미기입 신호가 된다).
 *
 * 경계는 자정 기준 **양끝 포함**이다 — 사람이 고른 "8/1 ~ 8/20"에 8/20이 빠지면
 * 화면이 거짓말을 한다. from/to가 null이면 그쪽 끝은 열려 있다(= 전체 기간).
 *
 * @param {Influencer[]} influencers
 * @param {{from: Date|null, to: Date|null}} [range] - 양끝 포함. 기본값은 전체 기간
 * @returns {{
 *   count: number,
 *   byDate: Array<{key: string, date: Date, count: number}>,
 *   items: Array<{id: string, fullName: string, tier: string, store: string, scheduledTime: Date}>,
 *   undatedCount: number,
 *   pendingCount: number,
 *   busiest: {key: string, date: Date, count: number}|null,
 *   bounds: {from: Date|null, to: Date|null},
 * }}
 */
/**
 * 날짜가 기간 안에 드는지 — **자정 기준, 양끝 포함**이다. null 끝은 열린 끝.
 *
 * 기간을 쓰는 모든 자리(Operations Visits 밴드, Report 기간 한정)가 이 판정
 * 하나를 쓴다 — 경계 규칙이 화면마다 다르면 같은 기간의 수가 서로 어긋난다.
 *
 * @param {Date|null} date
 * @param {{from?: Date|null, to?: Date|null}} range
 * @returns {boolean} 날짜가 없으면 false — 없는 날짜는 어떤 기간에도 들지 않는다
 */
export function isDayInRange(date, range = {}) {
  if (!date) return false;
  const startOf = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = startOf(date).getTime();
  const fromDay = range.from ? startOf(range.from).getTime() : -Infinity;
  const toDay = range.to ? startOf(range.to).getTime() : Infinity;
  return day >= fromDay && day <= toDay;
}

/**
 * 방문일(scheduledTime)이 기간에 드는 행만 남긴다 — Report의 기간 코호트.
 * 방문일이 없는 행은 어떤 기간에도 들지 않으므로 빠진다(호출부가 그 수를 밝힌다).
 *
 * @param {Influencer[]} influencers
 * @param {{from?: Date|null, to?: Date|null}} range
 * @returns {Influencer[]}
 */
export function filterByVisitRange(influencers, range = {}) {
  return (influencers || []).filter(i => isDayInRange(i.scheduledTime, range));
}

export function deriveVisitReport(influencers, range = {}) {
  const list = influencers || [];
  const attended = list.filter(i => i.attend);

  const startOf = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const inRange = date => isDayInRange(date, range);

  /* 선택 범위와 무관한 **전체** 방문일의 양끝. 컨트롤이 입력의 min/max로 쓴다 —
     데이터에 없는 날짜부터 고르게 두면 빈 결과가 나오고, 읽는 사람은 그걸
     자기가 잘못 고른 탓인지 데이터가 없는 탓인지 구분할 수 없다. */
  const datedDays = attended.filter(i => i.scheduledTime).map(i => startOf(i.scheduledTime).getTime());
  const bounds = datedDays.length === 0
    ? { from: null, to: null }
    : { from: new Date(Math.min(...datedDays)), to: new Date(Math.max(...datedDays)) };

  const items = attended
    .filter(i => inRange(i.scheduledTime))
    .map(inf => ({
      id: inf.id,
      fullName: inf.fullName,
      tier: inf.tier,
      store: inf.store,
      scheduledTime: inf.scheduledTime,
    }))
    .sort((a, b) => a.scheduledTime - b.scheduledTime);

  const byDateMap = new Map();
  for (const item of items) {
    const key = toDateKey(item.scheduledTime);
    if (!byDateMap.has(key)) byDateMap.set(key, { key, date: startOf(item.scheduledTime), count: 0 });
    byDateMap.get(key).count += 1;
  }
  const byDate = [...byDateMap.values()].sort((a, b) => a.date - b.date);

  /* 최다 방문일은 하나만 고른다 — 동수면 앞선 날짜가 이긴다.
     "제일 몰린 날이 언제였나"는 다음 캠페인 일정을 잡을 때 쓰는 값이다. */
  const busiest = byDate.reduce((best, day) => (best && best.count >= day.count ? best : day), null);

  return {
    count: items.length,
    byDate,
    items,
    undatedCount: attended.filter(i => !i.scheduledTime).length,
    pendingCount: list.filter(i => !i.attend && inRange(i.scheduledTime)).length,
    busiest,
    bounds,
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
    if (inf.creditUsed) acc.creditUsedCount += 1;
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
 * 초대 인원(Number 탭)을 티어/카테고리 코호트로 좁힌다 — 구조는 그대로 유지.
 * Number 탭의 축이 store × tier × category뿐이라 이 두 축만 받는다.
 * 플랫폼은 축이 없어 여기서 거를 수 없다 — 그 경우 호출부가 초대를 통째로 빼고
 * 퍼널 첫 줄을 Tracked로 돌리는 기존 규칙(기간 필터와 동일)을 쓴다.
 *
 * @param {Object<string, Object<string, Object<string, number>>>} inviteCounts - { [store]: { [tier]: { [category]: count } } }
 * @param {string} tier - TIERS 값 또는 'all'
 * @param {string} category - CATEGORIES 값 또는 'all'
 * @returns {Object<string, Object<string, Object<string, number>>>} 같은 구조로 좁혀진 사본
 */
export function filterInviteCounts(inviteCounts, tier = 'all', category = 'all') {
  if (tier === 'all' && category === 'all') return inviteCounts || {};
  const result = {};
  for (const [store, tiers] of Object.entries(inviteCounts || {})) {
    const outTiers = {};
    for (const [t, categories] of Object.entries(tiers)) {
      if (tier !== 'all' && t !== tier) continue;
      const outCategories = {};
      for (const [cat, count] of Object.entries(categories)) {
        if (category !== 'all' && cat !== category) continue;
        outCategories[cat] = count;
      }
      if (Object.keys(outCategories).length > 0) outTiers[t] = outCategories;
    }
    if (Object.keys(outTiers).length > 0) result[store] = outTiers;
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
  /* 크레딧 발급·사용 수. 그룹 표마다 같은 두 줄을 반복해 적으면 한쪽만 고쳐져 갈라진다.
     사용 수는 비율이 아니라 발급 수와 짝으로 쓴다 — 시트의 credit used 칸은 빈 행이
     많아서 비율을 내면 미기록이 전부 미사용으로 계산된다(KPI 스트립과 같은 규칙). */
  const creditStats = list => ({
    creditSharedCount: list.filter(i => i.creditShared).length,
    creditUsedCount: list.filter(i => i.creditUsed).length,
  });
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
      ...creditStats(list),
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
      ...creditStats(list),
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
      ...creditStats(list),
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
      ...creditStats(list),
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

/**
 * G10 Grand Opening 프로그램 결산 리포트 — "언제부터 했고, 목표 대비 얼마나 왔고,
 * 얼마 썼고, 잘한 사람이 몇 명인가"를 한 블록으로 답한다.
 *
 * 전체 목록에서 스토어 × Purpose(시트 열)로 코호트를 스스로 거른다 — 호출부의 스토어/기간 필터를 타지 않는다.
 * 목표 대비 달성률은 프로그램 전체가 모수인데, 화면의 기간 코호트를 물려받으면
 * 부분 기간 방문 수를 전체 목표와 비교하는 거짓 비율이 된다.
 *
 * 정직성 규칙(기존 리포트와 동일):
 * - No show는 방문 예정일이 **지난** 미방문만 센다. 예정일이 아직 안 온 사람은
 *   scheduled로 따로 센다 — 프로그램 진행 중에 미래 방문을 노쇼로 부르면 안 된다.
 *   날짜 없는 미방문은 프로그램이 끝난 뒤에만 노쇼로 넘긴다(그 전엔 판정 불가).
 * - 크레딧 사용액은 시트에 사용이 **확인된** 행만 합산한다(빈 칸 ≠ 미사용).
 * - 기프트백 수 = 방문 수다(방문 때 지급) — 재고 실사와 한두 개 어긋날 수 있는
 *   장부값이지, 실사값이 아니다. 단가는 그 사람 티어가 기본이고, 매장이 다른 티어
 *   백을 건넨 방문(program.giftBagTierOverrides)은 **실제로 나간 백**의 단가로 센다 —
 *   비용 리포트는 지급했어야 할 것이 아니라 지급한 것을 센다.
 * - 성과 우수 판정은 Performance 섹션과 같은 derivePerformanceReport에서 나온다:
 *   시트 Opinion이 USE이거나, Opinion이 빈 행 중 engagements 상위 사분위 추천이
 *   USE인 행. 두 화면이 다른 기준으로 "잘했다"를 말하면 안 된다.
 *
 * @param {Influencer[]} influencers - **전체** 목록 (스토어·기간 필터 이전)
 * @param {Object<string, Object<string, Object<string, number>>>} [inviteCounts] - Number 탭 전체
 * @param {Date} [today] - 테스트 주입점
 * @param {object} [program] - INFLUENCER_PROGRAMS 항목 [기본값: 첫 프로그램(G10 Grand Opening)]
 * @returns {null|{
 *   title: string, store: string, purpose: string, label: string,
 *   unassignedCount: number,
 *   period: {from: Date, to: Date, days: number}, isOngoing: boolean,
 *   byTier: Object<string, {goal: number, invited: number|null, tracked: number,
 *     attended: number, goalRate: number, noShow: number, scheduled: number,
 *     creditSentCount: number, creditSentUsd: number,
 *     creditUsedCount: number, creditUsedUsd: number,
 *     giftCount: number, giftUsd: number}>,
 *   totals: object, spendUsd: {gift: number, creditUsed: number, total: number},
 *   performance: {uploadedCount: number, recordedCount: number, topCount: number,
 *     topByTier: {tier1: number, tier2: number},
 *     top: Array<{id: string, fullName: string, tier: string, views: number|null,
 *       engagements: number, er: number|null}>},
 * }} G10 행이 하나도 없으면 null — 섹션을 그리지 않는다
 */
export function deriveProgramReport(influencers, inviteCounts = {}, today = new Date(), program = INFLUENCER_PROGRAMS[0]) {
  const storeRows = (influencers || []).filter(i => i.store === program.store);
  if (storeRows.length === 0) return null;

  /* 행 소속은 시트 Purpose 열이 정한다 — 한 매장이 프로그램 여럿을 겹쳐 돌리면
     store만으로는 어느 결산의 행인지 알 수 없다. 시트 표기가 "Grand Opening"/
     "grand opening"으로 섞여 있어 양쪽 다 소문자·trim으로 맞춘다. */
  const purposeKey = (program.purpose || '').trim().toLowerCase();
  const rows = storeRows.filter(i => (i.purpose || '').trim().toLowerCase() === purposeKey);
  /* Purpose가 빈 행은 어느 프로그램에도 못 든다 — 조용히 빼면 결산이 왜 모자란지
     알 수 없으므로 수를 실어 화면이 밝히게 한다(기간 필터의 undated 규칙과 동일).
     행이 아직 없는 프로그램도 결산은 그린다(목표 0/30이 "모집 전"을 말한다). */
  const unassignedCount = storeRows.filter(i => !(i.purpose || '').trim()).length;

  const from = parseDateKey(program.startKey);
  const to = parseDateKey(program.endKey);
  const days = Math.round((to - from) / 86400000) + 1;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isOngoing = todayStart <= to;

  const cents = n => Math.round(n * 100) / 100;
  /* Number 탭에는 purpose 축이 없다 — 이 프로그램이 그 탭의 주인일 때만 얹는다
     (같은 매장의 두 번째 프로그램에 첫 프로그램의 초대 수를 얹으면 거짓 분모가 된다) */
  const invitedByTier = sumInviteCountsByTier(
    program.useInviteCounts && inviteCounts[program.store]
      ? { [program.store]: inviteCounts[program.store] } : {},
  );
  const hasInviteData = invitedByTier.tier1 + invitedByTier.tier2 > 0;

  /* 실제로 건네진 백의 티어 — 매장 착오 보정. 이름 매칭이라 소문자·trim으로 맞춘다
     (시트 이름 칸에 꼬리 공백이 실재하고, 착오 보고는 사람 이름으로 온다). */
  const bagTierOf = i =>
    program.giftBagTierOverrides?.[(i.fullName || '').trim().toLowerCase()] ?? i.tier;

  const tierStats = tier => {
    const list = rows.filter(i => i.tier === tier);
    const attended = list.filter(i => i.attend);
    const notAttended = list.filter(i => !i.attend);
    /* 예정일이 지났는데 안 온 사람만 노쇼다. 날짜가 아직 안 온 사람은 scheduled —
       진행 중엔 둘을 섞으면 안 되고, 프로그램이 끝나면 남은 미방문 전부가 노쇼다. */
    const isPastDay = d => d && new Date(d.getFullYear(), d.getMonth(), d.getDate()) < todayStart;
    const noShow = notAttended.filter(i => isPastDay(i.scheduledTime) || (!i.scheduledTime && !isOngoing));
    const creditSent = list.filter(i => i.creditShared);
    const creditUsed = list.filter(i => i.creditUsed);
    const sumCredit = l => cents(l.reduce((s, i) => s + (creditValueUsd(i.creditType) ?? 0), 0));
    const goal = program.goalByTier[tier] ?? 0;
    return {
      goal,
      invited: hasInviteData ? invitedByTier[tier] : null,
      tracked: list.length,
      attended: attended.length,
      goalRate: goal > 0 ? attended.length / goal : 0,
      noShow: noShow.length,
      scheduled: notAttended.length - noShow.length,
      creditSentCount: creditSent.length,
      creditSentUsd: sumCredit(creditSent),
      creditUsedCount: creditUsed.length,
      creditUsedUsd: sumCredit(creditUsed),
      giftCount: attended.length,
      giftUsd: cents(attended.reduce((s, i) => s + (TIER_GIFT_VALUE_USD[bagTierOf(i)] ?? 0), 0)),
      /* 다른 티어 백이 나간 방문 수 — 화면 각주가 "왜 단가×수와 합계가 다른지"를 말한다 */
      giftMixCount: attended.filter(i => bagTierOf(i) !== i.tier).length,
    };
  };

  const byTier = {
    [TIERS.TIER1]: tierStats(TIERS.TIER1),
    [TIERS.TIER2]: tierStats(TIERS.TIER2),
  };
  const sum = key => byTier.tier1[key] + byTier.tier2[key];
  const totals = {
    goal: sum('goal'),
    invited: hasInviteData ? sum('invited') : null,
    tracked: sum('tracked'),
    attended: sum('attended'),
    goalRate: sum('goal') > 0 ? sum('attended') / sum('goal') : 0,
    noShow: sum('noShow'),
    scheduled: sum('scheduled'),
    creditSentCount: sum('creditSentCount'),
    creditSentUsd: cents(sum('creditSentUsd')),
    creditUsedCount: sum('creditUsedCount'),
    creditUsedUsd: cents(sum('creditUsedUsd')),
    giftCount: sum('giftCount'),
    giftUsd: cents(sum('giftUsd')),
    giftMixCount: sum('giftMixCount'),
  };

  /* "실제로 쓴 돈"은 방문 때 나간 기프트백 + 사용이 확인된 크레딧이다.
     발급했지만 사용 미확인인 크레딧은 아직 나간 돈이 아니라 여기 안 넣는다 —
     발급 총액은 byTier/totals가 따로 말한다. */
  const spendUsd = {
    gift: totals.giftUsd,
    creditUsed: totals.creditUsedUsd,
    total: cents(totals.giftUsd + totals.creditUsedUsd),
  };

  /* 성과 우수 — Performance 순위표와 같은 함수·같은 코호트(G10 전체) */
  const perf = derivePerformanceReport(rows);
  const top = perf.ranked.filter(r => r.opinion === OPINIONS.USE || r.suggestedOpinion === OPINIONS.USE);
  const performance = {
    uploadedCount: perf.uploadedCount,
    recordedCount: perf.recordedCount,
    topCount: top.length,
    topByTier: {
      tier1: top.filter(r => r.tier === TIERS.TIER1).length,
      tier2: top.filter(r => r.tier === TIERS.TIER2).length,
    },
    /* 결산 블록이 명단 표를 직접 그린다(2026-09-01 사장님: "숫자 띡 넣지 말고 누구인지,
       성과·링크·이메일 다 적으라" — 회장님 보고용). ranked 행에는 연락처가 없어
       원본 행에서 이메일·프로필·콘텐츠 링크를 되찾아 싣는다 — 표기는 목록 행과
       같은 출처(socialHandle 등)라 두 화면이 어긋나지 않는다. */
    top: top.map(r => {
      const inf = rows.find(i => i.id === r.id);
      return {
        id: r.id, fullName: r.fullName, tier: r.tier, platform: r.platform,
        views: r.views, engagements: r.engagements, er: r.er,
        opinion: r.opinion, suggestedOpinion: r.suggestedOpinion,
        email: inf?.email || '',
        socialAccountUrl: inf?.socialAccountUrl || '',
        socialHandle: inf?.socialHandle || '',
        collaboLink: inf?.collaboLink || '',
      };
    }),
  };

  return {
    title: program.title,
    store: program.store,
    purpose: purposeKey,
    label: program.label || program.title,
    unassignedCount,
    period: { from, to, days },
    isOngoing,
    byTier,
    totals,
    spendUsd,
    performance,
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
    purpose: '',
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
    creditUsedCount: 0,
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
