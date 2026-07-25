import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  MENTION_QUALIFICATIONS,
  MENTION_SOURCE_LABELS,
  MENTION_STATUS_LABELS,
  MENTION_STATUSES,
  formatCompact,
} from '../../data/beautymaster/mentions.js';

const STATUS_COLOR = {
  [MENTION_STATUSES.NEW]: 'primary.main',
  [MENTION_STATUSES.REVIEWED]: 'text.secondary',
  [MENTION_STATUSES.CONTACTED]: 'success.main',
  [MENTION_STATUSES.IGNORED]: 'text.disabled',
};

/**
 * MentionListRow component
 *
 * Single row in the Mentions panel list.
 * Anonymous (unverified) rows show a "?" avatar, caption context, and
 * Approve / Dismiss actions instead of follower metrics.
 *
 * Props:
 * @param {Mention} mention - Mention data object (data/beautymaster/mentions.js typedef) [Required]
 * @param {function} onApprove - Approve handler for unverified rows (mention) => void [Optional]
 * @param {function} onDismiss - Dismiss handler for unverified rows (mention) => void [Optional]
 *
 * Example usage:
 * <MentionListRow mention={mention} onApprove={handleApprove} onDismiss={handleDismiss} />
 */
function MentionListRow({ mention, onApprove, onDismiss }) {
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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        px: 2,
        py: 1,
        minHeight: 52,
        borderBottom: '1px solid',
        borderColor: 'divider',
        opacity: isBelowThreshold ? 0.55 : 1,
      }}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
          bgcolor: isUnverified ? 'grey.200' : undefined,
          color: isUnverified ? 'text.disabled' : undefined,
        }}
      >
        {initials}
      </Avatar>

      {/* Author + context — the only fluid column, so it gets minWidth: 0 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, minWidth: 0 }}>
          {authorHandle ? (
            <Typography
              variant="body2"
              component={authorProfileUrl ? 'a' : 'span'}
              href={authorProfileUrl || undefined}
              target={authorProfileUrl ? '_blank' : undefined}
              rel={authorProfileUrl ? 'noreferrer' : undefined}
              sx={{
                fontWeight: 500,
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
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.disabled' }}>
              Unknown author
            </Typography>
          )}
          {linkedInfluencerName && (
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                border: '1px solid',
                borderColor: 'secondary.main',
                borderRadius: '4px',
                px: 0.5,
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
          sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {platform} · {matchedKeyword} · via {MENTION_SOURCE_LABELS[source]}
        </Typography>
        {isUnverified && caption && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            “{caption}”
          </Typography>
        )}
      </Box>

      {/* Metrics — fixed columns, hidden on xs to avoid squeeze */}
      <Box sx={{ flex: '0 0 84px', flexShrink: 0, display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {formatCompact(followerCount)}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.625rem', lineHeight: 1 }}>
          followers
        </Typography>
      </Box>
      <Box sx={{ flex: '0 0 64px', flexShrink: 0, display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {engagementRate != null ? `${(engagementRate * 100).toFixed(1)}%` : '—'}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.625rem', lineHeight: 1 }}>
          eng. rate
        </Typography>
      </Box>
      <Box sx={{ flex: '0 0 64px', flexShrink: 0, display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {formatCompact(likes)}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.625rem', lineHeight: 1 }}>
          likes
        </Typography>
      </Box>

      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ flex: '0 0 52px', flexShrink: 0, textAlign: 'right', fontVariantNumeric: 'tabular-nums', display: { xs: 'none', sm: 'block' } }}
      >
        {dateLabel}
      </Typography>

      {/* Status or review actions */}
      <Box sx={{ flex: '0 0 132px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
        {isUnverified ? (
          <>
            <Button size="small" variant="outlined" onClick={() => onApprove?.(mention)} sx={{ fontSize: 11, px: 1, py: 0.25, minWidth: 'auto' }}>
              Approve
            </Button>
            <Button size="small" variant="text" color="inherit" onClick={() => onDismiss?.(mention)} sx={{ fontSize: 11, px: 1, py: 0.25, minWidth: 'auto', color: 'text.disabled' }}>
              Dismiss
            </Button>
          </>
        ) : (
          <Typography variant="caption" sx={{ fontWeight: 500, color: STATUS_COLOR[status] || 'text.secondary', whiteSpace: 'nowrap' }}>
            {MENTION_STATUS_LABELS[status] || status}
          </Typography>
        )}
        <Tooltip title="Open post">
          <IconButton size="small" component="a" href={postUrl} target="_blank" rel="noreferrer" sx={{ ml: 0.5 }}>
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default MentionListRow;
