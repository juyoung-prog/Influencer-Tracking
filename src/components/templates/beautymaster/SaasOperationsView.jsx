import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SaasKpiItem from './SaasKpiItem';
import { deriveKpiSummary } from '../../../data/beautymaster/schema.js';

/** 파이프라인 단계 → Status-first 표현 (dot + label) */
const STAGES = {
  attention: { label: 'Needs attention', dot: 'warning.main' },
  completed: { label: 'Completed', dot: 'success.main' },
  posted: { label: 'Posted', dot: 'primary.main' },
  visited: { label: 'Visited', dot: 'primary.main' },
  scheduled: { label: 'Scheduled', dot: 'grey.400' },
  invited: { label: 'Invited', dot: 'grey.400' },
};

const PLATFORM_OPTIONS = ['Instagram', 'TikTok'];
const TIER_OPTIONS = [
  { value: 'tier1', label: 'Tier 1' },
  { value: 'tier2', label: 'Tier 2' },
];
const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'kbeauty', label: 'K-Beauty' },
  { value: 'specific', label: 'Specific' },
];

/** @param {Influencer} inf */
function deriveStage(inf) {
  if (inf.alertFlags.length > 0) return 'attention';
  if (inf.creditShared) return 'completed';
  if (inf.collaboShared) return 'posted';
  if (inf.attend) return 'visited';
  if (inf.agreement) return 'scheduled';
  return 'invited';
}

function formatTime(date) {
  return date ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—';
}

