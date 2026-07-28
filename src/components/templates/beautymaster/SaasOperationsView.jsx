import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InfluencerListRow from '../../data-display/InfluencerListRow';
import SaasKpiItem from './SaasKpiItem';
import SaasStoreSelect from './SaasStoreSelect';
import {
  ALL_STORES,
  DEFAULT_INFLUENCER_FILTERS,
  SHEET_STATUS,
  deriveKpiSummary,
  deriveStores,
} from '../../../data/beautymaster/schema.js';

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

function formatTime(date) {
  return date ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—';
}

/**
 * 시트 상태 탭. 기존 InfluencerPanel의 TABS를 그대로 옮긴 것으로,
 * id는 Influencer.sheetStatus와 정확히 일치 비교한다('all'만 예외).
 */
const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: SHEET_STATUS.PROCESSING, label: 'Processing' },
  { id: SHEET_STATUS.DONE, label: 'Done' },
];

/**
 * main workspace 공통 가로 인셋 (theme.spacing 3 = 24px).
 * 필터 툴바 · 상태 탭 · 각 divider · 결과 섹션 컨테이너가 모두 이 하나의 값을 쓴다 —
 * 영역마다 제각각 padding을 두면 화면이 미묘하게 어긋나 보인다.
 */
const CONTENT_PX = 3;

/** Visit schedule 레일 폭 */
const RAIL_WIDTH = 236;
/** 레일과 목록 사이 거터 (theme.spacing 단위) */
const RAIL_GUTTER = 2;

/**
 * 24px 인셋으로 그어지는 divider.
 *
 * border를 컨테이너에 직접 주면 padding 바깥(border-box 전체)까지 선이 번져
 * 콘텐츠보다 좌우로 24px씩 튀어나온다. 의사요소로 그어 콘텐츠와 같은 그리드에 맞춘다.
 *
 * @param {object} theme - MUI theme
 * @param {'top'|'bottom'} side - 선을 그을 변 [기본값: 'bottom']
 * @returns {object} sx 조각
 */
const insetDivider = (theme, side = 'bottom') => ({
  position: 'relative',
  [`&::${side === 'top' ? 'before' : 'after'}`]: {
    content: '""',
    position: 'absolute',
    left: theme.spacing(CONTENT_PX),
    right: theme.spacing(CONTENT_PX),
    [side]: 0,
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
  },
});

/**
 * Visit schedule 레일의 시간 컬럼 폭.
 * "12:00 PM"(가장 긴 형태)이 한 줄에 들어가야 한다 — 접히면 행 높이가 달라지고
 * 이름 컬럼 시작점이 행마다 어긋난다.
 */
const TIME_COL_WIDTH = 62;

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
  // Today는 0명이어도 항상 넣는다 — "오늘 방문 없음"을 빈 자리가 아니라 숫자로 보여주기 위함.
  // 나머지 그룹은 비면 생략한다.
  groups.push(today);
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
 * KPI 스트립(배경 직접 배치) + Needs attention 배너는 목록 컬럼 안 최상단에 있다 —
 * 레일 위에 걸치면 세로 경계선이 KPI 아래에서야 시작해 KPI만 떠 보인다.
 * 목록은 Action required / Upcoming / Completed 섹션으로 나뉘고, 각 섹션은 접을 수 있다.
 * 행은 컬럼으로 흩뿌리지 않고 InfluencerListRow의 요약 행(아바타+이름·시간·카테고리 /
 * 티어·플랫폼 / 상태·overdue·연락사유)으로 한 사람 정보를 한 덩어리로 읽게 한다.
 *
 * Props:
 * @param {Influencer[]} influencers - 전체 인플루언서 목록 (data/beautymaster/schema.js typedef) [Required]
 * @param {function} onSelect - 행 클릭 핸들러 (influencer) => void [Optional]
 * @param {string|null} selectedId - 현재 선택된 인플루언서 ID [Optional, 기본값: null]
 * @param {boolean} isLoading - 최초 로딩 여부 (목록이 비었을 때만 스켈레톤) [Optional, 기본값: false]
 * @param {Error|null} error - 시트 조회 실패 에러 (상단 배너로 표시) [Optional, 기본값: null]
 * @param {function} onRetry - 에러 배너의 Retry 핸들러 [Optional]
 * @param {object|null} filters - 플랫폼/티어/카테고리 필터 ({ platform, tier, category }).
 *   주면 controlled, 안 주면 내부 상태로 동작 [Optional, 기본값: null]
 * @param {function} onFiltersChange - 필터 변경 핸들러 (nextFilters) => void [Optional]
 * @param {string[]} stores - 스토어 선택 옵션 목록. 없으면 influencers에서 파생 [Optional]
 * @param {string} selectedStore - 선택된 스토어 ('all'이면 전체). 세 뷰가 공유 [Optional, 기본값: 'all']
 * @param {function} onStoreChange - 스토어 변경 핸들러 (store) => void [Optional]
 *
 * Example usage:
 * <SaasOperationsView influencers={influencers} onSelect={handleSelect} />
 * <SaasOperationsView influencers={influencers} filters={filters} onFiltersChange={setFilters} />
 */
