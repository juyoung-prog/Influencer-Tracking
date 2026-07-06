import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KpiBar from '../../data-display/KpiBar';
import SyncStatusBar from '../../layout/SyncStatusBar';

/**
 * DashboardHeader component
 *
 * Top section of the BeautyMaster dashboard.
 * Shows the title + sync status bar and the KPI summary row.
 *
 * Props:
 * @param {KpiSummary} kpi - KPI summary object [Required]
 * @param {boolean} isSyncing - Whether a data sync is in progress [Optional, default: false]
 * @param {Date|null} lastSyncedAt - Timestamp of last successful sync [Optional, default: null]
 * @param {function} onRefresh - Handler for the refresh button [Optional]
 * @param {function} onSettingsClick - Settings icon click → opens SheetSettingsModal [Optional]
 * @param {object} sx - MUI sx overrides applied to the root Box [Optional]
 *
 * Example usage:
 * <DashboardHeader kpi={kpi} isSyncing={false} lastSyncedAt={new Date()} onRefresh={handleRefresh} onSettingsClick={() => setSettingsOpen(true)} />
 */
function DashboardHeader({ kpi, isSyncing = false, lastSyncedAt = null, onRefresh, onSettingsClick, sx }) {
  return (
    <Box sx={{ flexShrink: 0, backgroundColor: 'background.paper', ...sx }}>
      <Box sx={{ px: 3, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          BeautyMaster
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SyncStatusBar
            lastSyncedAt={lastSyncedAt}
            isSyncing={isSyncing}
            onRefresh={onRefresh || (() => {})}
          />
          <Tooltip title="Google Sheets settings">
            <IconButton size="small" onClick={onSettingsClick} sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}>
              <SettingsOutlinedIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
        <KpiBar kpi={kpi} />
      </Box>
    </Box>
  );
}

export default DashboardHeader;
