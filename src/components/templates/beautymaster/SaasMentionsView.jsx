import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SaasKpiItem from './SaasKpiItem';
import {
  MENTION_QUALIFICATIONS,
  MENTION_SOURCE_LABELS,
  MENTION_STATUSES,
  MENTION_STATUS_LABELS,
  MENTION_THRESHOLDS,
  deriveMentionKpi,
  formatCompact,
} from '../../../data/beautymaster/mentions.js';

const PLATFORM_OPTIONS = ['Instagram', 'TikTok'];

const STATUS_OPTIONS = [
  MENTION_STATUSES.NEW,
  MENTION_STATUSES.REVIEWED,
  MENTION_STATUSES.CONTACTED,
];

/** 운영 상태 → Status-first 표현 (dot + label). Operations 뷰의 STAGES와 같은 문법 */
const STATUS_DOTS = {
  [MENTION_STATUSES.NEW]: 'primary.main',
  [MENTION_STATUSES.REVIEWED]: 'grey.400',
  [MENTION_STATUSES.CONTACTED]: 'success.main',
  [MENTION_STATUSES.IGNORED]: 'grey.300',
};

const COLUMN_COUNT = 6;

function formatDate(date) {
  return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
}

function formatRate(rate) {
  return rate != null ? `${(rate * 100).toFixed(1)}%` : '—';
}

/**
 * SaasMentionsView component
 *
 * flat-SaaS 시안 Mentions 뷰 — 기존 MentionsPanel과 같은 데이터·구성이되 표면 문법만 다르다.
 * 상단은 KPI 스트립(배경 직접 배치) + 마지막 크롤 시각, 아래는 검색·플랫폼·상태 필터 툴바.
 * 목록은 섹션 헤더 행으로 Review queue / Qualified / Below threshold를 구분한 단일 테이블 —
 * 그룹을 나눠도 컬럼 정렬이 유지돼 스캔이 끊기지 않는다.
 * 익명(unverified) 건은 팔로워 검증이 불가해 캡션 발췌와 Approve/Dismiss 액션을 함께 보여주고,
 * below-threshold 건은 참조용이라 뮤트 처리한다.
 *
 * Props:
 * @param {Mention[]} mentions - 전체 멘션 목록 (data/beautymaster/mentions.js typedef) [Required]
 * @param {Date|null} lastCrawledAt - 마지막 일일 크롤 시각 [Optional, 기본값: null]
 * @param {function} onApprove - Review queue 행 Approve 핸들러 (mention) => void [Optional]
 * @param {function} onDismiss - Review queue 행 Dismiss 핸들러 (mention) => void [Optional]
 * @param {boolean} isLoading - 최초 로딩 여부 (목록이 비었을 때만 스켈레톤) [Optional, 기본값: false]
 * @param {Error|null} error - 조회 실패 에러 (상단 배너로 표시) [Optional, 기본값: null]
 * @param {function} onRetry - 에러 배너의 Retry 핸들러 [Optional]
 *
 * Example usage:
 * <SaasMentionsView mentions={mentions} lastCrawledAt={lastCrawledAt} onApprove={handleApprove} />
 */
