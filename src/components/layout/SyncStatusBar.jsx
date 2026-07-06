import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';

/** @param {Date} date */
function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * SyncStatusBar component
 *
 * Displays the last Google Sheets sync time and a manual refresh button.
 *
 * Props:
 * @param {Date|null} lastSyncedAt - Timestamp of last successful sync [Optional, default: null]
 * @param {boolean} isSyncing - Whether a sync is in progress [Optional, default: false]
 * @param {function} onRefresh - Refresh button click handler [Required]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <SyncStatusBar lastSyncedAt={new Date()} isSyncing={false} onRefresh={handleRefresh} />
 */
function SyncStatusBar({ lastSyncedAt = null, isSyncing = false, onRefresh, sx }) {
  const timeLabel = lastSyncedAt ? `Last synced ${formatTime(lastSyncedAt)}` : 'Pending';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ...sx }}>
      {isSyncing ? (
        <CircularProgress size={12} thickness={4} sx={{ color: 'text.disabled' }} />
      ) : null}
      <Typography variant="caption" color="text.disabled">
        {isSyncing ? 'Syncing...' : timeLabel}
      </Typography>
      <Tooltip title="Refresh now" arrow>
        <span>
          <IconButton
            size="small"
            onClick={onRefresh}
            disabled={isSyncing}
            aria-label="Refresh"
            sx={{ p: 0.25 }}
          >
            <RefreshIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

export default SyncStatusBar;
