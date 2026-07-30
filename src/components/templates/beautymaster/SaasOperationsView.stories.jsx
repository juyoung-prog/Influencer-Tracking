import { useState } from 'react';
import Box from '@mui/material/Box';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import SaasOperationsView from './SaasOperationsView';
import { SAAS_FONT } from './SaasShell';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';
import {
  ALERT_GRACE_DAYS,
  ALL_STORES,
  deriveAlertFlags,
  deriveScheduleGroup,
  deriveStores,
  isStaleVisit,
} from '../../../data/beautymaster/schema.js';

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
    const sections = [...rail.querySelectorAll('[data-rail-section]')]
      .map(e => e.children[0].textContent.trim());
    await expect(sections).toContain('TODAY');
    await expect(sections.some(t => t === 'UPCOMING' || t === 'PAST')).toBe(true);

    // 그 아래 날짜 그룹이 묶는다
    const days = [...rail.querySelectorAll('[data-rail-day]')];
    await expect(days.length).toBeGreaterThan(0);
    for (const day of days) {
      await expect(day.children[0].textContent.trim()).toMatch(/^[A-Z]{3} \d{1,2}$/);
    }
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
    const today = rail.querySelector('[data-rail-section="today"]');
    await expect(today.children[0].textContent.trim()).toBe('TODAY');
    await expect(today.querySelector('[data-rail-count]').textContent.trim()).toBe('0');
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

    const section = rail.querySelector('[data-rail-section]');
    const sectionStyle = getComputedStyle(section);
    await expect(sectionStyle.position).toBe('sticky');
    await expect(sectionStyle.top).toBe('0px');

    const day = rail.querySelector('[data-rail-day]');
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

/**
 * 헤더는 "라벨 좌 / 개수 우"다.
 *
 * "JUL 8 · 6"은 이 앱에서 " · "가 동등한 항목을 잇는 기호라("Jul 8 · 02:00 PM",
 * "T2 · Instagram") 날짜 범위 "7월 8~6"으로 읽혔다. 개수를 우측 끝에 두면
 * 구분자 없이도 개수로 읽힌다. 섹션·날짜 두 층에 같은 규칙을 쓴다.
 */
export const RailHeaderCountsAlignRight = {
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    const headers = [...rail.querySelectorAll('[data-rail-section], [data-rail-day]')];
    await expect(headers.length).toBeGreaterThan(1);

    const rights = new Set();
    for (const header of headers) {
      // 라벨에 구분자가 남아 있으면 안 된다
      await expect(header.children[0].textContent).not.toContain('·');

      const count = header.querySelector('[data-rail-count]');
      await expect(count).toBeTruthy();
      await expect(count.textContent.trim()).toMatch(/^\d+$/);
      rights.add(Math.round(count.getBoundingClientRect().right));

      // 날짜가 주인공, 개수는 보조 — 색이 같으면 위계가 없다
      const labelColor = getComputedStyle(header.children[0]).color;
      const countColor = getComputedStyle(count).color;
      await expect(countColor).not.toBe(labelColor);
    }

    // 두 층의 개수가 같은 세로선에 선다
    await expect(rights.size).toBe(1);
  },
};

/**
 * 경보 없는 미완료 건이 어느 구간으로 가는지.
 *
 * ACTION REQUIRED는 유예를 넘긴 건, IN PROGRESS는 유예 안에 있어 아직 경보가
 * 없는 건, STALE은 90일이 지나 경보를 멈춘 건이다. 세 구간이 같은 축(얼마나 밀렸나)
 * 위에 있어서, 경계가 어긋나면 사람이 조용히 사라지거나 엉뚱한 구간에 쌓인다.
 *
 * 유예 일수는 아직 확정값이 아니다(사장님이 써보고 정하기로 함).
 * 그래서 숫자를 스토리에 박지 않고 ALERT_GRACE_DAYS에서 가져다 쓴다 —
 * 값을 바꿔도 이 테스트는 새 기준으로 따라간다.
 */
const daysAgo = n => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(13, 0, 0, 0);
  return d;
};

const gracePeriodRow = (id, name, days, overrides) => {
  const base = {
    ...MOCK_INFLUENCERS[0],
    id,
    fullName: name,
    scheduledTime: daysAgo(days),
    hasScheduledTimeOfDay: true,
    collaboShared: false,
    creditShared: false,
    creditUsed: false,
    uploadDate: null,
    contactReason: null,
    contactStatus: null,
    lastContactDate: null,
    requestedDate: null,
    note: '',
    ...overrides,
  };
  const scheduleGroup = deriveScheduleGroup(base.scheduledTime);
  return { ...base, scheduleGroup, alertFlags: deriveAlertFlags({ ...base, scheduleGroup }) };
};

