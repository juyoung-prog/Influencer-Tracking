import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { ALERT_FLAGS, CONTACT_STATUSES, PERFORMANCE_STATES, derivePerformanceStatus, isStaleVisit, isTomorrow, isUnfulfilled, normalizePlatform, toDisplayName } from '../../data/beautymaster/schema.js';
import { avatarInitials, avatarTint } from '../../utils/influencerAvatar.js';

/* 속성 하위 컬럼 폭 — 각 값의 최장 문자열에서 도출(12px caption 기준).
   "Instagram" 62px / "T2" 16px / "K-Beauty" 54px. 넘치는 값은 줄임표로 보낸다 —
   늘리면 이름 칸이 그만큼 줄어든다. */
const ATTR_PLATFORM_W = 72;
const ATTR_TIER_W = 22;
const ATTR_CATEGORY_W = 62;

/* isUrgent인 단계만 상태 컬럼에서 색을 얻는다 — 나머지는 회색으로 남는다.
   전부 색을 주면 행마다 색이 달라 목록이 신호등이 되고, 정작 손대야 하는 건이 묻힌다. */
function getCurrentStage({ attend, collaboShared, creditShared, scheduleGroup }) {
  if (creditShared)  return { label: 'Completed',        color: 'success.main',   show: true };
  if (collaboShared) return { label: 'Credit Not Sent',  color: 'error.main',     show: true, isUrgent: true };
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

/**
 * D+14 성과 기록 상태를 행에 붙일 문구로 바꾼다. 표시할 게 없으면 null.
 *
 * - due     — "Record Performance"(작업 큐 섹션과 같은 어휘) + 초과일. 경보가 아니라
 *             예정된 루틴 작업이므로 warning 색이 아니라 본문 색 강조만 쓴다.
 * - waiting — 임박(D-3 이내)부터만 D-day를 보여준다. 전 행에 상시 노출하면 숫자 소음이 된다.
 * - recorded/expired — 행에서는 침묵한다(상세는 Drawer가 말한다).
 *
 * @param {Influencer} influencer
 * @returns {{text: string, isDue: boolean}|null}
 */
function getPerformanceLine(influencer) {
  const perf = derivePerformanceStatus(influencer);
  if (!perf) return null;
  if (perf.state === PERFORMANCE_STATES.DUE) {
    return { text: `Record Performance${perf.daysLate > 0 ? ` · ${perf.daysLate}d` : ''}`, isDue: true };
  }
  if (perf.state === PERFORMANCE_STATES.WAITING && perf.dDay <= 3) {
    return { text: `Perf check D-${perf.dDay}`, isDue: false };
  }
  return null;
}

/** 그 날로부터 오늘까지 경과일. 자정 기준, 음수는 0으로 */
function daysSinceDay(date) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const then = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.floor((todayStart - then) / 86400000);
  return days > 0 ? days : 0;
}

