import SyncStatusBar from './SyncStatusBar';

export default {
  title: 'BeautyMaster/Header/SyncStatusBar',
  component: SyncStatusBar,
  tags: ['autodocs'],
  argTypes: {
    lastSyncedAt: { control: 'date', description: 'Timestamp of last sync (Date or null)' },
    isSyncing: { control: 'boolean', description: 'Whether a sync is in progress' },
    onRefresh: { action: 'refresh clicked', description: 'Refresh button handler' },
    sx: { control: false },
  },
};

export const Default = {
  args: {
    lastSyncedAt: new Date('2026-07-01T10:30:00'),
    isSyncing: false,
  },
};

export const Syncing = {
  args: {
    lastSyncedAt: new Date('2026-07-01T10:30:00'),
    isSyncing: true,
  },
};

export const Initial = {
  name: 'No sync yet',
  args: {
    lastSyncedAt: null,
    isSyncing: false,
  },
};
