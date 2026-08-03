import Box from '@mui/material/Box';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import SaasAnalyticsView from './SaasAnalyticsView';
import { SAAS_FONT } from './SaasShell';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';
import { ALL_STORES, deriveStores } from '../../../data/beautymaster/schema.js';

const STORES = deriveStores(MOCK_INFLUENCERS);


/* 시트의 Number 탭 구조 그대로 store → tier → category 3단계.
   2단계로 두면 sumInviteCountsTotal이 0을 내고 Responded 단계가 통째로 사라진다. */
const INVITE_COUNTS = {
  G10: {
    tier1: { general: 40, specific: 6, kbeauty: 9 },
    tier2: { general: 25, specific: 4, kbeauty: 5 },
  },
  Atlanta: {
    tier1: { general: 30, specific: 3, kbeauty: 4 },
    tier2: { general: 20, specific: 2, kbeauty: 3 },
  },
};

export default {
  title: 'BeautyMaster/Section/SaasAnalyticsView',
  component: SaasAnalyticsView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    influencers: { control: 'object', description: '전체 인플루언서 목록' },
    inviteCounts: { control: 'object', description: '초대 인원 (store→tier→category→count). 선택된 스토어로 함께 좁혀진다' },
    stores: { control: 'object', description: '스토어 선택 옵션. 없으면 influencers에서 파생' },
    selectedStore: { control: 'select', options: [ALL_STORES, ...STORES], description: '선택된 스토어 — 세 뷰가 공유' },
    onStoreChange: { action: 'storeChanged', description: '스토어 변경 핸들러' },
    onSelect: { action: 'selected', description: 'Performance 순위 행 클릭 핸들러 (influencer) => void — 페이지가 Drawer를 연다' },
    sheetUrl: { control: 'text', description: 'Google Sheet 원본 링크 — Performance 첫 사용 안내(Opinion 전무 상태)의 Open sheet 링크' },
  },
  args: {
    influencers: MOCK_INFLUENCERS,
    stores: STORES,
    selectedStore: ALL_STORES,
    onStoreChange: fn(),
  },
  decorators: [
    Story => (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
};

/** 기본 — Campaign summary → Conversion funnel → Breakdown → Performance → Store */
export const Default = {};

/** 초대 인원 연결 — 퍼널에 Invited/Responded 단계가 반영된다 */
export const WithInviteCounts = {
  args: { inviteCounts: INVITE_COUNTS },
};

/**
 * 스토어 한정 — influencers와 inviteCounts를 **함께** 좁힌다.
 * 한쪽만 좁히면 퍼널의 Invited 단계가 목록과 어긋난다.
 */
export const StoreScoped = {
  args: { selectedStore: 'G10', inviteCounts: INVITE_COUNTS },
};

/** 데이터가 없어도 스토어 Select는 남는다 — 다른 스토어로 옮겨갈 수 있어야 하므로 */
export const Empty = {
  args: { influencers: [], stores: STORES },
};

/**
 * Bars와 Table은 같은 배열(buildFunnelRows)에서 나온다.
 *
 * 예전에는 Table이 Breakdown 테이블 스키마를 재사용해 attendRate/uploadRate를
 * 1로 하드코딩했고, 그 결과 모든 행이 100%로 나오면서 라벨도 raw 필드명(creditSent…)이
 * 그대로 노출됐다. 두 뷰가 갈라지지 않는지 토글해서 단계별로 대조한다.
 */
export const BarsAndTableAgree = {
  args: { inviteCounts: INVITE_COUNTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // DOM 구조 대신 data 속성으로 잡는다 — 구조를 바꿀 때마다 테스트가 조용히 빗나간다
    const readBars = () => Object.fromEntries(
      [...canvasElement.querySelectorAll('[data-funnel-step]')].map(r => [
        r.getAttribute('data-funnel-step'),
        {
          label: r.querySelector('[data-funnel-label]').textContent.trim(),
          value: r.querySelector('[data-funnel-value]').textContent.trim().split(' ')[0],
        },
      ]),
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Bars' }));
    const bars = await waitFor(() => {
      const b = readBars();
      if (Object.keys(b).length === 0) throw new Error('no bars');
      return b;
    });

    await userEvent.click(canvas.getByRole('button', { name: 'Table' }));
    const table = await waitFor(() => {
      const t = canvasElement.querySelector('table');
      if (!t) throw new Error('no table');
      return t;
    });

    // 컬럼은 퍼널 스키마 — Breakdown의 Visit rate / Upload rate가 아니다
    const head = [...table.querySelectorAll('thead th')].map(c => c.textContent.trim());
    await expect(head).toEqual(['Stage', 'Count', '% of invited', '% of previous']);

    const rows = Object.fromEntries(
      [...table.querySelectorAll('tbody tr[data-funnel-step]')].map(r => [
        r.getAttribute('data-funnel-step'),
        {
          label: r.children[0].textContent.replace('not measured', '').trim(),
          value: r.children[1].textContent.trim(),
        },
      ]),
    );

    // 단계 구성 · 라벨 · 값이 완전히 같아야 한다
    await expect(Object.keys(rows)).toEqual(Object.keys(bars));
    await expect(rows).toEqual(bars);

    // 모든 행이 100%로 나오던 회귀를 막는다 — 비율이 실제로 갈라져야 한다
    const ofInvited = [...table.querySelectorAll('tbody tr')].map(r => r.children[2].textContent.trim());
    await expect(new Set(ofInvited).size).toBeGreaterThan(1);

    // raw 필드명이 새어나오지 않는다
    for (const bad of ['creditSent', 'creditUsed', 'attended']) {
      await expect(table.textContent).not.toContain(bad);
    }
  },
};

/**
 * 단일 스토어에서는 Store 브레이크다운을 감춘다 — 행이 하나뿐이라 비교할 게 없다.
 */
/** 오늘 기준 n일 전 — D+14 기록 상태는 시간 파생이라 고정 날짜로는 스토리가 썩는다 */
const daysAgo = n => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(13, 0, 0, 0);
  return d;
};

const perfInf = (id, name, overrides) => ({
  ...MOCK_INFLUENCERS[0],
  id,
  fullName: name,
  agreement: true, attend: true, collaboShared: true, creditShared: true, creditUsed: true,
  tier: 'tier1', creditType: '$100 Credit',
  uploadDate: daysAgo(20), recordDate: daysAgo(6),
  alertFlags: [],
  views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
  opinion: null,
  ...overrides,
});

/**
 * Performance 리포트 — 재섭외 결정에 맞춘 산출물.
 *
 * - 순위는 **총 반응 수(Engagements = 질 × 도달)** — ER 정렬은 872뷰 소형 계정을
 *   1위에 앉히고 최대 도달자를 꼴찌권으로 밀었다(2026-08-03 A안 채택). ER은 참고 컬럼.
 * - 지표 6종(views~reposts) 전부 컬럼으로 — 시트에 적은 그대로, 빈 지표는 "—"
 * - 숫자와 사장님 평가가 어긋나는 행(상위인데 DON'T / 하위인데 USE)에 review 배지
 * - 조회수만 없는 기록도 순위에 든다(반응 절대량은 아니까) — ER만 "—"
 * - 행을 누르면 onSelect가 불린다 — 페이지가 Drawer를 열어 상세(기록 시점 포함)를 보여준다
 */
export const PerformanceReportRanksByEngagements = {
  args: {
    onSelect: fn(),
    influencers: [
      // ER 14.0% — 최상위인데 DON'T → review
      perfInf('er-top', 'Ava Torres', { tier: 'tier2', creditType: '$20 Credit_Tier2', views: 10000, likes: 900, shares: 100, saves: 300, comments: 100, reposts: 0, opinion: "DON'T" }),
      // ER 6.5% — 상위 절반 + USE → 정상
      perfInf('er-mid1', 'Bella Kim', { views: 20000, likes: 1000, shares: 50, saves: 150, comments: 100, reposts: 0, opinion: 'USE' }),
      // ER 5.0% — D+28 늦은 기록
      perfInf('er-mid2', 'Cara Lopez', { views: 15000, likes: 600, shares: 30, saves: 60, comments: 60, reposts: 0, opinion: 'MAYBE', uploadDate: daysAgo(30), recordDate: daysAgo(2) }),
      // ER 2.0% — 하위 절반인데 USE → review
      perfInf('er-low', 'Dana Park', { tier: 'tier2', creditType: '$20 Credit_Tier2', views: 8000, likes: 100, shares: 10, saves: 20, comments: 30, reposts: 0, opinion: 'USE' }),
      // 조회수만 없는 기록 — 반응 절대량(500)으로는 순위에 들고 ER만 "—"
      perfInf('er-noviews', 'Emma Cho', { likes: 500 }),
      // 업로드만 되고 아직 기록 전 — 분모(uploads)에만 잡힌다
      perfInf('er-pending', 'Fay Jung', { uploadDate: daysAgo(5), recordDate: null }),
    ],
  },
  play: async ({ args, canvasElement }) => {
    const section = canvasElement.querySelector('[data-perf-section]');
    await expect(section).toBeTruthy();

    // 분모가 제목에 있다 — 기록 5건, 업로드 6건
    await expect(section.textContent).toContain('recorded 5 of 6 uploads');

    // 총 반응 수 내림차순 — 1,400 > 1,300 > 750 > 500(조회수 없음) > 160
    const order = [...section.querySelectorAll('[data-perf-rank-row]')].map(r => r.getAttribute('data-perf-rank-row'));
    await expect(order).toEqual(['er-top', 'er-mid1', 'er-mid2', 'er-noviews', 'er-low']);
    // 순위 번호가 붙는다 — "T2에서 3등인 애" 같은 대화가 가능해진다
    await expect(section.querySelector('[data-perf-rank-row="er-top"] [data-perf-rank]').textContent.trim()).toBe('1');
    // 조회수 없는 기록도 반응 절대량으로 순위에 든다 — ER만 "—"로 남는다
    const noViewsRow = section.querySelector('[data-perf-rank-row="er-noviews"]');
    await expect(noViewsRow.querySelector('[data-perf-engagements]').textContent.trim()).toBe('500');

    // 평가↔숫자 어긋남에만 review 배지
    await expect(section.querySelector('[data-perf-rank-row="er-top"] [data-perf-review]').getAttribute('data-perf-review')).toBe('high-eng-dont');
    await expect(section.querySelector('[data-perf-rank-row="er-low"] [data-perf-review]').getAttribute('data-perf-review')).toBe('low-eng-use');
    await expect(section.querySelector('[data-perf-rank-row="er-mid1"] [data-perf-review]')).toBeNull();

    // 행 클릭 → onSelect(influencer) — 페이지가 이걸 받아 Drawer를 연다
    await userEvent.click(section.querySelector('[data-perf-rank-row="er-top"]'));
    await waitFor(async () => {
      await expect(args.onSelect).toHaveBeenCalled();
    });
    await expect(args.onSelect.mock.calls.at(-1)[0].id).toBe('er-top');

    // 분모(업로드) 대비 기록 수는 계속 제목이 말한다 — er-noviews가 순위에 들어도 5건
    await expect(section.querySelectorAll('[data-perf-rank-row]').length).toBe(5);

  },
};

/**
 * Opinion 추천 + 티어 코호트.
 *
 * - Opinion이 빈 행에만 "→ USE/MAYBE/DON'T" 제안(코호트 engagements 사분위 기반, 회색 제안 톤).
 *   공식은 항상 시트의 Opinion — 대시보드는 쓰지 않는다.
 * - dropped(섭외 포기)는 ER이 좋아도 추천하지 않는다 — 노쇼 이력자를 숫자만 보고
 *   재섭외 추천하면 안 된다.
 * - 티어 칩을 고르면 순위·추천이 그 코호트 안에서 다시 계산된다 — 전체 2등이
 *   T2에서는 1등이다.
 */
const suggInf = (id, name, tier, likes, overrides) => perfInf(id, name, {
  tier,
  creditType: tier === 'tier2' ? '$20 Credit_Tier2' : '$100 Credit',
  views: 10000, likes, shares: 0, saves: 0, comments: 0, reposts: 0,
  ...overrides,
});

export const PerformanceSuggestsOpinionPerTier = {
  args: {
    influencers: [
      suggInf('s1', 'Gia Han', 'tier1', 1300),                                    // 13% — 상위 1/4 → USE 제안
      suggInf('s2', 'Hana Lee', 'tier2', 1200),                                   // 12% — 전체 2등, T2 1등
      suggInf('s3', 'Iris Moon', 'tier1', 1000, { opinion: 'USE' }),              // 값 있으면 제안 없음
      suggInf('s4', 'Jade Suh', 'tier2', 800),                                    // 중간 → MAYBE 제안
      suggInf('s5', 'Kai Rin', 'tier1', 600),                                     // 중간 → MAYBE 제안
      suggInf('s6', 'Lia Seo', 'tier2', 500, { opinion: 'MAYBE' }),
      suggInf('s7', 'Mina Oh', 'tier1', 300),                                     // 하위 1/4 → DON'T 제안
      suggInf('s8', 'Nari Ku', 'tier2', 200, { contactStatus: 'dropped' }),       // dropped — 제안 금지
    ],
  },
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('[data-perf-section]');
    const suggestedOf = id => section.querySelector(`[data-perf-rank-row="${id}"] [data-perf-suggested]`)?.getAttribute('data-perf-suggested') ?? null;
    const rankOf = id => section.querySelector(`[data-perf-rank-row="${id}"] [data-perf-rank]`)?.textContent.trim();

    // 사분위별 제안 — 상위 USE / 중간 MAYBE / 하위 DON'T
    await expect(suggestedOf('s1')).toBe('USE');
    await expect(suggestedOf('s5')).toBe('MAYBE');
    await expect(suggestedOf('s7')).toBe("DON'T");
    // 값이 있는 행과 dropped 행에는 제안이 없다
    await expect(suggestedOf('s3')).toBeNull();
    await expect(suggestedOf('s8')).toBeNull();
    // 제안이 표시 전용임을 밝히는 안내 문장
    await expect(section.textContent).toContain('source of truth');

    // 티어 칩 — T2 코호트로 좁히면 순위가 코호트 안에서 다시 매겨진다
    await expect(rankOf('s2')).toBe('2');
    await userEvent.click(section.querySelector('[data-perf-tier="tier2"]'));
    await waitFor(async () => {
      const order = [...section.querySelectorAll('[data-perf-rank-row]')].map(r => r.getAttribute('data-perf-rank-row'));
      await expect(order).toEqual(['s2', 's4', 's6', 's8']);
    });
    await expect(rankOf('s2')).toBe('1');
    // 코호트(4명, 1/4=1명) 기준으로 제안도 재계산 — s2가 T2의 상위 1/4
    await expect(suggestedOf('s2')).toBe('USE');
    await expect(suggestedOf('s8')).toBeNull();
  },
};

