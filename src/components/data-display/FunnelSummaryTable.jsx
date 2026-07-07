import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { STEPS_BASE, STEPS_WITH_RESPONDED } from '../../data/beautymaster/funnelSteps.js';

function pct(rate) { return `${Math.round(rate * 100)}%`; }

/**
 * FunnelSummaryTable component
 *
 * Table-form alternative to InfluencerFunnel — same stage list and data,
 * read as exact counts rather than bar widths. Shows a per-tier invited
 * breakdown caption under the Invited row when tier invite data exists.
 *
 * Props:
 * @param {{ invited, responded, agreement, attended, uploaded, creditSent, creditUsed }} funnel - from deriveAnalyticsSummary().funnel [Required]
 * @param {{ tier1, tier2 }} byTier - from deriveAnalyticsSummary().byTier, used for the Invited row's tier caption [Optional]
 *
 * Example usage:
 * <FunnelSummaryTable funnel={summary.funnel} byTier={summary.byTier} />
 */
function FunnelSummaryTable({ funnel = {}, byTier = {} }) {
  const steps = funnel.responded !== undefined ? STEPS_WITH_RESPONDED : STEPS_BASE;
  const base = funnel.invited || 1;

  const t1Invited = byTier.tier1?.invited;
  const t2Invited = byTier.tier2?.invited;
  const showTierCaption = t1Invited != null || t2Invited != null;

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Stage</TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Count</TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>% of Invited</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {steps.map(({ key, label }) => {
          const count = funnel[key] ?? 0;
          return (
            <TableRow key={key}>
              <TableCell sx={{ fontWeight: 500 }}>
                {label}
                {key === 'invited' && showTierCaption && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Tier 1: {t1Invited ?? '—'} · Tier 2: {t2Invited ?? '—'}
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{count}</TableCell>
              <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                {pct(count / base)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default FunnelSummaryTable;
