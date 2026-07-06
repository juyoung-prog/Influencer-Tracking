import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InfluencerCard from './InfluencerCard';

const TODAY = new Date('2026-07-01T10:30:00');

const mockBase = {
  id: 'Processing_0',
  sheetStatus: 'Processing',
  store: 'G10',
  month: 7,
  barcode: 'G10INF2026',
  tier: 'tier1',
  platform: 'Instagram',
  category: 'kbeauty',
  creditType: '$100 Credit',
  imageUrl: '',
  fullName: 'Kim Minjung',
  socialAccountUrl: '',
  email: '',
  scheduledTime: TODAY,
  agreement: false,
  attend: false,
  collaboShared: false,
  creditShared: false,
  creditUsed: false,
  serialNumber: '',
  opinion: null,
  views: null,
  likes: null,
  shares: null,
  saves: null,
  comments: null,
  reposts: null,
  note: '',
  alertFlags: [],
  scheduleGroup: 'today',
  collaboLink: '',
  uploadDate: null,
};

export default {
  title: 'BeautyMaster/List/InfluencerCard',
  component: InfluencerCard,
  tags: ['autodocs'],
  argTypes: {
    influencer: { control: 'object', description: 'Influencer data object' },
    isSelected: { control: 'boolean', description: 'Highlights the card open in the Drawer' },
    onClick: { action: 'card clicked', description: 'Card click handler' },
    sx: { control: false },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 280 }}>
        <Story />
      </Box>
    ),
  ],
};

export const Default = {
  args: {
    influencer: { ...mockBase, agreement: true, attend: true },
    isSelected: false,
  },
};

export const Selected = {
  args: {
    influencer: { ...mockBase, agreement: true, attend: true },
    isSelected: true,
  },
};

export const WithAlerts = {
  args: {
    influencer: {
      ...mockBase,
      agreement: true,
      attend: true,
      collaboShared: false,
      alertFlags: ['attend-no-collabo'],
    },
    isSelected: false,
  },
};

export const AllComplete = {
  args: {
    influencer: {
      ...mockBase,
      agreement: true,
      attend: true,
      collaboShared: true,
      creditShared: true,
      alertFlags: [],
    },
    isSelected: false,
  },
};

export const CardGrid = {
  name: 'Card Grid (3 columns)',
  render: () => {
    const cards = [
      { ...mockBase, id: '0', fullName: 'Kim Minjung', agreement: true, attend: true, alertFlags: ['attend-no-collabo'] },
      { ...mockBase, id: '1', fullName: 'Park Soyeon', agreement: true, attend: true, collaboShared: true, creditShared: true, alertFlags: [] },
      { ...mockBase, id: '2', fullName: 'Lee Jiyeon', tier: 'tier2', barcode: 'G10INF202620', platform: 'TikTok', agreement: true, attend: false, alertFlags: ['agreement-no-attend'] },
      { ...mockBase, id: '3', fullName: 'Choi Yuna', agreement: true, attend: true, collaboShared: true, creditShared: false, alertFlags: ['collabo-no-credit'] },
      { ...mockBase, id: '4', fullName: 'Jung Hana', scheduledTime: null, scheduleGroup: 'no-time', alertFlags: [] },
      { ...mockBase, id: '5', fullName: 'Oh Seulgi', agreement: true, attend: true, collaboShared: true, creditShared: true, creditUsed: true, alertFlags: [] },
    ];
    return (
      <Grid container spacing={2}>
        {cards.map(inf => (
          <Grid key={inf.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <InfluencerCard influencer={inf} onClick={() => {}} />
          </Grid>
        ))}
      </Grid>
    );
  },
};