/**
 * 반응 절대량 정렬은 대박 크리에이터를 특례 없이 구한다.
 *
 * ER 정렬 시절에는 60K뷰·반응 1,200건이 ER 2%라는 이유로 꼴찌 + DON'T였고,
 * 그걸 "도달 가드"라는 예외 규칙으로 때웠다. engagements 정렬로 바꾸자
 * 예외 없이 자연스럽게 1위가 된다 — 규칙이 줄었는데 결과가 맞아졌다.
 *
 * Opinion이 하나도 없는 첫 사용 상태에서는 안내가 실행 경로(Open sheet)까지 준다.
 */
export const PerformanceBigReachWinsByEngagements = {
  args: {
    sheetUrl: 'https://docs.google.com/spreadsheets/d/example/edit',
    influencers: [
      suggInf('rg-a', 'Aria Bell', 'tier1', 600, { views: 5000 }),
      suggInf('rg-b', 'Bree Cho', 'tier1', 99, { views: 900 }),
      suggInf('rg-c', 'Cleo Dean', 'tier1', 72, { views: 800 }),
      suggInf('rg-d', 'Demi Eun', 'tier1', 56, { views: 700 }),
      suggInf('rg-e', 'Elle Fox', 'tier1', 42, { views: 600 }),
      suggInf('rg-f', 'Faye Gu', 'tier1', 30, { views: 500 }),
      // 반응 9건 — 하위 사분위, DON'T
      suggInf('rg-g', 'Gwen Ha', 'tier1', 9, { views: 400 }),
      // 반응 1,200건 최다 — ER은 2%로 꼴찌지만 순위는 1위, 제안도 USE
      suggInf('rg-h', 'Hope Lin', 'tier1', 1200, { views: 60000, platform: 'Tiktok' }),
    ],
  },
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('[data-perf-section]');
    const suggestedEl = id => section.querySelector(`[data-perf-rank-row="${id}"] [data-perf-suggested]`);

    // 반응 최다(1,200건)가 예외 규칙 없이 1위 + USE — ER 2%는 참고 컬럼으로만 남는다
    const hopeRank = section.querySelector('[data-perf-rank-row="rg-h"] [data-perf-rank]');
    await expect(hopeRank.textContent.trim()).toBe('1');
    await expect(suggestedEl('rg-h').getAttribute('data-perf-suggested')).toBe('USE');
    // 반응 9건은 하위 사분위 — DON'T
    await expect(suggestedEl('rg-g').getAttribute('data-perf-suggested')).toBe("DON'T");

    // 시트 원본 "Tiktok"이 공식 표기로 정규화된다 — 그룹 표와 같은 이름
    const hopeRow = section.querySelector('[data-perf-rank-row="rg-h"]');
    await expect(hopeRow.textContent).toContain('TikTok');
    await expect(hopeRow.textContent.includes('Tiktok')).toBe(false);

    // Opinion이 전무한 첫 사용 상태 — 안내 + 시트로 가는 실행 경로
    await expect(section.textContent).toContain('No opinions recorded yet');
    const link = [...section.querySelectorAll('a')].find(a => a.textContent.includes('Open sheet'));
    await expect(link).toBeTruthy();
    await expect(link.getAttribute('href')).toContain('docs.google.com');
  },
};

