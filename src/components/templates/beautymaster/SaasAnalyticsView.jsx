import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { deriveAnalyticsSummary } from '../../../data/beautymaster/schema.js';
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
 * SummaryCard — KPI 요약 카드 (border only, no shadow)
 *
 * Props:
 * @param {string} label - 라벨 [Required]
 * @param {string} value - 값 [Required]
 * @param {string} description - 부가 설명 [Optional]
 */
function SummaryCard({ label, value, description }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        p: 2,
        minWidth: 120,
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1, mb: 0.5, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>{description}</Typography>
      )}
    </Box>
  );
}

/**
 * FunnelBar — 퍼널 단계별 수평 바 (flat-SaaS: primary 1색, 페이드)
 *
 * Props:
 * @param {object} funnel - Funnel 데이터 [Required]
 */
function FunnelBar({ funnel }) {
  const steps = [
    { key: 'invited', label: 'Invited' },
    { key: 'responded', label: 'Responded' },
    { key: 'agreement', label: 'Agreement' },
    { key: 'attended', label: 'Visited' },
    { key: 'uploaded', label: 'Uploaded' },
    { key: 'creditSent', label: 'Credit sent' },
    { key: 'creditUsed', label: 'Credit used' },
  ];

  const data = steps
    .map(s => ({ ...s, value: funnel?.[s.key] }))
    .filter(s => s.value !== undefined && s.value !== null);

  if (data.length === 0) return <Typography sx={{ color: 'text.disabled' }}>No funnel data</Typography>;

  const max = Math.max(...data.map(s => s.value), 1);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 600 }}>
      {data.map((step, idx) => (
        <Box key={step.key} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ width: 80, flexShrink: 0, fontSize: 13, color: 'text.secondary' }}>
            {step.label}
          </Typography>
          <Box sx={{ flex: 1, height: 18, backgroundColor: 'grey.100', borderRadius: '4px', overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${(step.value / max) * 100}%`,
                height: '100%',
                backgroundColor: 'primary.main',
                opacity: 1 - idx * 0.08,
              }}
            />
          </Box>
          <Typography sx={{ width: 68, flexShrink: 0, fontSize: 13, fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {step.value} {pct(step.value / max)}
          </Typography>
        </Box>
      ))}
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
  return (
    <Box sx={{ overflowX: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: 11, fontWeight: 500, color: 'text.secondary', backgroundColor: 'grey.50', py: 0.75 } }}>
            <TableCell>{groupHeader}</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">Visit rate</TableCell>
            <TableCell align="right">Upload rate</TableCell>
            <TableCell align="right">Avg views</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.label}
              sx={{
                '& td': { fontSize: 13, py: 0.875 },
                '&:hover': { backgroundColor: 'grey.50' },
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
              <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {row.avgViews != null ? formatCompact(row.avgViews) : '—'}
              </TableCell>
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
 *
 * Example usage:
 * <SaasAnalyticsView influencers={influencers} inviteCounts={inviteCounts} />
 */
function SaasAnalyticsView({ influencers, inviteCounts = {} }) {
  const [funnelView, setFunnelView] = useState('bar');

  const filtered = useMemo(() => influencers, [influencers]);
  const filteredInviteCounts = useMemo(() => inviteCounts, [inviteCounts]);

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

  if (filtered.length === 0) {
    return (
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 3, py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          No data yet — select a store to see campaign analytics
        </Typography>
      </Box>
    );
  }

  const f = summary.funnel || {};
  const visitRate = f.agreement > 0 ? f.attended / f.agreement : 0;
  const uploadRate = f.attended > 0 ? f.uploaded / f.attended : 0;

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 3, py: 3 }}>
      {/* Summary — KPI 카드 행 */}
      <Box sx={{ mb: 4 }}>
        <SectionTitle title="Campaign Summary" />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <SummaryCard label="Tracked" value={filtered.length} />
          <SummaryCard label="Visit rate" value={pct(visitRate)} />
          <SummaryCard label="Upload rate" value={pct(uploadRate)} />
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
        {funnelView === 'bar' ? (
          <FunnelBar funnel={summary.funnel} />
        ) : (
          <BreakdownTable groupHeader="Stage" rows={Object.entries(summary.funnel || {}).map(([k, v]) => ({ label: k, count: v, attendRate: 1, uploadRate: 1, avgViews: null }))} />
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
        <SectionTitle title="Tier & Store" />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>Tier</Typography>
            <BreakdownTable groupHeader="Tier" rows={tierRows} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>Store</Typography>
            <BreakdownTable groupHeader="Store" rows={storeRows} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SaasAnalyticsView;
