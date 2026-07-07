import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CampaignSummaryGrid from '../../data-display/CampaignSummaryGrid';
import TopInfluencersTable from '../../data-display/TopInfluencersTable';
import OpinionBreakdown from '../../data-display/OpinionBreakdown';
import PlatformBreakdown from '../../data-display/PlatformBreakdown';
import StoreBreakdown from '../../data-display/StoreBreakdown';
import InfluencerFunnel from '../../data-display/InfluencerFunnel';
import TierComparison from '../../data-display/TierComparison';
import CategoryBreakdown from '../../data-display/CategoryBreakdown';
import MonthlyTrend from '../../data-display/MonthlyTrend';
import { deriveAnalyticsSummary } from '../../../data/beautymaster/schema.js';

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

function getCampaignStatus(summary) {
  if (summary.total === 0) return null;
  const attended  = summary.funnel?.attended  ?? 0;
  const agreement = summary.funnel?.agreement ?? 0;
  const total     = summary.total;

  if (attended === 0 && agreement === 0)
    return { text: 'Not started — no agreements logged yet', color: 'text.disabled' };
  if (attended === 0)
    return { text: `In progress · ${agreement} of ${total} agreed, visits pending`, color: 'info.main' };
  if (attended < total)
    return { text: `In progress · ${attended} of ${total} visited`, color: 'info.main' };
  return { text: `All ${total} influencers visited`, color: 'success.main' };
}

/**
 * AnalyticsDashboard component
 *
 * Campaign analytics report view. Store filtering is controlled by the parent.
 *
 * Props:
 * @param {Influencer[]} influencers - Full influencer list [Required]
 * @param {string} selectedStore - Active store filter ('all' or store name) [Optional, default: 'all']
 *
 * Example usage:
 * <AnalyticsDashboard influencers={influencers} selectedStore="G10" />
 */
function AnalyticsDashboard({ influencers = [], selectedStore = 'all' }) {
  const filtered = useMemo(() => (
    selectedStore === 'all' ? influencers : influencers.filter(i => i.store === selectedStore)
  ), [influencers, selectedStore]);

  const summary = useMemo(() => deriveAnalyticsSummary(filtered), [filtered]);

  const hasStores        = Object.keys(summary.byStore).length > 1;
  const hasMultiMonth    = Object.keys(summary.byMonth).length > 1;
  const hasPerformance   = summary.topByViews.length > 0;
  const hasOpinions      = summary.opinionCounts.use + summary.opinionCounts.maybe + summary.opinionCounts.dont > 0;
  const campaignStatus   = getCampaignStatus(summary);

  return (
    <Box sx={{ p: 3 }}>

      {/* ① Campaign Summary */}
      <SectionHeader title="Campaign Summary" />
      {campaignStatus && (
        <Typography variant="body2" sx={{ mb: 2, mt: -1, color: campaignStatus.color }}>
          {campaignStatus.text}
        </Typography>
      )}
      <CampaignSummaryGrid summary={summary} />

      <Divider sx={{ my: 4 }} />

      {/* ② Conversion Funnel */}
      <SectionHeader title="Conversion Funnel" />
      <Box sx={{ maxWidth: 600 }}>
        <InfluencerFunnel funnel={summary.funnel} />
      </Box>

      {(hasPerformance || hasOpinions) && (
        <>
          <Divider sx={{ my: 4 }} />

          {/* ③ Top Influencers + Opinion */}
          <Grid container spacing={3}>
            {hasPerformance && (
              <Grid size={{ xs: 12, md: hasOpinions ? 8 : 12 }}>
                <SectionHeader title="Top Influencers by Views" />
                <TopInfluencersTable influencers={summary.topByViews} />
              </Grid>
            )}
            {hasOpinions && (
              <Grid size={{ xs: 12, md: hasPerformance ? 4 : 12 }}>
                <SectionHeader title="Opinion Breakdown" />
                <OpinionBreakdown counts={summary.opinionCounts} />
              </Grid>
            )}
          </Grid>
        </>
      )}

      <Divider sx={{ my: 4 }} />

      {/* ④ Platform + Category */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionHeader title="Platform Breakdown" />
          <PlatformBreakdown byPlatform={summary.byPlatform} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionHeader title="Category Breakdown" />
          <CategoryBreakdown byCategory={summary.byCategory} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* ⑤ Tier Comparison + Store */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: hasStores ? 6 : 12 }}>
          <SectionHeader title="Tier Comparison" />
          <TierComparison byTier={summary.byTier} />
        </Grid>
        {hasStores && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeader title="Store Breakdown" />
            <StoreBreakdown byStore={summary.byStore} />
          </Grid>
        )}
      </Grid>

      {/* ⑥ Monthly Trend (멀티 월 데이터 있을 때만) */}
      {hasMultiMonth && (
        <>
          <Divider sx={{ my: 4 }} />
          <SectionHeader title="Monthly Trend" />
          <Box sx={{ maxWidth: 600 }}>
            <MonthlyTrend byMonth={summary.byMonth} />
          </Box>
        </>
      )}

    </Box>
  );
}

export default AnalyticsDashboard;