function formatVisit(date) {
  if (!date) return '—';
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${formatTime(date)}`;
}

/** 재연락 상태 요약 — 없으면 null */
function formatContact(inf) {
  if (!inf.contactReason) return null;
  const reason = inf.contactReason === 'no-show' ? 'No-show' : 'Reschedule';
  const status = inf.contactStatus === 'replied'
    ? 'replied'
    : inf.contactStatus === 'no-response' ? 'no reply' : 'pending';
  return `${reason} · ${status}`;
}

/** 좌측 레일용 날짜 그룹 — Today / 날짜별 / Past */
function buildScheduleGroups(influencers) {
  const today = { key: 'today', label: 'Today', items: [] };
  const past = { key: 'past', label: 'Past', items: [] };
  const byDate = {};

  for (const inf of influencers) {
    const g = inf.scheduleGroup;
    if (g === 'today') {
      today.items.push(inf);
    } else if (g === 'upcoming' && inf.scheduledTime) {
      const k = `${inf.scheduledTime.getFullYear()}-${inf.scheduledTime.getMonth()}-${inf.scheduledTime.getDate()}`;
      if (!byDate[k]) {
        byDate[k] = {
          key: k,
          label: inf.scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sortDate: inf.scheduledTime,
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
  groups.push(...Object.values(byDate).sort((a, b) => a.sortDate - b.sortDate));
  if (past.items.length) groups.push(past);
  for (const grp of groups) {
    grp.items.sort((a, b) => (a.scheduledTime && b.scheduledTime ? a.scheduledTime - b.scheduledTime : 0));
  }
  return groups;
}

/**
 * SaasOperationsView component
 *
 * flat-SaaS 시안 Operations 뷰 — 기존 대시보드 Operations 탭(SchedulePanel + InfluencerPanel)과
 * 같은 구성: Visit schedule 레일과 인플루언서 목록이 한 화면에 나란히 있고, 각자 스크롤한다.
 * 상단은 KPI 스트립(배경 직접 배치) + Needs attention 배너(Review 클릭 시 목록을 attention으로 필터).
 * 목록은 섹션 헤더 행으로 Action required / Upcoming / Completed를 구분한 단일 테이블 —
 * 그룹을 나눠도 컬럼 정렬이 유지돼 스캔이 끊기지 않는다. 폭은 프레임을 가득 채운다.
 *
 * Props:
 * @param {Influencer[]} influencers - 전체 인플루언서 목록 (data/beautymaster/schema.js typedef) [Required]
 * @param {function} onSelect - 행 클릭 핸들러 (influencer) => void [Optional]
 * @param {string|null} selectedId - 현재 선택된 인플루언서 ID [Optional, 기본값: null]
 * @param {boolean} isLoading - 최초 로딩 여부 (목록이 비었을 때만 스켈레톤) [Optional, 기본값: false]
 * @param {Error|null} error - 시트 조회 실패 에러 (상단 배너로 표시) [Optional, 기본값: null]
 * @param {function} onRetry - 에러 배너의 Retry 핸들러 [Optional]
 *
 * Example usage:
 * <SaasOperationsView influencers={influencers} onSelect={handleSelect} />
 */
function SaasOperationsView({
  influencers,
  onSelect,
  selectedId = null,
  isLoading = false,
  error = null,
  onRetry,
}) {
  const [stageFilter, setStageFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState(null);
  const [platformFilter, setPlatformFilter] = useState(null);
  const [tierFilter, setTierFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stores = useMemo(() => {
    const unique = new Set(influencers.map(inf => inf.store).filter(Boolean));
    return Array.from(unique).sort();
  }, [influencers]);

  const kpi = useMemo(() => deriveKpiSummary(influencers), [influencers]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return influencers.filter(inf => {
      if (storeFilter && inf.store !== storeFilter) return false;
      if (platformFilter) {
        const platforms = inf.platform.split(',').map(p => p.trim().toLowerCase());
        if (!platforms.includes(platformFilter.toLowerCase())) return false;
      }
      if (tierFilter && inf.tier !== tierFilter) return false;
      if (categoryFilter && inf.category !== categoryFilter) return false;
      if (q && !inf.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [influencers, storeFilter, platformFilter, tierFilter, categoryFilter, searchQuery]);

  const sections = useMemo(() => {
    const byTime = (a, b) => (a.scheduledTime && b.scheduledTime ? a.scheduledTime - b.scheduledTime : 0);
    const all = [
      {
        key: 'attention',
        label: 'Action required',
        items: filtered.filter(i => i.alertFlags.length > 0).sort(byTime),
      },
      {
        key: 'upcoming',
        label: 'Upcoming',
        items: filtered.filter(i => i.alertFlags.length === 0 && !i.creditShared).sort(byTime),
      },
      {
        key: 'completed',
        label: 'Completed',
        items: filtered.filter(i => i.alertFlags.length === 0 && i.creditShared).sort(byTime),
      },
    ];
    return all
      .filter(s => (stageFilter === 'all' ? true : s.key === stageFilter))
      .filter(s => s.items.length > 0);
  }, [filtered, stageFilter]);

  const scheduleGroups = useMemo(() => buildScheduleGroups(filtered), [filtered]);
  const visibleCount = sections.reduce((n, s) => n + s.items.length, 0);
  const hasFilter = stageFilter !== 'all' || storeFilter !== null || platformFilter !== null || tierFilter !== null || categoryFilter !== null || searchQuery.trim() !== '';
  /** 최초 로딩만 스켈레톤 — 이미 데이터가 있으면 폴링 중에도 목록을 유지한다 */
  const showSkeleton = isLoading && influencers.length === 0;

  const resetFilters = () => {
    setStageFilter('all');
    setStoreFilter(null);
    setPlatformFilter(null);
    setTierFilter(null);
    setCategoryFilter(null);
    setSearchQuery('');
  };

  const chipSx = isOn => ({
    height: 32,
    fontSize: 12,
    fontWeight: 500,
    borderRadius: '6px',
    px: 1,
    ...(isOn
      ? { backgroundColor: 'primary.main', color: 'common.white', borderColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }
      : { borderColor: 'divider', color: 'text.secondary', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'grey.50' } }),
  });

  return (
    <>
      {/* 조회 실패 — 목록을 지우지 않고 상단 배너로만 알린다(직전 데이터 유지) */}
      {error && (
        <Alert
          severity="error"
          square
          sx={{ flexShrink: 0, fontSize: 13, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry} sx={{ textTransform: 'none', fontSize: 12 }}>
                Retry
              </Button>
            )
          }
        >
          Failed to load data — {error.message}
        </Alert>
      )}

      {/* KPI 스트립 — 배경 위 직접 배치, 카드 없음 (Total 제외) */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 2,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <SaasKpiItem label="Agreement" value={kpi.agreementCount} total={kpi.total} isFirst />
        <SaasKpiItem label="Visit" value={kpi.attendCount} total={kpi.total} />
        <SaasKpiItem label="Upload" value={kpi.collaboSharedCount} total={kpi.total} />
        <SaasKpiItem label="Credit" value={kpi.creditSharedCount} total={kpi.total} />

        {kpi.alertCount > 0 && (
          <Box
            sx={theme => ({
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.5,
              py: 0.875,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: alpha(theme.palette.warning.main, 0.32),
              backgroundColor: alpha(theme.palette.warning.main, 0.06),
            })}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
              Needs attention — {kpi.alertCount}
            </Typography>
            <Button
              size="small"
              onClick={() => setStageFilter('attention')}
              sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, minWidth: 0, py: 0 }}
            >
              Review →
            </Button>
          </Box>
        )}
      </Box>

      {/* 본문 — Visit schedule 레일 + 목록, 한 화면에 나란히 */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* Visit schedule — 좌측 고정 레일, 자체 스크롤 */}
        <Box
          sx={{
            width: 236,
            flexShrink: 0,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            borderRight: '1px solid',
            borderColor: 'divider',
            minHeight: 0,
          }}
        >
          <Typography
            sx={{
              flexShrink: 0,
              fontSize: 11,
              fontWeight: 600,
              color: 'text.secondary',
              letterSpacing: '0.04em',
              px: 2,
              pt: 2,
              pb: 1,
            }}
          >
            VISIT SCHEDULE
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1, pb: 2 }}>
            {showSkeleton ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Box key={`rail-skeleton-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5 }}>
                  <Skeleton variant="text" width={44} />
                  <Skeleton variant="text" width={90} />
                </Box>
              ))
            ) : scheduleGroups.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: 'text.disabled', px: 1, py: 2 }}>
                No visits scheduled
              </Typography>
            ) : (
              scheduleGroups.map(grp => (
                <Box key={grp.key} sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1,
                      pt: 0.75,
                      pb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: grp.key === 'today' ? 'primary.main' : 'text.disabled',
                      }}
                    >
                      {grp.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: 'text.disabled',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {grp.items.length}
                    </Typography>
                  </Box>
                  {grp.items.map(inf => (
                    <Box
                      key={inf.id}
                      onClick={() => onSelect?.(inf)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1,
                        py: 0.5,
                        borderRadius: '6px',
                        cursor: onSelect ? 'pointer' : 'default',
                        backgroundColor: selectedId === inf.id ? 'grey.100' : 'transparent',
                        '&:hover': { backgroundColor: 'grey.50' },
                      }}
                    >
                      <Typography
                        sx={{ width: 52, flexShrink: 0, fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatTime(inf.scheduledTime)}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 13, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {inf.fullName || '—'}
                      </Typography>
                      {inf.alertFlags.length > 0 && (
                        <Box sx={{ ml: 'auto', width: 5, height: 5, borderRadius: '50%', backgroundColor: 'warning.main', flexShrink: 0 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* 목록 — 툴바 + 섹션 구분 테이블, 자체 스크롤 */}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: 200,
                '& .MuiInputBase-root': { borderRadius: '6px', fontSize: 12, height: 36, backgroundColor: 'background.paper' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                '& .MuiInputBase-input::placeholder': { color: 'text.disabled', opacity: 1 },
              }}
            />
            {stores.length > 0 && (
              <Select
                value={storeFilter || ''}
                onChange={e => setStoreFilter(e.target.value || null)}
                displayEmpty
                size="small"
                sx={{
                  width: 'auto',
                  height: 36,
                  fontSize: 12,
                  borderRadius: '6px',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                  '& .MuiSelect-icon': { fontSize: 18, right: 6 },
                }}
              >
                <MenuItem value="" sx={{ fontSize: 12 }}>All stores</MenuItem>
                {stores.map(store => (
                  <MenuItem key={store} value={store} sx={{ fontSize: 12 }}>
                    {store}
                  </MenuItem>
                ))}
              </Select>
            )}
            <Divider orientation="vertical" flexItem />
            {PLATFORM_OPTIONS.map(p => (
              <Chip
                key={p}
                label={p}
                size="small"
                onClick={() => setPlatformFilter(prev => (prev === p ? null : p))}
                variant={platformFilter === p ? 'filled' : 'outlined'}
                sx={chipSx(platformFilter === p)}
              />
            ))}
            <Divider orientation="vertical" flexItem />
            {TIER_OPTIONS.map(t => (
              <Chip
                key={t.value}
                label={t.label}
                size="small"
                onClick={() => setTierFilter(prev => (prev === t.value ? null : t.value))}
                variant={tierFilter === t.value ? 'filled' : 'outlined'}
                sx={chipSx(tierFilter === t.value)}
              />
            ))}
            <Divider orientation="vertical" flexItem />
            {CATEGORY_OPTIONS.map(c => (
              <Chip
                key={c.value}
                label={c.label}
                size="small"
                onClick={() => setCategoryFilter(prev => (prev === c.value ? null : c.value))}
                variant={categoryFilter === c.value ? 'filled' : 'outlined'}
                sx={chipSx(categoryFilter === c.value)}
              />
            ))}
            {stageFilter !== 'all' && (
              <Chip
                label="Action required only"
                size="small"
                onDelete={() => setStageFilter('all')}
                sx={chipSx(true)}
              />
            )}
            {hasFilter && (
              <Button
                size="small"
                onClick={resetFilters}
                sx={{ textTransform: 'none', fontSize: 12, fontWeight: 400, color: 'text.secondary', px: 0.75, py: 0.5, minWidth: 'auto', '&:hover': { color: 'text.primary', backgroundColor: 'transparent' } }}
              >
                Reset
              </Button>
            )}
            <Typography sx={{ ml: 'auto', fontSize: 12, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
              {visibleCount} of {influencers.length}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Table size="small" stickyHeader sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow
                  sx={{
                    '& th': {
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'text.secondary',
                      borderColor: 'divider',
                      backgroundColor: 'grey.50',
                      py: 0.875,
                    },
                    '& th:first-of-type': { pl: 3 },
                    '& th:last-of-type': { pr: 3 },
                  }}
                >
                  <TableCell>Name</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell>Stage</TableCell>
                  <TableCell>Visit</TableCell>
                  <TableCell>Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showSkeleton && Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} sx={{ '& td': { borderColor: 'divider', py: 0.875 }, '& td:first-of-type': { pl: 3 }, '& td:last-of-type': { pr: 3 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton variant="text" width={120} sx={{ fontSize: 13 }} />
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={40} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={90} /></TableCell>
                    <TableCell><Skeleton variant="text" width={70} /></TableCell>
                  </TableRow>
                ))}
                {!showSkeleton && sections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ border: 'none', py: 8, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: hasFilter ? 1 : 0 }}>
                        {hasFilter ? 'No influencers match the current filters' : 'No influencers yet'}
                      </Typography>
                      {hasFilter && (
                        <Button size="small" onClick={resetFilters} sx={{ textTransform: 'none', fontSize: 13, fontWeight: 500 }}>
                          Clear filters
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
                {!showSkeleton && sections.map(section => [
                  <TableRow key={`${section.key}-head`}>
                    <TableCell
                      colSpan={6}
                      sx={{
                        borderColor: 'divider',
                        backgroundColor: 'grey.50',
                        py: 0.625,
                        pl: 3,
                        pr: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="span"
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            color: section.key === 'attention' ? 'warning.main' : 'text.secondary',
                          }}
                        >
                          {section.label.toUpperCase()}
                        </Typography>
                        <Typography component="span" sx={{ fontSize: 11, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
                          {section.items.length}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>,
                  ...section.items.map(inf => {
                    const stage = STAGES[deriveStage(inf)];
                    const contact = formatContact(inf);
                    return (
                      <TableRow
                        key={inf.id}
                        onClick={() => onSelect?.(inf)}
                        sx={{
                          cursor: onSelect ? 'pointer' : 'default',
                          backgroundColor: selectedId === inf.id ? 'grey.100' : 'transparent',
                          '& td': { fontSize: 13, borderColor: 'divider', py: 0.875 },
                          '& td:first-of-type': { pl: 3 },
                          '& td:last-of-type': { pr: 3 },
                          '&:hover': { backgroundColor: 'grey.50' },
                        }}
                      >
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: 'grey.100',
                                color: 'text.secondary',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11,
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              {(inf.fullName || '?').charAt(0).toUpperCase()}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {inf.fullName || '—'}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: 'text.disabled', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {inf.store}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{inf.platform}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          {inf.tier === 'tier1' ? 'Tier 1' : 'Tier 2'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: stage.dot, flexShrink: 0 }} />
                            <Typography component="span" sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                              {stage.label}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                          {formatVisit(inf.scheduledTime)}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {contact ? (
                            <Typography component="span" sx={{ fontSize: 12, color: 'warning.main', fontWeight: 500 }}>
                              {contact}
                            </Typography>
                          ) : (
                            <Typography component="span" sx={{ fontSize: 13, color: 'text.disabled' }}>—</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }),
                ])}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SaasOperationsView;
