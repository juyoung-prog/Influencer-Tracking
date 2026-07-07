import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

function pct(rate) { return `${Math.round(rate * 100)}%`; }
function fmt(val) { return val == null ? '—' : val.toLocaleString('en-US'); }

const EMPTY_TIER = { count: 0, attendRate: 0, uploadRate: 0, avgViews: null, opinionCounts: { use: 0, maybe: 0, dont: 0 } };

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

  const rows = [
    { label: 'Count',         t1: t1.count,                         t2: t2.count },
    { label: 'Attend Rate',   t1: pct(t1.attendRate),               t2: pct(t2.attendRate) },
    { label: 'Upload Rate',   t1: pct(t1.uploadRate),               t2: pct(t2.uploadRate) },
    { label: 'Avg Views',     t1: fmt(t1.avgViews),                 t2: fmt(t2.avgViews) },
    { label: 'USE',           t1: t1.opinionCounts?.use ?? 0,       t2: t2.opinionCounts?.use ?? 0 },
    { label: 'MAYBE',         t1: t1.opinionCounts?.maybe ?? 0,     t2: t2.opinionCounts?.maybe ?? 0 },
    { label: "DON'T",         t1: t1.opinionCounts?.dont ?? 0,      t2: t2.opinionCounts?.dont ?? 0 },
  ];

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
            Tier 1
            <Typography component="div" variant="caption" color="text.secondary">$100 Credit</Typography>
          </TableCell>
          <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
            Tier 2
            <Typography component="div" variant="caption" color="text.secondary">$20 Credit</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(({ label, t1: v1, t2: v2 }) => (
          <TableRow key={label}>
            <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{label}</TableCell>
            <TableCell sx={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{v1}</TableCell>
            <TableCell sx={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{v2}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TierComparison;