function SaasMentionsView({
  mentions,
  lastCrawledAt = null,
  onApprove,
  onDismiss,
  isLoading = false,
  error = null,
  onRetry,
}) {
  const [platformFilter, setPlatformFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const kpi = useMemo(() => deriveMentionKpi(mentions), [mentions]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mentions.filter(m => {
      if (platformFilter && m.platform !== platformFilter) return false;
      if (statusFilter && m.status !== statusFilter) return false;
      if (q
        && !(m.authorHandle || '').toLowerCase().includes(q)
        && !(m.linkedInfluencerName || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [mentions, platformFilter, statusFilter, searchQuery]);

  const sections = useMemo(() => {
    const byNewest = (a, b) => b.capturedAt - a.capturedAt || b.postedAt - a.postedAt;
    return [
      {
        key: 'review',
        label: 'Review queue — manual check',
        isAlert: true,
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.UNVERIFIED).sort(byNewest),
      },
      {
        key: 'qualified',
        label: `Qualified — ${MENTION_THRESHOLDS.MIN_FOLLOWERS / 1000}K+ followers · ER ≥ ${MENTION_THRESHOLDS.MIN_ENGAGEMENT_RATE * 100}%`,
        isAlert: false,
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.QUALIFIED).sort(byNewest),
      },
      {
        key: 'below',
        label: 'Below threshold',
        isAlert: false,
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.BELOW_THRESHOLD).sort(byNewest),
      },
    ].filter(s => s.items.length > 0);
  }, [filtered]);

  const visibleCount = sections.reduce((n, s) => n + s.items.length, 0);
  const hasFilter = platformFilter !== null || statusFilter !== null || searchQuery.trim() !== '';
  /** 최초 로딩만 스켈레톤 — 이미 데이터가 있으면 폴링 중에도 목록을 유지한다 */
  const showSkeleton = isLoading && mentions.length === 0;

  const resetFilters = () => {
    setPlatformFilter(null);
    setStatusFilter(null);
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
          Failed to load mentions — {error.message}
        </Alert>
      )}

      {/* KPI 스트립 — 배경 위 직접 배치, 카드 없음 */}
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
        <SaasKpiItem label="New today" value={kpi.newToday} isFirst />
        <SaasKpiItem label="Qualified" value={kpi.qualified} />
        <SaasKpiItem label="Review queue" value={kpi.reviewQueue} isAlert={kpi.reviewQueue > 0} />
        <SaasKpiItem label="Contacted" value={kpi.contacted} />
        <SaasKpiItem label="Avg eng. rate" value={formatRate(kpi.avgEngagementRate)} />

        <Typography sx={{ ml: 'auto', fontSize: 12, color: 'text.disabled' }}>
          {lastCrawledAt
            ? `Last crawl ${formatDate(lastCrawledAt)}, ${lastCrawledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · runs daily`
            : 'Crawl runs daily'}
        </Typography>
      </Box>

      {/* 필터 툴바 — Operations 뷰와 같은 컨트롤 문법(36px 높이, 6px radius) */}
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
          placeholder="Search by handle or name"
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
            width: 220,
            '& .MuiInputBase-root': { borderRadius: '6px', fontSize: 12, height: 36, backgroundColor: 'background.paper' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
            '& .MuiInputBase-input::placeholder': { color: 'text.disabled', opacity: 1 },
          }}
        />
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
        {STATUS_OPTIONS.map(s => (
          <Chip
            key={s}
            label={MENTION_STATUS_LABELS[s]}
            size="small"
            onClick={() => setStatusFilter(prev => (prev === s ? null : s))}
            variant={statusFilter === s ? 'filled' : 'outlined'}
            sx={chipSx(statusFilter === s)}
          />
        ))}
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
          {visibleCount} of {mentions.length}
        </Typography>
      </Box>

      {/* 목록 — 섹션 헤더 행으로 구분한 단일 테이블 */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table size="small" stickyHeader sx={{ minWidth: 760 }}>
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
              <TableCell>Account</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell align="right">Followers</TableCell>
              <TableCell align="right">ER</TableCell>
              <TableCell>Posted</TableCell>
              <TableCell>Status</TableCell>
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
                <TableCell><Skeleton variant="text" width={50} /></TableCell>
                <TableCell><Skeleton variant="text" width={36} /></TableCell>
                <TableCell><Skeleton variant="text" width={56} /></TableCell>
                <TableCell><Skeleton variant="text" width={70} /></TableCell>
              </TableRow>
            ))}
            {!showSkeleton && sections.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMN_COUNT} sx={{ border: 'none', py: 8, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: hasFilter ? 1 : 0 }}>
                    {hasFilter ? 'No mentions match the current filters' : 'No mentions collected yet'}
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
                  colSpan={COLUMN_COUNT}
                  sx={{ borderColor: 'divider', backgroundColor: 'grey.50', py: 0.625, pl: 3, pr: 3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: section.isAlert ? 'warning.main' : 'text.secondary',
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
              ...section.items.map(mention => {
                const isUnverified = mention.qualification === MENTION_QUALIFICATIONS.UNVERIFIED;
                const isMuted = mention.qualification === MENTION_QUALIFICATIONS.BELOW_THRESHOLD;
                return (
                  <TableRow
                    key={mention.id}
                    sx={{
                      opacity: isMuted ? 0.6 : 1,
                      '& td': { fontSize: 13, borderColor: 'divider', py: 0.875 },
                      '& td:first-of-type': { pl: 3 },
                      '& td:last-of-type': { pr: 3 },
                      '&:hover': { backgroundColor: 'grey.50' },
                    }}
                  >
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            flexShrink: 0,
                            borderRadius: '50%',
                            backgroundColor: 'grey.100',
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                          }}
                        >
                          {isUnverified ? '?' : (mention.authorHandle || '—').charAt(0).toUpperCase()}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                            <Typography
                              component="span"
                              sx={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                              {isUnverified ? 'Anonymous' : `@${mention.authorHandle}`}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{ flexShrink: 0, fontSize: 10, color: 'text.disabled', letterSpacing: '0.04em' }}
                            >
                              {MENTION_SOURCE_LABELS[mention.source]}
                            </Typography>
                            {mention.linkedInfluencerName && (
                              <Typography
                                component="span"
                                sx={{ flexShrink: 0, fontSize: 10, color: 'primary.main', whiteSpace: 'nowrap' }}
                              >
                                Collab · {mention.linkedInfluencerName}
                              </Typography>
                            )}
                            {mention.postUrl && (
                              <Link
                                href={mention.postUrl}
                                target="_blank"
                                rel="noopener"
                                sx={{ display: 'inline-flex', flexShrink: 0, color: 'text.disabled', '&:hover': { color: 'text.primary' } }}
                              >
                                <OpenInNewOutlinedIcon sx={{ fontSize: 13 }} />
                              </Link>
                            )}
                          </Box>
                          {isUnverified && mention.caption && (
                            <Typography
                              sx={{ fontSize: 11, color: 'text.disabled', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                              {mention.caption}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{mention.platform}</TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      {mention.followerCount != null ? formatCompact(mention.followerCount) : '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      {formatRate(mention.engagementRate)}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      {formatDate(mention.postedAt)}
                    </TableCell>
                    <TableCell>
                      {isUnverified ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Button
                            size="small"
                            onClick={() => onApprove?.(mention)}
                            sx={{ textTransform: 'none', fontSize: 12, fontWeight: 500, minWidth: 0, px: 1, py: 0.25 }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            onClick={() => onDismiss?.(mention)}
                            sx={{ textTransform: 'none', fontSize: 12, fontWeight: 400, minWidth: 0, px: 1, py: 0.25, color: 'text.secondary' }}
                          >
                            Dismiss
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              flexShrink: 0,
                              borderRadius: '50%',
                              backgroundColor: STATUS_DOTS[mention.status] || 'grey.400',
                            }}
                          />
                          <Typography component="span" sx={{ fontSize: 13, color: 'text.secondary' }}>
                            {MENTION_STATUS_LABELS[mention.status]}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }),
            ])}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}

export default SaasMentionsView;
