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
function buildFunnelRows(funnel, funnelMeasured = {}) {
  /* 초대 데이터(Number 탭)가 없으면 schema가 invited를 시트 행 수로 대체하고
     responded 단계를 뺀다. 그 상태에서 첫 줄을 "Invited"라고 부르면 실제로는
     추적 중인 행 수인데 초대 인원으로 읽힌다 — 분모를 잘못 알려주는 셈이다. */
  const hasInviteData = funnel?.responded !== undefined && funnel?.responded !== null;

  const steps = FUNNEL_STEPS
    .map(s => ({ ...s, value: funnel?.[s.key], isMeasured: funnelMeasured[s.key] !== false }))
    .filter(s => s.value !== undefined && s.value !== null);
  if (steps.length === 0) return [];

  const top = steps[0].value || 0;
  return steps.map((step, i) => {
    const prev = steps[i - 1];
    /* 아직 아무도 기록하지 않은 단계는 0이 아니라 "모른다"다.
       0으로 계산하면 "발급분 전량 미사용" 같은 없는 사실이 만들어진다.
       직전 단계가 미측정이면 그 다음 비율도 낼 수 없다. */
    return {
      ...step,
      label: step.key === 'invited' && !hasInviteData ? 'Tracked' : step.label,
      ofInvited: step.isMeasured && top > 0 ? step.value / top : null,
      ofPrevious: i === 0 || !step.isMeasured || !prev.isMeasured
        ? null
        : (prev.value > 0 ? step.value / prev.value : 0),
    };
  });
}

/**
 * NotMeasuredBadge — 시트에 값이 하나도 적히지 않은 단계에 붙는 표시.
 *
 * 값이 0인 것과 아직 아무도 적지 않은 것은 다르다. 시트의 credit used 열은
 * 지금 비어 있는데, 이걸 0으로 두면 "발급한 33건이 전량 미사용"으로 읽힌다.
 * 열에 값이 들어오기 시작하면 배지가 사라지고 계산이 정상화된다.
 */
