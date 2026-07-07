import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

function pct(rate) { return `${Math.round(rate * 100)}%`; }
function fmt(val) { return val == null ? '—' : val.toLocaleString('en-US'); }

const EMPTY_TIER = { count: 0, invited: null, attendRate: 0, uploadRate: 0, avgViews: null, opinionCounts: { use: 0, maybe: 0, dont: 0 } };

/**
 * TierComparison component
 *
 * Side-by-side Tier 1 vs Tier 2 performance comparison table.
 *
 * Props:
 * @param {{ tier1, tier2 }} byTier - from deriveAnalyticsSummary().byTier [Required]
 *
 * Example usage:
 * <TierComparison byTier={summary.byTier} />
 */
function TierComparison({ byTier = {} }) {
  const t1 = byTier.tier1 || EMPTY_TIER;
  const t2 = byTier.tier2 || EMPTY_TIER;

  const showRates   = t1.attendRate > 0 || t2.attendRate > 0;
  const showInvited = t1.invited != null || t2.invited != null;

  const allRows = [
    { label: 'Count',         t1: t1.count,                         t2: t2.count,                        show: true },
    { label: 'Invited',       t1: fmt(t1.invited),                  t2: fmt(t2.invited),                 show: showInvited },
    { label: 'Attend Rate',   t1: pct(t1.attendRate),               t2: pct(t2.attendRate),               show: showRates },
    { label: 'Upload Rate',   t1: pct(t1.uploadRate),               t2: pct(t2.uploadRate),               show: showRates },
    { label: 'Avg Views',     t1: fmt(t1.avgViews),                 t2: fmt(t2.avgViews),                 show: showRates },
    { label: 'USE',           t1: t1.opinionCounts?.use ?? 0,       t2: t2.opinionCounts?.use ?? 0,       show: showRates },
    { label: 'MAYBE',         t1: t1.opinionCounts?.maybe ?? 0,     t2: t2.opinionCounts?.maybe ?? 0,     show: showRates },
    { label: "DON'T",         t1: t1.opinionCounts?.dont ?? 0,      t2: t2.opinionCounts?.dont ?? 0,      show: showRates },
  ];

  const rows = allRows.filter(r => r.show);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 140 }} />
          <TableCell sx={{ fontWeight: 600, textAlign: 'center', width: '50%' }}>
            Tier 1
            <Typography component="div" variant="caption" color="text.secondary">$100 Credit</Typography>
          </TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'center', width: '50%' }}>
            Tier 2
            <Typography component="div" variant="caption" color="text.secondary">$20 Credit</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(({ label, t1: v1, t2: v2 }) => (
          <TableRow key={label}>
            <TableCell sx={{ color: 'text.secondary', fontSize: 13, width: 140, whiteSpace: 'nowrap' }}>{label}</TableCell>
            <TableCell sx={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{v1}</TableCell>
            <TableCell sx={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{v2}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TierComparison;
