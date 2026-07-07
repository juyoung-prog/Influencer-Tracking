import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const OPINIONS = [
  { key: 'use',   label: 'USE',     color: 'success.main' },
  { key: 'maybe', label: 'MAYBE',   color: 'warning.main' },
  { key: 'dont',  label: "DON'T",   color: 'error.main' },
];

/**
 * OpinionBreakdown component
 *
 * Displays USE / MAYBE / DON'T distribution from evaluated influencers.
 * Shows count + percentage bar per opinion. Hidden when no opinions entered.
 *
 * Props:
 * @param {{ use: number, maybe: number, dont: number }} counts - from deriveAnalyticsSummary().opinionCounts [Required]
 *
 * Example usage:
 * <OpinionBreakdown counts={summary.opinionCounts} />
 */
function OpinionBreakdown({ counts = { use: 0, maybe: 0, dont: 0 } }) {
  const total = counts.use + counts.maybe + counts.dont;

  if (total === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="body2" color="text.disabled">
          No evaluations yet — add Opinion to the sheet to see breakdown.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {total} evaluated
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1.5 }}>
        {OPINIONS.map(({ key, label, color }) => {
          const count = counts[key];
          const pct = Math.round((count / total) * 100);
          return (
            <Box key={key}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color }}>{label}</Typography>
                <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                  {count} <Typography component="span" variant="caption" color="text.disabled">({pct}%)</Typography>
                </Typography>
              </Box>
              <Box sx={{ height: 6, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 1 }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default OpinionBreakdown;
