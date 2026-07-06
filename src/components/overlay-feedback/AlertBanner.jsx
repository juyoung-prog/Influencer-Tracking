import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * AlertBanner component
 *
 * Displays action-required alert cases as clickable filter badges.
 * Clicking a badge filters the list to that alert type; clicking again clears.
 * severity 'error' → red, 'warning' → amber, 'passive' → grey (waiting on influencer).
 *
 * Props:
 * @param {{ flag: string, label: string, count: number, severity?: 'warning'|'error'|'passive' }[]} alerts
 *   - Alert case list [Optional, default: []]
 * @param {string|null} activeFlag - Currently selected flag for filtering [Optional, default: null]
 * @param {function} onFlagSelect - (flag: string|null) => void — called on badge click [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <AlertBanner
 *   alerts={[
 *     { flag: 'attend-no-collabo', label: 'Upload Pending', count: 3, severity: 'passive' },
 *     { flag: 'collabo-no-credit', label: 'Credit Not Sent', count: 1, severity: 'error' },
 *   ]}
 *   activeFlag={activeFlag}
 *   onFlagSelect={setActiveFlag}
 * />
 */
function AlertBanner({ alerts = [], activeFlag = null, onFlagSelect, sx }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ...sx }}>
      {alerts.map(({ flag, label, count, severity = 'warning' }) => {
        const isError = severity === 'error';
        const isPassive = severity === 'passive';
        const color = isError ? 'error.main' : isPassive ? 'text.disabled' : 'warning.main';
        const Icon = isError ? ErrorOutlineIcon : WarningAmberIcon;
        const isSelected = activeFlag === flag;

        return (
          <ButtonBase
            key={flag}
            onClick={() => onFlagSelect?.(isSelected ? null : flag)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.25,
              py: 0.5,
              border: '1px solid',
              borderColor: color,
              color: isSelected ? 'background.paper' : color,
              backgroundColor: isSelected ? color : 'transparent',
              transition: 'background-color 0.12s, color 0.12s',
              '&:hover': {
                backgroundColor: isSelected ? color : 'action.hover',
              },
            }}
          >
            {!isPassive && !isSelected && <Icon sx={{ fontSize: 13 }} />}
            {isSelected && <CloseIcon sx={{ fontSize: 12 }} />}
            <Typography variant="caption" sx={{ fontWeight: isPassive ? 400 : 600 }}>
              {label} {count}
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default AlertBanner;
