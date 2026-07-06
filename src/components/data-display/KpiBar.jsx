import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * StatBlock — single KPI cell
 *
 * @param {string} label
 * @param {number} value
 * @param {number|null} total - denominator shown as "/ N" when provided
 * @param {boolean} isAlert - render in error color
 */
function StatBlock({ label, value, total = null, isAlert = false }) {
  return (
    <Box>
      <Typography
        sx={{
          display: 'block',
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: isAlert ? 'error.main' : 'text.disabled',
          lineHeight: 1,
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
        <Typography
          variant="h4"
          component="span"
          sx={{
            lineHeight: 1,
            fontWeight: 700,
            color: isAlert ? 'error.main' : 'text.primary',
          }}
        >
          {value}
        </Typography>
        {total !== null && total > 0 && (
          <Typography
            component="span"
            sx={{
              fontSize: '0.8125rem',
              color: 'text.disabled',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            / {total}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/**
 * KpiBar component
 *
 * Standalone content-area KPI block.
 * Displays Total / Agreement / Visit / Upload / Credit with fraction context.
 * Alerts cell appears in error color only when alertCount > 0.
 *
 * Props:
 * @param {object} kpi - KPI summary data [Required]
 *   @param {number} kpi.total
 *   @param {number} kpi.agreementCount
 *   @param {number} kpi.attendCount
 *   @param {number} kpi.collaboSharedCount
 *   @param {number} kpi.creditSharedCount
 *   @param {number} kpi.alertCount
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <KpiBar kpi={kpi} />
 */
function KpiBar({ kpi = {}, sx }) {
  const {
    total = 0,
    agreementCount = 0,
    attendCount = 0,
    collaboSharedCount = 0,
    creditSharedCount = 0,
    alertCount = 0,
  } = kpi;

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, ...sx }}>
      <StatBlock label="Total" value={total} />
      <StatBlock label="Agreement" value={agreementCount} total={total} />
      <StatBlock label="Visit" value={attendCount} total={total} />
      <StatBlock label="Upload" value={collaboSharedCount} total={total} />
      <StatBlock label="Credit" value={creditSharedCount} total={total} />
      {alertCount > 0 && (
        <>
          <Box sx={{ alignSelf: 'center', width: '1px', height: 24, bgcolor: 'divider', mx: 1 }} />
          <StatBlock label="Alerts" value={alertCount} isAlert />
        </>
      )}
    </Box>
  );
}

export default KpiBar;