function SaasOperationsView({
  influencers,
  onSelect,
  selectedId = null,
  isLoading = false,
  error = null,
  onRetry,
  filters = null,
  onFiltersChange,
  stores = null,
  selectedStore = ALL_STORES,
  onStoreChange,
}) {
  /** 검색어·단계는 뷰 안에서만 쓰는 일시 상태라 승격하지 않는다 */
  const [stageFilter, setStageFilter] = useState('all');
  /** 시트 상태 탭 — 기존 InfluencerPanel의 tab 상태를 그대로 복원한 것 */
  const [statusFilter, setStatusFilter] = useState('all');
  /**
   * 접힌 섹션 키. Action required만 펼친 채로 시작한다 — 손댈 게 있는 쪽이 먼저 보여야 하고,
   * 긴 섹션을 접어 아래 섹션으로 바로 갈 수 있어야 한다.
   */
  const [collapsedSections, setCollapsedSections] = useState(() => new Set(['upcoming', 'completed']));
  const [searchQuery, setSearchQuery] = useState('');
  const [internalFilters, setInternalFilters] = useState(DEFAULT_INFLUENCER_FILTERS);

  /** filters를 주면 controlled, 안 주면 내부 상태 — 스토리·목업은 그대로 uncontrolled로 쓴다 */
  const isFiltersControlled = filters !== null;
  const activeFilters = isFiltersControlled ? filters : internalFilters;

  const setFilter = (key, value) => {
    const next = { ...activeFilters, [key]: value };
    if (!isFiltersControlled) setInternalFilters(next);
    onFiltersChange?.(next);
  };

  const derivedStores = useMemo(() => deriveStores(influencers), [influencers]);
  const storeOptions = stores ?? derivedStores;

  /**
   * KPI 모수 — 스토어/플랫폼/티어/카테고리까지만 적용한다.
   * 검색어와 단계 필터는 "무엇을 보느냐"가 아니라 "지금 화면에서 어디를 찾느냐"라
   * 모수에서 뺀다. 기존 대시보드의 filteredKpi와 같은 기준이다.
   * (단계 필터를 넣으면 Needs attention의 Review를 누르는 순간 방금 본 경보 수가
   *  바뀌어버려 오히려 읽기 어려워진다.)
   */
  const scoped = useMemo(() => {
    const { platform, tier, category } = activeFilters;
    return influencers.filter(inf => {
      if (selectedStore !== ALL_STORES && inf.store !== selectedStore) return false;
      if (platform) {
        const platforms = inf.platform.split(',').map(p => p.trim().toLowerCase());
        if (!platforms.includes(platform.toLowerCase())) return false;
      }
      if (tier && inf.tier !== tier) return false;
      if (category && inf.category !== category) return false;
      return true;
    });
  }, [influencers, selectedStore, activeFilters]);

  const kpi = useMemo(() => deriveKpiSummary(scoped), [scoped]);

  const toggleSection = key => setCollapsedSections(prev => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scoped.filter(inf => {
      // 기존 InfluencerPanel과 같은 판정 — sheetStatus 정확히 일치
      if (statusFilter !== 'all' && inf.sheetStatus !== statusFilter) return false;
      if (q && !inf.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [scoped, statusFilter, searchQuery]);

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
  /** Today는 항상 들어 있으므로 그룹 개수가 아니라 실제 방문 유무로 빈 상태를 판정한다 */
  const hasScheduledVisit = scheduleGroups.some(g => g.items.length > 0);
  const visibleCount = sections.reduce((n, s) => n + s.items.length, 0);
  const hasFilter = stageFilter !== 'all'
    || statusFilter !== 'all'
    || selectedStore !== ALL_STORES
    || activeFilters.platform !== null
    || activeFilters.tier !== null
    || activeFilters.category !== null
    || searchQuery.trim() !== '';
  /** 최초 로딩만 스켈레톤 — 이미 데이터가 있으면 폴링 중에도 목록을 유지한다 */
  const showSkeleton = isLoading && influencers.length === 0;

  const resetFilters = () => {
    setStageFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
    if (!isFiltersControlled) setInternalFilters(DEFAULT_INFLUENCER_FILTERS);
    onFiltersChange?.(DEFAULT_INFLUENCER_FILTERS);
    onStoreChange?.(ALL_STORES);
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


      {/* 본문 — Visit schedule 레일 + 목록, 한 화면에 나란히.
          gap으로 16px 거터를 둬 두 영역이 하나의 표처럼 붙어 보이지 않게 한다.
          구분은 거터(여백) + 레일 우측의 얇은 divider가 함께 만든다. */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: RAIL_GUTTER }}>
        {/* Visit schedule — 좌측 고정 레일(보조 패널), 자체 스크롤 */}
        <Box
          sx={{
            width: RAIL_WIDTH,
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
            ) : !hasScheduledVisit ? (
              <Typography sx={{ fontSize: 13, color: 'text.disabled', px: 1, py: 2 }}>
                No visits scheduled
              </Typography>
            ) : (
              scheduleGroups.map(grp => {
                const isToday = grp.key === 'today';
                return (
                <Box key={grp.key} sx={{ mb: 1 }}>
                  {/* 본 테이블의 섹션 헤더(ACTION REQUIRED 등)와 같은 표면·타이포를 쓴다 —
                      grey.50 배경, 위아래 1px divider, 11px/600/0.04em uppercase, muted 카운트.
                      레일은 폭이 좁아 카운트를 우측 정렬해도 라벨과 멀어지지 않는다. */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      // 스크롤 컨테이너의 px:1을 상쇄해 헤더가 레일 전체 폭을 쓰게 한다
                      mx: -1,
                      px: 2,
                      py: 0.625,
                      backgroundColor: 'grey.50',
                      borderTop: '1px solid',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: isToday ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {grp.label.toUpperCase()}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        ml: 'auto',
                        fontSize: 11,
                        color: 'text.disabled',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {grp.items.length}
                    </Typography>
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
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
                      {/* 고정 폭 + nowrap — "11:00 AM"이 두 줄로 접히면 행 높이가 들쭉날쭉해지고
                          이름 시작 위치도 어긋난다. 폭은 가장 긴 "12:00 PM" 기준. */}
                      <Typography
                        sx={{
                          width: TIME_COL_WIDTH,
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                          fontSize: 12,
                          color: 'text.secondary',
                          fontVariantNumeric: 'tabular-nums',
                        }}
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
                </Box>
                );
              })
            )}
          </Box>
        </Box>

        {/* 목록 — 툴바 + 섹션 구분 테이블, 자체 스크롤 */}
        <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* KPI 스트립 — 배경 위 직접 배치, 카드 없음 (Total 제외).
            목록 컬럼 안에 있으므로 툴바·탭·섹션과 같은 인셋을 쓴다.
            덕분에 레일과의 세로 경계선이 화면 위끝까지 끊기지 않고 이어진다. */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 2,
            px: CONTENT_PX,
            py: 2,
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
          <Box
            sx={theme => ({
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              px: CONTENT_PX,
              py: 2,
              ...insetDivider(theme, 'top'),
              ...insetDivider(theme),
            })}
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
            <SaasStoreSelect
              stores={storeOptions}
              value={selectedStore}
              onChange={onStoreChange}
            />
            <Divider orientation="vertical" flexItem />
            {PLATFORM_OPTIONS.map(p => (
              <Chip
                key={p}
                label={p}
                size="small"
                onClick={() => setFilter('platform', activeFilters.platform === p ? null : p)}
                variant={activeFilters.platform === p ? 'filled' : 'outlined'}
                sx={chipSx(activeFilters.platform === p)}
              />
            ))}
            <Divider orientation="vertical" flexItem />
            {TIER_OPTIONS.map(t => (
              <Chip
                key={t.value}
                label={t.label}
                size="small"
                onClick={() => setFilter('tier', activeFilters.tier === t.value ? null : t.value)}
                variant={activeFilters.tier === t.value ? 'filled' : 'outlined'}
                sx={chipSx(activeFilters.tier === t.value)}
              />
            ))}
            <Divider orientation="vertical" flexItem />
            {CATEGORY_OPTIONS.map(c => (
              <Chip
                key={c.value}
                label={c.label}
                size="small"
                onClick={() => setFilter('category', activeFilters.category === c.value ? null : c.value)}
                variant={activeFilters.category === c.value ? 'filled' : 'outlined'}
                sx={chipSx(activeFilters.category === c.value)}
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

          {/* 시트 상태 탭 — 필터 컨트롤과 결과 사이의 2차 내비게이션.
              pill/카드 없이 텍스트 + 2px 하단 인디케이터로만 표현한다.
              위쪽 여백(10px)으로 필터 툴바와 띄워 세 층(필터 → 상태 → 결과)을 갈라 보이게 한다. */}
          <Box
            sx={theme => ({
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              px: CONTENT_PX,
              mt: 1.25,
              ...insetDivider(theme),
            })}
          >
            {STATUS_TABS.map(t => {
              const isActive = statusFilter === t.id;
              return (
                <Box
                  key={t.id}
                  component="button"
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => setStatusFilter(t.id)}
                  sx={{
                    border: 'none',
                    borderBottom: '2px solid',
                    borderBottomColor: isActive ? 'primary.main' : 'transparent',
                    // 컨테이너의 1px 보더 위에 인디케이터를 겹쳐 선이 두 줄로 보이지 않게 한다
                    mb: '-1px',
                    px: 0,
                    py: 1,
                    backgroundColor: 'transparent',
                    font: 'inherit',
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: isActive ? 'primary.main' : 'text.primary' },
                  }}
                >
                  {t.label}
                </Box>
              );
            })}
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: CONTENT_PX, pb: 2 }}>
            {showSkeleton && Array.from({ length: 8 }).map((_, i) => (
              <Box
                key={`skeleton-${i}`}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1, minHeight: 48, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Skeleton variant="circular" width={28} height={28} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width={140} />
                  <Skeleton variant="text" width={90} />
                </Box>
                <Skeleton variant="text" sx={{ flex: '0 0 100px' }} />
                <Skeleton variant="text" sx={{ flex: '0 0 140px' }} />
              </Box>
            ))}

            {!showSkeleton && sections.length === 0 && (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: hasFilter ? 1 : 0 }}>
                  {hasFilter ? 'No influencers match the current filters' : 'No influencers yet'}
                </Typography>
                {hasFilter && (
                  <Button size="small" onClick={resetFilters} sx={{ textTransform: 'none', fontSize: 13, fontWeight: 500 }}>
                    Clear filters
                  </Button>
                )}
              </Box>
            )}

            {!showSkeleton && sections.map(section => {
              const isCollapsed = collapsedSections.has(section.key);
              return (
                <Box
                  key={section.key}
                  sx={{
                    // 섹션 하나가 하나의 운영 단위로 읽히도록 테두리로 묶는다.
                    // 카드가 아니다 — 섀도 없음, radius 6px, 얇은 중립 보더.
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '6px',
                    mt: 2,
                    // 마지막 행의 하단 divider는 컨테이너 보더와 겹치므로 지운다
                    '& > [data-influencer-id]:last-of-type': { borderBottom: 'none' },
                  }}
                >
                  {/* 섹션 헤더 — 스크롤해도 어느 구간인지 남도록 sticky. 컨테이너 안쪽이라 radius를 맞춘다 */}
                  <Box
                    component="button"
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    aria-expanded={!isCollapsed}
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%',
                      px: 2,
                      py: 0.625,
                      border: 'none',
                      borderBottom: isCollapsed ? 'none' : '1px solid',
                      borderColor: 'divider',
                      borderRadius: isCollapsed ? '5px' : '5px 5px 0 0',
                      backgroundColor: 'grey.50',
                      font: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <ChevronRightIcon
                      sx={theme => ({
                        fontSize: 14,
                        flexShrink: 0,
                        color: 'text.disabled',
                        transform: isCollapsed ? 'none' : 'rotate(90deg)',
                        transition: theme.transitions.create('transform', { duration: 150 }),
                        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                      })}
                    />
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

                  {!isCollapsed && section.items.map(inf => (
                    <InfluencerListRow
                      key={inf.id}
                      influencer={inf}
                      onClick={() => onSelect?.(inf)}
                      isSelected={selectedId === inf.id}
                    />
                  ))}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SaasOperationsView;
