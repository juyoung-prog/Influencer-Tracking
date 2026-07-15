import Box from '@mui/material/Box';
import MessageTemplateMenu from './MessageTemplateMenu';
import { DEFAULT_MESSAGE_TEMPLATES } from '../../data/beautymaster/messageTemplates.js';

const baseInfluencer = {
  fullName: 'Kim Minjung',
  store: 'G10',
  email: 'kim.minjung@gmail.com',
  scheduledTime: new Date('2026-07-16T10:30:00'),
  requestedDate: new Date('2026-07-20T14:00:00'),
  month: 7,
  tier: 'tier1',
  platform: 'Instagram',
  category: 'kbeauty',
  alertFlags: [],
};

export default {
  title: 'BeautyMaster/Overlay/MessageTemplateMenu',
  component: MessageTemplateMenu,
  tags: ['autodocs'],
  argTypes: {
    influencer: { control: 'object', description: 'Influencer used to fill template placeholders' },
    templates: { control: 'object', description: 'Available message templates' },
  },
};

export const Default = {
  name: 'Active alert (Suggested section)',
  args: {
    influencer: { ...baseInfluencer, attend: true, collaboShared: false, alertFlags: ['attend-no-collabo'] },
    templates: DEFAULT_MESSAGE_TEMPLATES,
  },
  render: (args) => (
    <Box sx={{ p: 4 }}>
      <MessageTemplateMenu {...args} />
    </Box>
  ),
};

export const NoActiveAlerts = {
  name: 'No active alerts (manual list only)',
  args: {
    influencer: { ...baseInfluencer, alertFlags: [] },
    templates: DEFAULT_MESSAGE_TEMPLATES,
  },
  render: (args) => (
    <Box sx={{ p: 4 }}>
      <MessageTemplateMenu {...args} />
    </Box>
  ),
};
