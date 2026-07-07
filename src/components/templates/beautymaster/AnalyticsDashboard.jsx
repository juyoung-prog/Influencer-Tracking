import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CampaignSummaryGrid from '../../data-display/CampaignSummaryGrid';
import TopInfluencersTable from '../../data-display/TopInfluencersTable';
import OpinionBreakdown from '../../data-display/OpinionBreakdown';
import PlatformBreakdown from '../../data-display/PlatformBreakdown';
import StoreBreakdown from '../../data-display/StoreBreakdown';
import InfluencerFunnel from '../../data-display/InfluencerFunnel';
import CategoryBreakdown from '../../data-display/CategoryBreakdown';
import FunnelSummaryTable from '../../data-display/FunnelSummaryTable';
import TierMetricsTable from '../../data-display/TierMetricsTable';
import { deriveAnalyticsSummary } from '../../../data/beautymaster/schema.js';

function SectionHeader({ title, id, action }) {
  return (
    <Box id={id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: 'block', letterSpacing: 1 }}
      >
        {title}
      </Typography>
      {action}
    </Box>
  );
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getCampaignStatus(summary) {
  if (summary.total === 0) return null;
  const attended  = summary.funnel?.attended  ?? 0;
  const agreement = summary.funnel?.agreement ?? 0;
  const total     = summary.total;

  // Invited/responded context lives on the Tracked Influencers stat card —
  // repeating it here too was redundant and made this line a run-on sentence.
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
 * @param {Object} inviteCounts - Invited-per-store/tier/category counts from the "Number" tab, from parseInviteCountsCsv() [Optional, default: {}]
 * @param {string} selectedStore - Active store filter ('all' or store name) [Optional, default: 'all']
 *
 * Example usage:
 * <AnalyticsDashboard influencers={influencers} inviteCounts={inviteCounts} selectedStore="G10" />
 */
function AnalyticsDashboard({ influencers = [], inviteCounts = {}, selectedStore = 'all' }) {
  const filtered = useMemo(() => (
    selectedStore === 'all' ? influencers : influencers.filter(i => i.store === selectedStore)
  ), [influencers, selectedStore]);

  const filteredInviteCounts = useMemo(() => {
    if (selectedStore === 'all') return inviteCounts;
    return inviteCounts[selectedStore] ? { [selectedStore]: inviteCounts[selectedStore] } : {};
  }, [inviteCounts, selectedStore]);

  const summary = useMemo(() => deriveAnalyticsSummary(filtered, filteredInviteCounts), [filtered, filteredInviteCounts]);

  const hasStores        = Object.keys(summary.byStore).length > 1;
  const hasPerformance   = summary.topByViews.length > 0;
  const hasOpinions      = summary.opinionCounts.use + summary.opinionCounts.maybe + summary.opinionCounts.dont > 0;
  const campaignStatus   = getCampaignStatus(summary);

  const [funnelView, setFunnelView] = useState('bar');

  const jumpLinks = [
    { id: 'analytics-summary', label: 'Summary' },
    { id: 'analytics-funnel', label: 'Funnel' },
    (hasPerformance || hasOpinions) && { id: 'analytics-performance', label: 'Performance' },
    { id: 'analytics-breakdown', label: 'Breakdown' },
    { id: 'analytics-tier', label: 'Tier & Store' },
  ].filter(Boolean);

  return (
    <>
      {/* Sticky context bar — keeps the active store filter and section nav visible while scrolling */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: 3,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {selectedStore !== 'all' && (
          <Chip size="small" label={`Store: ${selectedStore}`} sx={{ fontWeight: 600 }} />
        )}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', ml: selectedStore !== 'all' ? 0 : 'auto' }}>
          {jumpLinks.map(({ id, label }) => (
            <Link
              key={id}
              component="button"
              variant="caption"
              underline="hover"
              color="text.secondary"
              onClick={() => scrollToSection(id)}
            >
              {label}
            </Link>
          ))}
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>

        {/* ① Campaign Summary */}
        <SectionHeader title="Campaign Summary" id="analytics-summary" />
        {campaignStatus && (
          <Typography variant="body2" sx={{ mb: 2, mt: -1, color: campaignStatus.color }}>
            {campaignStatus.text}
          </Typography>
        )}
        <CampaignSummaryGrid summary={summary} />

        <Divider sx={{ my: 4 }} />

        {/* ② Conversion Funnel — bar chart or table, same underlying data */}
        <SectionHeader
          title="Conversion Funnel"
          id="analytics-funnel"
          action={
            <ToggleButtonGroup
              size="small"
              value={funnelView}
              exclusive
              onChange={(e, val) => val && setFunnelView(val)}
            >
              <ToggleButton value="bar" sx={{ px: 1.5, py: 0.25, fontSize: 12 }}>Bars</ToggleButton>
              <ToggleButton value="table" sx={{ px: 1.5, py: 0.25, fontSize: 12 }}>Table</ToggleButton>
            </ToggleButtonGroup>
          }
        />
        <Box sx={{ maxWidth: funnelView === 'bar' ? 600 : 'none' }}>
          {funnelView === 'bar'
            ? <InfluencerFunnel funnel={summary.funnel} />
            : <FunnelSummaryTable funnel={summary.funnel} byTier={summary.byTier} />}
        </Box>

        {(hasPerformance || hasOpinions) && (
          <>
            <Divider sx={{ my: 4 }} />

            {/* ③ Top Influencers + Opinion */}
            <Box id="analytics-performance">
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
            </Box>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* ④ Platform + Category */}
        <Box id="analytics-breakdown">
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
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* ⑤ Tier Metrics + Store — single tier table (replaces the old column-form
            Tier Comparison, which duplicated these same numbers in a second layout) */}
        <Box id="analytics-tier">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: hasStores ? 6 : 12 }}>
              <SectionHeader title="Tier Metrics" />
              <TierMetricsTable byTier={summary.byTier} />
            </Grid>
            {hasStores && (
              <Grid size={{ xs: 12, md: 6 }}>
                <SectionHeader title="Store Breakdown" />
                <StoreBreakdown byStore={summary.byStore} />
              </Grid>
            )}
          </Grid>
        </Box>

      </Box>
    </>
  );
}

export default AnalyticsDashboard;
