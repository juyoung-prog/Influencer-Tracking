import { useState } from 'react';
import Box from '@mui/material/Box';
import InfluencerPanel from './InfluencerPanel';
import { deriveAlertFlags, deriveScheduleGroup } from '../../../data/beautymaster/schema.js';

const D = iso => new Date(iso);

function make(overrides = {}) {
  const base = {
    id: 'inf-0',
    sheetStatus: 'Processing',
    fullName: 'Kim Minjung',
    store: 'G10',
    month: 7,
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
  make({ id: '1', fullName: 'Park Soyeon', platform: 'TikTok', scheduledTime: D('2026-07-05T14:00:00'), attend: true, collaboShared: true, creditShared: true, uploadDate: D('2026-07-05') }),
  make({ id: '2', fullName: 'Lee Jiyeon', tier: 'tier2', scheduledTime: D('2026-07-08T11:00:00'), attend: false }),
  make({ id: '3', fullName: 'Han Areum', tier: 'tier2', platform: 'TikTok', scheduledTime: D('2026-07-10T14:00:00'), note: 'Rescheduled from Jun 28.' }),
  make({ id: '4', fullName: 'Shin Dahye', scheduledTime: D('2026-07-02T13:00:00'), attend: true, collaboShared: false }),
  make({ id: '5', fullName: 'Park Hyerin', scheduledTime: D('2026-07-01T14:00:00'), attend: true, collaboShared: true, creditShared: false, uploadDate: D('2026-07-01') }),
  make({ id: '6', fullName: 'Oh Seulgi', sheetStatus: 'Done', scheduledTime: D('2026-06-28T10:00:00'), attend: true, collaboShared: true, creditShared: true }),
  make({ id: '7', fullName: 'Jung Hana', tier: 'tier2', platform: 'TikTok', scheduledTime: null }),
];

const STORES = ['G10'];
const MONTHS = [7];

export default {
  title: 'BeautyMaster/Section/InfluencerPanel',
  component: InfluencerPanel,
  tags: ['autodocs'],
  argTypes: {
    influencers: { control: false },
    stores: { control: false },
    months: { control: false },
    onSelect: { action: 'influencer selected' },
    selectedId: { control: 'text' },
    isLoading: { control: 'boolean' },
    error: { control: false },
    sx: { control: false },
  },
};

export const Default = {
  render: () => {
    const [selectedId, setSelectedId] = useState(null);
    return (
      <Box sx={{ height: 680, display: 'flex' }}>
        <InfluencerPanel
          influencers={MOCK}
          stores={STORES}
          months={MONTHS}
          onSelect={inf => setSelectedId(inf.id)}
          selectedId={selectedId}
        />
      </Box>
    );
  },
};

export const Loading = {
  render: () => (
    <Box sx={{ height: 680, display: 'flex' }}>
      <InfluencerPanel
        influencers={[]}
        stores={[]}
        months={[]}
        onSelect={() => {}}
        selectedId={null}
        isLoading
      />
    </Box>
  ),
};

export const Empty = {
  name: 'No results',
  render: () => (
    <Box sx={{ height: 680, display: 'flex' }}>
      <InfluencerPanel
        influencers={[]}
        stores={[]}
        months={[]}
        onSelect={() => {}}
        selectedId={null}
      />
    </Box>
  ),
};

export const WithError = {
  render: () => (
    <Box sx={{ height: 680, display: 'flex' }}>
      <InfluencerPanel
        influencers={[]}
        stores={[]}
        months={[]}
        onSelect={() => {}}
        selectedId={null}
        error={new Error('Failed to fetch CSV: 403 — Forbidden')}
        onRetry={() => {}}
      />
    </Box>
  ),
};
