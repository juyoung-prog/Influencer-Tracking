import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LEGEND = [
  { label: 'Invited',   color: 'grey.300' },
  { label: 'Attended',  color: 'info.main' },
  { label: 'Uploaded',  color: 'success.main' },
];

/**
 * MonthlyTrend component
 *
 * Month-by-month bar chart: Invited / Attended / Uploaded counts.
 * CSS-based, no external chart library.
 *
 * Props:
 * @param {Object} byMonth - from deriveAnalyticsSummary().byMonth [Required]
 *
 * Example usage:
 * <MonthlyTrend byMonth={summary.byMonth} />
 */
function MonthlyTrend({ byMonth = {} }) {
  const months = Object.keys(byMonth).map(Number).sort((a, b) => a - b);

  if (months.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ py: 3 }}>
        No data available.
      </Typography>
    );
  }

  const maxCount = Math.max(...months.map(m => byMonth[m].count), 1);

  if (months.length === 1) {
    return (
      <Typography variant="body2" color="text.disabled" sx={{ py: 3 }}>
        Only one month of data — trend visible once data spans multiple months.
      </Typography>
    );
  }

  return (
    <Box>
      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {LEGEND.map(({ label, color }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 0.5, backgroundColor: color }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Bars per month */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {months.map(m => {
          const d = byMonth[m];
          const monthLabel = MONTH_NAMES[m] || `Month ${m}`;
          const bars = [
            { count: d.count,         color: 'grey.300' },
            { count: d.attendedCount, color: 'info.main' },
            { count: d.uploadedCount, color: 'success.main' },
          ];

          return (
            <Box key={m} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32, fontWeight: 600 }}>
                {monthLabel}
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {bars.map(({ count, color }, bi) => (
                  <Box key={bi} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1, height: 10, backgroundColor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{
                        height: '100%',
                        width: `${Math.round((count / maxCount) * 100)}%`,
                        backgroundColor: color,
                        borderRadius: 1,
                      }} />
                    </Box>
                    <Typography variant="caption" sx={{ minWidth: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default MonthlyTrend;
