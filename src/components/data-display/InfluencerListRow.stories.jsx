import Box from '@mui/material/Box';
import { expect } from 'storybook/test';
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
