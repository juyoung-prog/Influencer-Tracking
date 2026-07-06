import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ScheduleTimeline from './ScheduleTimeline';

const D = iso => new Date(iso);

const mockInfluencers = [
  { id: 'p0', fullName: 'Kim Minjung', scheduledTime: D('2026-07-01T10:30:00'), scheduleGroup: 'today', agreement: true, attend: true, collaboShared: false, creditShared: false, alertFlags: ['attend-no-collabo'] },
  { id: 'p1', fullName: 'Park Soyeon', scheduledTime: D('2026-07-01T14:00:00'), scheduleGroup: 'today', agreement: true, attend: true, collaboShared: true, creditShared: true, alertFlags: [] },
  { id: 'p2', fullName: 'Lee Jiyeon', scheduledTime: D('2026-07-03T11:00:00'), scheduleGroup: 'upcoming', agreement: true, attend: false, collaboShared: false, creditShared: false, alertFlags: [] },
  { id: 'p3', fullName: 'Choi Yuna', scheduledTime: D('2026-07-05T15:00:00'), scheduleGroup: 'upcoming', agreement: true, attend: false, collaboShared: false, creditShared: false, alertFlags: [] },
  { id: 'p4', fullName: 'Jung Hana', scheduledTime: D('2026-06-28T10:00:00'), scheduleGroup: 'past', agreement: true, attend: true, collaboShared: true, creditShared: false, alertFlags: ['collabo-no-credit'] },
  { id: 'p5', fullName: 'Oh Seulgi', scheduledTime: null, scheduleGroup: 'no-time', agreement: true, attend: false, collaboShared: false, creditShared: false, alertFlags: [] },
];

export default {
  title: 'BeautyMaster/Schedule/ScheduleTimeline',
  component: ScheduleTimeline,
  tags: ['autodocs'],
  argTypes: {
    influencers: { control: 'object', description: 'Influencer array (sorted internally by group)' },
    selectedId: { control: 'text', description: 'Selected influencer id' },
    onSelect: { action: 'row selected', description: 'Row click handler (influencer) => void' },
    sx: { control: false },
  },
  decorators: [
    Story => (
      <Box sx={{ width: 264, border: '1px solid', borderColor: 'divider' }}>
        <Story />
      </Box>
    ),
  ],
};

export const Default = {
  render: () => {
    const [selectedId, setSelectedId] = useState(null);
    return (
      <Box sx={{ width: 264, border: '1px solid', borderColor: 'divider' }}>
        <ScheduleTimeline
          influencers={mockInfluencers}
          onSelect={inf => setSelectedId(inf.id)}
          selectedId={selectedId}
        />
        {selectedId && (
          <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">Selected: {selectedId}</Typography>
          </Box>
        )}
      </Box>
    );
  },
};

export const TodayOnly = {
  args: {
    influencers: mockInfluencers.filter(i => i.scheduleGroup === 'today'),
    selectedId: null,
  },
};

export const Empty = {
  name: 'Empty state',
  args: {
    influencers: [],
    selectedId: null,
  },
};