export const GraceWindowDecidesTheSection = {
  args: {
    influencers: [
      // 방문 후 업로드 유예 안 — 아직 재촉할 때가 아니다
      gracePeriodRow('grace-in', 'Grace Inside', ALERT_GRACE_DAYS.UPLOAD - 1, { agreement: true, attend: true }),
      // 유예를 넘김 — 경보
      gracePeriodRow('grace-out', 'Grace Outside', ALERT_GRACE_DAYS.UPLOAD + 5, { agreement: true, attend: true }),
      // 90일 초과 — 경보를 멈춘 건
      gracePeriodRow('grace-stale', 'Long Gone', ALERT_GRACE_DAYS.STALE + 30, { agreement: true, attend: true }),
    ],
  },
  play: async ({ canvasElement }) => {
    const sectionOf = id => canvasElement.querySelector(`[data-influencer-id="${id}"]`)
      ?.closest('[data-section]')?.getAttribute('data-section');

    // 접힌 구간도 펼쳐서 전부 확인한다
    for (const header of canvasElement.querySelectorAll('[data-section] button')) {
      if (header.getAttribute('aria-expanded') !== 'true') await userEvent.click(header);
    }
    await waitFor(async () => {
      await expect(canvasElement.querySelector('[data-influencer-id="grace-in"]')).toBeTruthy();
    });

    await expect(sectionOf('grace-out')).toBe('attention');
    await expect(sectionOf('grace-in')).toBe('inProgress');
    await expect(sectionOf('grace-stale')).toBe('stale');

    // 세 명 모두 어딘가에는 있어야 한다 — 조용히 사라지면 운영에서 놓친다
    for (const id of ['grace-in', 'grace-out', 'grace-stale']) {
      await expect(sectionOf(id)).toBeTruthy();
    }

    // STALE의 판정은 목록과 경보 로직이 같은 함수를 쓴다
    await expect(isStaleVisit(daysAgo(ALERT_GRACE_DAYS.STALE + 30))).toBe(true);
    await expect(isStaleVisit(daysAgo(ALERT_GRACE_DAYS.UPLOAD - 1))).toBe(false);
  },
};

/**
 * 활성·선택·포커스가 모두 한 파랑에서 나온다.
 *
 * 예전에는 자리마다 값이 달랐다 — 칩 테두리·내비 배경·메뉴 선택은 #0000FF,
 * 탭 밑줄과 활성 글자는 #0000B2. 같은 "선택됨"인데 색이 두 개였다.
 * 채도가 낮은 쪽(accent.main)으로 모았다. 새 컨트롤이 primary.main을 다시
 * 끌어다 쓰면 이 테스트가 잡는다.
 */
export const AccentBlueIsOneValue = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 필터를 켜서 선택 상태를 만든다
    await userEvent.click(canvas.getByRole('button', { name: 'Instagram', exact: true }));

    const isBlue = c => {
      const m = (c.match(/[\d.]+/g) || []).map(Number);
      return m.length >= 3 && m[2] > 100 && m[2] > m[0] + 60 && m[2] > m[1] + 60;
    };

    const bases = new Set();
    await waitFor(async () => {
      bases.clear();
      for (const el of canvasElement.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        for (const prop of ['color', 'backgroundColor', 'borderColor', 'borderBottomColor', 'borderLeftColor']) {
          if (isBlue(cs[prop])) bases.add((cs[prop].match(/[\d.]+/g) || []).slice(0, 3).join(','));
        }
      }
      await expect(bases.size).toBeGreaterThan(0);
    });

    // 투명도는 달라도 되지만 기준 색은 하나여야 한다
    await expect([...bases]).toEqual(['0,0,178']);
  },
};

/**
 * 선택과 포커스는 다른 신호다.
 *
 * 선택은 옅은 틴트 + 파랑 글자·테두리로 "켜짐"만 알린다 — 파랑으로 꽉 채우면
 * 목록이 주인공인 화면에서 필터가 가장 강한 요소가 된다.
 * 포커스는 테두리를 굵히지 않고 바깥 링으로 알린다 — 굵기가 바뀌면 레이아웃이
 * 흔들리고, 선택과 포커스가 같은 신호로 보인다.
 */
