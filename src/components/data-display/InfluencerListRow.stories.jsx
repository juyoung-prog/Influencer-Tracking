import Box from '@mui/material/Box';
import { expect } from 'storybook/test';
import { defaultTheme } from '../../styles/themes';
import InfluencerListRow from './InfluencerListRow';
import { deriveAlertFlags, derivePerformanceStatus, deriveScheduleGroup } from '../../data/beautymaster/schema.js';

const D = iso => new Date(iso);

function make(overrides = {}) {
  const base = {
    id: 'inf-0',
    sheetStatus: 'Processing',
    fullName: 'Kim Minjung',
    hasFullName: true,
    socialHandle: 'kimminjung',
    imageUrl: '',
    platform: 'Instagram',
    tier: 'tier1',
    category: 'kbeauty',
    scheduledTime: D('2026-07-05T11:00:00'),
    // 시트 셀에 시각까지 적혀 있었는지. false면 날짜만 쓰고 시각은 "time TBD"로 밝힌다
    hasScheduledTimeOfDay: true,
    uploadDate: null,
    agreement: true,
    attend: false,
    collaboShared: false,
    creditShared: false,
    creditUsed: false,
    note: '',
    contactReason: null,
    contactStatus: null,
    lastContactDate: null,
    requestedDate: null,
    alertFlags: [],
    scheduleGroup: 'today',
    ...overrides,
  };
  const scheduleGroup = deriveScheduleGroup(base.scheduledTime);
  return { ...base, scheduleGroup, alertFlags: deriveAlertFlags({ ...base, scheduleGroup }) };
}

export default {
  title: 'BeautyMaster/List/InfluencerListRow',
  component: InfluencerListRow,
  tags: ['autodocs'],
  argTypes: {
    influencer: { control: 'object', description: 'Influencer data object' },
    isSelected: { control: 'boolean', description: 'Highlights the row currently open in Drawer' },
    onClick: { action: 'row clicked' },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
        <Story />
      </Box>
    ),
  ],
};

export const Scheduled = {
  args: {
    influencer: make({ id: 'inf-s', fullName: 'Lee Jiyeon', tier: 'tier2', scheduledTime: D('2026-07-08T11:00:00'), attend: false }),
    isSelected: false,
  },
};

export const Selected = {
  args: {
    influencer: make({ attend: true }),
    isSelected: true,
  },
};

export const AwaitingUpload = {
  args: {
    influencer: make({ attend: true, collaboShared: false }),
    isSelected: false,
  },
};

export const AlertUploadPending = {
  name: 'Alert — Upload Pending',
  args: {
    influencer: make({
      id: 'inf-a1',
      fullName: 'Shin Dahye',
      scheduledTime: D('2026-07-02T13:00:00'),
      attend: true,
      collaboShared: false,
    }),
    isSelected: false,
  },
};

/**
 * 상태 라벨 중 유일하게 색을 얻는 값.
 *
 * 나머지 라벨은 회색이다 — 대부분의 행이 같은 값이라 색을 줘봐야 신호가 안 된다.
 * "Credit Not Sent"만 다르다: 업로드까지 끝났는데 크레딧이 안 나간 건이고,
 * 우리가 실제로 해야 할 행동이 남은 유일한 상태다. 목록에서도 구간 맨 위로 올라간다.
 */
