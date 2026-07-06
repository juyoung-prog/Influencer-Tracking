import Box from '@mui/material/Box';
import KpiBar from './KpiBar';

export default {
  title: 'BeautyMaster/Header/KpiBar',
  component: KpiBar,
  tags: ['autodocs'],
  argTypes: {
    kpi: {
      control: 'object',
      description: 'KPI summary { total, agreementCount, attendCount, collaboSharedCount, creditSharedCount, alertCount }',
    },
    sx: { control: false },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Story />
      </Box>
    ),
  ],
};

export const Default = {
  args: {
    kpi: {
      total: 12,
      agreementCount: 10,
      attendCount: 8,
      collaboSharedCount: 6,
      creditSharedCount: 5,
      alertCount: 0,
    },
  },
};

export const WithAlerts = {
  args: {
    kpi: {
      total: 12,
      agreementCount: 10,
      attendCount: 8,
      collaboSharedCount: 6,
      creditSharedCount: 5,
      alertCount: 3,
    },
  },
};

export const Empty = {
  args: {
    kpi: {
      total: 0,
      agreementCount: 0,
      attendCount: 0,
      collaboSharedCount: 0,
      creditSharedCount: 0,
      alertCount: 0,
    },
  },
};