export const SelectedAndFocusLookDifferent = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Instagram', exact: true });

    await userEvent.click(chip);

    /* 클릭 직후에는 hover/focus-visible이 얹혀 배경이 잠깐 다르게 잡힌다.
       상태가 가라앉을 때까지 세 값을 함께 확인한다 — 하나만 먼저 통과하면
       나머지를 전환 중간에 읽게 된다(이 테스트가 처음 그렇게 실패했다). */
    await waitFor(async () => {
      const on = getComputedStyle(chip);
      // 꽉 채우지 않는다 — 배경은 반투명 틴트
      await expect(on.backgroundColor).toMatch(/rgba\(0, 0, 178, 0\.\d+\)/);
      await expect(on.color).toBe('rgb(0, 0, 178)');
      await expect(on.borderColor).toBe('rgb(0, 0, 178)');
    });

    // 입력 포커스는 1px 테두리 + 바깥 링
    const input = canvasElement.querySelector('input[placeholder]');
    input.focus();
    await waitFor(async () => {
      const root = input.closest('.MuiOutlinedInput-root');
      await expect(root.classList.contains('Mui-focused')).toBe(true);
    });
    const root = input.closest('.MuiOutlinedInput-root');
    const outline = root.querySelector('.MuiOutlinedInput-notchedOutline');
    // 굵기는 비포커스와 같아야 한다 — 바뀌면 레이아웃이 1px 흔들린다
    await expect(getComputedStyle(outline).borderWidth).toBe('1px');
    // 링은 있되 테두리보다 약해야 한다 — 컨트롤이 목록보다 강해 보이면 안 된다
    const shadow = getComputedStyle(root).boxShadow;
    await expect(shadow).toContain('rgba(0, 0, 178');
    const ringAlpha = Number(shadow.match(/rgba\(0, 0, 178, ([\d.]+)\)/)[1]);
    await expect(ringAlpha).toBeLessThan(0.15);
  },
};

/**
 * 스토어 드롭다운은 "필터 해제"와 "매장 선택"을 구분한다.
 *
 * "All stores"는 필터를 푸는 동작이고 나머지는 특정 매장을 고르는 동작이라
 * 성격이 다르다. 같은 목록에 나란히 두면 매장 하나처럼 읽힌다.
 */
export const StoreMenuSeparatesClearFromPick = {
  play: async ({ canvasElement }) => {
    const select = canvasElement.querySelector('.MuiSelect-select');
    await userEvent.click(select);

    const listbox = await waitFor(() => {
      const el = document.querySelector('[role="listbox"]');
      if (!el) throw new Error('menu not open');
      return el;
    });

    const items = [...listbox.children];
    await expect(items[0].textContent.trim()).toBe('All stores');
    await expect(items.length).toBeGreaterThan(1);

    /* 구분은 첫 매장 항목의 위쪽 선으로 한다. <Divider>를 자식으로 넣으면
       Select가 거기에도 role="option"을 붙여 선택 가능한 항목으로 읽힌다. */
    const firstStore = items[1];
    await expect(getComputedStyle(firstStore).borderTopWidth).toBe('1px');
    for (const item of items.slice(2)) {
      await expect(getComputedStyle(item).borderTopWidth).toBe('0px');
    }

    // 목록에 옵션 아닌 항목이 섞이지 않는다
    for (const item of items) {
      await expect(item.getAttribute('role')).toBe('option');
    }
  },
};

/**
 * 포커스 링은 사방이 대칭이어야 한다.
 *
 * 링은 box-shadow라 레이아웃을 차지하지 않는다. 그래서 조상이 overflow로 잘라내면
 * 소리 없이 한쪽만 사라진다 — 실제로 헤더 묶음의 클리핑 경계가 검색창 좌측과
 * 정확히 겹쳐서 왼쪽 링만 없었다(오른쪽은 툴바에 여유가 있어 보였다).
 * overflowY:hidden은 CSS상 다른 축을 auto로 바꾸기 때문에 생긴 일이라
 * 눈으로 보기 전에는 드러나지 않는다.
 */
export const FocusRingIsNotClipped = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[placeholder]');
    const root = input.closest('.MuiOutlinedInput-root');
    input.focus();

    await waitFor(async () => {
      await expect(root.classList.contains('Mui-focused')).toBe(true);
    });

    const field = root.getBoundingClientRect();
    const ring = 3;

    /* 링이 그려질 자리가 조상의 클리핑 박스 안에 있는지 본다.
       box-shadow는 잘려도 DOM에 흔적이 남지 않아 getBoundingClientRect로는
       확인할 수 없다 — 자를 수 있는 조상을 직접 훑는다. */
    let node = root.parentElement;
    while (node && node !== canvasElement) {
      const cs = getComputedStyle(node);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        const clip = node.getBoundingClientRect();
        await expect(field.left - ring).toBeGreaterThanOrEqual(clip.left - 0.5);
        await expect(field.right + ring).toBeLessThanOrEqual(clip.right + 0.5);
      }
      node = node.parentElement;
    }
  },
};

