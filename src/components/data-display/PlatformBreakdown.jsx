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
 * PlatformBreakdown component
 *
 * Comparison table of performance metrics grouped by platform (Instagram / TikTok).
 *
 * Props:
 * @param {Object} byPlatform - from deriveAnalyticsSummary().byPlatform [Required]
 *
 * Example usage:
 * <PlatformBreakdown byPlatform={summary.byPlatform} />
 */
function PlatformBreakdown({ byPlatform = {} }) {
  const platforms = Object.keys(byPlatform);

  if (platforms.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ py: 3 }}>
        No data available.
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Platform</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Count</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Attend</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Upload</TableCell>
            <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Avg Views</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {platforms.map(p => {
            const d = byPlatform[p];
            return (
              <TableRow key={p}>
                <TableCell sx={{ fontWeight: 500 }}>{p}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{d.count}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {pct(d.attendRate)}
                    <Box sx={{ width: 32, height: 3, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${Math.round(d.attendRate * 100)}%`, backgroundColor: 'primary.main' }} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {pct(d.uploadRate)}
                    <Box sx={{ width: 32, height: 3, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${Math.round(d.uploadRate * 100)}%`, backgroundColor: 'success.main' }} />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                  {fmt(d.avgViews)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlatformBreakdown;
