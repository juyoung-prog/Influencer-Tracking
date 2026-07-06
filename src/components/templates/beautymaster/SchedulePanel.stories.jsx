import { useState } from 'react';
import Box from '@mui/material/Box';
import SchedulePanel from './SchedulePanel';
import { deriveAlertFlags, deriveScheduleGroup } from '../../../data/beautymaster/schema.js';

const D = iso => new Date(iso);

function make(overrides = {}) {
  const base = {
    id: 'inf-0',
    sheetStatus: 'Processing',
    fullName: 'Kim Minjung',
    imageUrl: '',
    platform: 'Instagram',
    tier: 'tier1',
    scheduledTime: D('2026-07-05T11:00:00'),
    uploadDate: null,
    agreement: true,
    attend: false,
    collaboShared: false,
    creditShared: false,
    creditUsed: false,
    note: '',
    ...overrides,
  };
  const scheduleGroup = deriveScheduleGroup(base.scheduledTime);
  return { ...base, scheduleGroup, alertFlags: deriveAlertFlags({ ...base, scheduleGroup }) };
}

const MOCK = [
  make({ id: '0', fullName: 'Kim Minjung', scheduledTime: D('2026-07-05T10:30:00'), attend: true }),
  make({ id: '1', fullName: 'Park Soyeon', scheduledTime: D('2026-07-05T14:00:00'), attend: true, collaboShared: true, creditShared: true, uploadDate: D('2026-07-05') }),
  make({ id: '2', fullName: 'Lee Jiyeon', tier: 'tier2', scheduledTime: D('2026-07-08T11:00:00'), attend: false }),
  make({ id: '3', fullName: 'Han Areum', tier: 'tier2', scheduledTime: D('2026-07-10T14:00:00'), attend: false }),
  make({ id: '4', fullName: 'Shin Dahye', scheduledTime: D('2026-07-02T13:00:00'), attend: true, collaboShared: false }),
  make({ id: '5', fullName: 'Oh Seulgi', scheduledTime: D('2026-06-28T10:00:00'), attend: true, collaboShared: true, creditShared: true }),
  make({ id: '6', fullName: 'Jung Hana', tier: 'tier2', scheduledTime: null }),
];

export default {
  title: 'BeautyMaster/Section/SchedulePanel',
  component: SchedulePanel,
  tags: ['autodocs'],
  argTypes: {
    influencers: { control: false },
    onSelect: { action: 'influencer selected' },
    selectedId: { control: 'text' },
    sx: { control: false },
  },
};

export const Default = {
  render: () => (
    <Box sx={{ height: 560, display: 'flex' }}>
      <SchedulePanel influencers={MOCK} onSelect={() => {}} selectedId={null} />
    </Box>
  ),
};

export const WithSelection = {
  name: 'With selected row',
  render: () => {
    const [selectedId, setSelectedId] = useState('2');
    return (
      <Box sx={{ height: 560, display: 'flex' }}>
        <SchedulePanel
          influencers={MOCK}
          onSelect={inf => setSelectedId(inf.id)}
          selectedId={selectedId}
        />
      </Box>
    );
  },
};
