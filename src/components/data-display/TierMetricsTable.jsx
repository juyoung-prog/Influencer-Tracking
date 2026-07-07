import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

function pct(rate) { return `${Math.round(rate * 100)}%`; }
function fmt(val) { return val == null ? '—' : val.toLocaleString('en-US'); }

const EMPTY_TIER = { count: 0, invited: null, agreementCount: 0, attendCount: 0, collaboSharedCount: 0, scheduledCount: 0 };

/**
 * Derive the row values (Invited, Agreement %, Visited %, Scheduled, Content %)
 * for a single tier stats object.
 */
function rowFor(tier) {
  const invited        = tier.invited ?? tier.count;
  const agreementRate  = invited > 0 ? tier.agreementCount / invited : 0;
  const visitedRate     = tier.agreementCount > 0 ? tier.attendCount / tier.agreementCount : 0;
  const contentRate     = tier.attendCount > 0 ? tier.collaboSharedCount / tier.attendCount : 0;
  return {
    invited:      tier.invited,
    agreementRate,
    agreementCount: tier.agreementCount,
    visitedRate,
    attendCount:  tier.attendCount,
    scheduledCount: tier.scheduledCount,
    contentRate,
    collaboSharedCount: tier.collaboSharedCount,
  };
}

/**
 * TierMetricsTable component
 *
 * Tier-as-rows summary table: Invited, Agreement %, Visited %, Scheduled, Content %
 * per tier, plus a Total row recomputed from the summed raw counts (not an
 * average of the per-tier percentages).
 *
 * Props:
 * @param {{ tier1, tier2 }} byTier - from deriveAnalyticsSummary().byTier [Required]
 *
 * Example usage:
 * <TierMetricsTable byTier={summary.byTier} />
 */
function TierMetricsTable({ byTier = {} }) {
  const t1 = byTier.tier1 || EMPTY_TIER;
  const t2 = byTier.tier2 || EMPTY_TIER;

  const total = {
    invited:            t1.invited != null || t2.invited != null ? (t1.invited ?? 0) + (t2.invited ?? 0) : null,
    count:              t1.count + t2.count,
    agreementCount:     t1.agreementCount + t2.agreementCount,
    attendCount:        t1.attendCount + t2.attendCount,
    collaboSharedCount: t1.collaboSharedCount + t2.collaboSharedCount,
    scheduledCount:      t1.scheduledCount + t2.scheduledCount,
  };

  const rows = [
    { label: 'Tier 1', ...rowFor(t1) },
    { label: 'Tier 2', ...rowFor(t2) },
    { label: 'Total',  ...rowFor(total), isTotal: true },
  ];

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }} />
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Invited</TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Agreement (%)</TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Visited (%)</TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Scheduled</TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Content (%)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(({ label, invited, agreementRate, agreementCount, visitedRate, attendCount, scheduledCount, contentRate, collaboSharedCount, isTotal }) => (
          <TableRow key={label}>
            <TableCell sx={{ fontWeight: isTotal ? 700 : 500 }}>{label}</TableCell>
            <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: isTotal ? 700 : 400 }}>
              {fmt(invited)}
            </TableCell>
            <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: isTotal ? 700 : 400 }}>
              {agreementCount} <Typography component="span" variant="caption" color="text.secondary">({pct(agreementRate)})</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: isTotal ? 700 : 400 }}>
              {attendCount} <Typography component="span" variant="caption" color="text.secondary">({pct(visitedRate)})</Typography>
            </TableCell>
            <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: isTotal ? 700 : 400 }}>
              {scheduledCount}
            </TableCell>
            <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: isTotal ? 700 : 400 }}>
              {collaboSharedCount} <Typography component="span" variant="caption" color="text.secondary">({pct(contentRate)})</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TierMetricsTable;