/**
 * 100명이어도 다 펼치지 않는다 — 기본은 상위 10명 + View more.
 *
 * 처음에는 Top 10 + Bottom 5 + 중간에 "⋯ N more" 행이었는데, 표가 끊겨 보여서
 * 폐기했다(2026-08-03 사장님 판단: "10명만 보여주고 밑에 view more가 더 깔끔").
 * 버튼이 숨은 인원 수를 말하고, 펼친 뒤에는 View less로 돌아온다.
 */
export const PerformanceListShowsTopTenThenViewMore = {
  args: {
    influencers: Array.from({ length: 20 }, (_, k) => perfInf(`p-${String(k).padStart(2, '0')}`, `Person ${String(k).padStart(2, '0')}`, {
      views: 10000, likes: 2000 - k * 90, shares: 0, saves: 0, comments: 0, reposts: 0, opinion: 'MAYBE',
    })),
  },
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('[data-perf-section]');
    const rows = () => [...section.querySelectorAll('[data-perf-rank-row]')];
    const ranks = () => rows().map(r => r.querySelector('[data-perf-rank]').textContent.trim());

    // 기본: 상위 10명만, 순위는 1~10
    await expect(rows().length).toBe(10);
    await expect(ranks()[0]).toBe('1');
    await expect(ranks()[9]).toBe('10');

    // 버튼이 숨은 인원 수를 말한다
    const button = section.querySelector('[data-perf-viewmore]');
    await expect(button).toBeTruthy();
    await expect(button.textContent).toContain('View more (10)');

    // 펼치면 전부, 라벨은 View less로
    await userEvent.click(button);
    await waitFor(async () => {
      await expect(rows().length).toBe(20);
    });
    await expect(section.querySelector('[data-perf-viewmore]').textContent).toContain('View less');
  },
};

