import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

function pct(rate) {
  return `${Math.round(rate * 100)}%`;
}

function fmt(val) {
  if (val == null) return '—';
  return val.toLocaleString('en-US');
}

/**
 * StoreBreakdown component
 *
 * Comparison table of performance metrics grouped by store.
 *
 * Props:
 * @param {Object} byStore - from deriveAnalyticsSummary().byStore [Required]
 *
 * Example usage:
 * <StoreBreakdown byStore={summary.byStore} />
 */
function StoreBreakdown({ byStore = {} }) {
  const stores = Object.keys(byStore).sort();

  if (stores.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ py: 3 }}>
        No data available.
      </Typography>
    );
  }

  const showRates   = stores.some(s => byStore[s].attendRate > 0);
  const showInvited = stores.some(s => byStore[s].invited != null);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Store</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Count</TableCell>
            {showInvited && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Invited</TableCell>}
            {showRates && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Attend</TableCell>}
            {showRates && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Upload</TableCell>}
            {showRates && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Avg Views</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map(s => {
            const d = byStore[s];
            return (
              <TableRow key={s}>
                <TableCell sx={{ fontWeight: 500 }}>{s || '—'}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{d.count}</TableCell>
                {showInvited && (
                  <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                    {fmt(d.invited)}
                  </TableCell>
                )}
                {showRates && (
                  <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', opacity: d.attendRate === 0 ? 0.35 : 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {pct(d.attendRate)}
                      <Box sx={{ width: 32, height: 3, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${Math.round(d.attendRate * 100)}%`, backgroundColor: 'primary.main' }} />
                      </Box>
                    </Box>
                  </TableCell>
                )}
                {showRates && (
                  <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', opacity: d.uploadRate === 0 ? 0.35 : 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {pct(d.uploadRate)}
                      <Box sx={{ width: 32, height: 3, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${Math.round(d.uploadRate * 100)}%`, backgroundColor: 'success.main' }} />
                      </Box>
                    </Box>
                  </TableCell>
                )}
                {showRates && (
                  <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                    {fmt(d.avgViews)}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StoreBreakdown;
