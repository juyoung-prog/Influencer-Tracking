import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * 진행 단계 → 라벨 + 팔레트 키.
 * InfluencerListRow의 getCurrentStage와 같은 판정 로직이지만,
 * SaaS 시안에서는 텍스트 컬러 대신 soft tinted pill로 표현하므로 팔레트 키를 반환한다.
 */
function getCurrentStage({ attend, collaboShared, creditShared, scheduleGroup }) {
  if (creditShared)  return { label: 'Completed',         paletteKey: 'success',   show: true };
  if (collaboShared) return { label: 'Credit Not Sent',   paletteKey: 'error',     show: true };
  if (attend)        return { label: 'Awaiting Upload',   paletteKey: 'secondary', show: true };
  const isFuture = scheduleGroup === 'upcoming' || scheduleGroup === 'today';
  if (isFuture)      return { label: 'Scheduled',         paletteKey: 'grey',      show: false };
  return               { label: 'Visit Unconfirmed', paletteKey: 'warning',   show: true };
}

const CATEGORY_LABEL = { general: 'General', kbeauty: 'K-Beauty', specific: 'Specific' };

/**
 * InfluencerListRowSaas component
 *
 * InfluencerListRow의 모던 SaaS 문법 시안 변형 (라운드 카드 + 소프트 섀도 비교용).
 * 데이터·컬럼 구성은 InfluencerListRow와 동일하고 표면 문법만 다르다 —
 * 라운드 hover 배경, tinted 아바타, soft tinted 단계 pill.
 * 폰트는 부모(OperationsPanelSaas)의 Inter 스택을 상속한다.
 *
 * Props:
 * @param {Influencer} influencer - 인플루언서 데이터 객체 (data/beautymaster/schema.js typedef) [Required]
 * @param {function} onClick - 행 클릭 핸들러 [Required]
 * @param {boolean} isSelected - 현재 선택(Drawer 오픈)된 행 하이라이트 [Optional, 기본값: false]
 *
 * Example usage:
 * <InfluencerListRowSaas influencer={inf} onClick={() => handleSelect(inf)} isSelected={selectedId === inf.id} />
 */
function InfluencerListRowSaas({ influencer, onClick, isSelected = false }) {
  const theme = useTheme();
  const {
    fullName = '',
    imageUrl = '',
    scheduledTime = null,
    scheduleGroup = 'no-time',
    platform = '',
    tier = 'tier1',
    category = '',
    attend = false,
    collaboShared = false,
    creditShared = false,
    note = '',
  } = influencer;

  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const categoryLabel = CATEGORY_LABEL[category] || null;

  const timeLabel = scheduledTime
    ? scheduleGroup === 'today'
      ? scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : `${scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'TBD';

  const stage = getCurrentStage({ attend, collaboShared, creditShared, scheduleGroup });
  const stageColor = stage.paletteKey === 'grey' ? theme.palette.grey[600] : theme.palette[stage.paletteKey].main;

  return (
    <ButtonBase
      data-influencer-id={influencer.id}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        px: 2.5,
        py: 1.25,
        minHeight: 56,
        borderRadius: '10px',
        textAlign: 'left',
        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
        transition: 'background-color 120ms ease',
        '&:hover': { backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'grey.50' },
      }}
    >
      <Avatar
        src={imageUrl}
        alt={fullName}
        sx={{
          width: 36,
          height: 36,
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
          fontFamily: 'inherit',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: 'primary.main',
        }}
      >
        {initials}
      </Avatar>

      {/* Name + time + note — the only fluid column, so it gets minWidth: 0 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {fullName || '—'}
          </Typography>
          {categoryLabel && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'inherit',
                fontWeight: 500,
                color: 'text.secondary',
                backgroundColor: 'grey.100',
                borderRadius: '999px',
                px: 1,
                py: 0.25,
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {categoryLabel}
            </Typography>
          )}
        </Box>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: 'inherit', display: 'block', fontVariantNumeric: 'tabular-nums' }}
        >
          {timeLabel}
        </Typography>
        {note && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: 'inherit', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {note}
          </Typography>
        )}
      </Box>

      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontFamily: 'inherit', flex: '0 0 96px', flexShrink: 0, whiteSpace: 'nowrap', display: { xs: 'none', sm: 'block' } }}
      >
        {tier === 'tier2' ? 'T2' : 'T1'} · {platform}
      </Typography>

      {/* Stage pill */}
      <Box sx={{ flex: '0 0 132px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {stage.show && (
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'inherit',
              fontWeight: 600,
              color: stageColor,
              backgroundColor: alpha(stageColor, 0.08),
              borderRadius: '999px',
              px: 1.25,
              py: 0.375,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {stage.label}
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );
}

export default InfluencerListRowSaas;