/** 기록이 0건이면 표 대신 문장 — 빈 표는 "데이터가 이상하다"로 읽힌다 */
export const PerformanceEmptyStateSpeaks = {
  args: {
    influencers: [perfInf('er-pending', 'Fay Jung', { uploadDate: daysAgo(5), recordDate: null })],
  },
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('[data-perf-section]');
    await expect(section.textContent).toContain('recorded 0 of 1 uploads');
    await expect(section.textContent).toContain('No performance records yet');
    await expect(section.querySelector('[data-perf-rank-row]')).toBeNull();
  },
};

export const SingleStoreHidesStoreTable = {
  args: { selectedStore: STORES[0] },
  play: async ({ canvasElement }) => {
    const headers = [...canvasElement.querySelectorAll('table thead th:first-child')]
      .map(c => c.textContent.trim());
    await expect(headers).not.toContain('Store');
    await expect(headers.length).toBeGreaterThan(0);
  },
};

/**
 * Stage drop-off는 Table의 "% of previous"와 같은 값이어야 한다.
 *
 * 막대는 각 단계에 몇 명 남았는지만 보여줘서 어디서 새는지가 안 보인다.
 * 옆에 붙인 이탈 표가 다른 계산을 쓰면 같은 화면에서 두 숫자가 갈라진다 —
 * 두 뷰를 오가며 대조한다.
 */
