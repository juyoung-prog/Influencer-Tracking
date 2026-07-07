import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const OPINION_COLOR = { 'USE': 'success', 'MAYBE': 'warning', "DON'T": 'error' };

function fmt(val) {
  if (val == null) return '—';
  return val.toLocaleString('en-US');
}

function engagementRate(inf) {
  if (!inf.views || inf.views === 0) return null;
  const eng = (inf.likes ?? 0) + (inf.comments ?? 0) + (inf.saves ?? 0);
  if (inf.likes == null && inf.comments == null && inf.saves == null) return null;
  return Math.round((eng / inf.views) * 100);
}

/**
 * TopInfluencersTable component
 *
 * Ranked table of influencers sorted by views (desc).
 * Shows rank, name, platform, tier, views, eng rate, and opinion.
 *
 * Props:
 * @param {Influencer[]} influencers - topByViews from deriveAnalyticsSummary() [Required]
 *
 * Example usage:
 * <TopInfluencersTable influencers={summary.topByViews} />
 */
function TopInfluencersTable({ influencers = [] }) {
  if (influencers.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.disabled">
          No performance data yet — add Views to the sheet to see rankings.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, width: 36, color: 'text.secondary' }}>#</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 100 }}>Platform</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 80 }}>Tier</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 100, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>Views</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 80, textAlign: 'right' }}>Eng Rate</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 90 }}>Opinion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {influencers.map((inf, idx) => {
            const engRate = engagementRate(inf);
            return (
              <TableRow key={inf.id} hover>
                <TableCell sx={{ color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>{idx + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{inf.fullName}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{inf.platform}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{inf.tier === 'tier2' ? 'Tier 2' : 'Tier 1'}</TableCell>
                <TableCell sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{fmt(inf.views)}</TableCell>
                <TableCell sx={{
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  color: engRate == null ? 'text.disabled' : engRate > 100 ? 'warning.main' : 'text.primary',
                }}>
                  {engRate != null ? `${engRate}%` : '—'}
                </TableCell>
                <TableCell>
                  {inf.opinion ? (
                    <Chip label={inf.opinion} size="small" color={OPINION_COLOR[inf.opinion] || 'default'} />
                  ) : (
                    <Typography variant="caption" color="text.disabled">—</Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TopInfluencersTable;
