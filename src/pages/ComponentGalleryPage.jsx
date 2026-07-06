import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AlertBanner from '../components/overlay-feedback/AlertBanner';
import InfluencerCard from '../components/card/InfluencerCard';
import InfluencerDrawer from '../components/overlay-feedback/InfluencerDrawer';
import InfluencerFilterBar from '../components/data-display/InfluencerFilterBar';
import InfluencerListRow from '../components/data-display/InfluencerListRow';
import KpiBar from '../components/data-display/KpiBar';
import ScheduleTimeline from '../components/data-display/ScheduleTimeline';
import StatusIconRow from '../components/data-display/StatusIconRow';
import SyncStatusBar from '../components/layout/SyncStatusBar';
import DashboardHeader from '../components/templates/beautymaster/DashboardHeader';
import InfluencerPanel from '../components/templates/beautymaster/InfluencerPanel';
import SchedulePanel from '../components/templates/beautymaster/SchedulePanel';
import { MOCK_INFLUENCERS } from './beautymaster/BeautymasterDashboard';
import { deriveKpiSummary } from '../data/beautymaster/schema';

// ─── Section definitions (for sidebar nav) ───────────────────────────────────

const SECTIONS = [
  { id: 'header',   label: 'Header' },
  { id: 'list',     label: 'List' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'sections', label: 'Sections' },
  { id: 'overlay',  label: 'Overlay' },
];

// ─── Layout helpers ───────────────────────────────────────────────────────────

function SectionHeading({ id, children }) {
  return (
    <Box id={id} sx={{ scrollMarginTop: 72, pt: 6, pb: 2, borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
      <Typography variant="overline" color="text.disabled" sx={{ fontSize: '0.625rem', letterSpacing: '0.12em' }}>
        BeautyMaster
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.25 }}>
        {children}
      </Typography>
    </Box>
  );
}

function ComponentBlock({ title, note, children }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, mb: note ? 0.25 : 2 }}>
        {title}
      </Typography>
      {note && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {note}
        </Typography>
      )}
      {children}
    </Box>
  );
}

// ─── Gallery page ─────────────────────────────────────────────────────────────

