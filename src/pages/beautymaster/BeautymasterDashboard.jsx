import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import AnalyticsDashboard from '../../components/templates/beautymaster/AnalyticsDashboard';
import SaasDashboardMockup from '../../components/templates/beautymaster/SaasDashboardMockup';
import WorkflowGuide from '../../components/templates/beautymaster/WorkflowGuide';
import InfluencerDrawer from '../../components/overlay-feedback/InfluencerDrawer';
import SheetSettingsModal from '../../components/overlay-feedback/SheetSettingsModal';
import DashboardHeader from '../../components/templates/beautymaster/DashboardHeader';
import InfluencerPanel from '../../components/templates/beautymaster/InfluencerPanel';
import MentionsPanel from '../../components/templates/beautymaster/MentionsPanel';
import SchedulePanel from '../../components/templates/beautymaster/SchedulePanel';
import SheetSetupScreen from '../../components/templates/beautymaster/SheetSetupScreen';
import { useSheetData } from '../../hooks/useSheetData.js';
import { deriveKpiSummary } from '../../data/beautymaster/schema.js';
import { MOCK_MENTIONS } from '../../data/beautymaster/mentions.js';
import { findSheetViewUrl } from '../../utils/googleSheetUrl.js';

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
 * UI 리뉴얼 진행 중 — `?ui=saas`를 붙이면 flat-SaaS 셸(사이드바 + 글로벌 헤더)로,
 * 아무것도 안 붙이면 기존 탭 레이아웃으로 렌더한다. 두 UI가 같은 useSheetData
 * 데이터와 같은 오버레이(Drawer/Settings)를 공유하므로 나란히 놓고 비교할 수 있다.
 * 리뉴얼이 확정되면 기존 레이아웃과 이 플래그를 함께 제거한다.
 *
 * Props: (none — data is owned internally via useSheetData)
 */
function BeautymasterDashboard() {
  const { influencers, kpi, inviteCounts, storeDocs, messageTemplates, influencerTrackingListUrl, isSyncing, lastSyncedAt, error, refresh, config, saveConfig } = useSheetData();

  /** UI 리뉴얼 플래그 — ?ui=saas면 flat-SaaS 셸, 아니면 기존 탭 레이아웃 */
  const [searchParams] = useSearchParams();
  const isSaasUi = searchParams.get('ui') === 'saas';

  const [activeTab, setActiveTab] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filters, setFilters] = useState({ store: config?.defaultStore || 'all', platform: null, tier: null, category: null });
  const [analyticsStore, setAnalyticsStore] = useState(config?.defaultStore || 'all');
  /** flat-SaaS 셸은 세 뷰가 스토어 하나를 공유한다 — 기존 UI의 filters.store/analyticsStore 분리와 다름 */
  const [saasStore, setSaasStore] = useState(config?.defaultStore || 'all');

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

  const analyticsFilteredInfluencers = useMemo(() => (
    analyticsStore === 'all' ? influencers : influencers.filter(i => i.store === analyticsStore)
  ), [influencers, analyticsStore]);
  const analyticsKpi = useMemo(() => deriveKpiSummary(analyticsFilteredInfluencers), [analyticsFilteredInfluencers]);

  const selectedInfluencer = influencers.find(i => i.id === selectedId) || null;

  const sheetUrl = findSheetViewUrl(config);

  /** 멘션 수집 파이프라인 연결 전까지 MOCK_MENTIONS 기준 — 가장 최근 수집 시각 */
  const lastCrawledAt = useMemo(
    () => MOCK_MENTIONS.reduce((max, m) => (m.capturedAt > max ? m.capturedAt : max), MOCK_MENTIONS[0]?.capturedAt ?? null),
    [],
  );

  const handleSelect = inf => {
    setSelectedId(inf.id);
    setDrawerOpen(true);
  };

  const handleSaveConfig = (newConfig) => {
    saveConfig(newConfig);
    if (newConfig.defaultStore) {
      setFilters(prev => ({ ...prev, store: newConfig.defaultStore }));
      setSaasStore(newConfig.defaultStore);
    }
    setSettingsOpen(false);
  };

  /** 두 UI가 공유하는 오버레이 — 어느 레이아웃이든 같은 Drawer/Settings를 쓴다 */
  const overlays = (
    <>
      <InfluencerDrawer
        influencer={selectedInfluencer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        templates={messageTemplates}
      />
      <SheetSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        stores={stores}
      />
    </>
  );

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

  // ── flat-SaaS 셸 (?ui=saas) — 리뉴얼 후보 UI ─────────────────────────────────
  if (isSaasUi) {
    return (
      <Box sx={{ height: '100vh', overflow: 'hidden' }}>
        <SaasDashboardMockup
          influencers={influencers}
          mentions={MOCK_MENTIONS}
          inviteCounts={inviteCounts}
          lastSyncedAt={lastSyncedAt}
          lastCrawledAt={lastCrawledAt}
          onSelect={handleSelect}
          selectedId={selectedId}
          onRefresh={refresh}
          onOpenSettings={() => setSettingsOpen(true)}
          sheetUrl={sheetUrl}
          isLoading={isSyncing}
          error={error}
          onRetry={refresh}
          selectedStore={saasStore}
          onStoreChange={setSaasStore}
          storeDocs={storeDocs}
          influencerTrackingListUrl={influencerTrackingListUrl}
        />
        {overlays}
      </Box>
    );
  }

  // ── Dashboard (config saved, data polling active) ────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <DashboardHeader
        kpi={activeTab === 2 ? analyticsKpi : filteredKpi}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        onRefresh={refresh}
        onSettingsClick={() => setSettingsOpen(true)}
        sheetUrl={sheetUrl}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2, minHeight: 40 }}>
          <Tab label="Operations" sx={{ minHeight: 40, fontSize: 13 }} />
          <Tab label="Mentions" sx={{ minHeight: 40, fontSize: 13 }} />
          <Tab label="Analytics" sx={{ minHeight: 40, fontSize: 13 }} />
          <Tab label="Workflow" sx={{ minHeight: 40, fontSize: 13 }} />
        </Tabs>
        {(activeTab === 2 || activeTab === 3) && stores.length > 0 && (
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
        // 시안(mockup): 수집 파이프라인 연결 전까지 MOCK_MENTIONS로 렌더링
        <MentionsPanel
          mentions={MOCK_MENTIONS}
          lastCrawledAt={MOCK_MENTIONS.reduce((max, m) => (m.capturedAt > max ? m.capturedAt : max), MOCK_MENTIONS[0]?.capturedAt ?? null)}
        />
      )}

      {activeTab === 2 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <AnalyticsDashboard influencers={influencers} inviteCounts={inviteCounts} selectedStore={analyticsStore} />
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <WorkflowGuide
            selectedStore={analyticsStore}
            storeDocs={storeDocs}
            influencerTrackingListUrl={influencerTrackingListUrl}
          />
        </Box>
      )}

      {overlays}
    </Box>
  );
}

export default BeautymasterDashboard;
