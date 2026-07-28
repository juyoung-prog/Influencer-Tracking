import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SaasKpiItem from './SaasKpiItem';
import Typography from '@mui/material/Typography';
import SaasStoreSelect from './SaasStoreSelect';
import { ALL_STORES, deriveAnalyticsSummary, deriveStores } from '../../../data/beautymaster/schema.js';
import { formatCompact } from '../../../data/beautymaster/mentions.js';

const pct = rate => `${Math.round((rate || 0) * 100)}%`;

/**
 * SectionTitle — flat-SaaS 섹션 헤더
 *
 * Props:
 * @param {string} title - 섹션 제목 [Required]
 * @param {node} action - 우측 액션(버튼 등) [Optional]
 */
function SectionTitle({ title, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography component="h2" sx={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
        {title}
      </Typography>
      {action}
    </Box>
  );
}

/**
 * 퍼널 단계 정의 — Bars와 Table이 **같은 배열**을 쓴다.
 * 라벨을 두 곳에 두면 한쪽만 고쳐져서 갈라진다(Table에 raw 필드명이 나오던 원인).
 */
const FUNNEL_STEPS = [
  { key: 'invited', label: 'Invited' },
  { key: 'responded', label: 'Responded' },
  { key: 'agreement', label: 'Agreement' },
  { key: 'attended', label: 'Visited' },
  { key: 'uploaded', label: 'Uploaded' },
  { key: 'creditSent', label: 'Credit sent' },
  { key: 'creditUsed', label: 'Credit used' },
];

/**
 * 퍼널 행을 한 번만 만들어 Bars/Table이 공유한다.
 *
 * 비율을 두 가지로 낸다 — 하나만 쓰면 읽는 사람이 분모를 착각한다.
 * - ofInvited: 맨 위 단계 대비. 전체 전환율.
 * - ofPrevious: 직전 단계 대비. 어디서 빠지는지.
 *
 * @param {object} funnel - deriveAnalyticsSummary().funnel
 * @returns {Array<{key,label,value,ofInvited,ofPrevious}>}
 */
function buildFunnelRows(funnel) {
  /* 초대 데이터(Number 탭)가 없으면 schema가 invited를 시트 행 수로 대체하고
     responded 단계를 뺀다. 그 상태에서 첫 줄을 "Invited"라고 부르면 실제로는
     추적 중인 행 수인데 초대 인원으로 읽힌다 — 분모를 잘못 알려주는 셈이다. */
  const hasInviteData = funnel?.responded !== undefined && funnel?.responded !== null;

  const steps = FUNNEL_STEPS
    .map(s => ({ ...s, value: funnel?.[s.key] }))
    .filter(s => s.value !== undefined && s.value !== null);
  if (steps.length === 0) return [];

  const top = steps[0].value || 0;
  return steps.map((step, i) => ({
    ...step,
    label: step.key === 'invited' && !hasInviteData ? 'Tracked' : step.label,
    ofInvited: top > 0 ? step.value / top : 0,
    // 첫 단계는 직전이 없다. 0으로 나누지 않도록 분모를 확인한다.
    ofPrevious: i === 0 ? null : (steps[i - 1].value > 0 ? step.value / steps[i - 1].value : 0),
  }));
}

/**
 * NoDataBadge — 값이 0인 단계에 붙는 표시.
 *
 * 0이 "아무도 안 했다"인지 "아직 시트에 연결이 안 됐다"인지 집계만 봐서는 구분되지
 * 않는다. 그래서 단정하지 않고 관찰된 사실("기록된 값이 없다")만 적는다.
 * 실제로 시트의 credit used 컬럼은 값이 하나도 없다.
 */
function NoDataBadge() {
  return (
    <Typography
      component="span"
      sx={{
        ml: 0.75, px: 0.625, py: 0.125,
        fontSize: 10, fontWeight: 500, lineHeight: 1.6,
        color: 'text.secondary',
        backgroundColor: 'surface.muted',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
      }}
    >
      none recorded
    </Typography>
  );
}

/**
 * FunnelBar — 퍼널 단계별 수평 바
 *
 * Props:
 * @param {Array} rows - buildFunnelRows() 결과 [Required]
 */
function FunnelBar({ rows }) {
  if (rows.length === 0) return <Typography sx={{ color: 'text.secondary' }}>No funnel data</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 720 }}>
      {rows.map(step => (
        <Box key={step.key} data-funnel-step={step.key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography data-funnel-label sx={{ width: 84, flexShrink: 0, fontSize: 13, color: 'text.secondary' }}>
            {step.label}
          </Typography>
          <Box sx={{ flex: 1, height: 18, backgroundColor: 'surface.muted', borderRadius: '6px', overflow: 'hidden' }}>
            <Box
              sx={theme => ({
                // 단계마다 톤을 달리하면 의미 없는 차이를 만든다 — 한 색으로 고정하고,
                // 순수 #0000FF는 톤이 너무 튀므로 primary.dark를 낮은 불투명도로 쓴다.
                width: `${Math.min(step.ofInvited, 1) * 100}%`,
                height: '100%',
                backgroundColor: alpha(theme.palette.primary.dark, 0.62),
              })}
            />
          </Box>
          {/* 값은 고정폭으로 자릿수를 맞추고, 배지는 그 밖에 둔다 —
              안에 넣으면 폭에 눌려 "0"과 "0%"가 두 줄로 갈라진다. */}
          <Typography data-funnel-value sx={{ width: 74, flexShrink: 0, textAlign: 'right', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {step.value} {pct(step.ofInvited)}
          </Typography>
          <Box sx={{ width: 96, flexShrink: 0 }}>{step.value === 0 && <NoDataBadge />}</Box>
        </Box>
      ))}
    </Box>
  );
}

/**
 * FunnelTable — Bars와 같은 행을 표로 보여준다.
 *
 * Breakdown 테이블(Visit rate / Upload rate)을 재사용하던 것을 분리했다.
 * 스키마가 달라서 모든 행이 100%로 나오고 있었다.
 *
 * Props:
 * @param {Array} rows - buildFunnelRows() 결과 [Required]
 */
function FunnelTable({ rows }) {
  if (rows.length === 0) return <Typography sx={{ color: 'text.secondary' }}>No funnel data</Typography>;

  // 분모는 맨 윗 단계다. 초대 데이터가 없으면 그 단계가 "Tracked"이므로 헤더도 따라간다.
  const baseLabel = rows[0].label.toLowerCase();

  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: '6px' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: 11, fontWeight: 500, color: 'text.secondary', backgroundColor: 'surface.sunken', py: 0.75, whiteSpace: 'nowrap' } }}>
            <TableCell>Stage</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">% of { baseLabel }</TableCell>
            <TableCell align="right">% of previous</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.key} data-funnel-step={row.key} sx={{ '& td': { fontSize: 13, py: 0.875 }, '&:hover': { backgroundColor: 'action.hover' } }}>
              <TableCell sx={{ fontWeight: 500 }}>
                {row.label}
                {row.value === 0 && <NoDataBadge />}
              </TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>{row.value}</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {pct(row.ofInvited)}
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {row.ofPrevious == null ? '—' : pct(row.ofPrevious)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

/**
 * BreakdownTable — 그룹별 테이블
 *
 * Props:
 * @param {string} groupHeader - 첫 컬럼 헤더 [Required]
 * @param {Array} rows - 행 목록 [Required]
 */
function BreakdownTable({ groupHeader, rows }) {
  // 전 행이 비어 있으면 "—"만 늘어선 컬럼이 남는다 — 데이터가 붙기 전까지 숨긴다
  const hasAvgViews = rows.some(r => r.avgViews != null);

  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: '6px' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: 11, fontWeight: 500, color: 'text.secondary', backgroundColor: 'surface.sunken', py: 0.75 } }}>
            <TableCell>{groupHeader}</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">Visit rate</TableCell>
            <TableCell align="right">Upload rate</TableCell>
            {hasAvgViews && <TableCell align="right">Avg views</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.label}
              sx={{
                '& td': { fontSize: 13, py: 0.875 },
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {row.count}
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {pct(row.attendRate)}
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {pct(row.uploadRate)}
              </TableCell>
              {hasAvgViews && (
                <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {row.avgViews != null ? formatCompact(row.avgViews) : '—'}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

/**
 * SaasAnalyticsView component
 *
 * flat-SaaS 시안 Analytics 뷰 — 기존 AnalyticsDashboard의 4섹션 구조(Summary/Funnel/Breakdown/Tier&Store)를
 * flat-SaaS 표면 문법으로 구성. border + spacing으로만 섹션 구분, accent는 primary 1색.
 *
 * Props:
 * @param {Influencer[]} influencers - 전체 인플루언서 목록 [Required]
 * @param {object} inviteCounts - 초대 인원 데이터 [Optional, 기본값: {}]
 * @param {string[]} stores - 스토어 선택 옵션 목록. 없으면 influencers에서 파생 [Optional]
 * @param {string} selectedStore - 선택된 스토어 ('all'이면 전체). 세 뷰가 공유 [Optional, 기본값: 'all']
 * @param {function} onStoreChange - 스토어 변경 핸들러 (store) => void [Optional]
 *
 * Example usage:
 * <SaasAnalyticsView influencers={influencers} inviteCounts={inviteCounts} />
 */
function SaasAnalyticsView({
  influencers,
  inviteCounts = {},
  stores = null,
  selectedStore = ALL_STORES,
  onStoreChange,
}) {
  const [funnelView, setFunnelView] = useState('bar');

  const derivedStores = useMemo(() => deriveStores(influencers), [influencers]);
  const storeOptions = stores ?? derivedStores;

  const filtered = useMemo(
    () => (selectedStore === ALL_STORES
      ? influencers
      : influencers.filter(inf => inf.store === selectedStore)),
    [influencers, selectedStore],
  );

  /** 초대 인원도 같은 스토어로 좁힌다 — 퍼널 Invited 단계가 목록과 어긋나지 않도록 */
  const filteredInviteCounts = useMemo(() => {
    if (selectedStore === ALL_STORES) return inviteCounts;
    return inviteCounts[selectedStore] ? { [selectedStore]: inviteCounts[selectedStore] } : {};
  }, [inviteCounts, selectedStore]);

  const summary = useMemo(() => deriveAnalyticsSummary(filtered, filteredInviteCounts), [filtered, filteredInviteCounts]);

  const storeRows = useMemo(
    () => Object.entries(summary.byStore || {}).map(([store, stats]) => ({ label: store, ...stats })),
    [summary],
  );

  const tierRows = useMemo(
    () => [
      { label: 'Tier 1', ...(summary.byTier?.tier1 || {}) },
      { label: 'Tier 2', ...(summary.byTier?.tier2 || {}) },
    ].filter(r => r.count > 0),
    [summary],
  );

  /** 스토어 선택은 Operations·Workflow와 공유하는 상태라 데이터가 없을 때도 계속 보인다 */
  const toolbar = (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 3,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <SaasStoreSelect stores={storeOptions} value={selectedStore} onChange={onStoreChange} />
      <Typography sx={{ ml: 'auto', fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
        {filtered.length} tracked
      </Typography>
    </Box>
  );

  if (filtered.length === 0) {
    return (
      <>
        {toolbar}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 3, py: 8, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {selectedStore === ALL_STORES
              ? 'No data yet — campaign analytics appear once the sheet has rows'
              : `No data for ${selectedStore}`}
          </Typography>
        </Box>
      </>
    );
  }

  const f = summary.funnel || {};
  const visitRate = f.agreement > 0 ? f.attended / f.agreement : 0;
  const uploadRate = f.attended > 0 ? f.uploaded / f.attended : 0;
  const funnelRows = buildFunnelRows(f);

  /* 초대 데이터가 지금 보고 있는 스토어 전부를 덮지 못하면 "% of invited"의 분모가
     실제보다 좁거나 넓다. 시트의 Number 탭에는 G10만 있다 — 조용히 비율을 내면
     읽는 사람이 전체 캠페인 전환율로 오해한다. */
  const inviteStores = Object.keys(filteredInviteCounts || {});
  const trackedStores = [...new Set(filtered.map(i => i.store).filter(Boolean))];
  const uncoveredStores = trackedStores.filter(s => !inviteStores.includes(s));
  const hasInviteData = inviteStores.length > 0;
  const inviteGap = hasInviteData && uncoveredStores.length > 0 ? { inviteStores, uncoveredStores } : null;

  return (
    <>
      {toolbar}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 3, py: 3 }}>
      {/* Summary — KPI 카드 행 */}
      <Box sx={{ mb: 4 }}>
        <SectionTitle title="Campaign Summary" />
        {/* Operations와 같은 KPI 스트립 — 카드가 아니라 배경 위에 직접 놓고
            좌측 divider로만 셀을 나눈다. 같은 지표를 화면마다 다르게 그리지 않는다. */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', rowGap: 2 }}>
          <SaasKpiItem label="Tracked" value={filtered.length} isFirst />
          <SaasKpiItem label="Visit rate (of agreement)" value={pct(visitRate)} />
          <SaasKpiItem label="Upload rate (of visited)" value={pct(uploadRate)} />
        </Box>
      </Box>

      {/* Funnel — 수평 바 또는 테이블 토글 */}
      <Box sx={{ mb: 4 }}>
        <SectionTitle
          title="Conversion Funnel"
          action={
            <ToggleButtonGroup
              size="small"
              value={funnelView}
              exclusive
              onChange={(_, val) => val && setFunnelView(val)}
            >
              <ToggleButton value="bar" sx={{ px: 1.25, py: 0.25, fontSize: 11 }}>Bars</ToggleButton>
              <ToggleButton value="table" sx={{ px: 1.25, py: 0.25, fontSize: 11 }}>Table</ToggleButton>
            </ToggleButtonGroup>
          }
        />
        {funnelView === 'bar' ? <FunnelBar rows={funnelRows} /> : <FunnelTable rows={funnelRows} />}
        {inviteGap && (
          <Typography sx={{ mt: 1.5, fontSize: 11, color: 'text.secondary', lineHeight: 1.5 }}>
            Invite data covers {inviteGap.inviteStores.join(', ')} only —
            {' '}“% of invited” excludes {inviteGap.uncoveredStores.length} tracked{' '}
            {inviteGap.uncoveredStores.length === 1 ? 'store' : 'stores'} ({inviteGap.uncoveredStores.join(', ')}).
          </Typography>
        )}
        {!hasInviteData && (
          <Typography sx={{ mt: 1.5, fontSize: 11, color: 'text.secondary', lineHeight: 1.5 }}>
            No invite data for this store — the funnel starts from tracked sheet rows, not people invited.
          </Typography>
        )}
      </Box>

      {/* Breakdown — Platform + Category */}
      <Box sx={{ mb: 4 }}>
        <SectionTitle title="Breakdown" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>Platform</Typography>
            <BreakdownTable groupHeader="Platform" rows={Object.entries(summary.byPlatform || {}).map(([p, s]) => ({ label: p, ...s }))} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>Category</Typography>
            <BreakdownTable groupHeader="Category" rows={Object.entries(summary.byCategory || {}).map(([c, s]) => ({ label: c, ...s }))} />
          </Box>
        </Box>
      </Box>

      {/* Tier & Store — 2행 또는 2열 테이블 */}
      <Box>
        <SectionTitle title={ selectedStore === ALL_STORES ? 'Tier & Store' : 'Tier' } />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>Tier</Typography>
            <BreakdownTable groupHeader="Tier" rows={tierRows} />
          </Box>
          {/* 단일 스토어를 고른 상태에서는 행이 하나뿐이라 비교할 게 없다 */}
          {selectedStore === ALL_STORES && (
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>Store</Typography>
              <BreakdownTable groupHeader="Store" rows={storeRows} />
            </Box>
          )}
        </Box>
      </Box>
      </Box>
    </>
  );
}

export default SaasAnalyticsView;
