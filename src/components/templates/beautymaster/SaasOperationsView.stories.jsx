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
 * Needs attention 배너와 ACTION REQUIRED 섹션은 **같은 목록**에서 센다.
 * KPI 모수로 세면 상태 탭·검색을 걸었을 때 갈라지는데, Review가 그 섹션으로 가는
 * 동작이라 다른 수를 말하면 안 된다.
 */
export const CountsStayInSync = {
  play: async ({ canvasElement }) => {
    const read = () => {
      const t = canvasElement.innerText;
      return [t.match(/Needs attention — (\d+)/)?.[1], t.match(/ACTION REQUIRED\s*(\d+)/)?.[1]];
    };
    const [b1, s1] = read();
    await expect(b1).toBe(s1);

    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Processing' }));
    await waitFor(async () => {
      const [b2, s2] = read();
      await expect(b2).toBe(s2);
    });
  },
};
