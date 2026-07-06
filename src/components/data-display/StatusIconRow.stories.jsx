import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatusIconRow from './StatusIconRow';

export default {
  title: 'BeautyMaster/List/StatusIconRow',
  component: StatusIconRow,
  tags: ['autodocs'],
  argTypes: {
    agreement: { control: 'boolean', description: 'Agreement submitted' },
    attend: { control: 'boolean', description: 'Store visit complete' },
    collaboShared: { control: 'boolean', description: 'Content uploaded' },
    creditShared: { control: 'boolean', description: 'Credit sent' },
    size: {
      control: { type: 'number', min: 12, max: 32 },
      description: 'Icon size in px',
    },
  },
};

export const Default = {
  args: {
    agreement: true,
    attend: true,
    collaboShared: false,
    creditShared: false,
    size: 18,
  },
};

export const States = {
  render: () => (
    <Stack spacing={2}>
      {[
        { label: 'All complete', props: { agreement: true, attend: true, collaboShared: true, creditShared: true } },
        { label: 'Agreement only', props: { agreement: true } },
        { label: 'Agreement + Visit', props: { agreement: true, attend: true } },
        { label: 'Agreement + Visit + Upload', props: { agreement: true, attend: true, collaboShared: true } },
        { label: 'All incomplete', props: {} },
      ].map(({ label, props }) => (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="caption" sx={{ width: 200, color: 'text.secondary' }}>{label}</Typography>
          <StatusIconRow {...props} />
        </Box>
      ))}
    </Stack>
  ),
};

export const Sizes = {
  render: () => (
    <Stack spacing={2}>
      {[14, 18, 24].map(size => (
        <Box key={size} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="caption" sx={{ width: 40, color: 'text.secondary' }}>{size}px</Typography>
          <StatusIconRow agreement attend collaboShared size={size} />
        </Box>
      ))}
    </Stack>
  ),
};
