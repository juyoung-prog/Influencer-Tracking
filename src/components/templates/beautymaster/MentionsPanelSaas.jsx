import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import '@fontsource-variable/inter';
import MentionListRowSaas from '../../data-display/MentionListRowSaas';
import { SearchBar } from '../../input/SearchBar';
import {
  MENTION_QUALIFICATIONS,
  MENTION_STATUSES,
  MENTION_STATUS_LABELS,
  MENTION_THRESHOLDS,
  deriveMentionKpi,
} from '../../../data/beautymaster/mentions.js';

/** 시안 전용 표면 토큰 — 모던 SaaS 문법 (라운드 카드 + 소프트 섀도 + Inter) */
const SAAS_FONT = '"Inter Variable", Inter, "Pretendard Variable", Pretendard, sans-serif';
const SAAS_CARD_SX = {
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.100',
  borderRadius: '16px',
  boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06)',
};
const CHIP_SX = { height: 30, fontSize: 12, fontFamily: 'inherit', fontWeight: 500, borderRadius: '999px' };

const PLATFORM_OPTIONS = ['Instagram', 'TikTok'];
const STATUS_OPTIONS = [
  MENTION_STATUSES.NEW,
  MENTION_STATUSES.REVIEWED,
  MENTION_STATUSES.CONTACTED,
];

/**
 * MentionStatCard — KPI 스탯 카드 (SaaS 시안: 개별 라운드 카드)
 *
 * @param {string} label
 * @param {string|number} value
 * @param {boolean} isAlert - warning 강조 (review queue pending)
 */
