import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import '@fontsource-variable/inter';
import InfluencerListRowSaas from '../../data-display/InfluencerListRowSaas';
import { SearchBar } from '../../input/SearchBar';
import { deriveKpiSummary } from '../../../data/beautymaster/schema.js';

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
const TIER_OPTIONS = [
  { value: 'tier1', label: 'Tier 1' },
  { value: 'tier2', label: 'Tier 2' },
];

/**
 * KpiStatCard — KPI 스탯 카드 (SaaS 시안: 개별 라운드 카드)
 *
 * @param {string} label
 * @param {number} value
 * @param {number|null} total - "/ N" 분모 표시 [Optional, 기본값: null]
 */
function KpiStatCard({ label, value, total = null }) {
  return (
    <Box sx={{ ...SAAS_CARD_SX, flex: '1 1 140px', minWidth: 128, px: 2.5, py: 2 }}>
      <Typography
        sx={{
          display: 'block',
          fontFamily: 'inherit',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'text.secondary',
          lineHeight: 1,
          mb: 1.25,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
        <Typography
          variant="h4"
          component="span"
          sx={{ fontFamily: 'inherit', lineHeight: 1, fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          {value}
        </Typography>
        {total !== null && total > 0 && (
          <Typography
            component="span"
            sx={{ fontFamily: 'inherit', fontSize: '0.8125rem', color: 'text.disabled', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
          >
            / {total}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/** 스케줄 카드용 날짜 그룹 빌드 — today / 날짜별 upcoming / past 순 */
function buildScheduleGroups(influencers) {
  const today = { key: 'today', label: 'Today', items: [] };
  const past = { key: 'past', label: 'Past', items: [] };
  const byDate = {};

  for (const inf of influencers) {
    const g = inf.scheduleGroup || 'no-time';
    if (g === 'today') {
      today.items.push(inf);
    } else if ((g === 'upcoming' || g === 'this-week' || g === 'later') && inf.scheduledTime) {
      const k = `${inf.scheduledTime.getFullYear()}-${inf.scheduledTime.getMonth()}-${inf.scheduledTime.getDate()}`;
      if (!byDate[k]) {
        byDate[k] = {
          key: k,
          label: inf.scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          _sortDate: inf.scheduledTime,
          items: [],
        };
      }
      byDate[k].items.push(inf);
    } else if (g === 'past') {
      past.items.push(inf);
    }
  }

  const groups = [];
  if (today.items.length) groups.push(today);
  groups.push(...Object.values(byDate).sort((a, b) => a._sortDate - b._sortDate));
  if (past.items.length) groups.push(past);
  for (const grp of groups) {
    grp.items.sort((a, b) => (a.scheduledTime && b.scheduledTime ? a.scheduledTime - b.scheduledTime : 0));
  }
  return groups;
}

/**
 * OperationsPanelSaas component
 *
 * BeautyMaster 대시보드 Operations 뷰의 모던 SaaS 문법 시안 변형 (비교·검토용 mockup, 대시보드 미연결).
 * 데이터 파생·필터·섹션 로직은 기존 Operations 뷰(DashboardHeader + SchedulePanel + InfluencerPanel)와
 * 같은 규칙을 따르고 표면 문법만 다르다 — 소프트 그레이 캔버스 위 라운드 카드(16px) +
 * 레이어드 소프트 섀도 + Inter 폰트, KPI는 개별 스탯 카드 5장, 스케줄·리스트는
 * 헤더(제목+카운트 pill) 있는 카드 단위로 분리(InfluencerListRowSaas).
 * 프로젝트 기본 flat 문법과 의도적으로 다른 시안임.
 *
 * Props:
 * @param {Influencer[]} influencers - 전체 인플루언서 목록 (data/beautymaster/schema.js typedef) [Required]
 * @param {Date|null} lastSyncedAt - 마지막 시트 동기화 시각 [Optional, 기본값: null]
 * @param {function} onSelect - 행 클릭 핸들러 (influencer) => void [Optional]
 * @param {string|null} selectedId - 현재 선택된 인플루언서 ID [Optional, 기본값: null]
 * @param {object} sx - 루트 Box에 적용할 MUI sx 오버라이드 [Optional]
 *
 * Example usage:
 * <OperationsPanelSaas influencers={influencers} lastSyncedAt={lastSyncedAt} onSelect={handleSelect} />
 */
function OperationsPanelSaas({ influencers, lastSyncedAt = null, onSelect, selectedId = null, sx }) {
  const [platformFilter, setPlatformFilter] = useState(null);
  const [tierFilter, setTierFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const kpi = useMemo(() => deriveKpiSummary(influencers), [influencers]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return influencers.filter(inf => {
      if (platformFilter) {
        const platforms = inf.platform.split(',').map(p => p.trim().toLowerCase());
        if (!platforms.includes(platformFilter.toLowerCase())) return false;
      }
      if (tierFilter && inf.tier !== tierFilter) return false;
      if (q && !inf.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [influencers, platformFilter, tierFilter, searchQuery]);

  const sections = useMemo(() => {
    const byTime = (a, b) => (a.scheduledTime && b.scheduledTime ? a.scheduledTime - b.scheduledTime : 0);
    return [
      {
        key: 'action',
        label: 'Action required',
        sublabel: 'Alerts to resolve',
        labelColor: 'error.main',
        items: filtered.filter(i => i.alertFlags.length > 0).sort(byTime),
      },
      {
        key: 'scheduled',
        label: 'Upcoming',
        sublabel: 'Scheduled & in progress',
        labelColor: 'text.primary',
        items: filtered.filter(i => i.alertFlags.length === 0 && !i.creditShared).sort(byTime),
      },
      {
        key: 'completed',
        label: 'Completed',
        sublabel: 'Credit shared',
        labelColor: 'text.secondary',
        items: filtered.filter(i => i.alertFlags.length === 0 && i.creditShared).sort(byTime),
      },
    ].filter(s => s.items.length > 0);
  }, [filtered]);

  const scheduleGroups = useMemo(() => buildScheduleGroups(filtered), [filtered]);
  const hasFilter = platformFilter !== null || tierFilter !== null;

  return (
    <Box sx={{ flex: 1, overflow: 'auto', minWidth: 0, fontFamily: SAAS_FONT, backgroundColor: 'grey.50', ...sx }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', p: 3 }}>
        {/* Title + sync timestamp */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: 'inherit', fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Influencer Tracking
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'inherit', color: 'text.disabled' }}>
            {lastSyncedAt
              ? `Last synced ${lastSyncedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
              : 'Not synced yet'}
          </Typography>
        </Box>

        {/* KPI stat cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <KpiStatCard label="Total" value={kpi.total} />
          <KpiStatCard label="Agreement" value={kpi.agreementCount} total={kpi.total} />
          <KpiStatCard label="Visit" value={kpi.attendCount} total={kpi.total} />
          <KpiStatCard label="Upload" value={kpi.collaboSharedCount} total={kpi.total} />
          <KpiStatCard label="Credit" value={kpi.creditSharedCount} total={kpi.total} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
          {/* Visit schedule card */}
          <Box sx={{ ...SAAS_CARD_SX, width: 272, flexShrink: 0, overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, px: 2.5, pt: 2, pb: 1.25 }}>
              <Typography sx={{ fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>
                Visit schedule
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
                {scheduleGroups.reduce((n, g) => n + g.items.length, 0)}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'grey.100' }} />
            {scheduleGroups.length === 0 ? (
              <Typography variant="caption" sx={{ fontFamily: 'inherit', display: 'block', color: 'text.disabled', px: 2.5, py: 3 }}>
                No visits scheduled
              </Typography>
            ) : (
              <Box sx={{ px: 1.5, py: 1 }}>
                {scheduleGroups.map(grp => (
                  <Box key={grp.key} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        display: 'block',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: grp.key === 'today' ? 'primary.main' : 'text.disabled',
                        px: 1,
                        pt: 0.75,
                        pb: 0.5,
                      }}
                    >
                      {grp.label}
                    </Typography>
                    {grp.items.map(inf => (
                      <Box
                        key={inf.id}
                        onClick={() => onSelect?.(inf)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1,
                          py: 0.625,
                          borderRadius: '8px',
                          cursor: onSelect ? 'pointer' : 'default',
                          backgroundColor: selectedId === inf.id ? 'grey.100' : 'transparent',
                          '&:hover': { backgroundColor: 'grey.50' },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: 'inherit', width: 56, flexShrink: 0, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
                        >
                          {inf.scheduledTime
                            ? inf.scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {inf.fullName || '—'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* List column */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <SearchBar
              value={searchQuery}
              placeholder="Search by name..."
              onChange={setSearchQuery}
              isFullWidth
              size="sm"
              sx={{
                mb: 1.5,
                borderRadius: '12px',
                '& .MuiInputBase-root, & .MuiInputBase-input': { fontFamily: SAAS_FONT },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 2.5 }}>
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
              {TIER_OPTIONS.map(t => (
                <Chip
                  key={t.value}
                  label={t.label}
                  size="small"
                  onClick={() => setTierFilter(prev => (prev === t.value ? null : t.value))}
                  color={tierFilter === t.value ? 'primary' : 'default'}
                  variant={tierFilter === t.value ? 'filled' : 'outlined'}
                  sx={CHIP_SX}
                />
              ))}
              {hasFilter && (
                <Chip
                  label="Reset"
                  size="small"
                  variant="outlined"
                  onClick={() => { setPlatformFilter(null); setTierFilter(null); }}
                  sx={{ ...CHIP_SX, borderStyle: 'dashed' }}
                />
              )}
            </Box>

            {/* Section cards */}
            {sections.length === 0 ? (
              <Box sx={{ ...SAAS_CARD_SX, py: 8, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ fontFamily: 'inherit', color: 'text.disabled' }}>
                  No influencers found
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
                      {section.items.map(inf => (
                        <InfluencerListRowSaas
                          key={inf.id}
                          influencer={inf}
                          onClick={() => onSelect?.(inf)}
                          isSelected={selectedId === inf.id}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OperationsPanelSaas;
