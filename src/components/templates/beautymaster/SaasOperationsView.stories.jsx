import Box from '@mui/material/Box';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import SaasOperationsView from './SaasOperationsView';
import { SAAS_FONT } from './SaasShell';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';
import { ALL_STORES, deriveStores } from '../../../data/beautymaster/schema.js';

const STORES = deriveStores(MOCK_INFLUENCERS);

export default {
  title: 'BeautyMaster/Section/SaasOperationsView',
  component: SaasOperationsView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    influencers: { control: 'object', description: '전체 인플루언서 목록 (Influencer[] typedef)' },
    selectedId: { control: 'text', description: '현재 선택된 인플루언서 ID — 해당 행을 강조' },
    isLoading: { control: 'boolean', description: '최초 로딩 여부. 목록이 비었을 때만 스켈레톤을 띄운다' },
    error: { control: false, description: '조회 실패 에러 — 목록을 지우지 않고 상단 배너로 알린다' },
    filters: { control: 'object', description: '{ platform, tier, category }. 주면 controlled, 안 주면 내부 상태' },
    stores: { control: 'object', description: '스토어 선택 옵션. 없으면 influencers에서 파생' },
    selectedStore: { control: 'select', options: [ALL_STORES, ...STORES], description: '선택된 스토어 — 세 뷰가 공유' },
    onSelect: { action: 'selected', description: '행 클릭 핸들러 (influencer) => void' },
    onRetry: { action: 'retried', description: '에러 배너 Retry 핸들러' },
    onFiltersChange: { action: 'filtersChanged', description: '필터 변경 핸들러' },
    onStoreChange: { action: 'storeChanged', description: '스토어 변경 핸들러' },
  },
  args: {
    influencers: MOCK_INFLUENCERS,
    stores: STORES,
    selectedStore: ALL_STORES,
    onSelect: fn(),
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

/**
 * 기본 — KPI 스트립 + 필터 툴바 + 상태 탭 + Visit schedule 레일 + 섹션 목록.
 * Action required만 펼쳐진 채로 시작한다.
 */
export const Default = {};

/** 섹션 접기 — 헤더를 누르면 행이 숨고 아래 섹션이 바로 올라온다 */
export const SectionCollapse = {
  play: async ({ canvasElement }) => {
    const rowsOf = () => canvasElement.querySelectorAll('[data-influencer-id]').length;
    const firstHeader = canvasElement.querySelector('button[aria-expanded]');

    await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
    const before = rowsOf();
    await expect(before).toBeGreaterThan(0);

    await userEvent.click(firstHeader);
    await waitFor(async () => {
      await expect(canvasElement.querySelector('button[aria-expanded]')).toHaveAttribute('aria-expanded', 'false');
    });
    await expect(rowsOf()).toBeLessThan(before);
  },
};

/** 상태 탭 — 기존 InfluencerPanel의 All/Processing/Done을 그대로 복원한 필터 */
export const StatusTabProcessing = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Processing' }));
    await waitFor(async () => {
      await expect(canvas.getByRole('button', { name: 'Processing' })).toHaveAttribute('aria-current', 'true');
    });
  },
};

/** 스토어를 고르면 KPI 모수와 목록이 함께 좁혀진다 (검색어는 KPI 모수에서 제외) */
export const StoreScoped = {
  args: { selectedStore: 'G10' },
};

/** 선택된 행 강조 — Drawer가 열린 상태에서 목록의 위치를 잃지 않게 한다 */
export const RowSelected = {
  args: { selectedId: MOCK_INFLUENCERS[0].id },
};

/** 최초 로딩 — 목록이 비었을 때만 스켈레톤. 폴링 중에는 직전 목록을 유지한다 */
export const Loading = {
  args: { influencers: [], isLoading: true },
};

/** 조회 실패 — 목록을 지우지 않고 상단 배너 + Retry */
export const LoadError = {
  args: { error: new Error('Google Sheets returned 403 (check sharing settings)'), onRetry: fn() },
};

/** 빈 상태 — 시트는 연결됐지만 아직 행이 없을 때 */
export const Empty = {
  args: { influencers: [], stores: [] },
};

