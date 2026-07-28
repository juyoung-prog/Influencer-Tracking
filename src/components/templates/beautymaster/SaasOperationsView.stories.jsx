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
 * 레일 상태 표시 — 경보가 있는 행은 이름 아래 짧은 상태 문구가 붙는다.
 * 이전에는 색 점(•) 하나로 "경보 있음"만 알렸는데, 어떤 문제인지 알 수 없고
 * 색·모양으로만 전달돼 텍스트 대체물이 없었다(WCAG 1.4.1).
 */
export const RailAlertLabels = {
  play: async ({ canvasElement }) => {
    const rail = [...canvasElement.querySelectorAll('p')]
      .find(p => p.textContent.trim() === 'VISIT SCHEDULE').parentElement;

    // 색 점은 더 이상 쓰지 않는다
    const dots = [...rail.querySelectorAll('div')].filter(d => {
      const s = getComputedStyle(d);
      return s.borderRadius === '50%' && parseFloat(s.width) <= 6;
    });
    await expect(dots).toHaveLength(0);

    // 대신 상태 문구가 보인다
    const labels = [...rail.querySelectorAll('p')]
      .map(p => p.textContent.trim())
      .filter(t => ['No visit', 'No upload', 'No credit', 'No-show', 'Reschedule'].includes(t));
    await expect(labels.length).toBeGreaterThan(0);
  },
};

/**
 * 레일은 날짜와 시각을 함께 보여준다.
 *
 * Past 그룹은 여러 날짜가 한 덩어리로 묶여 있어 시각만 있으면 그게 1월인지 10월인지
 * 알 수 없었다. 동시에, 시트에 시각이 없는 건은 파싱하면 자정이 되는데 그걸
 * "12:00 AM"으로 보여주면 없는 정보를 만들어내는 것이라 날짜만 쓴다.
 */
export const RailShowsDateAndTime = {
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    const cells = [...rail.querySelectorAll('*')]
      .filter(e => !e.children.length && /^[A-Z][a-z]{2}\s\d/.test(e.textContent.trim()))
      .map(e => e.textContent.trim());
    await expect(cells.length).toBeGreaterThan(0);

    // 모든 일정 셀이 날짜로 시작한다
    for (const c of cells) await expect(c).toMatch(/^[A-Z][a-z]{2} \d{1,2}/);
    // 시각이 붙은 건이 실제로 있다
    await expect(cells.some(c => /·\s\d{1,2}:\d{2}\s?(AM|PM)/.test(c))).toBe(true);
    // 자정을 지어내지 않는다
    await expect(cells.some(c => /12:00\s?AM/.test(c))).toBe(false);
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
