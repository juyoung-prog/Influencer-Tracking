import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import MentionListRow from '../../data-display/MentionListRow';
import { SearchBar } from '../../input/SearchBar';
import {
  MENTION_QUALIFICATIONS,
  MENTION_STATUSES,
  MENTION_STATUS_LABELS,
  MENTION_THRESHOLDS,
  deriveMentionKpi,
} from '../../../data/beautymaster/mentions.js';

const CHIP_SX = { height: 28, fontSize: 12 };

const PLATFORM_OPTIONS = ['Instagram', 'TikTok'];
const STATUS_OPTIONS = [
  MENTION_STATUSES.NEW,
  MENTION_STATUSES.REVIEWED,
  MENTION_STATUSES.CONTACTED,
];

/**
 * MentionStat — single KPI cell (KpiBar StatBlock idiom)
 *
 * @param {string} label
 * @param {string|number} value
 * @param {boolean} isAlert - render in warning color (review queue pending)
 */
function MentionStat({ label, value, isAlert = false }) {
  return (
    <Box>
      <Typography
        sx={{
          display: 'block',
          fontSize: '0.625rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: isAlert ? 'warning.main' : 'text.disabled',
          lineHeight: 1,
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        component="span"
        sx={{ lineHeight: 1, fontWeight: 700, color: isAlert ? 'warning.main' : 'text.primary' }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/**
 * MentionsPanel component
 *
 * Mentions tab content for the BeautyMaster dashboard.
 * Smart component: owns platform/status filter and search state.
 * Splits mentions into three sections — Review Queue (unverified, manual
 * check), Qualified (10K+ followers & ER threshold passed), and Below
 * Threshold (kept for micro-influencer reference, rendered muted).
 *
 * Props:
 * @param {Mention[]} mentions - Full mention list (data/beautymaster/mentions.js typedef) [Required]
 * @param {Date|null} lastCrawledAt - Timestamp of the last daily crawl [Optional, default: null]
 * @param {function} onApprove - Approve handler for review-queue rows (mention) => void [Optional]
 * @param {function} onDismiss - Dismiss handler for review-queue rows (mention) => void [Optional]
 * @param {object} sx - MUI sx overrides applied to the root Box [Optional]
 *
 * Example usage:
 * <MentionsPanel mentions={mentions} lastCrawledAt={lastCrawledAt} onApprove={handleApprove} />
 */
function MentionsPanel({ mentions, lastCrawledAt = null, onApprove, onDismiss, sx }) {
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
        label: 'REVIEW QUEUE — MANUAL CHECK',
        labelColor: 'warning.main',
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.UNVERIFIED).sort(byNewest),
      },
      {
        key: 'qualified',
        label: `QUALIFIED — ${MENTION_THRESHOLDS.MIN_FOLLOWERS / 1000}K+ FOLLOWERS · ER ≥ ${MENTION_THRESHOLDS.MIN_ENGAGEMENT_RATE * 100}%`,
        labelColor: 'text.disabled',
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.QUALIFIED).sort(byNewest),
      },
      {
        key: 'below',
        label: 'BELOW THRESHOLD',
        labelColor: 'text.disabled',
        items: filtered.filter(m => m.qualification === MENTION_QUALIFICATIONS.BELOW_THRESHOLD).sort(byNewest),
      },
    ].filter(s => s.items.length > 0);
  }, [filtered]);

  const hasFilter = platformFilter !== null || statusFilter !== null;

  return (
    <Box sx={{ flex: 1, overflow: 'auto', minWidth: 0, ...sx }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        {/* KPI strip + crawl timestamp */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, mb: 2.5, flexWrap: 'wrap' }}>
          <MentionStat label="New Today" value={kpi.newToday} />
          <MentionStat label="Qualified" value={kpi.qualified} />
          <MentionStat label="Review Queue" value={kpi.reviewQueue} isAlert={kpi.reviewQueue > 0} />
          <MentionStat label="Contacted" value={kpi.contacted} />
          <MentionStat
            label="Avg Eng. Rate"
            value={kpi.avgEngagementRate != null ? `${(kpi.avgEngagementRate * 100).toFixed(1)}%` : '—'}
          />
          <Typography variant="caption" color="text.disabled" sx={{ ml: 'auto', alignSelf: 'flex-end' }}>
            {lastCrawledAt
              ? `Last crawl: ${lastCrawledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${lastCrawledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · runs daily`
              : 'Crawl runs daily'}
          </Typography>
        </Box>

        {/* Search + filters */}
        <SearchBar
          value={searchQuery}
          placeholder="Search by handle or name..."
          onChange={setSearchQuery}
          isFullWidth
          size="sm"
          sx={{ mb: 1.5 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
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

        {/* Sectioned list */}
        {sections.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.disabled">
              No mentions found
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderBottom: 'none',
              borderRadius: '4px 4px 0 0',
              overflow: 'hidden',
            }}
          >
            {sections.map(section => (
              <Box key={section.key}>
                <Box sx={{ px: 2, py: 0.625, backgroundColor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: section.labelColor, lineHeight: 1 }}>
                    {section.label}
                  </Typography>
                </Box>
                {section.items.map(mention => (
                  <MentionListRow
                    key={mention.id}
                    mention={mention}
                    onApprove={onApprove}
                    onDismiss={onDismiss}
                  />
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MentionsPanel;
