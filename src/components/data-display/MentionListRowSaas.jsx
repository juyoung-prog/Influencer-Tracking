import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  MENTION_QUALIFICATIONS,
  MENTION_SOURCE_LABELS,
  MENTION_STATUS_LABELS,
  MENTION_STATUSES,
  formatCompact,
} from '../../data/beautymaster/mentions.js';

/** 상태별 팔레트 키 — soft tinted pill 배경/텍스트에 함께 사용 */
const STATUS_PALETTE_KEY = {
  [MENTION_STATUSES.NEW]: 'primary',
  [MENTION_STATUSES.REVIEWED]: 'secondary',
  [MENTION_STATUSES.CONTACTED]: 'success',
  [MENTION_STATUSES.IGNORED]: 'grey',
};

/**
 * MentionListRowSaas component
 *
 * MentionListRow의 모던 SaaS 문법 시안 변형 (라운드 카드 + 소프트 섀도 비교용).
 * 데이터·컬럼 구성은 MentionListRow와 동일하고 표면 문법만 다르다 —
 * 라운드 hover 배경, soft tinted 상태 pill, pill 버튼.
 * 폰트는 부모(MentionsPanelSaas)의 Inter 스택을 상속한다.
 *
 * Props:
 * @param {Mention} mention - 멘션 데이터 객체 (data/beautymaster/mentions.js typedef) [Required]
 * @param {function} onApprove - unverified 행의 Approve 핸들러 (mention) => void [Optional]
 * @param {function} onDismiss - unverified 행의 Dismiss 핸들러 (mention) => void [Optional]
 *
 * Example usage:
 * <MentionListRowSaas mention={mention} onApprove={handleApprove} onDismiss={handleDismiss} />
 */
function MentionListRowSaas({ mention, onApprove, onDismiss }) {
  const theme = useTheme();
  const {
    platform,
    postUrl,
    authorHandle,
    authorProfileUrl,
    followerCount,
    engagementRate,
    likes,
    postedAt,
    matchedKeyword,
    source,
    qualification,
    status,
    linkedInfluencerName,
    caption,
  } = mention;

  const isUnverified = qualification === MENTION_QUALIFICATIONS.UNVERIFIED;
  const isBelowThreshold = qualification === MENTION_QUALIFICATIONS.BELOW_THRESHOLD;
  const initials = authorHandle ? authorHandle.slice(0, 2).toUpperCase() : '?';

  const dateLabel = postedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const statusKey = STATUS_PALETTE_KEY[status] || 'secondary';
  const statusColor = statusKey === 'grey' ? theme.palette.grey[600] : theme.palette[statusKey].main;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        px: 2.5,
        py: 1.5,
        minHeight: 60,
        borderRadius: '10px',
        opacity: isBelowThreshold ? 0.55 : 1,
        transition: 'background-color 120ms ease',
        '&:hover': { backgroundColor: 'grey.50' },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
          fontFamily: 'inherit',
          bgcolor: isUnverified ? 'grey.100' : alpha(theme.palette.primary.main, 0.08),
          color: isUnverified ? 'text.disabled' : 'primary.main',
        }}
      >
        {initials}
      </Avatar>

      {/* Author + context — the only fluid column, so it gets minWidth: 0 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {authorHandle ? (
            <Typography
              variant="body2"
              component={authorProfileUrl ? 'a' : 'span'}
              href={authorProfileUrl || undefined}
              target={authorProfileUrl ? '_blank' : undefined}
              rel={authorProfileUrl ? 'noreferrer' : undefined}
              sx={{
                fontFamily: 'inherit',
                fontWeight: 600,
                color: 'text.primary',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '&:hover': { textDecoration: authorProfileUrl ? 'underline' : 'none' },
              }}
            >
              @{authorHandle}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ fontFamily: 'inherit', fontWeight: 600, color: 'text.disabled' }}>
              Unknown author
            </Typography>
          )}
          {linkedInfluencerName && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'inherit',
                fontWeight: 500,
                color: 'secondary.main',
                backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                borderRadius: '999px',
                px: 1,
                py: 0.25,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Collab · {linkedInfluencerName}
            </Typography>
          )}
        </Box>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: 'inherit', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {platform} · {matchedKeyword} · via {MENTION_SOURCE_LABELS[source]}
        </Typography>
        {isUnverified && caption && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: 'inherit', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            “{caption}”
          </Typography>
        )}
      </Box>

      {/* Metrics — fixed columns, hidden on xs to avoid squeeze */}
      <Box sx={{ flex: '0 0 84px', flexShrink: 0, display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {formatCompact(followerCount)}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'inherit', fontSize: '0.625rem', lineHeight: 1 }}>
          followers
        </Typography>
      </Box>
      <Box sx={{ flex: '0 0 64px', flexShrink: 0, display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {engagementRate != null ? `${(engagementRate * 100).toFixed(1)}%` : '—'}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'inherit', fontSize: '0.625rem', lineHeight: 1 }}>
          eng. rate
        </Typography>
      </Box>
      <Box sx={{ flex: '0 0 64px', flexShrink: 0, display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {formatCompact(likes)}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'inherit', fontSize: '0.625rem', lineHeight: 1 }}>
          likes
        </Typography>
      </Box>

      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontFamily: 'inherit', flex: '0 0 52px', flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums', display: { xs: 'none', sm: 'block' } }}
      >
        {dateLabel}
      </Typography>

      {/* Status pill or review actions */}
      <Box sx={{ flex: '0 0 148px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75 }}>
        {isUnverified ? (
          <>
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={() => onApprove?.(mention)}
              sx={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 600, px: 1.5, py: 0.5, minWidth: 'auto', borderRadius: '999px', textTransform: 'none' }}
            >
              Approve
            </Button>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => onDismiss?.(mention)}
              sx={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 500, px: 1.25, py: 0.5, minWidth: 'auto', borderRadius: '999px', textTransform: 'none', color: 'text.disabled' }}
            >
              Dismiss
            </Button>
          </>
        ) : (
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'inherit',
              fontWeight: 600,
              color: statusColor,
              backgroundColor: alpha(statusColor, 0.08),
              borderRadius: '999px',
              px: 1.25,
              py: 0.375,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {MENTION_STATUS_LABELS[status] || status}
          </Typography>
        )}
        <Tooltip title="Open post">
          <IconButton size="small" component="a" href={postUrl} target="_blank" rel="noreferrer" sx={{ ml: 0.25 }}>
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default MentionListRowSaas;