/**
 * 검색 결과는 접힌 구간 안에 숨지 않는다.
 *
 * UPCOMING/IN PROGRESS/STALE/COMPLETED는 기본 접힘이다. 검색은 특정 인물을 찾는
 * 동작인데 결과가 그 안에 들어가면 "COMPLETED 1"만 보이고 행은 하나도 안 보인다 —
 * 찾았는데 안 보이는 상태가 된다. 실데이터에서 "Stephanie" 검색이 그랬다.
 *
 * 접힘 상태 자체는 남겨서, 검색어를 지우면 원래대로 돌아온다.
 */
export const SearchRevealsCollapsedMatches = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[placeholder]');

    // 기본 접힘인 구간에 있는 사람을 고른다
    const collapsedFirst = canvasElement.querySelector('[data-section]:not([data-section="attention"]) button');
    if (!collapsedFirst) return;
    await expect(collapsedFirst.getAttribute('aria-expanded')).toBe('false');

    const target = MOCK_INFLUENCERS.find(i => i.alertFlags.length === 0 && i.creditShared);
    await expect(target).toBeTruthy();

    await userEvent.type(input, target.fullName);

    await waitFor(async () => {
      const sections = [...canvasElement.querySelectorAll('[data-section]')];
      await expect(sections.length).toBeGreaterThan(0);
      // 헤더가 말하는 수와 실제로 그려진 행 수가 같아야 한다
      for (const sec of sections) {
        const claimed = Number(sec.querySelector('button').innerText.match(/(\d+)\s*$/)?.[1]);
        await expect(sec.querySelectorAll('[data-influencer-id]').length).toBe(claimed);
      }
      await expect(canvasElement.querySelector(`[data-influencer-id="${target.id}"]`)).toBeTruthy();
    });

    // 검색어를 지우면 접힘이 돌아온다 — 사용자가 접어둔 상태를 빼앗지 않는다
    await userEvent.clear(input);
    await waitFor(async () => {
      const again = canvasElement.querySelector('[data-section]:not([data-section="attention"]) button');
      await expect(again.getAttribute('aria-expanded')).toBe('false');
    });
  },
};

/**
 * SelectionHarness — 선택 상태를 실제로 들고 있는 래퍼.
 *
 * 스토리 render 콜백에 useState를 두면 hooks 규칙 위반이고, onSelect에 스파이만
 * 넘기면 selectedId가 갱신되지 않아 클릭해도 아무 일이 일어나지 않는다.
 */
function SelectionHarness() {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <SaasOperationsView
      influencers={ MANY }
      stores={ deriveStores(MANY) }
      selectedStore={ ALL_STORES }
      selectedId={ selectedId }
      onSelect={ inf => setSelectedId(inf.id) }
    />
  );
}

/**
 * 레일에서 고른 사람이 목록에서도 보이는 자리로 온다.
 *
 * 선택하면 행이 강조되지만 목록이 수백 줄이라 화면 밖에 남는 경우가 많았다 —
 * 실측에서 강조된 행이 2429px 아래에 있었다. 드로어로 누구인지는 알지만
 * 닫고 나면 그 사람이 목록 어디였는지 알 수 없다.
 *
 * 목록이 스크롤될 만큼 길어야 의미가 있어서 목업을 여러 벌 복제해 쓴다.
 */
const MANY = Array.from({ length: 8 }, (_, k) =>
  MOCK_INFLUENCERS.map(inf => ({ ...inf, id: `${inf.id}-c${k}` })),
).flat();

export const RailSelectionScrollsListIntoView = {
  render: () => <SelectionHarness />,
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector('[data-rail]');
    /* 구조로 찾으면 앱이 실제로 스크롤하는 요소와 다른 걸 잡는다 —
       처음에 바깥 박스를 잡아서 경계가 15px 어긋났다. 같은 앵커를 쓴다. */
    const scroller = canvasElement.querySelector('[data-list-scroller]');
    await expect(scroller).toBeTruthy();

    // 목록에 그려져 있으면서 지금은 화면 밖인 행을 레일에서 찾는다
    const target = [...rail.querySelectorAll('[data-rail-row]')].find(r => {
      const row = canvasElement.querySelector(`[data-influencer-id="${CSS.escape(r.getAttribute('data-rail-row'))}"]`);
      if (!row) return false;
      const view = scroller.getBoundingClientRect();
      const box = row.getBoundingClientRect();
      return box.bottom > view.bottom || box.top < view.top;
    });
    if (!target) return;   // 전부 보이면 검증할 게 없다

    const id = target.getAttribute('data-rail-row');
    await userEvent.click(target);

    await waitFor(async () => {
      const row = canvasElement.querySelector(`[data-influencer-id="${CSS.escape(id)}"]`);
      await expect(row).toBeTruthy();
      const view = scroller.getBoundingClientRect();
      const box = row.getBoundingClientRect();
      await expect(box.top).toBeGreaterThanOrEqual(view.top - 1);
      await expect(box.bottom).toBeLessThanOrEqual(view.bottom + 1);
    });
  },
};

