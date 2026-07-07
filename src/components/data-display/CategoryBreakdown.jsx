import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const CATEGORY_LABELS = {
  general:  'General',
  kbeauty:  'K-Beauty',
  specific: 'Specific',
};

function pct(rate) { return `${Math.round(rate * 100)}%`; }
function fmt(val) { return val == null ? '—' : val.toLocaleString('en-US'); }

/**
 * CategoryBreakdown component
 *
 * Comparison table of performance metrics grouped by content category.
 *
 * Props:
 * @param {Object} byCategory - from deriveAnalyticsSummary().byCategory [Required]
 *
 * Example usage:
 * <CategoryBreakdown byCategory={summary.byCategory} />
 */
function CategoryBreakdown({ byCategory = {} }) {
  const categories = Object.keys(byCategory).sort();

  if (categories.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ py: 3 }}>
        No data available.
      </Typography>
    );
  }

  const showRates = categories.some(cat => byCategory[cat].attendRate > 0);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Count</TableCell>
            {showRates && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Attend</TableCell>}
            {showRates && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Upload</TableCell>}
            {showRates && <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Avg Views</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map(cat => {
            const d = byCategory[cat];
            return (
              <TableRow key={cat}>
                <TableCell sx={{ fontWeight: 500 }}>{CATEGORY_LABELS[cat] || cat}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{d.count}</TableCell>
                {showRates && (
                  <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {pct(d.attendRate)}
                      <Box sx={{ width: 32, height: 3, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${Math.round(d.attendRate * 100)}%`, backgroundColor: 'primary.main' }} />
                      </Box>
                    </Box>
                  </TableCell>
                )}
                {showRates && (
                  <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
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

export default CategoryBreakdown;
