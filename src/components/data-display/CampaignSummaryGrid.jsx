import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

function pct(rate) {
  return `${Math.round(rate * 100)}%`;
}

function StatCard({ label, value, sub, accent = false }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        // Explicit px string bypasses the theme's shape.borderRadius:0 multiplier —
        // matches AnalyticsDashboard's SectionCard radius so every card on the
        // Analytics tab reads consistently.
        borderRadius: '6px',
        p: 2.5,
        height: '100%',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 11 }}>
        {label}
      </Typography>
      <Typography
        variant="h3"
        sx={{ fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: accent ? 'primary.main' : 'text.primary' }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

function RateCard({ label, rate, sub }) {
  const pctValue = Math.round(rate * 100);
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        // Explicit px string bypasses the theme's shape.borderRadius:0 multiplier —
        // matches AnalyticsDashboard's SectionCard radius so every card on the
        // Analytics tab reads consistently.
        borderRadius: '6px',
        p: 2.5,
        height: '100%',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {pct(rate)}
      </Typography>
      {/* Progress bar */}
      <Box sx={{ mt: 1.5, height: 3, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pctValue}%`, backgroundColor: pctValue >= 80 ? 'success.main' : pctValue >= 50 ? 'primary.main' : 'warning.main', borderRadius: 1 }} />
      </Box>
      {sub && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

/**
 * CampaignSummaryGrid component
 *
 * 4-card KPI grid for the Analytics view.
 * Shows Total + Tier breakdown, Attendance Rate, Upload Rate, Credit Used Rate.
 *
 * Props:
 * @param {AnalyticsSummary} summary - Output of deriveAnalyticsSummary() [Required]
 *
 * Example usage:
 * <CampaignSummaryGrid summary={analyticsSummary} />
 */
function CampaignSummaryGrid({ summary }) {
  // funnel.responded only exists when real "Number" tab invite data is available —
  // in that case `total` is a tracked subset of a larger invited pool, and the
  // label/sub-text should say so instead of reading as two unrelated "totals".
  const hasInviteData = summary.funnel?.responded !== undefined;
  const invited = summary.funnel?.invited;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard
          label={hasInviteData ? 'Tracked Influencers' : 'Total Influencers'}
          value={summary.total}
          sub={hasInviteData
            ? `of ${invited.toLocaleString('en-US')} invited · Tier 1: ${summary.tier1Count} · Tier 2: ${summary.tier2Count}`
            : `Tier 1: ${summary.tier1Count} · Tier 2: ${summary.tier2Count}`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <RateCard
          label="Attendance Rate"
          rate={summary.attendRate}
          sub={`${Math.round(summary.attendRate * summary.total)} of ${summary.total} attended`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <RateCard
          label="Upload Rate"
          rate={summary.uploadRate}
          sub="of attendees who posted content"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <RateCard
          label="Credit Used Rate"
          rate={summary.creditUsedRate}
          sub="of sent credits used by influencer"
        />
      </Grid>
    </Grid>
  );
}

export default CampaignSummaryGrid;
