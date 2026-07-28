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
  if (isFuture)      return { label: 'Scheduled',        color: 'text.secondary',  show: false };
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
    hasScheduledTimeOfDay = false,
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

  // 시트에 시각이 없으면 파싱 결과가 자정이 된다. 그걸 "12:00 AM"으로 보여주면
  // 없는 정보를 있는 것처럼 만들므로, 날짜만 쓰고 시각은 "time TBD"로 밝힌다.
  const dateLabel = scheduledTime ? scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
  const clockLabel = scheduledTime && hasScheduledTimeOfDay
    ? scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;
  const timeLabel = !scheduledTime
    ? 'Date TBD'
    : scheduleGroup === 'today'
      ? (clockLabel ?? 'Time TBD')
      : `${dateLabel} · ${clockLabel ?? 'time TBD'}`;

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
        borderLeftColor: isSelected ? 'accent.main' : 'transparent',
        backgroundColor: isSelected ? 'action.selected' : 'transparent',
        textAlign: 'left',
        '&:hover': { backgroundColor: 'action.hover' },
      }}
    >
      <Avatar
        src={imageUrl}
        alt={fullName}
        sx={{
          width: 28, height: 28, fontSize: 11, fontWeight: 700,
          flexShrink: 0, alignSelf: 'flex-start', mt: 0.25,
          // 기본값(흰 글자 + grey.400)은 대비 1.88:1로 AA 미달 — 연한 배경에 진한 글자로 뒤집는다
          bgcolor: 'surface.muted',
          color: 'text.secondary',
        }}
      >
        {initials}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fullName || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }}>
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

      <Typography variant="caption" color="text.secondary" sx={{ flex: '0 0 100px', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {tier === 'tier2' ? 'T2' : 'T1'} · {platform}
      </Typography>

      <Box sx={{ flex: '0 0 140px', flexShrink: 0 }}>
        {stage.show && (
          <Typography variant="caption" sx={{ display: 'block', fontWeight: stage.color === 'error.main' ? 700 : 500, color: stage.color, whiteSpace: 'nowrap' }}>
            {stage.label}
          </Typography>
        )}
        {daysOverdue != null && (
          // 지연 일수는 심각도가 아니라 "얼마나"를 말하는 수치다.
          // 심각도 색은 위의 stage 라벨이 이미 지고 있어서, 여기까지 앰버로 칠하면
          // 한 행에 경고색이 세 줄 겹쳐 무엇이 급한지 사라진다.
          // 대비는 AA를 넘기되(5.74:1) 색은 중립으로 두고 굵기로만 강조한다.
          <Typography
            variant="caption"
            sx={{ display: 'block', color: 'text.secondary', fontWeight: 600, fontSize: '0.6875rem', lineHeight: 1.3 }}
          >
            {daysOverdue}d overdue
          </Typography>
        )}
        {contactAlert && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.25,
              // 3단계: 막힘(레드) > 지연(앰버) > 부가정보(중립).
              // 회신이 끊긴 건은 스스로 풀리지 않으므로 레드. 회신 대기 중인 건은
              // 위의 stage 라벨이 이미 앰버라, 여기까지 앰버면 한 행에 경고색이 둘이 된다.
              color: contactAlert.isUrgent ? 'error.main' : 'text.secondary',
              fontWeight: contactAlert.isUrgent ? 700 : 500,
              fontSize: '0.6875rem',
              lineHeight: 1.3,
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
