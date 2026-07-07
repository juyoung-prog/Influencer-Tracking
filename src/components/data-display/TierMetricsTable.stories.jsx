import TierMetricsTable from './TierMetricsTable';

export default {
  title: 'BeautyMaster/Analytics/TierMetricsTable',
  component: TierMetricsTable,
  tags: ['autodocs'],
  argTypes: {
    byTier: {
      control: 'object',
      description: 'from deriveAnalyticsSummary().byTier — { tier1, tier2 }, each with invited/agreementCount/attendCount/collaboSharedCount/scheduledCount/count',
    },
  },
};

export const Default = {
  args: {
    byTier: {
      tier1: { invited: 101, count: 87, agreementCount: 40, attendCount: 29, collaboSharedCount: 24, scheduledCount: 0 },
      tier2: { invited: 167, count: 60, agreementCount: 32, attendCount: 17, collaboSharedCount: 10, scheduledCount: 7 },
    },
  },
};

export const NoInviteData = {
  name: 'No invite data (Invited column falls back to —)',
  args: {
    byTier: {
      tier1: { invited: null, count: 87, agreementCount: 40, attendCount: 29, collaboSharedCount: 24, scheduledCount: 0 },
      tier2: { invited: null, count: 60, agreementCount: 32, attendCount: 17, collaboSharedCount: 10, scheduledCount: 7 },
    },
  },
};
