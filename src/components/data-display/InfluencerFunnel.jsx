import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { STEPS_BASE, STEPS_WITH_RESPONDED } from '../../data/beautymaster/funnelSteps.js';

/**
 * InfluencerFunnel component
 *
 * Horizontal funnel showing conversion from Invited → Credit Used.
 * Bar width = count / total (invited). Drop-off rate shown per step.
 * When funnel.responded is present (real "Number" tab invite data available),
 * an extra "Responded" step is shown between Invited and Agreement.
 *
 * Props:
 * @param {{ invited, responded, agreement, attended, uploaded, creditSent, creditUsed }} funnel - from deriveAnalyticsSummary().funnel [Required]
 *
 * Example usage:
 * <InfluencerFunnel funnel={summary.funnel} />
 */
function InfluencerFunnel({ funnel = {} }) {
  const base = funnel.invited || 1;
  const steps = funnel.responded !== undefined ? STEPS_WITH_RESPONDED : STEPS_BASE;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {steps.map(({ key, label, note, color }, idx) => {
        const count = funnel[key] ?? 0;
        const widthPct = Math.round((count / base) * 100);
        const prevKey = idx > 0 ? steps[idx - 1].key : null;
        const prevCount = prevKey ? (funnel[prevKey] ?? 0) : base;
        const convPct = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;

        const isPending = count === 0;

        return (
          <Box key={key} sx={{ opacity: isPending ? 0.35 : 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: isPending ? 400 : 600, minWidth: 100 }}>
                  {label}
                </Typography>
                {note && idx > 0 && (
                  <Typography variant="caption" color="text.disabled">
                    {convPct}% {note.replace('% of', 'of')}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: isPending ? 400 : 500 }}>
                {count}
                <Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
                  ({widthPct}%)
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ height: 8, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
              <Box sx={{
                height: '100%',
                width: `${widthPct}%`,
                backgroundColor: color,
                borderRadius: 1,
              }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default InfluencerFunnel;
