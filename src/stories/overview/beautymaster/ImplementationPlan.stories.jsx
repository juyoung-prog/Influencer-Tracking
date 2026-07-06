import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../../../components/storybookDocumentation';

export default {
  title: 'Overview/BeautyMaster/Implementation Plan',
  parameters: {
    layout: 'padded',
  },
};

/* ─── Shared ──────────────────────────────────────────── */
const mono = { fontFamily: 'monospace', fontSize: 12 };

const Tag = ({ label, color = 'primary' }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      px: 0.75,
      py: 0.25,
      fontSize: 11,
      fontWeight: 600,
      color: `${color}.main`,
      border: '1px solid',
      borderColor: `${color}.main`,
      lineHeight: 1.4,
    }}
  >
    {label}
  </Box>
);

const phaseColor = (phase) => {
  const map = { 0: 'secondary', 1: 'primary', 2: 'success', 3: 'warning', 4: 'error', 5: 'info' };
  return map[phase] || 'primary';
};

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster — Implementation Plan"
        status="Planning"
        note="Data-component separation. schema.js as single source of truth."
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Implementation Plan</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The data layer and component layer are fully separated.
          All types, constants, and derivation logic live in a single file: <Box component="code" sx={mono}>schema.js</Box>.
        </Typography>

        {/* ① File Structure */}
        <SectionTitle title="File Structure" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 1, lineHeight: 1.8, overflow: 'auto' }}>
{`src/
├── data/
│   └── beautymaster/
│       └── schema.js                  ← All types, constants, derivation functions (single source)
│
├── utils/
│   └── parseInfluencerCsv.js          ← CSV row → Influencer conversion (imports schema only)
│
├── hooks/
│   └── useCsvPolling.js               ← fetch + parsing + 60s interval + state management
│
└── components/
    ├── data-display/
    │   ├── StatusIconRow.jsx           ← 4 status icons (no schema dependency)
    │   ├── KpiBar.jsx                  ← Header KPI summary row
    │   └── ScheduleTimeline.jsx        ← Visit schedule list (TODAY highlighted)
    ├── card/
    │   └── InfluencerCard.jsx          ← 3-layer influencer card
    ├── overlay-feedback/
    │   ├── AlertBanner.jsx             ← Alert cases banner (renders nothing if empty)
    │   └── InfluencerDrawer.jsx        ← Detail panel (metrics, Note, Link)
    └── layout/
        └── SyncStatusBar.jsx           ← Last sync time + refresh button`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          Page assembly: src/stories/page/BeautymasterDashboard.stories.jsx
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ② Layer Separation Principle */}
        <SectionTitle title="Layer Separation Principle" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '18%' }}>Layer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Import Rule</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Type Layer', 'schema.js', 'No imports', 'Constants · types · derivation functions · factory functions'],
                ['Parse Layer', 'parseInfluencerCsv.js', 'schema.js only', 'CSV text → Influencer[]'],
                ['State Layer', 'useCsvPolling.js', 'parseInfluencerCsv.js only', 'fetch + interval + React state'],
                ['Component Layer', 'each .jsx file', 'Receives data via props only', 'Rendering only. No business logic.'],
                ['Page Layer', 'Dashboard.stories.jsx', 'hook + components', 'Assembly and data flow wiring'],
              ].map(([layer, file, rule, role]) => (
                <TableRow key={layer}>
                  <TableCell sx={{ fontWeight: 600 }}>{layer}</TableCell>
                  <TableCell sx={{ ...mono }}>{file}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{rule}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ③ Phase 0 — schema.js */}
        <SectionTitle title="Phase 0 — schema.js Design" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Written first. Minimize changes after this. All derivation functions are pure (no side effects).
        </Typography>

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          Constants (Object.freeze)
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Constant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['TIERS', "{ TIER1: 'tier1', TIER2: 'tier2' }"],
                ['PLATFORMS', "{ INSTAGRAM: 'Instagram', TIKTOK: 'TikTok' }"],
                ['CATEGORIES', "{ GENERAL: 'general', KBEAUTY: 'kbeauty', SPECIFIC: 'specific' }"],
                ['SHEET_STATUS', "{ PROCESSING: 'Processing', DONE: 'Done' }"],
                ['SCHEDULE_GROUPS', "{ TODAY: 'today', UPCOMING: 'upcoming', PAST: 'past', NO_TIME: 'no-time' }"],
                ['OPINIONS', "{ USE: 'USE', MAYBE: 'MAYBE', DONT: \"DON'T\" }"],
                ['ALERT_FLAGS', '{ AGREEMENT_NO_ATTEND, ATTEND_NO_COLLABO, COLLABO_NO_CREDIT, CREDIT_SHARED_NO_USED }'],
              ].map(([name, val]) => (
                <TableRow key={name}>
                  <TableCell sx={{ ...mono }}>{name}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          Derivation Functions (pure functions)
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Function</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Input</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Returns</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Logic</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['deriveTier', 'barcode: string', 'TIERS value', 'length === 10 → tier1, length === 12 → tier2'],
                ['deriveScheduleGroup', 'scheduledTime: Date|null', 'SCHEDULE_GROUPS value', 'null → NO_TIME / today → TODAY / future → UPCOMING / past → PAST'],
                ['deriveAlertFlags', 'influencer: Influencer', 'ALERT_FLAGS[]', 'Evaluates boolean combinations. agreement && !attend → AGREEMENT_NO_ATTEND, etc.'],
                ['deriveKpiSummary', 'influencers: Influencer[]', 'KpiSummary', 'Aggregates each count via reduce + alertCount sum'],
              ].map(([fn, input, returns, logic]) => (
                <TableRow key={fn}>
                  <TableCell sx={{ ...mono }}>{fn}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{input}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{returns}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{logic}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          Factory Functions (safe defaults guaranteed)
        </Typography>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['createInfluencer(overrides)', 'Influencer', 'Sets safe defaults for all fields. Partial overrides via overrides param.'],
                ['createKpiSummary(overrides)', 'KpiSummary', 'Initializes all counts to 0'],
                ['createDataSourceConfig(overrides)', 'DataSourceConfig', 'Default pollingIntervalMs: 60000'],
              ].map(([fn, returns, desc]) => (
                <TableRow key={fn}>
                  <TableCell sx={{ ...mono }}>{fn}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary', width: '20%' }}>{returns}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ④ Phase 1 — Data Layer */}
        <SectionTitle title="Phase 1 — Data Layer" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>File</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Imports</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Input</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Returns</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Key Logic</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ ...mono }}>parseInfluencerCsv.js</TableCell>
                <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>schema.js only</TableCell>
                <TableCell sx={{ fontSize: 12 }}>CSV string + sheetStatus</TableCell>
                <TableCell sx={{ ...mono, fontSize: 11 }}>Influencer[]</TableCell>
                <TableCell sx={{ fontSize: 12 }}>Parse header row → createInfluencer per row → call 3 derive functions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ ...mono }}>useCsvPolling.js</TableCell>
                <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>parseInfluencerCsv.js only</TableCell>
                <TableCell sx={{ fontSize: 12 }}>DataSourceConfig</TableCell>
                <TableCell sx={{ ...mono, fontSize: 11 }}>{ '{ influencers, kpi, lastSyncedAt, isSyncing, error, refresh }' }</TableCell>
                <TableCell sx={{ fontSize: 12 }}>Fetch Processing + Done tabs simultaneously → parse → merge → repeat on 60s interval</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑤ Component Dependency Graph */}
        <SectionTitle title="Component Build Order (Dependency Graph)" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 2, lineHeight: 2, overflow: 'auto' }}>
{`[Phase 2] StatusIconRow          Receives 4 booleans only. No schema dependency.
               │
               ├────────────────────────────────────┐
               ↓                                    ↓
[Phase 3] InfluencerCard          ScheduleTimeline
          (uses StatusIconRow)     (uses StatusIconRow)

[Phase 3] KpiBar                  AlertBanner         SyncStatusBar
          KpiSummary shape         alertFlags[]        Date + onRefresh
               │                       │                    │
               └───────────────────────┴────────────────────┘
                                       ↓
[Phase 4]                   InfluencerDrawer
                            Influencer | null

               └───────────────────────────────────────────┘
                                       ↓
[Phase 5]               Page assembly (connect useCsvPolling)`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          Do not start a phase before its dependencies are complete. Components do not import schema.js directly.
        </Typography>

        {/* ⑥ Component Props Interface */}
        <SectionTitle title="Component Props Interface" />

        {[
          {
            phase: 2,
            name: 'StatusIconRow',
            path: 'components/data-display/StatusIconRow.jsx',
            desc: 'Single row of 4 status icons. Minimal atomic component with no schema dependency.',
            props: [
              ['agreement', 'boolean', 'false', 'Agreement completed'],
              ['attend', 'boolean', 'false', 'Visit completed'],
              ['collaboShared', 'boolean', 'false', 'Content uploaded'],
              ['creditShared', 'boolean', 'false', 'Credit sent'],
              ['size', 'number', '18', 'Icon size in px'],
            ],
          },
          {
            phase: 3,
            name: 'KpiBar',
            path: 'components/data-display/KpiBar.jsx',
            desc: 'Header KPI summary row. Displays 5 numbers with tabular-nums.',
            props: [
              ['kpi', 'KpiSummary', '—', '{ total, agreementCount, attendCount, collaboSharedCount, creditSharedCount, alertCount }'],
            ],
          },
          {
            phase: 3,
            name: 'AlertBanner',
            path: 'components/overlay-feedback/AlertBanner.jsx',
            desc: 'Alert cases banner. Renders nothing when alerts is an empty array.',
            props: [
              ['alerts', '{ flag, label, count }[]', '[]', 'List of alert cases to display. Empty array → renders nothing.'],
            ],
          },
          {
            phase: 3,
            name: 'SyncStatusBar',
            path: 'components/layout/SyncStatusBar.jsx',
            desc: 'Last sync timestamp + manual refresh button.',
            props: [
              ['lastSyncedAt', 'Date | null', 'null', 'Timestamp of last successful sync'],
              ['isSyncing', 'boolean', 'false', 'Whether polling is in progress (spinner icon)'],
              ['onRefresh', 'function', '—', 'Refresh button click handler [Required]'],
            ],
          },
          {
            phase: 3,
            name: 'InfluencerCard',
            path: 'components/card/InfluencerCard.jsx',
            desc: '3-layer card. Hero (name + time) / Status (4 icons) / Alert badges. Uses StatusIconRow.',
            props: [
              ['influencer', 'Influencer', '—', 'Influencer object [Required]'],
              ['onClick', 'function', '—', 'Card click → open Drawer [Required]'],
              ['isSelected', 'boolean', 'false', 'Highlights card currently open in the Drawer'],
            ],
          },
          {
            phase: 3,
            name: 'ScheduleTimeline',
            path: 'components/data-display/ScheduleTimeline.jsx',
            desc: 'Visit list sorted by time. Auto-groups into TODAY / UPCOMING / NO TIME SET. Uses StatusIconRow.',
            props: [
              ['influencers', 'Influencer[]', '[]', 'Full influencer list (grouped internally by scheduleGroup)'],
              ['onSelect', 'function', '—', 'Row click → open Drawer [Required]'],
              ['selectedId', 'string | null', 'null', 'Currently selected influencer id (row highlight)'],
            ],
          },
          {
            phase: 4,
            name: 'InfluencerDrawer',
            path: 'components/overlay-feedback/InfluencerDrawer.jsx',
            desc: 'Right-slide detail panel. 6 performance metrics + Note + Collabo Link + Opinion.',
            props: [
              ['influencer', 'Influencer | null', 'null', 'Influencer to display. null empties the Drawer.'],
              ['open', 'boolean', 'false', 'Whether the Drawer is open [Required]'],
              ['onClose', 'function', '—', 'Drawer close handler [Required]'],
            ],
          },
        ].map(({ phase, name, path, desc, props }) => (
          <Box key={name} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Tag label={`Phase ${phase}`} color={phaseColor(phase)} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{name}</Typography>
              <Typography variant="caption" sx={{ ...mono, color: 'text.disabled' }}>{path}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{desc}</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '22%' }}>Prop</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '26%' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '12%' }}>Default</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.map(([prop, type, def, propDesc]) => (
                    <TableRow key={prop}>
                      <TableCell sx={{ ...mono }}>{prop}</TableCell>
                      <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{type}</TableCell>
                      <TableCell sx={{ ...mono, fontSize: 11, color: 'text.disabled' }}>{def}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{propDesc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Divider sx={{ my: 4 }} />

        {/* ⑦ Phase 5 — Page Assembly */}
        <SectionTitle title="Phase 5 — Page Assembly" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 2, lineHeight: 1.8, overflow: 'auto' }}>
{`useCsvPolling(DataSourceConfig)
  → { influencers, kpi, lastSyncedAt, isSyncing, error, refresh }

AppShell
├── Header (sticky)
│   ├── KpiBar          kpi={kpi}
│   └── SyncStatusBar   lastSyncedAt isSyncing onRefresh={refresh}
│
├── Left Panel (264px fixed)
│   └── ScheduleTimeline
│         influencers={influencers}
│         onSelect={handleSelect}
│         selectedId={selectedId}
│
└── Right Main (scrollable)
    ├── AlertBanner     alerts={derivedAlerts}
    ├── FilterBar
    ├── CategoryTab     (Processing / Done)
    └── Grid
        └── InfluencerCard × n
              influencer={item}
              onClick={handleSelect}
              isSelected={selectedId === item.id}

InfluencerDrawer
  influencer={selectedInfluencer}
  open={drawerOpen}
  onClose={handleClose}`}
        </Box>

        {/* ⑧ Task Order Checklist */}
        <SectionTitle title="Task Order Checklist" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>Phase</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '40%' }}>File</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Done When</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Phase 0', 'src/data/beautymaster/schema.js', 'Constants · derivation functions · factory functions exported. No imports.'],
                ['Phase 1-a', 'src/utils/parseInfluencerCsv.js', 'CSV string → Influencer[] conversion works correctly'],
                ['Phase 1-b', 'src/hooks/useCsvPolling.js', '60s polling + manual refresh + error state returned'],
                ['Phase 2', 'StatusIconRow.jsx + .stories.jsx', '4 icons complete/incomplete states verified in stories'],
                ['Phase 3-a', 'KpiBar.jsx + .stories.jsx', 'Renders correctly with KpiSummary mock data'],
                ['Phase 3-b', 'AlertBanner.jsx + .stories.jsx', 'Empty array → renders nothing; data → banner visible'],
                ['Phase 3-c', 'SyncStatusBar.jsx + .stories.jsx', 'Sync time format + spinner state verified'],
                ['Phase 3-d', 'InfluencerCard.jsx + .stories.jsx', '3-layer hierarchy (Hero/Status/Alert) verified in stories'],
                ['Phase 3-e', 'ScheduleTimeline.jsx + .stories.jsx', 'TODAY/UPCOMING/no-time auto-grouping verified'],
                ['Phase 4', 'InfluencerDrawer.jsx + .stories.jsx', 'Metrics + Note + Collabo Link render verified'],
                ['Phase 5', 'BeautymasterDashboard.stories.jsx', 'useCsvPolling connected + full layout assembled'],
              ].map(([phase, file, condition]) => (
                <TableRow key={phase + file}>
                  <TableCell><Tag label={phase} color={phaseColor(parseInt(phase.replace('Phase ', '')))} /></TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{file}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{condition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