function getContactAlert(alertFlags, lastContactDate, requestedDate) {
  const flag = alertFlags.find(f => CONTACT_ALERT_LABEL[f]);
  if (!flag) return null;

  const label = CONTACT_ALERT_LABEL[flag];
  const requestedSuffix = requestedDate
    ? ` → ${requestedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : '';

  /* "무응답"은 별도 상태가 아니다(구 no-response는 폐기) — "awaiting reply"에
     경과일을 병기하면 어제 보낸 건과 3주 전 보낸 건이 저절로 갈린다.
     오래 기다린 건을 상태 전환 없이 숫자가 말해 준다. */
  const waited = lastContactDate ? daysSinceDay(lastContactDate) : null;
  const waitedSuffix = waited != null ? ` · ${waited}d` : '';
  return { text: `${label} · awaiting reply${waitedSuffix}${requestedSuffix}` };
}

/**
 * InfluencerListRow component
 *
 * Single row in the influencer list panel.
 * Shows avatar / name + time + note / platform·tier / stage label + overdue + performance D-day.
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
    hasFullName = true,
    socialHandle = '',
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

  /* 세 속성을 한 문자열로 묶는다. 필터 바 칩 순서와 같게 두어야
     "Instagram 칩을 눌렀다 → 행에서 Instagram을 찾는다"가 같은 자리에서 일어난다.
     셋 다 맨 텍스트다 — 동등한 속성인데 하나만 칩이면 무게가 달라 보인다. */
  const attributeCells = [
    { key: 'platform', text: normalizePlatform(platform), width: ATTR_PLATFORM_W },
    { key: 'tier', text: tier === 'tier2' ? 'T2' : 'T1', width: ATTR_TIER_W },
    { key: 'category', text: categoryLabel || '', width: ATTR_CATEGORY_W },
  ];
  const attributeTitle = attributeCells.map(c => c.text).filter(Boolean).join(' · ');

  /* 표시용으로만 정규화한다 — 시트에 성을 소문자로 적은 행이 목록에서 튄다.
     아바타 이니셜·색도 정규화된 이름에서 뽑아 대문자 표기와 어긋나지 않게 한다. */
  const displayName = toDisplayName(fullName);
  const initials = avatarInitials(displayName);
  const tint = avatarTint(displayName);

  /* 핸들은 DM 보낼 때 실제로 필요한 값이고, 왼쪽 블록이 이름+날짜뿐이라
     넓은 화면에서 폭을 정당화하지 못했다. 상세 패널 링크와 같은 출처를 쓴다.
     이름 칸이 비어 핸들이 이름 자리에 올라온 행은 같은 값을 두 번 쓰지 않는다. */
  const handleLabel = socialHandle && hasFullName ? `@${socialHandle}` : null;

  // 시트에 시각이 없으면 파싱 결과가 자정이 된다. 그걸 "12:00 AM"으로 보여주면
  // 없는 정보를 있는 것처럼 만들므로, 날짜만 쓰고 시각은 "time TBD"로 밝힌다.
  const dateLabel = scheduledTime ? scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
  const clockLabel = scheduledTime && hasScheduledTimeOfDay
    ? scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null;
  /* 오늘은 이미 날짜를 지우고 시각만 남긴다 — 같은 이유로 내일도 날짜 대신 "Tomorrow"를
     쓴다. "Aug 13"이 코앞인지 알려면 사람이 오늘 날짜를 알고 빼야 하는데, 이 줄은
     준비할 시간이 남았는지 판단하려고 보는 줄이다. */
  const timeLabel = !scheduledTime
    ? 'Date TBD'
    : scheduleGroup === 'today'
      ? (clockLabel ?? 'Time TBD')
      : `${isTomorrow(scheduledTime) ? 'Tomorrow' : dateLabel} · ${clockLabel ?? 'time TBD'}`;

  const stage = getCurrentStage({ attend, collaboShared, creditShared, scheduleGroup });
  const daysOverdue = getDaysOverdue(alertFlags, scheduledTime, uploadDate);
  const contactAlert = getContactAlert(alertFlags, lastContactDate, requestedDate);
  const performanceLine = getPerformanceLine(influencer);
  /* 종결 상태 — 경보도 단계 문구도 아닌 "Dropped" 한 단어만 조용히 남긴다.
     행은 목록에 남는다: 다음 캠페인 때 노쇼 이력을 확인하는 근거가 된다. */
  const isDropped = contactStatus === CONTACT_STATUSES.DROPPED;
  /* 90일이 지나 경보가 꺼진 미이행 건. 경보를 되살리지는 않지만 문구는 바꿔야 한다 —
     "Awaiting Upload"는 아직 기다리는 중이라는 뜻이라, 200일 지난 건에 붙으면
     화면이 거짓말을 한다. 사실("No upload")로 바꾸고 경과일을 붙여 크기를 밝힌다.
     크레딧까지 나간 행은 제외한다 — 뒤 단계가 끝났으면 앞 단계를 말하지 않는다. */
  const isStaleNoUpload = !isDropped && !creditShared
    && isUnfulfilled(influencer) && isStaleVisit(scheduledTime);

  return (
    <ButtonBase
      data-influencer-id={influencer.id}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        /* 좁은 폭에서는 오른쪽 두 컬럼을 다음 줄로 접는다.
           고정 컬럼 합이 348px라(아바타 28 + gap 48 + 100 + 140 + padding 32)
           390px 폰에서 이름 자리가 마이너스가 되어 날짜·플랫폼·상태가 뒤엉켰다.

           뷰포트가 아니라 **컨테이너** 폭을 본다. 이 행이 실제로 쓸 수 있는 폭은
           창 크기가 아니라 목록 컬럼이 정하기 때문이다(좌측 레일이 180px을 가져간다).
           부모가 containerType을 선언하지 않으면 넓은 레이아웃으로 남는다. */
        flexWrap: 'nowrap',
        '@container (max-width: 420px)': { flexWrap: 'wrap', rowGap: 4 },
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
          /* 이름에서 뽑은 연한 색 — 이니셜이 겹치는 인접 행을 구분한다.
             기본값(흰 글자 + grey.400)은 대비 1.88:1로 AA 미달이었다. */
          bgcolor: tint.bg,
          color: tint.fg,
        }}
      >
        {initials}
      </Avatar>

      {/* 좁을 때는 이름 칸에 최소 폭을 줘서 오른쪽 두 컬럼이 다음 줄로 밀리게 한다.
          100%를 주면 아바타까지 떨어져 혼자 한 줄을 쓰므로 minWidth로만 민다. */}
      <Box sx={{ flex: 1, minWidth: 0, '@container (max-width: 420px)': { minWidth: 180 } }}>
        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {displayName || '—'}
        </Typography>
        {/* 핸들과 시각이 한 줄을 공유한다 — 줄을 더 늘리면 행 높이가 커져 한 화면에
            들어가는 사람이 줄어든다. 핸들이 없는 행은 예전처럼 날짜·시각만 남는다. */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {handleLabel ? `${handleLabel} · ${timeLabel}` : timeLabel}
        </Typography>
        {note && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {note}
          </Typography>
        )}
      </Box>

      {/* 접힌 줄에서는 아바타 폭(28) + gap(16)만큼 들여써서 이름과 세로선을 맞춘다 */}
      {/* 속성 컬럼 — 세 값이 각각 고정 폭 하위 컬럼에 들어가 세로로 정렬된다.
          한 문자열로 이어 붙이면 앞 값 길이에 따라 뒤 값 시작점이 밀려 훑을 수 없다.
          구분자 " · " 대신 컬럼 사이 여백이 경계를 만든다.
          순서는 필터 바 칩과 같다(플랫폼 → 티어 → 카테고리). */}
      <Box
        title={attributeTitle}
        sx={{
          display: 'flex',
          gap: 1,
          flex: `0 0 ${ATTR_PLATFORM_W + ATTR_TIER_W + ATTR_CATEGORY_W + 16}px`,
          minWidth: 0,
          flexShrink: 0,
          // 접힌 줄에서는 아바타 폭(28) + gap(16)만큼 들여써서 이름과 세로선을 맞춘다
          '@container (max-width: 420px)': { flex: '0 0 auto', marginLeft: '44px' },
        }}
      >
        {attributeCells.map(cell => (
          <Typography
            key={cell.key}
            variant="caption"
            color="text.secondary"
            sx={{
              /* 고정 폭 + minWidth:0 — 값이 길어도 컬럼이 늘어나지 않아야
                 그 행만 시작점이 밀리는 일이 없다. 넘치면 줄임표(전체는 title에). */
              width: cell.width,
              flexShrink: 0,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {cell.text}
          </Typography>
        ))}
      </Box>
      {/* 상태 컬럼 폭 — 가장 긴 문구 "No-show · awaiting reply · 20d"(11px, 약 164px)가
          한 줄에 들어가야 한다. 접히면 2줄 압축이 무의미해지고 행 높이도 들쭉날쭉해진다. */}
      <Box sx={{ flex: '0 0 176px', minWidth: 0, flexShrink: 0, '@container (max-width: 420px)': { flex: '1 1 auto' } }}>
        {/* 경과일이 이 행에서 유일하게 행마다 다르고 우선순위를 정하는 값이다 —
            그래서 여기에 강조가 간다. 상태 라벨은 대부분의 행이 같은 값이라 회색으로.
            (예전에는 반대였다: "Visit Unconfirmed"가 앰버, 경과일이 회색)
            예외는 "Credit Not Sent" 하나다 — 돈이 실제로 안 나간 건이라 회색에 섞이면 안 된다. */}
        {isDropped ? (
          <Typography
            variant="caption"
            sx={{ display: 'block', color: 'text.disabled', fontSize: '0.6875rem', lineHeight: 1.3 }}
          >
            Dropped
          </Typography>
        ) : isStaleNoUpload ? (
          /* 경보가 아니라 확정된 사실이라 warning/error 색을 쓰지 않는다(성과 기록 문구와
             같은 규칙). 대신 굵기로만 올린다 — 이 구간에서 유일하게 돈이 나간 건이다. */
          <Typography
            variant="caption"
            data-stale-no-upload
            sx={{ display: 'block', color: 'text.primary', fontWeight: 600, fontSize: '0.6875rem', lineHeight: 1.3 }}
          >
            No upload · {daysSinceDay(scheduledTime)}d
          </Typography>
        ) : (
          <>
            {daysOverdue != null && (
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'warning.main', fontWeight: 600, fontSize: '0.6875rem', lineHeight: 1.3 }}
              >
                {daysOverdue}d overdue
              </Typography>
            )}
            {/* 연락 상태가 있으면 그게 공식 상태값이다 — 섹션 분류가 alertFlags 로 돌아간다.
                "Visit Unconfirmed"는 같은 사실(방문 미확인)을 다시 말하는 표시용 파생값이라
                둘이 함께 나오면 3줄이 되고 한 줄이 잉여가 된다. 연락 상태를 남긴다. */}
            {contactAlert ? (
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'text.secondary', fontSize: '0.6875rem', lineHeight: 1.3 }}
              >
                {contactAlert.text}
              </Typography>
            ) : (
              /* 성과 기록이 밀린 건 "Completed"를 지운다 — 크레딧까지 끝났어도 기록이
                 남았으면 완료가 아니다. 같은 행이 "Completed"와 "Record Performance"를
                 동시에 말하면 둘 중 하나는 거짓이 된다. 크레딧 미발송(Credit Not Sent)
                 등 다른 단계 라벨은 그대로 둔다 — 그건 기록과 별개의 할 일이다. */
              stage.show && !(performanceLine?.isDue && creditShared) && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: stage.isUrgent ? stage.color : 'text.secondary',
                    fontWeight: stage.isUrgent ? 600 : 400,
                    fontSize: '0.6875rem',
                    lineHeight: 1.3,
                  }}
                >
                  {stage.label}
                </Typography>
              )
            )}
            {performanceLine && (
              <Typography
                variant="caption"
                data-performance-line
                sx={{
                  display: 'block',
                  color: performanceLine.isDue ? 'text.primary' : 'text.secondary',
                  fontWeight: performanceLine.isDue ? 600 : 400,
                  fontSize: '0.6875rem',
                  lineHeight: 1.3,
                }}
              >
                {performanceLine.text}
              </Typography>
            )}
          </>
        )}
      </Box>
    </ButtonBase>
  );
}

export default InfluencerListRow;
