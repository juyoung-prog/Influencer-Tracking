import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InfluencerDrawer from './InfluencerDrawer';
import { DEFAULT_MESSAGE_TEMPLATES } from '../../data/beautymaster/messageTemplates.js';

const fullInfluencer = {
  id: 'Processing_0',
  sheetStatus: 'Processing',
  fullName: 'Kim Minjung',
  imageUrl: '',
  platform: 'Instagram',
  tier: 'tier1',
  store: 'G10',
  month: 7,
  barcode: 'G10INF2026',
  category: 'kbeauty',
  creditType: '$100 Credit',
  socialAccountUrl: 'https://instagram.com/example',
  email: 'kim@example.com',
  scheduledTime: new Date('2026-07-01T10:30:00'),
  agreement: true,
  attend: true,
  collaboShared: true,
  creditShared: true,
  creditUsed: false,
  serialNumber: 'G10CRED001234',
  collaboLink: 'https://instagram.com/p/example',
  uploadDate: new Date('2026-07-03'),
  opinion: 'USE',
  views: 12450,
  likes: 3201,
  shares: 142,
  saves: 891,
  comments: 234,
  reposts: 45,
  note: 'Visit complete. Content quality looks great.\nPlease confirm upload link.',
  alertFlags: [],
  scheduleGroup: 'today',
};

const minimalInfluencer = {
  ...fullInfluencer,
  id: 'Processing_1',
  fullName: 'Park Soyeon',
  collaboShared: false,
  creditShared: false,
  creditUsed: false,
  serialNumber: '',
  collaboLink: '',
  uploadDate: null,
  opinion: null,
  views: null,
  likes: null,
  shares: null,
  saves: null,
  comments: null,
  reposts: null,
  note: '',
  socialAccountUrl: '',
  alertFlags: ['attend-no-collabo'],
};

export default {
  title: 'BeautyMaster/Overlay/InfluencerDrawer',
  component: InfluencerDrawer,
  tags: ['autodocs'],
  argTypes: {
    influencer: { control: 'object', description: 'Influencer data (null empties the Drawer)' },
    open: { control: 'boolean', description: 'Whether the Drawer is open' },
    onClose: { action: 'drawer closed', description: 'Close handler' },
    templates: { control: 'object', description: 'Outreach message templates for MessageTemplateMenu' },
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Open Drawer (with performance data)
        </Button>
        <InfluencerDrawer influencer={fullInfluencer} open={open} onClose={() => setOpen(false)} templates={DEFAULT_MESSAGE_TEMPLATES} />
      </Box>
    );
  },
};

export const Minimal = {
  name: 'No performance data',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Open Drawer (no metrics)
        </Button>
        <InfluencerDrawer influencer={minimalInfluencer} open={open} onClose={() => setOpen(false)} templates={DEFAULT_MESSAGE_TEMPLATES} />
      </Box>
    );
  },
};
