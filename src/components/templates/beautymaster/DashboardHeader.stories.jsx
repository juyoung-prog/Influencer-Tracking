import { useState } from 'react';
import Box from '@mui/material/Box';
import DashboardHeader from './DashboardHeader';
import SheetSettingsModal from '../../overlay-feedback/SheetSettingsModal';

const mockKpi = {
  total: 15,
  agreementCount: 15,
  attendCount: 8,
  collaboSharedCount: 6,
  creditSharedCount: 5,
  alertCount: 3,
};

export default {
  title: 'BeautyMaster/Section/DashboardHeader',
  component: DashboardHeader,
  tags: ['autodocs'],
  argTypes: {
    kpi: { control: 'object', description: 'KPI summary object' },
    isSyncing: { control: 'boolean', description: 'Whether a sync is in progress' },
    lastSyncedAt: { control: 'date', description: 'Timestamp of last sync' },
    onRefresh: { action: 'refresh clicked' },
    onSettingsClick: { action: 'settings clicked' },
    sheetUrl: { control: 'text', description: 'Connected Google Sheet URL; icon hidden when null' },
    sx: { control: false },
  },
  decorators: [
    Story => (
      <Box sx={{ bgcolor: 'background.default', minHeight: 120 }}>
        <Story />
      </Box>
    ),
  ],
};

export const Default = {
  args: {
    kpi: mockKpi,
    isSyncing: false,
    lastSyncedAt: new Date('2026-07-05T10:28:00'),
  },
};

export const Syncing = {
  args: {
    kpi: mockKpi,
    isSyncing: true,
    lastSyncedAt: new Date('2026-07-05T10:28:00'),
  },
};

export const NoAlerts = {
  args: {
    kpi: { ...mockKpi, alertCount: 0 },
    isSyncing: false,
    lastSyncedAt: new Date('2026-07-05T10:28:00'),
  },
};

export const NeverSynced = {
  name: 'No sync yet',
  args: {
    kpi: { total: 0, agreementCount: 0, attendCount: 0, collaboSharedCount: 0, creditSharedCount: 0, alertCount: 0 },
    isSyncing: false,
    lastSyncedAt: null,
  },
};

export const WithSheetLink = {
  name: 'Google Sheet link icon',
  args: {
    kpi: mockKpi,
    isSyncing: false,
    lastSyncedAt: new Date('2026-07-05T10:28:00'),
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1FEdoUfToSKGJ8oVyDIaj15Oo2YRLasj_kfhlsHkwFI4/edit#gid=0',
  },
};

export const WithSettingsModal = {
  name: 'Settings icon → modal (interactive)',
  render: () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    return (
      <Box sx={{ bgcolor: 'background.default' }}>
        <DashboardHeader
          kpi={mockKpi}
          isSyncing={false}
          lastSyncedAt={new Date('2026-07-05T10:28:00')}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <SheetSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSave={(cfg) => { console.log('saved', cfg); setSettingsOpen(false); }}
        />
      </Box>
    );
  },
};
