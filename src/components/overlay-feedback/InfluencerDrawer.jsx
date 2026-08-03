import Avatar from '@mui/material/Avatar';
import { SAAS_FONT } from '../templates/beautymaster/SaasShell';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StatusIconRow from '../data-display/StatusIconRow';
import {
  PERFORMANCE_CHECK_DAYS,
  PERFORMANCE_STATES,
  deriveEngagementRate,
  derivePerformanceStatus,
  normalizePlatform,
  toDisplayName,
} from '../../data/beautymaster/schema.js';
import { avatarInitials, avatarTint } from '../../utils/influencerAvatar.js';
import MessageTemplateMenu from './MessageTemplateMenu';

const CATEGORY_LABEL = { general: 'General', kbeauty: 'K-Beauty', specific: 'Specific' };

const OPINION_COLOR = {
  'USE': 'success',
  'MAYBE': 'warning',
  "DON'T": 'error',
};

/** @param {Date|null} date */
function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** @param {number|null} val */
function formatNum(val) {
  if (val == null) return '—';
  return val.toLocaleString('en-US');
}

/** @param {Date} date @param {number} days */
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * InfluencerDrawer component
 *
 * Right-side slide panel showing full influencer detail.
 * Sections: Profile + Status / Performance metrics / Content / Credit & evaluation / Contact (email + social) / Note.
 * When influencer is null, the drawer body is empty.
 *
 * Props:
 * @param {Influencer|null} influencer - Influencer to display [Optional, default: null]
 * @param {boolean} open - Whether the Drawer is open [Required]
 * @param {function} onClose - Drawer close handler [Required]
 * @param {MessageTemplate[]} templates - Outreach message templates for MessageTemplateMenu [Optional, default: []]
 * @param {string} sheetUrl - Google Sheet 원본 링크. 성과 기록이 밀린 상태(due)일 때
 *   "Record in sheet" 링크로 노출 — 기록은 시트에만 한다 [Optional, default: '']
 *
 * Example usage:
 * <InfluencerDrawer influencer={selected} open={drawerOpen} onClose={handleClose} templates={messageTemplates} />
 */