/**
 * 콘텐츠가 레일 오른쪽 남은 공간의 가운데에 놓이는지.
 *
 * 좌우 여백이 같아야 "가운데"다. 레일은 콘텐츠 컬럼의 직전 형제라 그 사이 틈을
 * 왼쪽 기준으로, 부모 행의 오른쪽 끝까지를 오른쪽 기준으로 잰다.
 * `mx: 'auto'`가 빠지면 왼쪽 틈이 0이 되고 남는 공간이 전부 오른쪽으로 몰린다.
 */
export const ContentIsCenteredInRemainingSpace = {
  play: async ({ canvasElement }) => {
    const column = await waitFor(() => {
      const el = canvasElement.querySelector('[data-content-column]');
      if (!el?.getBoundingClientRect().width) throw new Error('content column not laid out yet');
      return el;
    });

    const colBox = column.getBoundingClientRect();
    const rowBox = column.parentElement.getBoundingClientRect();
    const railBox = column.previousElementSibling.getBoundingClientRect();

    const gapLeft = Math.round(colBox.left - railBox.right);
    const gapRight = Math.round(rowBox.right - colBox.right);

    // 상한을 넘지 않는다 — 넘으면 행이 화면 전체로 늘어나 이름과 상태가 끊긴다
    await expect(Math.round(colBox.width)).toBeLessThanOrEqual(1500);

    // 상한에 닿지 않는 좁은 뷰포트에서는 양쪽 틈이 0이라 가운데 정렬이 자명하게 참이다.
    // 남는 공간이 실제로 있을 때만 반씩 갈렸는지 따진다.
    if (gapLeft + gapRight > 2) {
      await expect(Math.abs(gapLeft - gapRight)).toBeLessThanOrEqual(2);
    }
  },
};

/**
 * KPI 스트립과 검색창 사이 구분선이 위아래 같은 간격으로 보이는지.
 *
 * `pt`와 `pb`를 똑같이 주면 **눈에는 안 맞는다**. 위쪽 마지막 잉크는 22px 숫자인데
 * 그 글자 상자에 baseline 아래 여유가 약 9px 붙어 있어서, 16px씩 주면 실제로는
 * 26px 대 17px로 보이고 구분선이 아래쪽에 붙는다(픽셀로 확인했다).
 * 그래서 아래 padding만 줄인 광학 보정이 들어가 있다.
 *
 * 이 스토리가 막는 건 "대칭으로 정리한다"며 `py: 2`로 되돌리는 회귀다 —
 * 코드만 보면 그게 맞아 보이지만 화면에서는 다시 어긋난다.
 */
export const KpiDividerIsOpticallyBalanced = {
  play: async ({ canvasElement }) => {
    // 필터 바(위아래 1px 보더 + 검색 input)를 찾고, 그 직전 형제가 KPI 스트립이다
    const strip = await waitFor(() => {
      const col = canvasElement.querySelector('[data-content-column]');
      const bar = [...(col?.querySelectorAll('div') || [])].find(b => {
        const st = getComputedStyle(b);
        return st.borderTopWidth === '1px' && st.borderBottomWidth === '1px' && b.querySelector('input');
      });
      if (!bar?.previousElementSibling) throw new Error('KPI strip not mounted');
      return bar.previousElementSibling;
    });

    const { paddingTop, paddingBottom } = getComputedStyle(strip);
    const top = parseFloat(paddingTop);
    const bottom = parseFloat(paddingBottom);

    // 아래가 더 작아야 한다 — 같으면 광학 보정이 사라진 것이다
    await expect(bottom).toBeLessThan(top);

    // 글자 상자 여유(약 9px)만큼만 줄인다. 더 줄이면 이번엔 위로 붙는다.
    await expect(top - bottom).toBeGreaterThanOrEqual(4);
    await expect(top - bottom).toBeLessThanOrEqual(10);
  },
};
