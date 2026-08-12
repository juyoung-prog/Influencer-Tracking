import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * SaasKpiItem component
 *
 * flat-SaaS 시안의 KPI 스트립 셀. 카드가 아니라 배경 위에 직접 놓이고,
 * 셀 구분은 좌측 1px divider로만 한다(첫 셀은 테두리 없음).
 * Operations / Mentions 등 flat-SaaS 뷰가 공유하는 프리미티브.
 *
 * Props:
 * @param {string} label - 지표 이름 [Required]
 * @param {string|number} value - 지표 값 [Required]
 * @param {number|null} total - 값 옆에 "of N"으로 붙일 모수 [Optional, 기본값: null]
 * @param {boolean} isFirst - 첫 셀 여부 (좌측 divider·padding 제거) [Optional, 기본값: false]
 * @param {boolean} isAlert - 주의 상태 여부 (warning 색으로 렌더) [Optional, 기본값: false]
 * @param {string} note - 값 아래 한 줄. 수치가 스스로 말하지 못하는 단서를 붙인다
 *   (예: 측정이 덜 된 지표의 "25 not recorded") [Optional, 기본값: '']
 *
 * Example usage:
 * <SaasKpiItem label="Agreement" value={12} total={20} isFirst />
 * <SaasKpiItem label="Credit used" value={12} total={44} note="25 not recorded" />
 */
function SaasKpiItem({ label, value, total = null, isFirst = false, isAlert = false, note = '' }) {
  return (
    <Box
      sx={{
        pl: isFirst ? 0 : 2.5,
        pr: 2.5,
        borderLeft: isFirst ? 'none' : '1px solid',
        borderColor: 'divider',
        minWidth: 84,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          color: isAlert ? 'warning.main' : 'text.secondary',
          mb: 0.5,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.625 }}>
        <Typography
          component="span"
          sx={{
            fontSize: 22,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            color: isAlert ? 'warning.main' : 'text.primary',
          }}
        >
          {value}
        </Typography>
        {total !== null && total > 0 && (
          <Typography component="span" sx={{ fontSize: 11, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            of {total}
          </Typography>
        )}
      </Box>
      {/* 값이 스스로 말하지 못하는 단서. 숫자 아래에 붙어야 그 숫자에 대한 말로 읽힌다 —
          스트립 밖 각주로 빼면 어느 셀 이야기인지 잃는다. 셀 높이가 한 줄 늘어나지만
          전 셀이 같은 baseline에서 시작하므로 정렬은 깨지지 않는다. */}
      {note && (
        <Typography
          data-kpi-note
          sx={{ mt: 0.5, fontSize: 10, lineHeight: 1.3, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}
        >
          {note}
        </Typography>
      )}
    </Box>
  );
}

export default SaasKpiItem;
