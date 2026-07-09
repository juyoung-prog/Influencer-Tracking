import Box from '@mui/material/Box';
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