export const DropOffMatchesTable = {
  args: { inviteCounts: INVITE_COUNTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Bars' }));
    const drop = await waitFor(() => {
      const rows = [...canvasElement.querySelectorAll('[data-dropoff-step]')];
      if (rows.length === 0) throw new Error('no drop-off rows');
      return Object.fromEntries(rows.map(r => [
        r.getAttribute('data-dropoff-step'),
        r.children[1].textContent.trim(),
      ]));
    });

    await userEvent.click(canvas.getByRole('button', { name: 'Table' }));
    const table = await waitFor(() => {
      const t = canvasElement.querySelector('table');
      if (!t) throw new Error('no table');
      return t;
    });
    const ofPrevious = Object.fromEntries(
      [...table.querySelectorAll('tbody tr[data-funnel-step]')]
        .map(r => [r.getAttribute('data-funnel-step'), r.children[3].textContent.trim()])
        .filter(([, v]) => v !== '—'),
    );

    // 미측정 구간은 양쪽 모두 수치를 내지 않는다 — 계산된 구간만 대조한다
    const measured = Object.fromEntries(Object.entries(drop).filter(([, v]) => v !== 'not measured'));
    await expect(measured).toEqual(ofPrevious);
    for (const [key, v] of Object.entries(drop)) {
      if (v === 'not measured') await expect(ofPrevious[key]).toBeUndefined();
    }

    // 가장 크게 빠진 구간 하나만 강조된다 — 여러 개면 강조가 아니다
    await userEvent.click(canvas.getByRole('button', { name: 'Bars' }));
    const emphasised = await waitFor(() => {
      const all = [...canvasElement.querySelectorAll('[data-dropoff-delta]')];
      if (all.length === 0) throw new Error('no deltas');
      return all.filter(e => getComputedStyle(e).fontWeight === '600');
    });
    await expect(emphasised.length).toBe(1);
  },
};