export default function ComponentGalleryPage() {
  // Header section state
  const [isSyncing, setIsSyncing] = useState(false);

  // List section state
  const [filters, setFilters] = useState({ store: 'all', month: 'all', platform: null, tier: null });
  const [listSelectedId, setListSelectedId] = useState(null);

  // Overlay state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerInfluencer, setDrawerInfluencer] = useState(null);
  const [activeFlag, setActiveFlag] = useState(null);

  // Section demo state
  const [panelSelectedId, setPanelSelectedId] = useState(null);

  const kpi = deriveKpiSummary(MOCK_INFLUENCERS);
  const stores = [...new Set(MOCK_INFLUENCERS.map(i => i.store))];
  const months = [...new Set(MOCK_INFLUENCERS.map(i => i.month))].sort((a, b) => a - b);

  const mockAlerts = [
    { flag: 'agreement-no-attend', label: 'Visit Unconfirmed', count: 2, severity: 'warning' },
    { flag: 'attend-no-collabo',   label: 'Upload Pending',    count: 1, severity: 'passive' },
    { flag: 'collabo-no-credit',   label: 'Credit Not Sent',   count: 1, severity: 'error' },
  ];

  const sampleCards = MOCK_INFLUENCERS.slice(0, 3);
  const sampleRows  = MOCK_INFLUENCERS.slice(0, 5);

  return (
    <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

      {/* ── Sidebar ── */}
      <Box
        sx={{
          width: 180,
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 56,
          height: 'calc(100vh - 56px)',
          overflow: 'auto',
          py: 3,
          px: 2,
        }}
      >
        <Typography variant="overline" color="text.disabled" sx={{ fontSize: '0.625rem', letterSpacing: '0.12em', display: 'block', mb: 1.5 }}>
          Components
        </Typography>
        <Stack spacing={0.25}>
          {SECTIONS.map(s => (
            <Box
              key={s.id}
              component="a"
              href={`#${s.id}`}
              sx={{
                display: 'block',
                px: 1.5,
                py: 0.625,
                fontSize: '0.8125rem',
                color: 'text.secondary',
                textDecoration: 'none',
                borderRadius: 0.5,
                '&:hover': { color: 'text.primary', backgroundColor: 'action.hover' },
              }}
            >
              {s.label}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── Main content ── */}
      <Box sx={{ flex: 1, minWidth: 0, px: 5, pb: 10 }}>

        {/* ── Header ── */}
        <SectionHeading id="header">Header</SectionHeading>

        <ComponentBlock
          title="KpiBar"
          note="KPI funnel summary. Alerts column appears only when alertCount > 0."
        >
          <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <KpiBar kpi={kpi} />
          </Box>
          <Box sx={{ p: 3, mt: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <KpiBar kpi={{ ...kpi, alertCount: 0 }} />
          </Box>
        </ComponentBlock>

        <ComponentBlock
          title="SyncStatusBar"
          note="Shows last sync time and a refresh button. Toggle the syncing state below."
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <SyncStatusBar
              lastSyncedAt={new Date('2026-07-05T10:28:00')}
              isSyncing={isSyncing}
              onRefresh={() => {
                setIsSyncing(true);
                setTimeout(() => setIsSyncing(false), 2000);
              }}
            />
            <Button size="small" variant="outlined" onClick={() => setIsSyncing(v => !v)} sx={{ ml: 'auto' }}>
              {isSyncing ? 'Stop syncing' : 'Simulate sync'}
            </Button>
          </Box>
        </ComponentBlock>

        <Divider sx={{ my: 2 }} />

        {/* ── List ── */}
        <SectionHeading id="list">List</SectionHeading>

        <ComponentBlock
          title="StatusIconRow"
          note="4-step pipeline icons: Agreement → Visit → Upload → Credit."
        >
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Stack spacing={1.5}>
              {[
                { label: 'All complete',             props: { agreement: true, attend: true, collaboShared: true, creditShared: true } },
                { label: 'Agreement + Visit',        props: { agreement: true, attend: true } },
                { label: 'Agreement + Visit + Upload', props: { agreement: true, attend: true, collaboShared: true } },
                { label: 'All incomplete',           props: {} },
              ].map(({ label, props }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ width: 200, flexShrink: 0 }}>{label}</Typography>
                  <StatusIconRow {...props} />
                </Box>
              ))}
            </Stack>
          </Box>
        </ComponentBlock>

        <ComponentBlock
          title="InfluencerCard"
          note="280px fixed-width card. Click to open Drawer."
        >
          <Grid container spacing={2}>
            {sampleCards.map(inf => (
              <Grid key={inf.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <InfluencerCard
                  influencer={inf}
                  isSelected={listSelectedId === inf.id}
                  onClick={() => {
                    setListSelectedId(inf.id);
                    setDrawerInfluencer(inf);
                    setDrawerOpen(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </ComponentBlock>

        <ComponentBlock
          title="InfluencerListRow"
          note="Single row: avatar / name + time + note / platform·tier / stage + overdue."
        >
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderBottom: 'none' }}>
            {sampleRows.map(inf => (
              <InfluencerListRow
                key={inf.id}
                influencer={inf}
                isSelected={listSelectedId === inf.id}
                onClick={() => {
                  setListSelectedId(inf.id);
                  setDrawerInfluencer(inf);
                  setDrawerOpen(true);
                }}
              />
            ))}
          </Box>
        </ComponentBlock>

        <ComponentBlock
          title="InfluencerFilterBar"
          note="Store, Month dropdowns + Platform / Tier toggle chips. Reset appears when a filter is active."
        >
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <InfluencerFilterBar
              stores={stores}
              months={months}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </Box>
        </ComponentBlock>

        <Divider sx={{ my: 2 }} />

        {/* ── Schedule ── */}
        <SectionHeading id="schedule">Schedule</SectionHeading>

        <ComponentBlock
          title="ScheduleTimeline"
          note="Groups influencers by TODAY / UPCOMING / PAST / NO TIME SET. Click a row to highlight."
        >
          <Box sx={{ height: 480, border: '1px solid', borderColor: 'divider', overflow: 'hidden', display: 'flex' }}>
            <ScheduleTimeline
              influencers={MOCK_INFLUENCERS}
              onSelect={inf => setPanelSelectedId(inf.id)}
              selectedId={panelSelectedId}
              sx={{ flex: 1 }}
            />
          </Box>
        </ComponentBlock>

        <Divider sx={{ my: 2 }} />

        {/* ── Sections ── */}
        <SectionHeading id="sections">Sections</SectionHeading>

        <ComponentBlock
          title="DashboardHeader"
          note="Title + SyncStatusBar row + KpiBar row. Composes KpiBar and SyncStatusBar."
        >
          <Box sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <DashboardHeader
              kpi={kpi}
              isSyncing={false}
              lastSyncedAt={new Date('2026-07-05T10:28:00')}
            />
          </Box>
        </ComponentBlock>

        <ComponentBlock
          title="SchedulePanel"
          note="Left panel with 'VISIT SCHEDULE' label and ScheduleTimeline. forwardRef for scroll sync."
        >
          <Box sx={{ height: 460, border: '1px solid', borderColor: 'divider', display: 'flex', overflow: 'hidden' }}>
            <SchedulePanel
              influencers={MOCK_INFLUENCERS}
              onSelect={inf => setPanelSelectedId(inf.id)}
              selectedId={panelSelectedId}
            />
          </Box>
        </ComponentBlock>

        <ComponentBlock
          title="InfluencerPanel"
          note="Smart right panel. Owns tab / filter / search state. Click a row to open the Drawer."
        >
          <Box sx={{ height: 560, border: '1px solid', borderColor: 'divider', display: 'flex', overflow: 'hidden' }}>
            <InfluencerPanel
              influencers={MOCK_INFLUENCERS}
              stores={stores}
              months={months}
              onSelect={inf => {
                setPanelSelectedId(inf.id);
                setDrawerInfluencer(inf);
                setDrawerOpen(true);
              }}
              selectedId={panelSelectedId}
            />
          </Box>
        </ComponentBlock>

        <Divider sx={{ my: 2 }} />

        {/* ── Overlay ── */}
        <SectionHeading id="overlay">Overlay</SectionHeading>

        <ComponentBlock
          title="AlertBanner"
          note="Clickable alert badges. Active badge filters the list. Click again to clear."
        >
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <AlertBanner alerts={mockAlerts} activeFlag={activeFlag} onFlagSelect={flag => setActiveFlag(f => f === flag ? null : flag)} />
          </Box>
          {activeFlag && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Active filter: <strong>{activeFlag}</strong>
            </Typography>
          )}
        </ComponentBlock>

        <ComponentBlock
          title="InfluencerDrawer"
          note="Slide-in detail panel. Shows full influencer data, contact, stats."
        >
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {MOCK_INFLUENCERS.slice(0, 4).map(inf => (
              <Button
                key={inf.id}
                variant="outlined"
                size="small"
                onClick={() => { setDrawerInfluencer(inf); setDrawerOpen(true); }}
              >
                {inf.fullName}
              </Button>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Click a name to open the Drawer for that influencer.
          </Typography>
        </ComponentBlock>

      </Box>

      {/* ── Shared Drawer ── */}
      <InfluencerDrawer
        influencer={drawerInfluencer}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
}
