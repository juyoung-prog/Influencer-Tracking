import FunnelSummaryTable from './FunnelSummaryTable';

export default {
  title: 'BeautyMaster/Analytics/FunnelSummaryTable',
  component: FunnelSummaryTable,
  tags: ['autodocs'],
  argTypes: {
    funnel: {
      control: 'object',
      description: 'from deriveAnalyticsSummary().funnel — { invited, responded, agreement, attended, uploaded, creditSent, creditUsed }',
    },
    byTier: {
      control: 'object',
      description: 'from deriveAnalyticsSummary().byTier — used for the Invited row tier caption',
    },
  },
};

export const WithInviteData = {
  name: 'With invite data (Responded step + tier caption)',
  args: {
    funnel: {
      invited: 268,
      responded: 147,
      agreement: 143,
      attended: 84,
      uploaded: 69,
      creditSent: 70,
      creditUsed: 0,
    },
    byTier: {
      tier1: { invited: 101 },
      tier2: { invited: 167 },
    },
  },
};

export const NoInviteData = {
  name: 'No invite data (falls back to row count)',
  args: {
    funnel: {
      invited: 147,
      agreement: 143,
      attended: 84,
      uploaded: 69,
      creditSent: 70,
      creditUsed: 0,
    },
    byTier: {
      tier1: { invited: null },
      tier2: { invited: null },
    },
  },
};