function InfluencerDrawer({ influencer = null, open = false, onClose, templates = [], sheetUrl = '' }) {
  /* 표기는 목록과 같은 규칙을 쓴다 — 시트에 성이 소문자인 행이 있어 패널만
     "Aurora garcia"로 나왔다. 원본 fullName은 그대로 두고 표시만 바꾼다. */
  const displayName = toDisplayName(influencer?.fullName || '');
  const tint = avatarTint(displayName);
  /* D+14 기록 상태와 ER — 판정·계산은 목록·큐와 같은 derive 함수를 쓴다.
     행에서 "Record Performance"를 보고 열었는데 패널이 다른 말을 하면 안 된다. */
  const perf = influencer ? derivePerformanceStatus(influencer) : null;
  const engagementRate = influencer ? deriveEngagementRate(influencer) : null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            /* Drawer도 포털로 <body> 아래 렌더돼 SaasShell의 폰트·크기 규칙이 닿지 않는다.
               고치기 전에는 Pretendard와 Outfit 두 서체가 섞여 나왔다.
               모달과 같은 방식으로 한 곳에서 규격을 건다. */
            /* 폭을 내용에 맡기면 긴 이메일·프로필 URL 하나가 패널을 늘려서
               사람마다 드로어 폭이 달라진다. 폭은 여기서 정하고, 끊을 곳 없는
               긴 토큰은 링크 쪽에서 줄바꿈시킨다. */
            width: { xs: '100%', sm: 420 },
            '& a': { overflowWrap: 'anywhere' },
            fontFamily: SAAS_FONT,
            '& .MuiTypography-root, & .MuiButton-root, & .MuiChip-root, & .MuiAvatar-root': {
              fontFamily: 'inherit',
            },
            '& button, & input, & select, & textarea': { fontFamily: 'inherit' },

            // 화면이 쓰는 글자 단계(11~14px)에 맞춘다 — h5(20px)가 그대로 나오고 있었다
            '& .MuiTypography-h5': { fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' },
            '& .MuiChip-root': { borderRadius: '6px', height: 22, fontSize: 11 },
            '& .MuiButton-root': { textTransform: 'none', fontSize: 13, fontWeight: 500, borderRadius: '6px' },
            // 선·글자는 primary.dark (순수 #0000FF는 흰 배경에서 가장자리가 떨린다)
            '& .MuiButton-textPrimary, & .MuiButton-outlinedPrimary, & a': { color: 'primary.dark' },
          },
        },
      }}
    >
      {influencer ? (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* ── Header ── */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Avatar
              src={influencer.imageUrl}
              alt={displayName}
              /* 이니셜·색을 목록 행과 같은 규칙에서 뽑는다 — 행을 눌러 패널을 열었을 때
                 방금 본 원과 다른 원이 나오면 안 된다. 기본값(흰 글자 + grey.400)은
                 대비 1.88:1로 AA 미달이었다. */
              sx={{ width: 48, height: 48, flexShrink: 0, fontSize: 16, fontWeight: 700, bgcolor: tint.bg, color: tint.fg }}
            >
              {avatarInitials(displayName)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {displayName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip label={normalizePlatform(influencer.platform)} size="small" variant="outlined" />
                <Chip label={influencer.tier === 'tier2' ? 'Tier 2' : 'Tier 1'} size="small" variant="outlined" />
                {influencer.category && (
                  <Chip label={CATEGORY_LABEL[influencer.category] || influencer.category} size="small" variant="outlined" />
                )}
                <Chip label={`${influencer.store} · Month ${influencer.month}`} size="small" variant="outlined" />
              </Box>
              <Box sx={{ mt: 1 }}>
                <StatusIconRow
                  agreement={influencer.agreement}
                  attend={influencer.attend}
                  collaboShared={influencer.collaboShared}
                  creditShared={influencer.creditShared}
                  size={18}
                />
              </Box>
            </Box>
            <IconButton size="small" onClick={onClose} aria-label="Close" sx={{ flexShrink: 0 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ── Scrollable body ── */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>

            {/* Performance metrics */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Performance
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
              {[
                { label: 'Views', value: influencer.views },
                { label: 'Likes', value: influencer.likes },
                { label: 'Shares', value: influencer.shares },
                { label: 'Saves', value: influencer.saves },
                { label: 'Comments', value: influencer.comments },
                { label: 'Reposts', value: influencer.reposts },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {label}
                  </Typography>
                  <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
                    {formatNum(value)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* ER 요약 + 기록 상태 — 원시 숫자 6개의 해석을 화면이 대신한다.
                뷰티에서 구매 의도에 가까운 saves/shares까지 합친 조회수 기반 비율.
                기록 시점은 실제 Record Date를 그대로 보여준다 — D+14가 아니면
                그 사실이 보여야 다른 사람과 비교할 때 걸러 읽을 수 있다. */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Engagement rate
              </Typography>
              <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
                {engagementRate != null ? `${(engagementRate * 100).toFixed(1)}%` : '—'}
              </Typography>
              {perf?.state === PERFORMANCE_STATES.RECORDED && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {influencer.recordDate
                    ? `Recorded ${formatDate(influencer.recordDate)}${perf.recordedAfterDays != null ? ` · D+${perf.recordedAfterDays}` : ''}`
                    : 'Recorded · date not in sheet'}
                </Typography>
              )}
              {perf?.state === PERFORMANCE_STATES.WAITING && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {`Check due ${formatDate(addDays(influencer.uploadDate, PERFORMANCE_CHECK_DAYS))} · D-${perf.dDay}`}
                </Typography>
              )}
              {perf?.state === PERFORMANCE_STATES.DUE && (
                <>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    {`Performance check due${perf.daysLate > 0 ? ` · ${perf.daysLate}d past` : ''}`}
                  </Typography>
                  {sheetUrl && (
                    <Link
                      href={sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                      variant="body2"
                    >
                      Record in sheet <OpenInNewIcon sx={{ fontSize: 14 }} />
                    </Link>
                  )}
                </>
              )}
              {perf?.state === PERFORMANCE_STATES.EXPIRED && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Not recorded — check window passed
                </Typography>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Content link */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Content
            </Typography>
            {influencer.collaboLink ? (
              <Link
                href={influencer.collaboLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                variant="body2"
              >
                View Content <OpenInNewIcon sx={{ fontSize: 14 }} />
              </Link>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                No link
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Upload: {formatDate(influencer.uploadDate)}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Credit & evaluation */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Credit / Evaluation
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {influencer.serialNumber && (
                <Chip
                  label={`serial# ${influencer.serialNumber}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontSize: 11 }}
                />
              )}
              {influencer.creditUsed && (
                <Chip label="Credit Used" size="small" color="success" />
              )}
              {influencer.opinion && (
                <Chip
                  label={influencer.opinion}
                  size="small"
                  color={OPINION_COLOR[influencer.opinion] || 'default'}
                />
              )}
              {!influencer.opinion && influencer.collaboShared && (
                <Chip label="Evaluation Pending" size="small" variant="outlined" />
              )}
            </Box>

            {/* Contact */}
            {(influencer.socialAccountUrl || influencer.email) && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Contact
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  <MessageTemplateMenu influencer={influencer} templates={templates} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                  {influencer.socialAccountUrl && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <PersonOutlineIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                      <Link
                        href={influencer.socialAccountUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                        variant="body2"
                      >
                        {normalizePlatform(influencer.platform)} Profile <OpenInNewIcon sx={{ fontSize: 13 }} />
                      </Link>
                    </Box>
                  )}
                  {influencer.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <EmailOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                      <Link href={`mailto:${influencer.email}`} variant="body2">
                        {influencer.email}
                      </Link>
                    </Box>
                  )}
                </Box>
              </>
            )}

            {/* Note */}
            {influencer.note && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Note
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {influencer.note}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
}

export default InfluencerDrawer;