/**
 * 미측정 단계는 계산하지 않는다.
 *
 * 시트의 credit used 열이 비어 있으면 creditUsed가 전부 false로 파싱된다.
 * 그걸 0으로 계산하면 "발급분 전량 미사용"이라는 없는 사실이 만들어진다.
 * 값이 하나라도 들어오면(hasCreditUsedValue) 자동으로 정상 계산으로 돌아간다.
 */
export const UnmeasuredStageShowsNoPercent = {
  args: {
    inviteCounts: INVITE_COUNTS,
    // 목업은 hasCreditUsedValue가 전부 false — 아직 아무도 적지 않은 상태
    influencers: MOCK_INFLUENCERS.map(i => ({ ...i, hasCreditUsedValue: false })),
  },
  play: async ({ canvasElement }) => {
    const row = await waitFor(() => {
      const r = canvasElement.querySelector('[data-funnel-step="creditUsed"]');
      if (!r) throw new Error('creditUsed row missing');
      return r;
    });

    // 수와 비율 모두 "—" — 0으로 단정하지 않는다
    await expect(row.querySelector('[data-funnel-value]').textContent.trim()).toBe('—');
    await expect(row.textContent).toContain('not measured');

    // drop-off에서도 0% / -N 같은 수치를 넣지 않는다
    const drop = canvasElement.querySelector('[data-dropoff-step="creditUsed"]');
    await expect(drop).toBeTruthy();
    await expect(drop.textContent).toContain('not measured');
    await expect(drop.querySelector('[data-dropoff-delta]').textContent.trim()).toBe('');
  },
};

