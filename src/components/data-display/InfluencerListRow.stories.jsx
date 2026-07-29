import Box from '@mui/material/Box';
import { expect } from 'storybook/test';
import { defaultTheme } from '../../styles/themes';
import InfluencerListRow from './InfluencerListRow';
import { deriveAlertFlags, deriveScheduleGroup } from '../../data/beautymaster/schema.js';

const D = iso => new Date(iso);

function make(overrides = {}) {
  const base = {
    id: 'inf-0',
    sheetStatus: 'Processing',
    fullName: 'Kim Minjung',
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
      contactStatus: 'no-response',
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

export const WithNote = {
  args: {
    influencer: make({
      attend: true,
      note: 'Rescheduled from Jun 28. Content expected this week.',
    }),
    isSelected: false,
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
      make({ id: '5', fullName: 'Han Yerin', category: 'kbeauty', scheduledTime: D('2026-07-03T13:00:00'), attend: false, contactReason: 'no-show', contactStatus: 'no-response', lastContactDate: D('2026-07-05') }),
      make({ id: '6', fullName: 'Choi Yuna', category: 'general', scheduledTime: D('2026-07-10T15:00:00'), attend: false, contactReason: 'reschedule-request', contactStatus: 'pending-reply', lastContactDate: D('2026-07-07'), requestedDate: D('2026-07-14') }),
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
      <InfluencerListRow
        influencer={make({ id: 'x', fullName: 'Shin Dahye', scheduledTime: D('2026-05-02T13:00:00'), attend: false })}
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
 * 심각도는 3단계다 — 막힘(error) > 지연(warning) > 부가정보(중립).
 *
 * 예전엔 stage 라벨 · overdue 수치 · contact 상태가 **모두 앰버**라 한 행에 같은
 * 경고색이 세 줄 겹쳤고, 그러면 무엇이 급한지 알 수 없어진다.
 *
 * 그래서 규칙은 "경고색 한 줄"이 아니라 **"같은 경고색이 두 번 나오지 않는다"**이다.
 * 앰버(지연) 위에 레드(막힘)가 겹치는 건 정상이다 — 서로 다른 층위라 눈이
 * 레드 → 앰버 순으로 읽힌다. 문제는 같은 색이 반복돼 층위가 사라지는 것이다.
 * overdue는 "얼마나"를 말하는 수치라 중립색이다.
 */
export const SeverityHierarchy = {
  name: 'Severity Hierarchy',
  render: () => {
    const rows = [
      make({ id: 'h0', fullName: 'Oh Seulgi', scheduledTime: D('2026-06-28T10:00:00'), attend: true, collaboShared: true, creditShared: true }),
      make({ id: 'h1', fullName: 'Shin Dahye', scheduledTime: D('2026-07-02T13:00:00'), attend: true, collaboShared: false }),
      make({ id: 'h2', fullName: 'Choi Yuna', scheduledTime: D('2026-07-10T15:00:00'), attend: false, contactReason: 'reschedule-request', contactStatus: 'pending-reply', lastContactDate: D('2026-07-07') }),
      make({ id: 'h3', fullName: 'Han Yerin', scheduledTime: D('2026-07-03T13:00:00'), attend: false, contactReason: 'no-show', contactStatus: 'no-response', lastContactDate: D('2026-07-05') }),
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
    const alertColors = [rgb(defaultTheme.palette.warning.main), rgb(defaultTheme.palette.error.main)];

    const rows = [...canvasElement.querySelectorAll('[data-influencer-id]')];
    await expect(rows.length).toBe(4);

    let sawAlert = false;
    for (const row of rows) {
      const hits = [...row.querySelectorAll('*')]
        .filter(e => !e.children.length && e.textContent.trim())
        .map(e => getComputedStyle(e).color)
        .filter(c => alertColors.includes(c));
      // 같은 경고색은 한 행에 한 번만 — 이게 무너지면 층위가 사라진다
      for (const c of alertColors) {
        await expect(hits.filter(h => h === c).length).toBeLessThanOrEqual(1);
      }
      if (hits.length) sawAlert = true;
    }
    await expect(sawAlert).toBe(true);   // 전부 무채색이 되어버린 것도 아니다

    // 회신이 끊긴 건은 레드까지 올라간다
    const urgent = [...canvasElement.querySelectorAll('*')]
      .find(e => !e.children.length && /no reply/.test(e.textContent));
    await expect(getComputedStyle(urgent).color).toBe(rgb(defaultTheme.palette.error.main));
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
      const cell = [...row.children].find(c => /^T[12] · /.test(c.textContent.trim()));
      const box = cell.getBoundingClientRect();
      return { text: cell.textContent.trim(), left: Math.round(box.left), width: Math.round(box.width) };
    });
    await expect(cells.length).toBe(2);
    await expect(cells[1].text).toContain(',');

    // 긴 값이 있어도 두 행의 컬럼 시작점과 폭이 같아야 한다
    await expect(cells[0].width).toBe(cells[1].width);
    await expect(cells[0].left).toBe(cells[1].left);

    // 넘치는 값은 줄임표로 자르고 전체는 title로 남긴다
    const longCell = [...canvasElement.querySelectorAll('[data-influencer-id]')][1]
      .querySelector('[title]');
    await expect(longCell.getAttribute('title')).toContain('Tiktok, Instagram');
    await expect(getComputedStyle(longCell).textOverflow).toBe('ellipsis');
  },
};
