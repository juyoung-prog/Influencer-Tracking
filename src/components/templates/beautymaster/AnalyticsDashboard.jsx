import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CampaignSummaryGrid from '../../data-display/CampaignSummaryGrid';
import TopInfluencersTable from '../../data-display/TopInfluencersTable';
import OpinionBreakdown from '../../data-display/OpinionBreakdown';
import PlatformBreakdown from '../../data-display/PlatformBreakdown';
import StoreBreakdown from '../../data-display/StoreBreakdown';

function SectionHeader({ title }) {
  return (
    <Typography
      variant="overline"
      color="text.secondary"
      sx={{ display: 'block', mb: 2, letterSpacing: 1 }}
    >
      {title}
    </Typography>
  );
}

/**
 * AnalyticsDashboard component
 *
 * Campaign analytics report view. Assembles 5 analytics components
 * from a single deriveAnalyticsSummary() result.
 *
 * Props:
 * @param {AnalyticsSummary} summary - Output of deriveAnalyticsSummary() [Required]
 *
 * Example usage:
 * <AnalyticsDashboard summary={analyticsSummary} />
 */
function AnalyticsDashboard({ summary }) {
  const hasStores = Object.keys(summary.byStore).length > 1;

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>

      {/* ① Campaign Summary */}
      <SectionHeader title="Campaign Summary" />
      <CampaignSummaryGrid summary={summary} />

      <Divider sx={{ my: 4 }} />

      {/* ② Performance */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionHeader title="Top Influencers by Views" />
          <TopInfluencersTable influencers={summary.topByViews} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionHeader title="Opinion Breakdown" />
          <OpinionBreakdown counts={summary.opinionCounts} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ③ Platform + Store Breakdown */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: hasStores ? 6 : 12 }}>
          <SectionHeader title="Platform Breakdown" />
          <PlatformBreakdown byPlatform={summary.byPlatform} />
        </Grid>
        {hasStores && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeader title="Store Breakdown" />
            <StoreBreakdown byStore={summary.byStore} />
          </Grid>
        )}
      </Grid>

    </Box>
  );
}

export default AnalyticsDashboard;
