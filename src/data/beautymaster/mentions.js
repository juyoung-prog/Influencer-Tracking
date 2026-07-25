/**
 * BeautyMaster — Mentions Tracking (시안/mockup)
 *
 * Constants, derive helpers, and mock data for the daily English-keyword
 * mention crawl (Instagram + TikTok). Follows schema.js conventions:
 * frozen constant maps + pure derive functions, no imports.
 *
 * Data source (planned): daily Apps Script crawl appends rows to a
 * "Mentions" sheet tab; the dashboard polls it as CSV like every other tab.
 * Until that pipeline exists, MOCK_MENTIONS feeds the UI mockup.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

/** 수집 경로 — 경로에 따라 자동 검증 가능 여부가 갈린다 */
export const MENTION_SOURCES = Object.freeze({
  /** IG 해시태그 검색 — 작성자 익명(수동 확인 필요) */
  HASHTAG: 'hashtag',
  /** IG @beautymaster 태그 웹훅 — 작성자 식별 가능 */
  MENTION_WEBHOOK: 'mention-webhook',
  /** 협업 인플루언서 핸들 폴링 (IG Business Discovery) */
  KNOWN_HANDLE: 'known-handle',
  /** 틱톡 OAuth 동의 계정 (Display API) */
  TIKTOK_OAUTH: 'tiktok-oauth',
  /** 구글 색인 발굴 (site:tiktok.com) — 팔로워 수 검증 불가 */
  GOOGLE_INDEX: 'google-index',
});

export const MENTION_SOURCE_LABELS = Object.freeze({
  [MENTION_SOURCES.HASHTAG]: 'Hashtag',
  [MENTION_SOURCES.MENTION_WEBHOOK]: '@Mention',
  [MENTION_SOURCES.KNOWN_HANDLE]: 'Collab',
  [MENTION_SOURCES.TIKTOK_OAUTH]: 'Collab',
  [MENTION_SOURCES.GOOGLE_INDEX]: 'Google',
});

/** 자격 검증 결과 — 팔로워 1만+ & ER 기준 통과 여부 */
export const MENTION_QUALIFICATIONS = Object.freeze({
  QUALIFIED: 'qualified',
  BELOW_THRESHOLD: 'below-threshold',
  /** 작성자 익명 또는 팔로워 수 조회 불가 — 수동 확인 대기열 */
  UNVERIFIED: 'unverified',
});

/** 운영 상태 — 시트에서 수기로 관리 */
export const MENTION_STATUSES = Object.freeze({
  NEW: 'new',
  REVIEWED: 'reviewed',
  CONTACTED: 'contacted',
  IGNORED: 'ignored',
});

export const MENTION_STATUS_LABELS = Object.freeze({
  [MENTION_STATUSES.NEW]: 'New',
  [MENTION_STATUSES.REVIEWED]: 'Reviewed',
  [MENTION_STATUSES.CONTACTED]: 'Contacted',
  [MENTION_STATUSES.IGNORED]: 'Ignored',
});

/** 자격 기준 — 운영 중에는 시트 설정 탭에서 조정 예정 */
export const MENTION_THRESHOLDS = Object.freeze({
  MIN_FOLLOWERS: 10000,
  MIN_ENGAGEMENT_RATE: 0.02,
  /** 익명(해시태그) 건 1차 컷 — 이 좋아요 수 미만은 수집기에서 제외 */
  MIN_ANON_LIKES: 500,
});

// ─── Derive helpers ──────────────────────────────────────────────────────────

/**
 * 축약 숫자 포맷 (52300 → "52.3K", 1200000 → "1.2M")
 * @param {number|null} n
 * @returns {string}
 */
export function formatCompact(n) {
  if (n == null) return '—';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

/**
 * 멘션 목록에서 KPI 요약 도출
 * @param {Mention[]} mentions
 * @returns {{ newToday: number, qualified: number, reviewQueue: number, contacted: number, avgEngagementRate: number|null }}
 */
export function deriveMentionKpi(mentions) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const qualifiedList = mentions.filter(m => m.qualification === MENTION_QUALIFICATIONS.QUALIFIED);
  const withEr = qualifiedList.filter(m => m.engagementRate != null);

  return {
    newToday: mentions.filter(m => m.capturedAt >= todayStart && m.status === MENTION_STATUSES.NEW).length,
    qualified: qualifiedList.length,
    reviewQueue: mentions.filter(m => m.qualification === MENTION_QUALIFICATIONS.UNVERIFIED && m.status === MENTION_STATUSES.NEW).length,
    contacted: mentions.filter(m => m.status === MENTION_STATUSES.CONTACTED).length,
    avgEngagementRate: withEr.length > 0
      ? withEr.reduce((sum, m) => sum + m.engagementRate, 0) / withEr.length
      : null,
  };
}