export const AlertCreditNotSent = {
  name: 'Alert — Credit Not Sent',
  args: {
    influencer: make({
      id: 'inf-a2',
      fullName: 'Park Soyeon',
      scheduledTime: D('2026-07-01T14:00:00'),
      attend: true,
      collaboShared: true,
      creditShared: false,
      uploadDate: D('2026-07-01'),
    }),
    isSelected: false,
  },
  play: async ({ canvasElement }) => {
    const label = [...canvasElement.querySelectorAll('span')]
      .find(e => e.textContent === 'Credit Not Sent');
    await expect(label).toBeTruthy();

    const h = defaultTheme.palette.error.main.replace('#', '');
    const red = `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
    await expect(getComputedStyle(label).color).toBe(red);
    await expect(getComputedStyle(label).fontWeight).toBe('600');
  },
};

export const AlertNoShowFollowUp = {
  name: 'Alert — No-show Follow-up',
  args: {
    influencer: make({
      id: 'inf-a3',
      fullName: 'Han Yerin',
      scheduledTime: D('2026-07-03T13:00:00'),
      attend: false,
      contactReason: 'no-show',
      contactStatus: 'pending-reply',
      lastContactDate: D('2026-07-05'),
    }),
    isSelected: false,
  },
};

export const AlertReschedulePending = {
  name: 'Alert — Reschedule Pending',
  args: {
    influencer: make({
      id: 'inf-a4',
      fullName: 'Choi Yuna',
      scheduledTime: D('2026-07-10T15:00:00'),
      attend: false,
      contactReason: 'reschedule-request',
      contactStatus: 'pending-reply',
      lastContactDate: D('2026-07-07'),
      requestedDate: D('2026-07-14'),
    }),
    isSelected: false,
  },
};

/**
 * 종결 — 시트 Contact Status에 Dropped를 적으면 모든 경보가 꺼지고
 * "Dropped" 한 단어만 비활성 톤으로 남는다. 행은 목록에서 사라지지 않는다 —
 * 다음 캠페인 때 "이 사람 노쇼로 드롭됐었네"를 확인하는 이력이 된다.
 * 드롭 여부 판단은 사람이 한다(노쇼 횟수 자동 추적은 시트 관리 부담으로 철회).
 */
export const DroppedTerminal = {
  name: 'Dropped',
  args: {
    influencer: make({
      id: 'inf-a6',
      fullName: 'Seo Hana',
      scheduledTime: D('2026-07-20T13:00:00'),
      attend: false,
      contactReason: 'no-show',
      contactStatus: 'dropped',
      lastContactDate: D('2026-07-25'),
    }),
    isSelected: false,
  },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-influencer-id]');
    const status = row.children[3].textContent;
    await expect(status).toBe('Dropped');
    // 경보 문구가 함께 남지 않는다 — 종결인데 "overdue"가 있으면 모순
    await expect(status).not.toMatch(/overdue|awaiting reply/);

    const label = [...row.querySelectorAll('span,p')].find(e => e.textContent === 'Dropped');
    // "처리 필요"가 아니라 "끝난 건" — 비활성 톤, 굵기 없음
    await expect(getComputedStyle(label).fontWeight).toBe('400');
  },
};

export const Completed = {
  args: {
    influencer: make({
      id: 'inf-done',
      fullName: 'Oh Seulgi',
      scheduledTime: D('2026-06-28T10:00:00'),
      attend: true,
      collaboShared: true,
      creditShared: true,
    }),
    isSelected: false,
  },
};

/** 오늘 기준 n일 전 — 성과 D-day는 시간 파생이라 고정 날짜로는 스토리가 썩는다 */
const daysAgo = n => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(13, 0, 0, 0);
  return d;
};

/**
 * D+14 성과 기록 문구 — 경보가 아니라 예정된 루틴 작업.
 *
 * due는 "Record Performance"(작업 큐 섹션과 같은 어휘) + 초과일을 본문 색 강조로,
 * 임박(D-3 이내)은 D-day를 회색으로 보여준다. warning/error 색을 쓰지 않는 게 요점 —
 * 색까지 주면 목록이 신호등이 되고 진짜 경보(Credit Not Sent)가 묻힌다.
 */
export const PerformanceRecordDue = {
  name: 'Performance — Record Due',
  args: {
    influencer: make({
      id: 'inf-perf-due',
      fullName: 'Han Areum',
      scheduledTime: daysAgo(18),
      attend: true,
      collaboShared: true,
      creditShared: true,
      uploadDate: daysAgo(16),
    }),
    isSelected: false,
  },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelector('[data-performance-line]');
    await expect(line).toBeTruthy();
    await expect(line.textContent).toBe('Record Performance · 2d');
    // "Completed"는 사라진다 — 기록이 남았으면 완료가 아니다. 한 행이 두 말을 하면 안 된다.
    await expect(canvasElement.textContent).not.toContain('Completed');
    // 경보 색이 아니다 — 본문 색 + 굵기로만 선다
    const err = defaultTheme.palette.error.main;
    const warn = defaultTheme.palette.warning.main;
    const toRgb = hex => `rgb(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)})`;
    await expect(getComputedStyle(line).color).not.toBe(toRgb(err));
    await expect(getComputedStyle(line).color).not.toBe(toRgb(warn));
    await expect(getComputedStyle(line).fontWeight).toBe('600');
  },
};

export const PerformanceCheckImminent = {
  name: 'Performance — D-day Imminent',
  args: {
    influencer: make({
      id: 'inf-perf-wait',
      fullName: 'Choi Yuna',
      scheduledTime: daysAgo(14),
      attend: true,
      collaboShared: true,
      creditShared: true,
      uploadDate: daysAgo(12),
    }),
    isSelected: false,
  },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelector('[data-performance-line]');
    await expect(line).toBeTruthy();
    await expect(line.textContent).toBe('Perf check D-2');

    // 임박 전(D-4 이상)은 침묵한다 — 상시 노출은 숫자 소음이다
    const early = make({ collaboShared: true, creditShared: true, uploadDate: daysAgo(5) });
    await expect(derivePerformanceStatus(early).dDay).toBe(9);
  },
};

export const Tier2TikTok = {
  name: 'Tier 2 / TikTok',
  args: {
    influencer: make({ id: 'inf-t2', tier: 'tier2', platform: 'TikTok', scheduledTime: D('2026-07-10T14:00:00'), attend: false }),
    isSelected: false,
  },
};

export const Categories = {
  name: 'Categories',
  render: () => {
    const rows = [
      make({ id: 'c0', fullName: 'Kim Minjung', category: 'kbeauty' }),
      make({ id: 'c1', fullName: 'Lee Jiyeon', category: 'general' }),
      make({ id: 'c2', fullName: 'Park Soyeon', category: 'specific' }),
    ];
    return (
      <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
        {rows.map(inf => (
          <InfluencerListRow key={inf.id} influencer={inf} onClick={() => {}} isSelected={false} />
        ))}
      </Box>
    );
  },
};

export const AllStates = {
  name: 'All States',
  render: () => {
    const rows = [
      make({ id: '0', fullName: 'Kim Minjung', category: 'kbeauty', attend: true, note: 'Visit complete.' }),
      make({ id: '1', fullName: 'Lee Jiyeon', category: 'general', scheduledTime: D('2026-07-08T11:00:00'), attend: false }),
      make({ id: '2', fullName: 'Shin Dahye', category: 'specific', scheduledTime: D('2026-07-02T13:00:00'), attend: true, collaboShared: false }),
      make({ id: '3', fullName: 'Park Soyeon', category: 'kbeauty', scheduledTime: D('2026-07-01T14:00:00'), attend: true, collaboShared: true, creditShared: false, uploadDate: D('2026-07-01') }),
      make({ id: '4', fullName: 'Oh Seulgi', category: 'general', scheduledTime: D('2026-06-28T10:00:00'), attend: true, collaboShared: true, creditShared: true }),
      make({ id: '5', fullName: 'Han Yerin', category: 'kbeauty', scheduledTime: D('2026-07-03T13:00:00'), attend: false, contactReason: 'no-show', contactStatus: 'pending-reply', lastContactDate: D('2026-07-05') }),
      make({ id: '6', fullName: 'Choi Yuna', category: 'general', scheduledTime: D('2026-07-10T15:00:00'), attend: false, contactReason: 'reschedule-request', contactStatus: 'pending-reply', lastContactDate: D('2026-07-07'), requestedDate: D('2026-07-14') }),
      make({ id: '7', fullName: 'Seo Hana', category: 'kbeauty', scheduledTime: D('2026-07-20T13:00:00'), attend: false, contactReason: 'no-show', contactStatus: 'dropped', lastContactDate: D('2026-07-25') }),
    ];
    return (
      <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
        {rows.map(inf => (
          <InfluencerListRow key={inf.id} influencer={inf} onClick={() => {}} isSelected={false} />
        ))}
      </Box>
    );
  },
};

/**
 * 시각 미입력 — 시트에 날짜만 있고 시각이 없는 경우.
 * 파싱하면 자정이 되는데 그걸 "12:00 AM"으로 보여주면 없는 정보를 만들어내는 것이라,
 * 날짜만 쓰고 시각 자리는 "time TBD"로 밝힌다. 실데이터에서 45건(24%)이 이 상태다.
 */
export const TimeNotSet = {
  name: 'Time Not Set',
  render: () => (
    <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
      <InfluencerListRow
        influencer={make({ id: 'a', fullName: 'Kim Minjung', hasScheduledTimeOfDay: true })}
        onClick={() => {}}
      />
      <InfluencerListRow
        influencer={make({ id: 'b', fullName: 'Lee Jiyeon', hasScheduledTimeOfDay: false })}
        onClick={() => {}}
      />
      <InfluencerListRow
        influencer={make({ id: 'c', fullName: 'Park Soyeon', scheduledTime: null, hasScheduledTimeOfDay: false })}
        onClick={() => {}}
      />
    </Box>
  ),
};

/**
 * 위험 신호 대비 — "Nd overdue"는 한때 text.disabled(2.68:1)로 가장 흐렸다.
 * 지금은 text.secondary(5.74:1) + 600 굵기다. 색은 중립인데,
 * 심각도는 위의 stage 라벨이 지고 이 줄은 "얼마나"를 말하는 수치이기 때문이다.
 * 색을 다시 흐리게 바꾸면 이 테스트가 잡는다. 아바타도 1.88 → 5.59:1.
 */
export const OverdueEmphasis = {
  render: () => (
    <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
      {/* 고정 날짜였을 때 STALE(90일)을 넘기는 순간 경보가 꺼져 스토리가 조용히 썩었다 */}
      <InfluencerListRow
        influencer={make({ id: 'x', fullName: 'Shin Dahye', scheduledTime: daysAgo(30), attend: false })}
        onClick={() => {}}
      />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const overdue = [...canvasElement.querySelectorAll('span,p')]
      .find(e => /\d+d overdue/.test(e.textContent) && !e.children.length);
    await expect(overdue).toBeTruthy();

    // 대비 4.5:1 이상 (흰 배경 기준)
    const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const m = getComputedStyle(overdue).color.match(/[\d.]+/g).map(Number);
    const [L1, L2] = [lum(m.slice(0, 3)), lum([255, 255, 255])].sort((a, b) => b - a);
    await expect((L1 + 0.05) / (L2 + 0.05)).toBeGreaterThan(4.5);
  },
};

/**
 * 강조는 행마다 다른 값에 간다.
 *
 * 예전에는 stage 라벨("Visit Unconfirmed")이 앰버였다. 그런데 그 값은 대부분의 행이
 * 같아서 강조해도 행을 고르는 데 도움이 안 되고, 정작 우선순위를 정하는 경과일은
 * 회색이었다. 강조를 경과일로 옮기고 상태 라벨은 회색으로 내렸다.
 *
 * 동시에 "Visit Unconfirmed"와 "No-show"가 같은 사실을 두 줄로 말하던 것을 정리했다 —
 * 섹션 분류가 alertFlags 로 돌아가므로 연락 상태가 공식 값이고, stage 라벨은
 * 그것이 없을 때만 나온다. 결과적으로 상태 블록은 최대 2줄이다.
 */
export const SeverityHierarchy = {
  name: 'Severity Hierarchy',
  render: () => {
    const rows = [
      make({ id: 'h0', fullName: 'Oh Seulgi', scheduledTime: D('2026-06-28T10:00:00'), attend: true, collaboShared: true, creditShared: true }),
      make({ id: 'h1', fullName: 'Shin Dahye', scheduledTime: D('2026-07-02T13:00:00'), attend: true, collaboShared: false }),
      make({ id: 'h2', fullName: 'Choi Yuna', scheduledTime: D('2026-07-10T15:00:00'), attend: false, contactReason: 'reschedule-request', contactStatus: 'pending-reply', lastContactDate: D('2026-07-07') }),
      make({ id: 'h3', fullName: 'Han Yerin', scheduledTime: D('2026-07-03T13:00:00'), attend: false, contactReason: 'no-show', contactStatus: 'pending-reply', lastContactDate: D('2026-07-05') }),
    ];
    return (
      <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
        { rows.map(inf => (
          <InfluencerListRow key={ inf.id } influencer={ inf } onClick={ () => {} } isSelected={ false } />
        )) }
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const rgb = hex => {
      const h = hex.replace('#', '');
      return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
    };
    const amber = rgb(defaultTheme.palette.warning.main);

    const rows = [...canvasElement.querySelectorAll('[data-influencer-id]')];
    await expect(rows.length).toBe(4);

    for (const row of rows) {
      const lines = [...row.children[3].querySelectorAll('*')]
        .filter(el => !el.children.length && el.textContent.trim());

      // 상태 블록은 최대 2줄 — 같은 사실을 두 번 말하지 않는다
      await expect(lines.length).toBeLessThanOrEqual(2);

      for (const line of lines) {
        const isOverdue = /\d+d overdue/.test(line.textContent);
        // 강조는 경과일에만. 상태 라벨은 회색이라 행마다 다른 값이 먼저 눈에 든다
        if (isOverdue) await expect(getComputedStyle(line).color).toBe(amber);
        else await expect(getComputedStyle(line).color).not.toBe(amber);
      }
    }

    // "Visit Unconfirmed"와 연락 상태가 한 행에 같이 나오지 않는다
    for (const row of rows) {
      const text = row.children[3].textContent;
      if (/No-show|Reschedule/.test(text)) await expect(text).not.toContain('Visit Unconfirmed');
    }

    /* "무응답"은 상태가 아니라 경과일로 말한다 — no-response 상태는 폐기됐고
       (수동 전환은 잊힌다), 오래 기다린 건은 "awaiting reply · Nd"의 숫자가 가른다 */
    const awaiting = rows.map(r => r.children[3].textContent).find(t => /awaiting reply/.test(t));
    await expect(awaiting).toMatch(/awaiting reply · \d+d/);
  },
};

/**
 * 좁은 폭에서 행이 깨지지 않는다.
 *
 * 고정 컬럼 합이 348px였다 — 아바타 28 + gap 48 + tier·platform 100 + stage 140
 * + padding 32. 390px 폰에서는 본문이 334px라 이름 자리가 마이너스가 되어
 * 날짜·플랫폼·상태가 뒤엉키고 우측이 잘렸다.
 *
 * 이름 칸에 최소 폭을 줘서 오른쪽 두 컬럼이 다음 줄로 밀리게 한다.
 * 이름을 100%로 만들면 아바타까지 떨어져 혼자 한 줄을 쓰므로 minWidth로만 민다.
 */
export const NarrowWidthWraps = {
  name: 'Narrow width',
  render: () => (
    <Box sx={{ width: 334, containerType: 'inline-size', border: '1px solid', borderColor: 'divider' }}>
      <InfluencerListRow
        influencer={make({
          id: 'narrow',
          fullName: 'Kientazya Hawkins',
          scheduledTime: D('2026-07-02T13:00:00'),
          attend: true,
          collaboShared: false,
        })}
        onClick={() => {}}
      />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-influencer-id]');

    // 가로로 넘쳐서 잘리는 부분이 없어야 한다
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);

    // 아바타와 이름은 같은 줄에 남는다 — 아바타만 따로 떨어지면 목록이 읽히지 않는다
    const avatar = row.querySelector('.MuiAvatar-root');
    const name = [...row.querySelectorAll('*')].find(e => e.textContent.trim() === 'Kientazya Hawkins');
    await expect(avatar).toBeTruthy();
    await expect(name).toBeTruthy();
    const sameLine = Math.abs(avatar.getBoundingClientRect().top - name.getBoundingClientRect().top) < 24;
    await expect(sameLine).toBe(true);

    // 이름은 줄임표로 잘리지 않는다
    await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth + 1);
  },
};

/**
 * 세 속성이 한 컬럼에 필터 바와 같은 순서로 모인다.
 *
 * 예전에는 카테고리만 왼쪽에 칩으로 붙고 티어·플랫폼은 오른쪽에 역순("T2 · Instagram")이라,
 * 같은 세 속성이 화면에서 순서도 위치도 갈라져 있었다. 한 열로 모아야 세로로 훑을 수 있다.
 * 셋 다 맨 텍스트다 — 동등한 속성인데 하나만 칩이면 무게가 달라 보인다.
 */
export const AttributesMatchFilterOrder = {
  name: 'Attribute column',
  render: () => (
    <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
      <InfluencerListRow influencer={ make({ id: 'a1', fullName: 'Kim Minjung', platform: 'Instagram', tier: 'tier2', category: 'general' }) } onClick={ () => {} } />
      {/* 시트에는 "Tiktok" 으로 적혀 있어도 화면은 공식 표기 "TikTok" 이어야 한다 */}
      <InfluencerListRow influencer={ make({ id: 'a2', fullName: 'Lee Jiyeon', platform: 'Tiktok', tier: 'tier1', category: 'kbeauty' }) } onClick={ () => {} } />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const rows = [...canvasElement.querySelectorAll('[data-influencer-id]')];
    const cells = rows.map(row => row.children[2]);

    // 필터 바 칩 순서와 같다: 플랫폼 → 티어 → 카테고리 (구분자 없이 하위 컬럼으로)
    const valuesOf = cell => [...cell.children].map(c => c.textContent.trim());
    await expect(valuesOf(cells[0])).toEqual(['Instagram', 'T2', 'General']);
    await expect(valuesOf(cells[1])).toEqual(['TikTok', 'T1', 'K-Beauty']);

    // 세 값이 각각 세로로 정렬된다 — 앞 값 길이에 뒤 값이 밀리면 훑을 수 없다
    for (const i of [0, 1, 2]) {
      const xs = cells.map(c => Math.round(c.children[i].getBoundingClientRect().x));
      await expect(new Set(xs).size).toBe(1);
    }

    // 왼쪽에 카테고리 칩이 남아 있지 않다 — 테두리 있는 카테고리 노드 0건
    for (const row of rows) {
      const chips = [...row.querySelectorAll('*')].filter(el => {
        const cs = getComputedStyle(el);
        return cs.borderStyle === 'solid' && cs.borderWidth !== '0px'
          && /General|K-Beauty|Specific/.test(el.textContent);
      });
      await expect(chips.length).toBe(0);
    }

    // 세 속성이 같은 무게 — 하위 컬럼에 별도 표면(테두리·배경)이 없고 색도 같다
    for (const cell of cells) {
      for (const sub of cell.children) {
        const cs = getComputedStyle(sub);
        await expect(cs.borderWidth).toBe('0px');
        await expect(cs.backgroundColor).toBe('rgba(0, 0, 0, 0)');
        await expect(cs.color).toBe(getComputedStyle(cells[0].children[0]).color);
      }
    }
  },
};

/**
 * 긴 플랫폼 값이 들어와도 컬럼 폭이 변하지 않는다.
 *
 * flex 항목의 기본 min-width:auto는 nowrap 내용의 최소 폭을 하한으로 잡는다.
 * 그래서 "T1 · Tiktok, Instagram"이 들어오면 100px 기준을 무시하고 126px로 늘어나,
 * 그 행만 컬럼 시작점이 26px 왼쪽으로 밀렸다 — 목록에서 세로선이 어긋나 보인다.
 * 실데이터에 콤마로 두 플랫폼을 적는 행이 있다.
 */
export const LongPlatformKeepsColumnWidth = {
  name: 'Long platform',
  render: () => (
    <Box sx={{ maxWidth: 680, border: '1px solid', borderColor: 'divider' }}>
      <InfluencerListRow influencer={ make({ id: 'p1', fullName: 'Kim Minjung', platform: 'Instagram' }) } onClick={ () => {} } />
      <InfluencerListRow influencer={ make({ id: 'p2', fullName: 'Lee Jiyeon', platform: 'Tiktok, Instagram' }) } onClick={ () => {} } />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const cells = [...canvasElement.querySelectorAll('[data-influencer-id]')].map(row => {
      const cell = row.children[2];   // 속성 컬럼(하위 컬럼 3개를 감싼 Box)
      const box = cell.getBoundingClientRect();
      return { text: cell.textContent.trim(), left: Math.round(box.left), width: Math.round(box.width) };
    });
    await expect(cells.length).toBe(2);
    // 순서는 필터 바와 같다 — 플랫폼이 맨 앞
    await expect(cells[0].text.startsWith('Instagram')).toBe(true);

    // 긴 값이 있어도 두 행의 컬럼 시작점과 폭이 같아야 한다
    await expect(cells[0].width).toBe(cells[1].width);
    await expect(cells[0].left).toBe(cells[1].left);

    /* 시트에 "Tiktok, Instagram" 처럼 여럿이 적혀 있어도 컬럼은 첫 플랫폼의
       공식 표기만 쓴다 — 컬럼 폭이 값 길이에 흔들리면 세로 정렬이 깨진다.
       전체 조합은 title 로 남는다. */
    const longCell = [...canvasElement.querySelectorAll('[data-influencer-id]')][1]
      .querySelector('[title]');
    await expect(longCell.getAttribute('title')).toBe('TikTok · T1 · K-Beauty');
    await expect(cells[1].text).toContain('TikTok');
    // 줄임표는 값이 담긴 하위 컬럼에 걸린다(title 을 든 래퍼가 아니라)
    for (const sub of longCell.children) {
      await expect(getComputedStyle(sub).textOverflow).toBe('ellipsis');
    }
  },
};

/**
 * 핸들이 왼쪽 블록의 두 번째 줄에 시각과 한 줄을 공유하는지.
 *
 * 이름+날짜만으로는 넓은 화면에서 행 가운데가 비어 폭을 정당화하지 못했다.
 * 핸들은 그 여백을 메우면서 실제 쓸모(DM 보낼 때 필요)가 있는 값이다.
 * 줄을 새로 만들지 않는 게 중요하다 — 행 높이가 커지면 한 화면에 들어가는 사람이 줄어든다.
 */
export const HandleSharesTheDateLine = {
  args: { influencer: make({ fullName: 'Jasmin Bean', socialHandle: 'jasminbean' }) },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelectorAll('.MuiTypography-caption')[0];
    await expect(line.textContent).toBe('@jasminbean · Jul 5 · 11:00 AM');

    // 한 줄이어야 한다 — caption 한 줄 높이를 크게 넘지 않는지
    await expect(line.getBoundingClientRect().height).toBeLessThan(24);
  },
};

/**
 * 핸들이 없는 행은 예전처럼 날짜·시각만.
 *
 * 시트의 social account 칸에 자기소개가 적힌 행이 있어서(파서가 걸러낸다) 핸들이
 * 빈 값으로 온다. 그때 "@" 하나만 남거나 " · "가 앞에 붙으면 안 된다.
 */
export const NoHandleKeepsDateOnly = {
  args: { influencer: make({ fullName: 'Rosalia Serrano', socialHandle: '' }) },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelectorAll('.MuiTypography-caption')[0];
    await expect(line.textContent).toBe('Jul 5 · 11:00 AM');
    await expect(line.textContent).not.toContain('@');
  },
};

/**
 * 이름 칸이 비어 핸들이 이름 자리에 올라온 행은 같은 값을 두 번 쓰지 않는다.
 *
 * 파서는 이름이 없으면 소셜 계정을 이름으로 쓴다(hasFullName: false). 그 행에서
 * 핸들 줄까지 넣으면 "_d1stylez_" 아래 "@_d1stylez_"가 되어 같은 말을 두 번 한다.
 */
export const HandleAsNameIsNotRepeated = {
  args: { influencer: make({ fullName: '_d1stylez_', hasFullName: false, socialHandle: '_d1stylez_' }) },
  play: async ({ canvasElement }) => {
    const line = canvasElement.querySelectorAll('.MuiTypography-caption')[0];
    await expect(line.textContent).toBe('Jul 5 · 11:00 AM');
  },
};

/**
 * 아바타 이니셜 — 성이 없어도 두 글자.
 *
 * 한 글자만 쓰면("Nicole" → "N") 나머지가 두 글자인 열에서 그 행만 비어 보인다.
 * 앞의 기호는 이니셜이 될 수 없다 — 핸들이 이름 자리에 온 행이 "_D"가 됐다.
 */
export const AvatarInitialsAlwaysTwoChars = {
  render: () => (
    <Box sx={{ width: 720 }}>
      {[
        { fullName: 'Nicole', socialHandle: 'nicole' },
        { fullName: 'YULEIDYS', socialHandle: '' },
        { fullName: '_d1stylez_', hasFullName: false, socialHandle: '_d1stylez_' },
        { fullName: 'Maria Jose Doubront', socialHandle: 'dearmariajose' },
      ].map((o, i) => (
        <InfluencerListRow key={ i } influencer={ make({ id: `ini-${i}`, ...o }) } onClick={ () => {} } />
      ))}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const initials = [...canvasElement.querySelectorAll('.MuiAvatar-root')].map(a => a.textContent);
    await expect(initials).toEqual(['NI', 'YU', 'D1', 'MJ']);
    // 기호가 이니셜에 남지 않는다
    for (const t of initials) await expect(t).toMatch(/^[A-Z0-9]{2}$/);
  },
};

/**
 * 이니셜이 같은 사람이 인접해도 아바타 색으로 갈린다.
 *
 * 실제 데이터 191명에서 "이니셜이 같은 서로 다른 사람이 인접한" 쌍은 두 건이다 —
 * Aurora Garcia/Alexis Garrett(AG), Sherian McGhee/Sharon Mijares(SM). 둘 다 여기 넣는다.
 * 처음 쓴 `h*31 + c` 해시는 앞부분이 비슷한 이름을 같은 칸에 떨어뜨려 AG 쌍이 같은
 * 색이 됐다(이 스토리가 잡아냈다). 지금은 FNV-1a에 10칸이다.
 *
 * 해시는 100%를 보장하지 않는다(동일 이니셜 쌍 전체로는 97%). 이 스토리가 지키는 건
 * **실제로 붙어 앉는 쌍이 갈리는지**와 대비가 AA를 넘는지다.
 */
export const CollidingInitialsGetDifferentTints = {
  render: () => (
    <Box sx={{ width: 720 }}>
      {['Aurora Garcia', 'Alexis Garrett', 'Sherian McGhee', 'Sharon Mijares'].map((n, i) => (
        <InfluencerListRow key={ n } influencer={ make({ id: `dup-${i}`, fullName: n, socialHandle: `h${i}` }) } onClick={ () => {} } />
      ))}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const avatars = [...canvasElement.querySelectorAll('.MuiAvatar-root')];
    await expect(avatars.map(a => a.textContent)).toEqual(['AG', 'AG', 'SM', 'SM']);

    const bg = avatars.map(a => getComputedStyle(a).backgroundColor);
    const fg = avatars.map(a => getComputedStyle(a).color);
    // 붙어 앉는 두 쌍이 각각 갈려야 한다
    await expect(bg[0]).not.toBe(bg[1]);
    await expect(bg[2]).not.toBe(bg[3]);
    await expect(fg[0]).not.toBe(fg[1]);
    await expect(fg[2]).not.toBe(fg[3]);

    // 색은 보조 신호 — 글자 대비는 네 아바타 모두 AA(4.5:1)를 넘어야 한다
    const lum = rgb => {
      const [r, g, b] = rgb.match(/\d+/g).map(Number).map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    for (const a of avatars) {
      const st = getComputedStyle(a);
      const [hi, lo] = [lum(st.backgroundColor), lum(st.color)].sort((x, y) => y - x);
      await expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(4.5);
    }
  },
};

/**
 * 같은 사람은 어디에 있어도 같은 색.
 *
 * 색을 목록 순서(index)로 매기면 필터를 걸거나 섹션이 접힐 때마다 같은 사람의 색이
 * 바뀌어, 색이 사람을 가리키는 신호로 쓸 수 없게 된다. 시트에는 같은 사람이 방문마다
 * 여러 행으로 들어오는 경우도 있어(Santana Williams 등) 그 행들이 묶여 보여야 한다.
 */
export const SamePersonKeepsTheSameTint = {
  render: () => (
    <Box sx={{ width: 720 }}>
      {['Santana Williams', 'Camila Castro', 'Santana Williams'].map((n, i) => (
        <InfluencerListRow key={ i } influencer={ make({ id: `same-${i}`, fullName: n, socialHandle: `h${i}` }) } onClick={ () => {} } />
      ))}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const bg = [...canvasElement.querySelectorAll('.MuiAvatar-root')].map(a => getComputedStyle(a).backgroundColor);
    // 떨어져 있어도 같은 이름이면 같은 색 (0번과 2번)
    await expect(bg[0]).toBe(bg[2]);
    await expect(bg[0]).not.toBe(bg[1]);
  },
};

/**
 * 표시 이름 정규화 — 시트에 성을 소문자로 적은 행이 목록에서 튀지 않게.
 *
 * 전체를 소문자로 깔고 첫 글자만 올리는 흔한 구현은 이미 맞게 적힌 이름을 망가뜨린다.
 * 여기서 지키는 건 그 반대 방향이다: 첫 글자만 올리고 나머지는 손대지 않는다.
 */
export const NameCapitalizationIsNormalized = {
  render: () => (
    <Box sx={{ width: 720 }}>
      {['Aurora garcia', 'Jakkah kebbay', 'Nathalia JMag', 'Karima MuhammadPoe', "O'Brien Smith"].map((n, i) => (
        <InfluencerListRow key={ n } influencer={ make({ id: `cap-${i}`, fullName: n, socialHandle: `h${i}` }) } onClick={ () => {} } />
      ))}
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const names = [...canvasElement.querySelectorAll('.MuiTypography-body2')].map(e => e.textContent);
    await expect(names).toEqual([
      'Aurora Garcia',
      'Jakkah Kebbay',
      // 이미 대문자가 섞인 이름은 그대로 — 소문자로 깔면 JMag·MuhammadPoe가 망가진다
      'Nathalia JMag',
      'Karima MuhammadPoe',
      "O'Brien Smith",
    ]);
  },
};
