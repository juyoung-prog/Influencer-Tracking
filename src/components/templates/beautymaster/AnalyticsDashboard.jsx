import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CampaignSummaryGrid from '../../data-display/CampaignSummaryGrid';
import TopInfluencersTable from '../../data-display/TopInfluencersTable';
import OpinionBreakdown from '../../data-display/OpinionBreakdown';
import PlatformBreakdown from '../../data-display/PlatformBreakdown';
import StoreBreakdown from '../../data-display/StoreBreakdown';
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

/**
 * AnalyticsDashboard component
 *
 * Campaign analytics report view with store selector.
 * Derives summary internally from the filtered influencer list.
 *
 * Props:
 * @param {Influencer[]} influencers - Full influencer list [Required]
 * @param {string[]} stores - Available store options [Optional, default: []]
 *
 * Example usage:
 * <AnalyticsDashboard influencers={influencers} stores={stores} />
 */
function AnalyticsDashboard({ influencers = [], stores = [] }) {
  const [selectedStore, setSelectedStore] = useState('all');

  const filtered = useMemo(() => (
    selectedStore === 'all' ? influencers : influencers.filter(i => i.store === selectedStore)
  ), [influencers, selectedStore]);

  const summary = useMemo(() => deriveAnalyticsSummary(filtered), [filtered]);

  const hasStores = Object.keys(summary.byStore).length > 1;

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>

      {/* Store selector */}
      {stores.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            label="All Stores"
            size="small"
            onClick={() => setSelectedStore('all')}
            color={selectedStore === 'all' ? 'primary' : 'default'}
            variant={selectedStore === 'all' ? 'filled' : 'outlined'}
            sx={{ borderRadius: 0, height: 28, fontSize: 12 }}
          />
          {stores.map(s => (
            <Chip
              key={s}
              label={s}
              size="small"
              onClick={() => setSelectedStore(s)}
              color={selectedStore === s ? 'primary' : 'default'}
              variant={selectedStore === s ? 'filled' : 'outlined'}
              sx={{ borderRadius: 0, height: 28, fontSize: 12 }}
            />
          ))}
        </Box>
      )}

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