// ─── JSDoc Typedef ───────────────────────────────────────────────────────────

/**
 * @typedef {Object} Mention
 * @property {string} id - postUrl 기반 고유 키
 * @property {'Instagram'|'TikTok'} platform
 * @property {string} postUrl
 * @property {string|null} authorHandle - 익명(해시태그) 건은 null
 * @property {string|null} authorProfileUrl
 * @property {number|null} followerCount - 검증 불가 시 null
 * @property {number|null} engagementRate - (likes+comments)/followers, 검증 불가 시 null
 * @property {number|null} likes
 * @property {Date} postedAt
 * @property {Date} capturedAt - 수집기가 발견한 시각
 * @property {string} matchedKeyword
 * @property {string} source - MENTION_SOURCES 값
 * @property {string} qualification - MENTION_QUALIFICATIONS 값
 * @property {string} status - MENTION_STATUSES 값
 * @property {string|null} linkedInfluencerName - 기존 협업 인플루언서 매칭 시 이름
 * @property {string} caption - 캡션 발췌 (수동 확인용 맥락)
 */

// ─── Mock data (시안 전용 — 수집 파이프라인 연결 전까지 사용) ────────────────────

const D = iso => new Date(iso);

export const MOCK_MENTIONS = [
  // 오늘 크롤 — qualified 신규 발굴
  {
    id: 'ig_p_C9xK21', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9xK21',
    authorHandle: 'glowbysofia', authorProfileUrl: 'https://instagram.com/glowbysofia',
    followerCount: 52300, engagementRate: 0.042, likes: 2140,
    postedAt: D('2026-07-24T18:20:00'), capturedAt: D('2026-07-25T07:00:00'),
    matchedKeyword: '@beautymaster', source: 'mention-webhook',
    qualification: 'qualified', status: 'new', linkedInfluencerName: null,
    caption: 'Found my new go-to K-beauty haul spot @beautymaster in Duluth! …',
  },
  {
    id: 'tt_v_88213', platform: 'TikTok', postUrl: 'https://tiktok.com/@kbeautyava/video/88213',
    authorHandle: 'kbeautyava', authorProfileUrl: 'https://tiktok.com/@kbeautyava',
    followerCount: 128000, engagementRate: 0.061, likes: 7800,
    postedAt: D('2026-07-23T21:05:00'), capturedAt: D('2026-07-25T07:00:00'),
    matchedKeyword: 'beautymaster', source: 'google-index',
    qualification: 'qualified', status: 'new', linkedInfluencerName: null,
    caption: 'beautymaster atlanta is UNDERRATED — full skincare restock vlog',
  },
  // 오늘 크롤 — 협업 인플루언서 업로드 감지 (attend-no-collabo 해소 케이스)
  {
    id: 'tt_v_10422', platform: 'TikTok', postUrl: 'https://tiktok.com/@park.soyeon/video/10422',
    authorHandle: 'park.soyeon', authorProfileUrl: 'https://tiktok.com/@park.soyeon',
    followerCount: 45100, engagementRate: 0.055, likes: 2480,
    postedAt: D('2026-07-24T15:40:00'), capturedAt: D('2026-07-25T07:00:00'),
    matchedKeyword: '#beautymaster', source: 'tiktok-oauth',
    qualification: 'qualified', status: 'new', linkedInfluencerName: 'Park Soyeon',
    caption: 'GRWM with everything I picked up at #beautymaster ✨',
  },
  {
    id: 'ig_p_C9wF08', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9wF08',
    authorHandle: 'kim.minjung', authorProfileUrl: 'https://instagram.com/kim.minjung',
    followerCount: 38900, engagementRate: 0.037, likes: 1390,
    postedAt: D('2026-07-24T11:12:00'), capturedAt: D('2026-07-25T07:00:00'),
    matchedKeyword: '#beautymasterusa', source: 'known-handle',
    qualification: 'qualified', status: 'new', linkedInfluencerName: 'Kim Minjung',
    caption: 'Restocked my whole routine — thank you #beautymasterusa 🤍',
  },
  // 검토 대기열 — IG 해시태그 익명 건 (좋아요 1차 컷 통과)
  {
    id: 'ig_p_C9vT77', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9vT77',
    authorHandle: null, authorProfileUrl: null,
    followerCount: null, engagementRate: null, likes: 1820,
    postedAt: D('2026-07-24T09:30:00'), capturedAt: D('2026-07-25T07:00:00'),
    matchedKeyword: '#beautymaster', source: 'hashtag',
    qualification: 'unverified', status: 'new', linkedInfluencerName: null,
    caption: 'K-beauty shelfie of the week 🧴 #beautymaster #skincareroutine #atlanta',
  },
  {
    id: 'ig_p_C9uQ35', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9uQ35',
    authorHandle: null, authorProfileUrl: null,
    followerCount: null, engagementRate: null, likes: 940,
    postedAt: D('2026-07-23T19:44:00'), capturedAt: D('2026-07-25T07:00:00'),
    matchedKeyword: '#beautymaster', source: 'hashtag',
    qualification: 'unverified', status: 'new', linkedInfluencerName: null,
    caption: 'Sunday reset: mask night with my #beautymaster haul 🫧',
  },
  // 검토 대기열 — 틱톡 구글 색인 건 (핸들은 알지만 팔로워 검증 불가)
  {
    id: 'tt_v_5590', platform: 'TikTok', postUrl: 'https://tiktok.com/@dewyskindiary/video/5590',
    authorHandle: 'dewyskindiary', authorProfileUrl: 'https://tiktok.com/@dewyskindiary',
    followerCount: null, engagementRate: null, likes: 3200,
    postedAt: D('2026-07-21T13:00:00'), capturedAt: D('2026-07-24T07:00:00'),
    matchedKeyword: 'beauty master', source: 'google-index',
    qualification: 'unverified', status: 'new', linkedInfluencerName: null,
    caption: 'the beauty master store tour you asked for 🛒 (part 2)',
  },
  // 어제까지 처리된 것들
  {
    id: 'ig_p_C9sM12', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9sM12',
    authorHandle: 'skinbyleah', authorProfileUrl: 'https://instagram.com/skinbyleah',
    followerCount: 76400, engagementRate: 0.048, likes: 3540,
    postedAt: D('2026-07-22T16:00:00'), capturedAt: D('2026-07-23T07:00:00'),
    matchedKeyword: '@beautymaster', source: 'mention-webhook',
    qualification: 'qualified', status: 'contacted', linkedInfluencerName: null,
    caption: 'My @beautymaster picks for humid Georgia summers ☀️',
  },
  {
    id: 'tt_v_31577', platform: 'TikTok', postUrl: 'https://tiktok.com/@avaglowup/video/31577',
    authorHandle: 'avaglowup', authorProfileUrl: 'https://tiktok.com/@avaglowup',
    followerCount: 21700, engagementRate: 0.029, likes: 610,
    postedAt: D('2026-07-21T20:15:00'), capturedAt: D('2026-07-22T07:00:00'),
    matchedKeyword: 'beautymaster', source: 'google-index',
    qualification: 'qualified', status: 'reviewed', linkedInfluencerName: null,
    caption: 'come thrift k-beauty with me… beautymaster edition',
  },
  // 기준 미달 — 시트에는 남김 (마이크로 인플루언서 참고용)
  {
    id: 'ig_p_C9rB90', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9rB90',
    authorHandle: 'jessglows_', authorProfileUrl: 'https://instagram.com/jessglows_',
    followerCount: 8200, engagementRate: 0.081, likes: 660,
    postedAt: D('2026-07-22T10:30:00'), capturedAt: D('2026-07-23T07:00:00'),
    matchedKeyword: '#beautymaster', source: 'mention-webhook',
    qualification: 'below-threshold', status: 'new', linkedInfluencerName: null,
    caption: 'obsessed with everything from #beautymaster 🛍️',
  },
  {
    id: 'ig_p_C9qA44', platform: 'Instagram', postUrl: 'https://instagram.com/p/C9qA44',
    authorHandle: 'minaslowbeauty', authorProfileUrl: 'https://instagram.com/minaslowbeauty',
    followerCount: 4900, engagementRate: 0.036, likes: 170,
    postedAt: D('2026-07-20T14:20:00'), capturedAt: D('2026-07-21T07:00:00'),
    matchedKeyword: '@beautymaster', source: 'mention-webhook',
    qualification: 'below-threshold', status: 'ignored', linkedInfluencerName: null,
    caption: 'quick stop at @beautymaster before work 💄',
  },
];