function MentionStatCard({ label, value, isAlert = false }) {
  return (
    <Box sx={{ ...SAAS_CARD_SX, flex: '1 1 140px', minWidth: 128, px: 2.5, py: 2 }}>
      <Typography
        sx={{
          display: 'block',
          fontFamily: 'inherit',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: isAlert ? 'warning.main' : 'text.secondary',
          lineHeight: 1,
          mb: 1.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        component="span"
        sx={{
          fontFamily: 'inherit',
          lineHeight: 1,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: isAlert ? 'warning.main' : 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/**
 * MentionsPanelSaas component
 *
 * MentionsPanel의 모던 SaaS 문법 시안 변형 (비교·검토용 mockup).
 * 데이터 파생·필터·섹션 로직은 MentionsPanel과 동일하고 표면 문법만 다르다 —
 * 소프트 그레이 캔버스 위 라운드 카드(16px) + 레이어드 소프트 섀도 + Inter 폰트,
 * KPI는 개별 스탯 카드, 섹션 리스트는 카드 단위로 분리.
 * 기존 MentionsPanel(flat 문법)은 그대로 유지된다.
 *
 * Props:
 * @param {Mention[]} mentions - 전체 멘션 목록 (data/beautymaster/mentions.js typedef) [Required]
 * @param {Date|null} lastCrawledAt - 마지막 일일 크롤 시각 [Optional, 기본값: null]
 * @param {function} onApprove - 검토 대기열 Approve 핸들러 (mention) => void [Optional]
 * @param {function} onDismiss - 검토 대기열 Dismiss 핸들러 (mention) => void [Optional]
 * @param {object} sx - 루트 Box에 적용할 MUI sx 오버라이드 [Optional]
 *
 * Example usage:
 * <MentionsPanelSaas mentions={mentions} lastCrawledAt={lastCrawledAt} onApprove={handleApprove} />
 */
function MentionsPanelSaas({ mentions, lastCrawledAt = null, onApprove, onDismiss, sx }) {
  const [platformFilter, setPlatformFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const kpi = useMemo(() => deriveMentionKpi(mentions), [mentions]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mentions.filter(m => {
      if (platformFilter && m.platform !== platformFilter) return false;
      if (statusFilter && m.status !== statusFilter) return false;
      if (q && !(m.authorHandle || '').toLowerCase().includes(q) && !(m.linkedInfluencerName || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [mentions, platformFilter, statusFilter, searchQuery]);

  const sections = useMemo(() => {
    const byNewest = (a, b) => b.capturedAt - a.capturedAt || b.postedAt - a.postedAt;
    return [
      {
        key: 'review',
        label: 'Review queue',
        sublabel: 'Manual check needed',
        labelColor: 'warning.main',
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.UNVERIFIED).sort(byNewest),
      },
      {
        key: 'qualified',
        label: 'Qualified',
        sublabel: `${MENTION_THRESHOLDS.MIN_FOLLOWERS / 1000}K+ followers · ER ≥ ${MENTION_THRESHOLDS.MIN_ENGAGEMENT_RATE * 100}%`,
        labelColor: 'text.primary',
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.QUALIFIED).sort(byNewest),
      },
      {
        key: 'below',
        label: 'Below threshold',
        sublabel: 'Kept for micro-influencer reference',
        labelColor: 'text.secondary',
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.BELOW_THRESHOLD).sort(byNewest),
      },
    ].filter(s => s.items.length > 0);
  }, [filtered]);

  const hasFilter = platformFilter !== null || statusFilter !== null;

  return (
    <Box sx={{ flex: 1, overflow: 'auto', minWidth: 0, fontFamily: SAAS_FONT, backgroundColor: 'grey.50', ...sx }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* KPI stat cards + crawl timestamp */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: 'inherit', fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Mentions
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'inherit', color: 'text.disabled' }}>
            {lastCrawledAt
              ? `Last crawl: ${lastCrawledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${lastCrawledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · runs daily`
              : 'Crawl runs daily'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <MentionStatCard label="New today" value={kpi.newToday} />
          <MentionStatCard label="Qualified" value={kpi.qualified} />
          <MentionStatCard label="Review queue" value={kpi.reviewQueue} isAlert={kpi.reviewQueue > 0} />
          <MentionStatCard label="Contacted" value={kpi.contacted} />
          <MentionStatCard
            label="Avg eng. rate"
            value={kpi.avgEngagementRate != null ? `${(kpi.avgEngagementRate * 100).toFixed(1)}%` : '—'}
          />
        </Box>

        {/* Search + filter pills */}
        <SearchBar
          value={searchQuery}
          placeholder="Search by handle or name..."
          onChange={setSearchQuery}
          isFullWidth
          size="sm"
          sx={{
            mb: 1.5,
            borderRadius: '12px',
            '& .MuiInputBase-root, & .MuiInputBase-input': { fontFamily: SAAS_FONT },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 3 }}>
          {PLATFORM_OPTIONS.map(p => (
            <Chip
              key={p}
              label={p}
              size="small"
              onClick={() => setPlatformFilter(prev => (prev === p ? null : p))}
              color={platformFilter === p ? 'primary' : 'default'}
              variant={platformFilter === p ? 'filled' : 'outlined'}
              sx={CHIP_SX}
            />
          ))}
          <Box sx={{ width: '1px', height: 20, backgroundColor: 'divider', flexShrink: 0, mx: 0.5 }} />
          {STATUS_OPTIONS.map(s => (
            <Chip
              key={s}
              label={MENTION_STATUS_LABELS[s]}
              size="small"
              onClick={() => setStatusFilter(prev => (prev === s ? null : s))}
              color={statusFilter === s ? 'primary' : 'default'}
              variant={statusFilter === s ? 'filled' : 'outlined'}
              sx={CHIP_SX}
            />
          ))}
          {hasFilter && (
            <Chip
              label="Reset"
              size="small"
              variant="outlined"
              onClick={() => { setPlatformFilter(null); setStatusFilter(null); }}
              sx={{ ...CHIP_SX, borderStyle: 'dashed' }}
            />
          )}
        </Box>

        {/* Section cards */}
        {sections.length === 0 ? (
          <Box sx={{ ...SAAS_CARD_SX, py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontFamily: 'inherit', color: 'text.disabled' }}>
              No mentions found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {sections.map(section => (
              <Box key={section.key} sx={{ ...SAAS_CARD_SX, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, px: 2.5, pt: 2, pb: 1.25 }}>
                  <Typography sx={{ fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, color: section.labelColor, lineHeight: 1.2 }}>
                    {section.label}
                  </Typography>
                  <Typography sx={{ fontFamily: 'inherit', fontSize: '0.75rem', color: 'text.disabled', lineHeight: 1.2 }}>
                    {section.sublabel}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'inherit',
                      ml: 'auto',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                      backgroundColor: 'grey.100',
                      borderRadius: '999px',
                      px: 1,
                      py: 0.25,
                      lineHeight: 1.4,
                    }}
                  >
                    {section.items.length}
                  </Typography>
                </Box>
                <Divider sx={{ borderColor: 'grey.100' }} />
                <Box sx={{ px: 1, py: 0.75 }}>
                  {section.items.map(mention => (
                    <MentionListRowSaas
                      key={mention.id}
                      mention={mention}
                      onApprove={onApprove}
                      onDismiss={onDismiss}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MentionsPanelSaas;
