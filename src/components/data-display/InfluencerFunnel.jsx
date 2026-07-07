import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const STEPS = [
  { key: 'invited',    label: 'Invited',     note: null },
  { key: 'agreement',  label: 'Agreement',   note: '% of invited' },
  { key: 'attended',   label: 'Visited',     note: '% of agreement' },
  { key: 'uploaded',   label: 'Uploaded',    note: '% of visited' },
  { key: 'creditSent', label: 'Credit Sent', note: '% of uploaded' },
  { key: 'creditUsed', label: 'Credit Used', note: '% of sent' },
];

const STEP_COLORS = ['primary.main', 'primary.main', 'info.main', 'info.main', 'success.main', 'success.main'];

/**
 * InfluencerFunnel component
 *
 * Horizontal funnel showing conversion from Invited → Credit Used.
 * Bar width = count / total (invited). Drop-off rate shown per step.
 *
 * Props:
 * @param {{ invited, agreement, attended, uploaded, creditSent, creditUsed }} funnel - from deriveAnalyticsSummary().funnel [Required]
 *
 * Example usage:
 * <InfluencerFunnel funnel={summary.funnel} />
 */
function InfluencerFunnel({ funnel = {} }) {
  const base = funnel.invited || 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {STEPS.map(({ key, label, note }, idx) => {
        const count = funnel[key] ?? 0;
        const widthPct = Math.round((count / base) * 100);
        const prevKey = idx > 0 ? STEPS[idx - 1].key : null;
        const prevCount = prevKey ? (funnel[prevKey] ?? 0) : base;
        const convPct = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;

        return (
          <Box key={key}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100 }}>{label}</Typography>
                {note && idx > 0 && (
                  <Typography variant="caption" color="text.disabled">
                    {convPct}% {note.replace('% of', 'of')}
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
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
                backgroundColor: STEP_COLORS[idx],
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