function NotMeasuredBadge() {
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
      not measured
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                width: step.ofInvited == null ? 0 : `${Math.min(step.ofInvited, 1) * 100}%`,
                height: '100%',
                backgroundColor: alpha(theme.palette.accent.main, 0.62),
              })}
            />
          </Box>
          {/* 수와 비율은 자릿수가 달라 붙여두면 어느 쪽이 어느 쪽인지 매번 읽어야 한다.
              각각 고정폭 우측 정렬로 나눈다. 배지는 그 밖에 둔다 —
              폭 안에 넣으면 눌려서 "0"과 "0%"가 두 줄로 갈라진다. */}
          <Typography data-funnel-value sx={{ width: 40, flexShrink: 0, textAlign: 'right', fontSize: 13, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
            {step.isMeasured ? step.value : '—'}
          </Typography>
          <Typography sx={{ width: 40, flexShrink: 0, textAlign: 'right', fontSize: 13, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            {step.ofInvited == null ? '—' : pct(step.ofInvited)}
          </Typography>
          {/* 배지 자리는 항상 잡아둔다. 있는 행에만 렌더하면 그 행만 flex 항목이
              하나 더 생겨 트랙(flex:1)이 줄고 숫자 컬럼이 밀린다. */}
          <Box sx={{ width: 92, flexShrink: 0 }}>
            {!step.isMeasured && <NotMeasuredBadge />}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/**
 * StageDropOff — 단계 사이에서 몇 명이 빠졌는지.
 *
 * 막대는 "각 단계에 몇 명 남았나"만 보여줘서 어디서 새는지가 안 보인다.
 * Table 뷰의 % of previous를 그대로 쓰고(같은 rows에서 파생) 실제 감소 인원을 함께 적는다.
 * 막대를 늘려서 빈 공간을 채우면 작은 값이 실선이 되므로, 폭 대신 정보를 넣는다.
 *
 * Props:
 * @param {Array} rows - buildFunnelRows() 결과 [Required]
 */
function StageDropOff({ rows }) {
  if (rows.length < 2) return null;

  const pairs = rows.slice(1).map((cur, i) => {
    // 어느 한쪽이 미측정이면 이탈을 계산할 수 없다 — 0%/-33 같은 수치를 만들지 않는다
    const isMeasured = cur.isMeasured && rows[i].isMeasured;
    return {
      key: cur.key,
      from: rows[i].label,
      to: cur.label,
      isMeasured,
      rate: isMeasured ? cur.ofPrevious ?? 0 : null,
      delta: isMeasured ? cur.value - rows[i].value : null,
    };
  });

  // 가장 많이 빠진 구간 하나만 강조한다 — 여러 개를 칠하면 강조가 아니게 된다
  const measured = pairs.filter(p => p.isMeasured);
  const worstDelta = measured.length > 0 ? Math.min(...measured.map(p => p.delta)) : 0;
  const hasLoss = worstDelta < 0;

  return (
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
        Stage drop-off
      </Typography>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '6px', overflow: 'hidden' }}>
        {pairs.map((p, i) => {
          const isWorst = hasLoss && p.delta === worstDelta;
          return (
            <Box
              key={p.key}
              data-dropoff-step={p.key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.875,
                borderTop: i === 0 ? 'none' : '1px solid',
                borderColor: 'divider',
                backgroundColor: isWorst ? theme => alpha(theme.palette.warning.main, 0.06) : 'transparent',
              }}
            >
              <Typography sx={{ flex: 1, minWidth: 0, fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.from} <Box component="span" sx={{ color: 'text.disabled' }}>→</Box> {p.to}
              </Typography>
              <Typography sx={{ width: p.isMeasured ? 44 : 'auto', flexShrink: 0, textAlign: 'right', fontSize: 12, color: p.isMeasured ? 'text.primary' : 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {p.isMeasured ? pct(p.rate) : 'not measured'}
              </Typography>
              <Typography
                data-dropoff-delta
                sx={{
                  width: 52, flexShrink: 0, textAlign: 'right',
                  fontSize: 12, fontVariantNumeric: 'tabular-nums',
                  fontWeight: isWorst ? 600 : 400,
                  color: isWorst ? 'warning.main' : 'text.secondary',
                }}
              >
                {!p.isMeasured ? '' : p.delta === 0 ? '0' : p.delta}
              </Typography>
            </Box>
          );
        })}
      </Box>
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
                {!row.isMeasured && <NotMeasuredBadge />}
              </TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {row.isMeasured ? row.value : '—'}
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {row.ofInvited == null ? '—' : pct(row.ofInvited)}
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
/**
 * 표본이 작으면 퍼센트만으로는 오해가 생긴다.
 * "kbeauty 100%"가 2명 중 2명인지 20명 중 20명인지 알 수 없고, 앞의 경우 한 명이
 * 빠지면 50%가 된다. n < 10이면 원시 분수를 함께 적어 흔들림의 크기를 드러낸다.
 */
const SMALL_SAMPLE = 10;

/**
 * Rate — 비율 + (표본이 작을 때) 원시 분수
 *
 * Props:
 * @param {number} rate - 0~1 비율 [Required]
 * @param {number} numerator - 분자 [Required]
 * @param {number} denominator - 분모 [Required]
 */
function Rate({ rate, numerator, denominator }) {
  const isSmall = denominator > 0 && denominator < SMALL_SAMPLE;
  return (
    <>
      {pct(rate)}
      {isSmall && (
        <Box component="span" sx={{ ml: 0.5, fontSize: 11, color: 'text.secondary' }}>
          ({numerator}/{denominator})
        </Box>
      )}
    </>
  );
}

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
                <Rate rate={row.attendRate} numerator={row.attendCount ?? 0} denominator={row.count ?? 0} />
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                <Rate rate={row.uploadRate} numerator={row.collaboSharedCount ?? 0} denominator={row.attendCount ?? 0} />
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
      {/* 같은 수를 Campaign Summary의 Tracked 카드가 이미 말한다 —
          한 화면에 같은 숫자를 두 번 두지 않는다. */}
      <SaasStoreSelect stores={storeOptions} value={selectedStore} onChange={onStoreChange} />
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
  const funnelRows = buildFunnelRows(f, summary.funnelMeasured || {});

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
        {/* 요약 카드는 agreement 기준, 퍼널은 invited 기준이라 한 화면에 모수가 둘이다.
            어느 쪽을 보고 있는지 제목에 적어둔다. */}
        <SectionTitle
          title={`Conversion Funnel — of ${funnelRows[0]?.value ?? 0} ${(funnelRows[0]?.label ?? '').toLowerCase()}`}
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
        {funnelView === 'bar' ? (
          /* 막대는 폭을 늘리지 않는다 — 늘리면 작은 값이 실선이 되어 오히려 안 보인다.
             남는 폭에는 막대가 답하지 못하는 것(어디서 새는지)을 넣는다. */
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '55fr 45fr' }, gap: 3, alignItems: 'start' }}>
            <FunnelBar rows={funnelRows} />
            <StageDropOff rows={funnelRows} />
          </Box>
        ) : (
          <FunnelTable rows={funnelRows} />
        )}
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

      {/* Breakdown — Platform | Category | Tier 한 줄.
          각 표의 첫 컬럼 헤더가 이미 그룹 이름이라 소제목을 따로 두지 않는다
          (전에는 "Tier"가 섹션 제목·소제목·컬럼 헤더에 세 번 나왔다). */}
      <Box sx={{ mb: 4 }}>
        <SectionTitle title="Breakdown" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3, alignItems: 'start' }}>
          <BreakdownTable groupHeader="Platform" rows={Object.entries(summary.byPlatform || {}).map(([p, st]) => ({ label: p, ...st }))} />
          <BreakdownTable groupHeader="Category" rows={Object.entries(summary.byCategory || {}).map(([c, st]) => ({ label: c, ...st }))} />
          <BreakdownTable groupHeader="Tier" rows={tierRows} />
        </Box>
      </Box>

      {/* Store — 단일 스토어를 고른 상태에서는 행이 하나뿐이라 비교할 게 없다 */}
      {selectedStore === ALL_STORES && (
        <Box>
          <SectionTitle title="Store" />
          <BreakdownTable groupHeader="Store" rows={storeRows} />
        </Box>
      )}
      </Box>
    </>
  );
}

export default SaasAnalyticsView;