/**
 * 좁은 화면 — md 미만에서는 Visit schedule이 사라지지 않고 목록 위로 쌓인다.
 * 숨기면 현장에서 오늘 방문자를 확인할 수단이 없어지므로 높이만 제한해 남긴다.
 * (뷰포트 애드온을 쓰지 않고 데코레이터로 폭을 고정해 재현한다)
 */
export const NarrowViewport = {
  decorators: [
    Story => (
      <Box sx={{ width: 390, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid', borderColor: 'divider', fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
  play: async ({ canvasElement }) => {
    const rail = [...canvasElement.querySelectorAll('p')]
      .find(p => p.textContent.trim() === 'VISIT SCHEDULE')?.parentElement;
    await expect(rail).toBeTruthy();
    await expect(rail).toBeVisible();
  },
};



/**
 * 섹션 헤더의 수는 그 섹션이 실제로 그린 행 수와 같아야 한다.
 *
 * 예전에는 상단 "Needs attention" 배너가 같은 개념을 다른 모수로 세어 두 숫자가
 * 갈라졌다. 배너를 없애 숫자를 하나로 줄였으므로, 남은 위험은 "헤더 수 ≠ 실제 행 수"
 * 하나다. 상태 탭을 바꿔도 그 관계가 유지되는지 본다.
 */
export const SectionCountMatchesRows = {
  play: async ({ canvasElement }) => {
    const check = async () => {
      const sections = [...canvasElement.querySelectorAll('[data-section]')];
      await expect(sections.length).toBeGreaterThan(0);
      let checked = 0;
      for (const sec of sections) {
        const header = sec.querySelector('button');
        // 접힌 섹션은 행을 그리지 않으므로 헤더 수와 비교할 대상이 없다
        if (header.getAttribute('aria-expanded') !== 'true') continue;
        const claimed = Number(header.innerText.match(/(\d+)\s*$/)?.[1]);
        const rows = sec.querySelectorAll('[data-influencer-id]').length;
        await expect(claimed).toBe(rows);
        checked += 1;
      }
      await expect(checked).toBeGreaterThan(0);
    };
    await check();

    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Processing' }));
    await waitFor(check);
  },
};

/**
 * Upcoming 구간에는 예정된 방문만 들어간다.
 *
 * 예전 조건은 "경보 없음 + 미완료"뿐이라 날짜를 보지 않았다. 90일이 지나 경보가
 * 억제된 건들이 전부 여기로 흘러들어, 실데이터에서 17건 중 15건이 과거 일정이고
 * 미래는 0건이었다. 지나간 건은 In progress / Stale로 나눠 이름과 내용을 맞췄다.
 */
export const UpcomingHoldsOnlyFutureVisits = {
  play: async ({ canvasElement }) => {
    const sections = [...canvasElement.querySelectorAll('[data-section]')]
      .map(s => s.getAttribute('data-section'));
    await expect(sections.length).toBeGreaterThan(0);

    const upcoming = canvasElement.querySelector('[data-section="upcoming"]');
    if (!upcoming) return;   // 예정 건이 없으면 구간 자체가 사라진다 — 그것도 정상이다

    // 접혀 있으면 펼친다
    const header = upcoming.querySelector('button');
    if (header.getAttribute('aria-expanded') !== 'true') await userEvent.click(header);

    const rows = await waitFor(() => {
      const r = upcoming.querySelectorAll('[data-influencer-id]');
      if (r.length === 0) throw new Error('rows not rendered');
      return [...r];
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    for (const row of rows) {
      const id = row.getAttribute('data-influencer-id');
      const inf = MOCK_INFLUENCERS.find(i => i.id === id);
      await expect(inf).toBeTruthy();
      await expect(inf.alertFlags.length).toBe(0);
      // 날짜가 있으면 오늘 이후여야 한다
      if (inf.scheduledTime) {
        const day = new Date(inf.scheduledTime);
        day.setHours(0, 0, 0, 0);
        await expect(day.getTime()).toBeGreaterThanOrEqual(todayStart.getTime());
      }
    }
  },
};

/**
 * 레일은 인덱스다 — 두 층 헤더 + 한 줄 행.
 *
 * 섹션(TODAY / UPCOMING / PAST)이 방향을 한 번만 말하고, 그 아래 날짜 그룹이
 * "JUL 8 · 6"으로 묶는다. 날짜 그룹만 두면 그 날이 지난 날인지 예정인지 알 수 없고,
 * 헤더마다 경과일을 적으면 같은 정보가 계속 반복된다.
 *
 * 행에는 24시간제 시각만 남는다 — AM/PM이 빠져 폭이 줄고 자릿수가 고정된다.
 *
 * 상태 문구("No visit")를 점으로 되돌린 건 정보를 줄이려는 게 아니다. 구체적 상태는
 * 오른쪽 목록과 상세 패널이 이미 말하므로 레일에서는 "미해결 있음"만 알면 된다.
 * 다만 색·모양만으로 전달하면 안 되므로 점에 role/aria-label로 상태 텍스트를 붙인다.
 */
export const RailIsAnIndex = {
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    await expect(rail).toBeTruthy();

    const rows = [...rail.querySelectorAll('[data-rail-row]')];
    await expect(rows.length).toBeGreaterThan(0);

    // 모든 행이 같은 높이 = 한 줄. 두 줄짜리가 섞이면 인덱스로 훑을 수 없다.
    const heights = new Set(rows.map(r => Math.round(r.getBoundingClientRect().height)));
    await expect(heights.size).toBe(1);

    // 행에는 날짜가 없고, 시각은 24시간제다 (AM/PM 없음)
    for (const row of rows) {
      const time = row.children[0].textContent.trim();
      await expect(time).toMatch(/^(\d{2}:\d{2}|—)$/);
    }

    // 섹션 헤더가 방향을 말한다 — TODAY는 0건이어도 항상 있다
    const sections = [...rail.querySelectorAll('span')]
      .map(e => e.textContent.trim())
      .filter(t => /^(TODAY|UPCOMING|PAST) · \d+$/.test(t));
    await expect(sections.some(t => t.startsWith('TODAY'))).toBe(true);
    await expect(sections.some(t => /^(UPCOMING|PAST)/.test(t))).toBe(true);

    // 그 아래 날짜 그룹이 "JUL 8 · 6" 형태로 묶는다
    const days = [...rail.querySelectorAll('p')]
      .map(e => e.textContent.trim())
      .filter(t => /^[A-Z]{3} \d{1,2} · \d+$/.test(t));
    await expect(days.length).toBeGreaterThan(0);
  },
};

/**
 * 경보는 점 하나로 표시하되, 점만으로 끝내지 않는다.
 * WCAG 1.4.1 — 색과 모양만으로 정보를 전달하지 않도록 상태 텍스트를 접근성 이름에 넣는다.
 */
export const RailDotsCarryAccessibleText = {
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    const dots = [...rail.querySelectorAll('[role="img"]')];
    await expect(dots.length).toBeGreaterThan(0);

    for (const dot of dots) {
      const label = dot.getAttribute('aria-label');
      await expect(label).toBeTruthy();
      await expect(dot.getAttribute('title')).toBe(label);
    }

    // 점이 붙은 행은 실제로 경보가 있는 건이어야 한다
    for (const dot of dots) {
      const id = dot.closest('[data-rail-row]').getAttribute('data-rail-row');
      const inf = MOCK_INFLUENCERS.find(i => i.id === id);
      await expect(inf.alertFlags.length).toBeGreaterThan(0);
    }
  },
};

/**
 * 레일에서 고른 사람이 오른쪽 목록에서 강조된다 — 이 레일이 존재하는 이유다.
 */
export const RailSelectionSyncsToList = {
  args: { onSelect: fn() },
  play: async ({ args, canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    const listIds = new Set(
      [...canvasElement.querySelectorAll('[data-influencer-id]')].map(e => e.getAttribute('data-influencer-id')),
    );
    const row = [...rail.querySelectorAll('[data-rail-row]')]
      .find(r => listIds.has(r.getAttribute('data-rail-row')));
    await expect(row).toBeTruthy();

    await userEvent.click(row);
    await waitFor(async () => {
      await expect(args.onSelect).toHaveBeenCalled();
    });
    const picked = args.onSelect.mock.calls.at(-1)[0];
    await expect(picked.id).toBe(row.getAttribute('data-rail-row'));
  },
};

/**
 * 오늘 일정이 0건이어도 구간을 남기고, 빈 회색 띠 대신 문구를 둔다.
 */
export const TodayEmptyStateSpeaks = {
  args: { influencers: MOCK_INFLUENCERS.filter(i => i.scheduleGroup !== 'today') },
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    await expect(rail.textContent).toContain('TODAY · 0');
    await expect(rail.textContent).toContain('No visits today');
  },
};

/**
 * 스크롤해도 지금 보는 행이 언제인지 알 수 있어야 한다.
 *
 * 헤더가 위로 사라지면 목록 중간에서 날짜를 잃는다. 두 층을 모두 붙여둔다 —
 * 섹션(방향)이 맨 위, 날짜가 그 바로 아래. 오프셋이 어긋나면 두 헤더가 겹치므로
 * 섹션 높이를 상수로 고정하고 날짜 헤더의 top을 그 값에 맞춘다.
 */
export const RailHeadersStickWhileScrolling = {
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');

    const section = [...rail.querySelectorAll('span')]
      .find(e => /^(TODAY|UPCOMING|PAST) · \d+$/.test(e.textContent.trim()))
      .parentElement;
    const sectionStyle = getComputedStyle(section);
    await expect(sectionStyle.position).toBe('sticky');
    await expect(sectionStyle.top).toBe('0px');

    const day = [...rail.querySelectorAll('p')]
      .find(e => /^[A-Z]{3} \d{1,2} · \d+$/.test(e.textContent.trim()));
    await expect(day).toBeTruthy();
    const dayStyle = getComputedStyle(day);
    await expect(dayStyle.position).toBe('sticky');

    // 날짜 헤더는 섹션 헤더 바로 아래에 멈춘다 — 겹치면 둘 다 못 읽는다
    await expect(parseFloat(dayStyle.top)).toBe(Math.round(section.getBoundingClientRect().height));
    // 스크롤한 행이 비쳐 보이지 않도록 불투명해야 한다
    await expect(dayStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    // 섹션이 날짜보다 위층
    await expect(Number(sectionStyle.zIndex)).toBeGreaterThan(Number(dayStyle.zIndex));
  },
};

/**
 * 이니셜은 문자일 때만 쓴다.
 *
 * 마지막 토큰을 무조건 쓰면 "Stephanie Gilliam (Robertson)"이 "Stephanie (."가 된다.
 * 뒤에서부터 문자로 시작하는 토큰을 찾고, 없으면 축약하지 않는다.
 * 홑이름("Nicole")은 그대로 둔다.
 */
export const RailNamesNeverAbbreviateToSymbols = {
  args: {
    influencers: [
      ...MOCK_INFLUENCERS,
      { ...MOCK_INFLUENCERS[0], id: 'ab-1', fullName: 'Stephanie Gilliam (Robertson)' },
      { ...MOCK_INFLUENCERS[0], id: 'ab-2', fullName: 'Nicole' },
      { ...MOCK_INFLUENCERS[0], id: 'ab-3', fullName: 'Ana (@ana)' },
    ],
  },
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    const shown = new Map(
      [...rail.querySelectorAll('[data-rail-row]')].map(r => [
        r.getAttribute('data-rail-row'),
        r.children[1].textContent.trim(),
      ]),
    );

    // 어떤 행도 기호를 이니셜로 쓰지 않는다
    for (const label of shown.values()) {
      await expect(label).not.toMatch(/[^\p{L}]\.$/u);
    }

    await expect(shown.get('ab-1')).toBe('Stephanie G.');   // 괄호를 건너뛰고 성을 찾는다
    await expect(shown.get('ab-2')).toBe('Nicole');         // 홑이름은 그대로
    await expect(shown.get('ab-3')).toBe('Ana (@ana)');     // 쓸 이니셜이 없으면 축약하지 않는다
  },
};
