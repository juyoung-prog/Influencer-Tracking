import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { ALERT_FLAGS, CONTACT_STATUSES, normalizePlatform, toDisplayName } from '../../data/beautymaster/schema.js';

/* 아바타 색 팔레트 — HSL 색상환을 10등분해 만든 값(배경 L 91.5%/S 20%, 글자 L 29.5%/S 22%).
   손으로 고르면 두 색이 거의 같아지는 조합이 생겨서(slate와 dusty가 채널 합 6 차이였다)
   균등 간격을 색상환에서 보장했다.

   왜 필요한가: 이니셜이 같은 사람이 인접해 앉는다. 실제 데이터 191명에서 이런 쌍이
   두 건 있다 — Aurora Garcia/Alexis Garrett(AG), Sherian McGhee/Sharon Mijares(SM).
   같은 원 두 개가 붙어 있으면 스크롤 중에 같은 사람으로 읽힌다.

   구분은 주로 **글자색**이 진다(간격 19~96). 배경은 일부러 옅게 남겨 목록이
   알록달록해지지 않게 했다 — 앰버(경보)·파랑(선택)이 이 화면에서 의미를 지고 있어서
   아바타가 색으로 경쟁하면 안 된다. 모든 조합이 대비 6.1:1 이상으로 AA를 넘는다
   (예전에 흰 글자 + grey.400 조합이 1.88:1로 미달이었다).

   색은 보조 신호다 — 이름이 바로 옆에 적혀 있어 색만으로 사람을 구분하게 두지 않는다.
   해시는 10칸이라 이름이 다른 동일 이니셜 쌍의 97%(63/65)를 갈라낸다. 100%는 아니다. */
const AVATAR_TINTS = [
  { bg: '#EEE7E5', fg: '#5C433B' },
  { bg: '#EEECE5', fg: '#5C563B' },
  { bg: '#EAEEE5', fg: '#4D5C3B' },
  { bg: '#E5EEE5', fg: '#3B5C3C' },
  { bg: '#E5EEEB', fg: '#3B5C50' },
  { bg: '#E5ECEE', fg: '#3B545C' },
  { bg: '#E5E6EE', fg: '#3B405C' },
  { bg: '#E9E5EE', fg: '#493B5C' },
  { bg: '#EEE5ED', fg: '#5C3B5A' },
  { bg: '#EEE5E8', fg: '#5C3B47' },
];

/**
 * 이름에서 아바타 색을 고른다. 같은 사람은 언제나 같은 색이어야 하므로
 * 목록 순서가 아니라 이름 문자열에서 뽑는다(필터·정렬로 순서가 바뀌어도 색이 유지된다).
 * 시트에 같은 사람이 두 번 들어온 행들도 같은 색으로 묶인다.
 *
 * FNV-1a를 쓴다. 처음 쓴 `h*31 + c`는 섞임이 약해서 앞부분이 비슷한 이름이 같은 칸에
 * 떨어졌다 — 실제로 Aurora Garcia와 Alexis Garrett이 같은 색이 됐다(스토리가 잡았다).
 *
 * @param {string} name
 * @returns {{bg: string, fg: string}}
 */
function avatarTint(name) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    // 32비트 곱셈을 넘어가지 않게 Math.imul을 쓴다 — 곱셈 연산자는 정밀도가 새어 나간다
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

/**
 * 아바타 이니셜. 두 단어 이상이면 앞 두 단어의 첫 글자, 한 단어면 앞 두 글자.
 *
 * 한 글자만 쓰면("Nicole" → "N") 나머지가 두 글자인 열에서 그 행만 비어 보인다.
 * 앞의 기호는 이니셜이 될 수 없다 — 핸들이 이름 자리에 온 행("_d1stylez_")이 "_D"가 됐다.
 *
 * @param {string} name
 * @returns {string}
 */
function avatarInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '—';
  const clean = w => w.replace(/[^\p{L}\p{N}]/gu, '');
  if (words.length === 1) return clean(words[0]).slice(0, 2).toUpperCase() || '—';
  return ((clean(words[0])[0] || '') + (clean(words[1])[0] || '')).toUpperCase() || '—';
}

/* 속성 하위 컬럼 폭 — 각 값의 최장 문자열에서 도출(12px caption 기준).
   "Instagram" 62px / "T2" 16px / "K-Beauty" 54px. 넘치는 값은 줄임표로 보낸다 —
   늘리면 이름 칸이 그만큼 줄어든다. */
const ATTR_PLATFORM_W = 72;
const ATTR_TIER_W = 22;
const ATTR_CATEGORY_W = 62;

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

/** 연락 보낸 날로부터 오늘까지 경과일. 자정 기준, 음수는 0으로 */
function daysSinceContact(lastContactDate) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const sent = new Date(lastContactDate.getFullYear(), lastContactDate.getMonth(), lastContactDate.getDate());
  const days = Math.floor((todayStart - sent) / 86400000);
  return days > 0 ? days : 0;
}

function getContactAlert(alertFlags, contactStatus, lastContactDate, requestedDate) {
  const flag = alertFlags.find(f => CONTACT_ALERT_LABEL[f]);
  if (!flag) return null;

  const label = CONTACT_ALERT_LABEL[flag];
  const isNoResponse = contactStatus === CONTACT_STATUSES.NO_RESPONSE;
  const requestedSuffix = requestedDate
    ? ` → ${requestedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : '';

  if (isNoResponse && lastContactDate) {
    return { text: `${label} · ${daysSinceContact(lastContactDate)}d no reply${requestedSuffix}`, isUrgent: true };
  }

  /* "awaiting reply"만으로는 언제 연락했는지 알 수 없다 — 어제 보낸 건과
     3주 전 보낸 건이 같은 문구가 된다. 보낸 날짜가 있으면 경과일을 병기한다. */
  const waited = lastContactDate ? daysSinceContact(lastContactDate) : null;
  const waitedSuffix = waited != null ? ` · ${waited}d` : '';
  return { text: `${label} · awaiting reply${waitedSuffix}${requestedSuffix}`, isUrgent: false };
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
            (예전에는 반대였다: "Visit Unconfirmed"가 앰버, 경과일이 회색) */}
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
          stage.show && (
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'text.secondary', fontSize: '0.6875rem', lineHeight: 1.3 }}
            >
              {stage.label}
            </Typography>
          )
        )}
      </Box>
    </ButtonBase>
  );
}

export default InfluencerListRow;