/**
 * Bars의 모든 행은 트랙 길이와 숫자 컬럼 위치가 같아야 한다.
 *
 * "not measured" 배지를 같은 flex 행에 조건부로 넣었더니 그 행만 항목이 하나 더
 * 생겨서 트랙(flex:1)이 줄고 숫자가 왼쪽으로 밀렸다. 배지 자리를 항상 잡아둔다.
 */
export const BarRowsShareOneGrid = {
  args: {
    inviteCounts: INVITE_COUNTS,
    influencers: MOCK_INFLUENCERS.map(i => ({ ...i, hasCreditUsedValue: false })),
  },
  play: async ({ canvasElement }) => {
    const rows = await waitFor(() => {
      const r = [...canvasElement.querySelectorAll('[data-funnel-step]')];
      if (r.length < 2) throw new Error('bars not rendered');
      return r;
    });
    const tracks = rows.map(r => Math.round(r.children[1].getBoundingClientRect().width));
    const values = rows.map(r => Math.round(r.querySelector('[data-funnel-value]').getBoundingClientRect().x));
    await expect(new Set(tracks).size).toBe(1);
    await expect(new Set(values).size).toBe(1);
  },
};

/**
 * 표본이 작은 행은 퍼센트 옆에 원시 분수를 적는다.
 * "100%"가 2명 중 2명인지 20명 중 20명인지 구분되지 않으면 오해가 생긴다.
 */
export const SmallSamplesShowRawCounts = {
  args: { inviteCounts: INVITE_COUNTS },
  play: async ({ canvasElement }) => {
    const tables = await waitFor(() => {
      const t = [...canvasElement.querySelectorAll('table')];
      if (t.length === 0) throw new Error('no tables');
      return t;
    });
    let sawSmall = false;
    for (const table of tables) {
      /* Breakdown 계열(Visit rate 컬럼)만 본다 — Performance 표는 컬럼 스키마가 달라서
         "children[1]=Count, children[2]=비율" 가정이 성립하지 않는다 */
      const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim());
      if (!headers.includes('Visit rate')) continue;
      for (const tr of table.querySelectorAll('tbody tr')) {
        const count = Number(tr.children[1].textContent.trim());
        if (Number.isNaN(count)) continue;
        const visitCell = tr.children[2].textContent.trim();
        if (count > 0 && count < 10) {
          await expect(visitCell).toMatch(/\(\d+\/\d+\)/);
          sawSmall = true;
        } else if (count >= 10) {
          await expect(visitCell).not.toMatch(/\(\d+\/\d+\)/);
        }
      }
    }
    await expect(sawSmall).toBe(true);
  },
};

/**
 * Breakdown은 표가 정확히 3개다 — 빈 칸이 남지 않아야 한다.
 *
 * 2열로 두면 세 번째 표가 혼자 다음 줄로 내려가 옆이 비고,
 * auto-fit으로 두면 넓은 화면에서 트랙이 5개까지 생겨 빈 트랙이 남는다.
 * md부터 3열로 고정한다.
 */
export const BreakdownFillsItsRow = {
  play: async ({ canvasElement }) => {
    const grid = await waitFor(() => {
      const el = [...canvasElement.querySelectorAll('div')]
        .find(d => getComputedStyle(d).display === 'grid' && d.querySelectorAll('table').length === 3);
      if (!el) throw new Error('breakdown grid not found');
      return el;
    });

    const tracks = getComputedStyle(grid).gridTemplateColumns.split(' ');
    await expect(tracks.length).toBe(3);

    // 표 3개가 모두 같은 줄에 있어야 한다 — 하나가 내려가면 옆이 빈다
    const tops = new Set([...grid.children].map(c => Math.round(c.getBoundingClientRect().top)));
    await expect(tops.size).toBe(1);

    // 트랙 폭이 균등해야 한다 (minmax(0, 1fr))
    const widths = new Set(tracks.map(t => Math.round(parseFloat(t))));
    await expect(widths.size).toBe(1);
  },
};
