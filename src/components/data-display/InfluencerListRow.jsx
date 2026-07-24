import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { ALERT_FLAGS, CONTACT_STATUSES } from '../../data/beautymaster/schema.js';

function getCurrentStage({ attend, collaboShared, creditShared, scheduleGroup }) {
  if (creditShared)  return { label: 'Completed',        color: 'success.main',   show: true };
  if (collaboShared) return { label: 'Credit Not Sent',  color: 'error.main',     show: true };
  if (attend)        return { label: 'Awaiting Upload',  color: 'text.secondary', show: true };
  const isFuture = scheduleGroup === 'upcoming' || scheduleGroup === 'today';
  if (isFuture)      return { label: 'Scheduled',        color: 'text.disabled',  show: false };
  return               { label: 'Visit Unconfirmed', color: 'warning.main',   show: true };
}

function getDaysOverdue(alertFlags, scheduledTime, uploadDate) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (alertFlags.includes(ALERT_FLAGS.COLLABO_NO_CREDIT) && uploadDate) {
    const d = new Date(uploadDate.getFullYear(), uploadDate.getMonth(), uploadDate.getDate());
    const days = Math.floor((todayStart - d) / 86400000);
    return days > 0 ? days : null;
  }
  if (
    (alertFlags.includes(ALERT_FLAGS.AGREEMENT_NO_ATTEND) || alertFlags.includes(ALERT_FLAGS.ATTEND_NO_COLLABO))
    && scheduledTime
  ) {
    const d = new Date(scheduledTime.getFullYear(), scheduledTime.getMonth(), scheduledTime.getDate());
    const days = Math.floor((todayStart - d) / 86400000);
    return days > 0 ? days : null;
  }
  return null;
}

const CONTACT_ALERT_LABEL = {
  [ALERT_FLAGS.NO_SHOW_UNRESOLVED]: 'No-show',
  [ALERT_FLAGS.RESCHEDULE_PENDING]: 'Reschedule',
};

function getContactAlert(alertFlags, contactStatus, lastContactDate, requestedDate) {
  const flag = alertFlags.find(f => CONTACT_ALERT_LABEL[f]);
  if (!flag) return null;

  const label = CONTACT_ALERT_LABEL[flag];
  const isNoResponse = contactStatus === CONTACT_STATUSES.NO_RESPONSE;
  const requestedSuffix = requestedDate
    ? ` → ${requestedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : '';

  if (isNoResponse && lastContactDate) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d = new Date(lastContactDate.getFullYear(), lastContactDate.getMonth(), lastContactDate.getDate());
    const days = Math.floor((todayStart - d) / 86400000);
    return { text: `${label} · ${days > 0 ? days : 0}d no reply${requestedSuffix}`, isUrgent: true };
  }

  return { text: `${label} · awaiting reply${requestedSuffix}`, isUrgent: false };
}

/**
 * InfluencerListRow component
 *
 * Single row in the influencer list panel.
 * Shows avatar / name + time + note / platform·tier / stage label + overdue.
 *
 * Props:
 * @param {Influencer} influencer - Influencer data object [Required]
 * @param {function} onClick - Row click handler [Required]
 * @param {boolean} isSelected - Highlights the row currently open in Drawer [Optional, default: false]
 *
 * Example usage:
 * <InfluencerListRow influencer={inf} onClick={() => handleSelect(inf)} isSelected={selectedId === inf.id} />
 */
function InfluencerListRow({ influencer, onClick, isSelected = false }) {
  const {
    fullName = '',
    imageUrl = '',
    scheduledTime = null,
    uploadDate = null,
    scheduleGroup = 'no-time',
    platform = '',
    tier = 'tier1',
    category = '',
    attend = false,
    collaboShared = false,
    creditShared = false,
    alertFlags = [],
    contactStatus = null,
    lastContactDate = null,
    requestedDate = null,
    note = '',
  } = influencer;

  const CATEGORY_LABEL = { general: 'General', kbeauty: 'K-Beauty', specific: 'Specific' };
  const categoryLabel = CATEGORY_LABEL[category] || null;

  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const timeLabel = scheduledTime
    ? scheduleGroup === 'today'
      ? scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : `${scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'TBD';

  const stage = getCurrentStage({ attend, collaboShared, creditShared, scheduleGroup });
  const daysOverdue = getDaysOverdue(alertFlags, scheduledTime, uploadDate);
  const contactAlert = getContactAlert(alertFlags, contactStatus, lastContactDate, requestedDate);

  return (
    <ButtonBase
      data-influencer-id={influencer.id}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        px: 2,
        py: 1,
        minHeight: 48,
        borderBottom: '1px solid',
        borderColor: 'divider',
        borderLeft: '2px solid',
        borderLeftColor: isSelected ? 'primary.main' : 'transparent',
        backgroundColor: isSelected ? 'action.selected' : 'transparent',
        textAlign: 'left',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      <Avatar
        src={imageUrl}
        alt={fullName}
        sx={{ width: 28, height: 28, fontSize: 11, fontWeight: 700, flexShrink: 0, alignSelf: 'flex-start', mt: 0.25 }}
      >
        {initials}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fullName || '—'}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {timeLabel}
        </Typography>
        {categoryLabel && (
          <Typography variant="caption" sx={{ display: 'inline-block', color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: '4px', px: 0.5, lineHeight: 1.4, mt: 0.25, ml: 0.75 }}>
            {categoryLabel}
          </Typography>
        )}
        {note && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {note}
          </Typography>
        )}
      </Box>

      <Typography variant="caption" color="text.disabled" sx={{ flex: '0 0 100px', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {tier === 'tier2' ? 'T2' : 'T1'} · {platform}
      </Typography>

      <Box sx={{ flex: '0 0 140px', flexShrink: 0 }}>
        {stage.show && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: stage.color === 'error.main' ? 700 : 500, color: stage.color, whiteSpace: 'nowrap' }}>
            {stage.label}
          </Typography>
        )}
        {daysOverdue != null && (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.625rem', lineHeight: 1 }}>
            {daysOverdue}d overdue
          </Typography>
        )}
        {contactAlert && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.25,
              color: 'warning.main',
              fontWeight: contactAlert.isUrgent ? 700 : 500,
              fontSize: '0.625rem',
              lineHeight: 1.2,
            }}
          >
            {contactAlert.text}
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );
}

export default InfluencerListRow;
