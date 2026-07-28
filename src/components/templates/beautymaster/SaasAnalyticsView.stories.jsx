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

/** 기본 — Campaign summary → Conversion funnel → Breakdown → Tier & Store */
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
          label: r.children[0].textContent.replace('none recorded', '').trim(),
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

    await expect(drop).toEqual(ofPrevious);

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
