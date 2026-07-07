import { useState, useMemo, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AnalyticsDashboard from '../../components/templates/beautymaster/AnalyticsDashboard';
import InfluencerDrawer from '../../components/overlay-feedback/InfluencerDrawer';
import SheetSettingsModal from '../../components/overlay-feedback/SheetSettingsModal';
import DashboardHeader from '../../components/templates/beautymaster/DashboardHeader';
import InfluencerPanel from '../../components/templates/beautymaster/InfluencerPanel';
import SchedulePanel from '../../components/templates/beautymaster/SchedulePanel';
import SheetSetupScreen from '../../components/templates/beautymaster/SheetSetupScreen';
import { useSheetData } from '../../hooks/useSheetData.js';
import { deriveKpiSummary } from '../../data/beautymaster/schema.js';

// ─── Mock data (Storybook / ComponentGallery only) ────────────────────────────

const D = iso => new Date(iso);

export const MOCK_INFLUENCERS = [
  {
    id: 'Processing_0', sheetStatus: 'Processing', fullName: 'Kim Minjung', store: 'G10', month: 7,
    barcode: 'G10INF2026', tier: 'tier1', platform: 'Instagram', category: 'kbeauty',
    creditType: '$100 Credit', imageUrl: '', socialAccountUrl: 'https://instagram.com/kim.minjung',
    email: 'kim.minjung@gmail.com', scheduledTime: D('2026-07-05T10:30:00'),
    scheduleGroup: 'today', alertFlags: ['attended-no-collabo'],
    agreement: true, attend: true, collaboShared: false, creditShared: false, creditUsed: false,
    collaboLink: '', uploadDate: null, serialNumber: '', opinion: null,
    views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
    note: 'Visit complete. Content upload expected.',
  },
  {
    id: 'Processing_1', sheetStatus: 'Processing', fullName: 'Park Soyeon', store: 'G10', month: 7,
    barcode: 'G10INF2026', tier: 'tier1', platform: 'TikTok', category: 'general',
    creditType: '$100 Credit', imageUrl: '', socialAccountUrl: 'https://tiktok.com/@park.soyeon',
    email: 'park.soyeon@naver.com', scheduledTime: D('2026-07-05T14:00:00'),
    scheduleGroup: 'today', alertFlags: [],
    agreement: true, attend: true, collaboShared: true, creditShared: true, creditUsed: true,
    collaboLink: 'https://tiktok.com/@example/video/1', uploadDate: D('2026-07-05'),
    serialNumber: 'G10CRED000101', opinion: 'USE',
    views: 24300, likes: 5820, shares: 312, saves: 1430, comments: 567, reposts: 89,
    note: '',
  },
  {
    id: 'Processing_2', sheetStatus: 'Processing', fullName: 'Lee Jiyeon', store: 'G10', month: 7,
    barcode: 'G10INF202620', tier: 'tier2', platform: 'Instagram', category: 'specific',
    creditType: '$20 Credit_Tier2', imageUrl: '', socialAccountUrl: 'https://instagram.com/lee.jiyeon',
    email: 'lee.jiyeon@kakao.com', scheduledTime: D('2026-07-08T11:00:00'),
    scheduleGroup: 'this-week', alertFlags: [],
    agreement: true, attend: false, collaboShared: false, creditShared: false, creditUsed: false,
    collaboLink: '', uploadDate: null, serialNumber: '', opinion: null,
    views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
    note: '',
  },
  {
    id: 'Processing_3', sheetStatus: 'Processing', fullName: 'Han Areum', store: 'G10', month: 7,
    barcode: 'G10INF202620', tier: 'tier2', platform: 'TikTok', category: 'general',
    creditType: '$20 Credit_Tier2', imageUrl: '', socialAccountUrl: '',
    email: '', scheduledTime: D('2026-07-10T14:00:00'),
    scheduleGroup: 'this-week', alertFlags: [],
    agreement: true, attend: false, collaboShared: false, creditShared: false, creditUsed: false,
    collaboLink: '', uploadDate: null, serialNumber: '', opinion: null,
    views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
    note: 'Rescheduled from Jun 28.',
  },
  {
    id: 'Processing_4a', sheetStatus: 'Processing', fullName: 'Yoon Soojin', store: 'G10', month: 7,
    barcode: 'G10INF2026', tier: 'tier1', platform: 'Instagram', category: 'kbeauty',
    creditType: '$100 Credit', imageUrl: '', socialAccountUrl: '',
    email: '', scheduledTime: D('2026-07-12T11:30:00'),
    scheduleGroup: 'later', alertFlags: [],
    agreement: true, attend: false, collaboShared: false, creditShared: false, creditUsed: false,
    collaboLink: '', uploadDate: null, serialNumber: '', opinion: null,
    views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
    note: '',
  },
  {
    id: 'Processing_5a', sheetStatus: 'Processing', fullName: 'Choi Yuna', store: 'G10', month: 7,
    barcode: 'G10INF2026', tier: 'tier1', platform: 'Instagram', category: 'kbeauty',
    creditType: '$100 Credit', imageUrl: '', socialAccountUrl: '',
    email: '', scheduledTime: D('2026-07-14T13:00:00'),
    scheduleGroup: 'later', alertFlags: [],
    agreement: true, attend: false, collaboShared: false, creditShared: false, creditUsed: false,
    collaboLink: '', uploadDate: null, serialNumber: '', opinion: null,
    views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
    note: '',
  },
  {
    id: 'Processing_5', sheetStatus: 'Processing', fullName: 'Shin Dahye', store: 'G10', month: 7,
    barcode: 'G10INF2026', tier: 'tier1', platform: 'Instagram', category: 'kbeauty',
    creditType: '$100 Credit', imageUrl: '', socialAccountUrl: '',
    email: '', scheduledTime: D('2026-07-02T13:00:00'),
    scheduleGroup: 'past', alertFlags: ['attended-no-credit'],
    agreement: true, attend: true, collaboShared: true, creditShared: false, creditUsed: false,
    collaboLink: 'https://instagram.com/p/example3', uploadDate: D('2026-07-03'),
    serialNumber: '', opinion: null,
    views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
    note: '',
  },
  {
    id: 'Done_0', sheetStatus: 'Done', fullName: 'Oh Seulgi', store: 'G10', month: 6,
    barcode: 'G10INF2026', tier: 'tier1', platform: 'Instagram', category: 'kbeauty',
    creditType: '$100 Credit', imageUrl: '', socialAccountUrl: '',
    email: '', scheduledTime: D('2026-06-28T10:00:00'),
    scheduleGroup: 'past', alertFlags: [],
    agreement: true, attend: true, collaboShared: true, creditShared: true, creditUsed: true,
    collaboLink: 'https://instagram.com/p/example2', uploadDate: D('2026-06-29'),
    serialNumber: 'G10CRED000055', opinion: 'MAYBE',
    views: 8900, likes: 1230, shares: 76, saves: 340, comments: 89, reposts: 12,
    note: 'To be reviewed next month.',
  },
  {
    id: 'Done_1', sheetStatus: 'Done', fullName: 'Na Eunji', store: 'G10', month: 6,
    barcode: 'G10INF202620', tier: 'tier2', platform: 'TikTok', category: 'general',
    creditType: '$20 Credit_Tier2', imageUrl: '', socialAccountUrl: '',
    email: '', scheduledTime: D('2026-06-20T14:00:00'),
    scheduleGroup: 'past', alertFlags: [],
    agreement: true, attend: true, collaboShared: true, creditShared: true, creditUsed: true,
    collaboLink: 'https://tiktok.com/@example2/video/1', uploadDate: D('2026-06-22'),
    serialNumber: 'G10CRED000042', opinion: 'USE',
    views: 31200, likes: 7400, shares: 520, saves: 2100, comments: 830, reposts: 140,
    note: '',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * BeautymasterDashboard page component
 *
 * Full-screen influencer management dashboard.
 * Reads data from Google Sheets via useSheetData.
 * Shows SheetSetupScreen when no config is saved.
 *
 * Props: (none — data is owned internally via useSheetData)
 */
function BeautymasterDashboard() {
  const { influencers, kpi, isSyncing, lastSyncedAt, error, refresh, config, saveConfig } = useSheetData();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filters, setFilters] = useState({ store: config?.defaultStore || 'all', platform: null, tier: null, category: null });
  const [analyticsStore, setAnalyticsStore] = useState('all');

  const timelinePanelRef = useRef(null);
  const listPanelRef = useRef(null);

  useEffect(() => {
    if (!selectedId) return;
    const selector = `[data-influencer-id="${selectedId}"]`;
    timelinePanelRef.current?.querySelector(selector)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    listPanelRef.current?.querySelector(selector)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  const stores = useMemo(() => [...new Set(influencers.map(i => i.store))].sort(), [influencers]);
  const months = useMemo(() => [...new Set(influencers.map(i => i.month))].sort((a, b) => a - b), [influencers]);

  const filteredInfluencers = useMemo(() => influencers.filter(inf => {
    if (filters.store !== 'all' && inf.store !== filters.store) return false;
    if (filters.platform) {
      const platforms = inf.platform.split(',').map(p => p.trim().toLowerCase());
      if (!platforms.includes(filters.platform.toLowerCase())) return false;
    }
    if (filters.tier && inf.tier !== filters.tier) return false;
    if (filters.category && inf.category !== filters.category) return false;
    return true;
  }), [influencers, filters]);

  const filteredKpi = useMemo(() => deriveKpiSummary(filteredInfluencers), [filteredInfluencers]);

  const selectedInfluencer = influencers.find(i => i.id === selectedId) || null;

  const handleSelect = inf => {
    setSelectedId(inf.id);
    setDrawerOpen(true);
  };

  const handleSaveConfig = (newConfig) => {
    saveConfig(newConfig);
    if (newConfig.defaultStore) {
      setFilters(prev => ({ ...prev, store: newConfig.defaultStore }));
    }
    setSettingsOpen(false);
  };

  // ── Setup screen (no config saved yet) ──────────────────────────────────────
  if (!config) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <DashboardHeader
          kpi={kpi}
          isSyncing={false}
          lastSyncedAt={null}
          onRefresh={() => {}}
          onSettingsClick={() => setSettingsOpen(true)}
        />
        <SheetSetupScreen onSetup={() => setSettingsOpen(true)} />
        <SheetSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          config={config}
          onSave={handleSaveConfig}
          stores={stores}
        />
      </Box>
    );
  }

  // ── Dashboard (config saved, data polling active) ────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <DashboardHeader
        kpi={filteredKpi}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        onRefresh={refresh}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2, minHeight: 40 }}>
          <Tab label="Operations" sx={{ minHeight: 40, fontSize: 13 }} />
          <Tab label="Analytics" sx={{ minHeight: 40, fontSize: 13 }} />
        </Tabs>
        {activeTab === 1 && stores.length > 0 && (
          <Box sx={{ ml: 'auto', pr: 2 }}>
            <FormControl size="small">
              <Select
                value={analyticsStore}
                onChange={e => setAnalyticsStore(e.target.value)}
                displayEmpty
                sx={{ fontSize: 13, height: 32, minWidth: 140 }}
              >
                <MenuItem value="all">All Stores</MenuItem>
                {stores.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {activeTab === 0 && (
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <SchedulePanel
            ref={timelinePanelRef}
            influencers={filteredInfluencers}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
          <InfluencerPanel
            ref={listPanelRef}
            influencers={filteredInfluencers}
            stores={stores}
            months={months}
            filters={filters}
            onFiltersChange={setFilters}
            onSelect={handleSelect}
            selectedId={selectedId}
            isLoading={isSyncing && influencers.length === 0}
            error={error}
            onRetry={refresh}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <AnalyticsDashboard influencers={influencers} selectedStore={analyticsStore} />
        </Box>
      )}

      <InfluencerDrawer
        influencer={selectedInfluencer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <SheetSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        stores={stores}
      />
    </Box>
  );
}

export default BeautymasterDashboard;
