import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import '@fontsource-variable/inter';

/** flat-SaaS 시안 공통 폰트 스택 (modern_saas_design_core_features.md 기반 시안 전용) */
export const SAAS_FONT = '"Inter Variable", Inter, "Pretendard Variable", Pretendard, sans-serif';

/** 기존 대시보드의 탭 구성(Operations / Analytics / Workflow)을 사이드바로 옮긴 것 */
const NAV_ITEMS = [
  { key: 'operations', label: 'Operations', Icon: ListAltOutlinedIcon },
  { key: 'analytics', label: 'Analytics', Icon: BarChartOutlinedIcon },
  { key: 'workflow', label: 'Workflow', Icon: RouteOutlinedIcon },
];

/** 접힌 레일 폭 — 아이콘만 보인다 */
const RAIL_WIDTH = 56;
/** hover/focus 시 펼쳐지는 폭 */
const EXPANDED_WIDTH = 248;
/**
 * 항목 내용은 항상 펼친 폭 기준으로 배치하고 접힌 상태에서는 잘라낸다.
 * 폭 전환 중에 라벨이 줄바꿈되거나 카운트가 튀는 걸 막기 위함이다.
 */
const ITEM_WIDTH = EXPANDED_WIDTH - 20;

/**
 * SaasShell component
 *
 * flat-SaaS 시안의 셸 — 좌측 사이드바 + 유동 본문.
 * 사이드바는 기본이 아이콘만 보이는 56px 레일이고, hover하거나 키보드 포커스가
 * 안으로 들어오면 248px로 펼쳐지며 라벨이 페이드인된다(Meta Ads Manager 방식).
 * 펼침은 본문 **위에 겹쳐서** 일어난다 — absolute로 띄우고 레일 폭만큼 spacer를
 * 흐름에 남겨두므로 본문 폭·위치는 접힘/펼침과 무관하게 고정이다.
 * md 미만에서는 레일과 spacer를 모두 숨긴다(기존과 동일).
 * 본문은 중앙 정렬 max-width 없이 프레임을 가득 채운다(운영형 SaaS의 공간 포화 정책).
 * 스크롤은 셸이 아니라 각 뷰가 소유한다(본문은 overflow hidden + flex column).
 * 상단 header에는 global utility controls(sync status, refresh, settings)가 있다.
 *
 * Props:
 * @param {string} activeNav - 활성 네비 키 (operations|analytics|workflow) [Required]
 * @param {number} influencerCount - Operations 항목 옆 카운트 [Optional, 기본값: 0]
 * @param {Date|null} lastSyncedAt - 마지막 동기화 시각 (상단 header에 표시) [Optional, 기본값: null]
 * @param {function} onNavigate - 네비 항목 클릭 핸들러 (key) => void [Optional]
 * @param {function} onRefresh - Refresh 아이콘 클릭 핸들러 [Optional]
 * @param {string} sheetUrl - Google Sheet 원본 링크. 없으면 해당 아이콘을 숨긴다 [Optional, 기본값: '']
 * @param {function} onOpenSettings - 설정 아이콘 클릭 핸들러 [Optional]
 * @param {node} children - 본문 뷰 [Required]
 * @param {object} sx - 루트 Box에 적용할 MUI sx 오버라이드 [Optional]
 *
 * Example usage:
 * <SaasShell activeNav="operations" influencerCount={12} onNavigate={setView}>...</SaasShell>
 */
function SaasShell({
  activeNav,
  influencerCount = 0,
  lastSyncedAt = null,
  onNavigate,
  onRefresh,
  sheetUrl = '',
  onOpenSettings,
  children,
  sx,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        minHeight: 0,
        // 펼친 사이드바가 본문 위에 겹치도록 기준점을 잡고, z-index를 셸 안으로 가둔다
        position: 'relative',
        isolation: 'isolate',
        backgroundColor: 'background.paper',
        fontFamily: SAAS_FONT,
        '& .MuiTypography-root, & .MuiButton-root, & .MuiChip-root, & .MuiTableCell-root, & .MuiInputBase-root': {
          fontFamily: 'inherit',
        },
        ...sx,
      }}
    >
      {/* 레일 자리 확보 — 사이드바가 펼쳐져도 본문이 밀리지 않게 흐름에 폭만 남긴다 */}
      <Box aria-hidden sx={{ width: RAIL_WIDTH, flexShrink: 0, display: { xs: 'none', md: 'block' } }} />

      {/* Sidebar — 기본 아이콘 레일, hover/포커스 시 본문 위로 펼쳐짐. md 미만 숨김 */}
      <Box
        component="nav"
        sx={theme => ({
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: RAIL_WIDTH,
          zIndex: theme.zIndex.appBar,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
          px: 1.25,
          py: 1.75,
          transition: theme.transitions.create(
            ['width', 'background-color', 'box-shadow'],
            { duration: 180, easing: theme.transitions.easing.easeOut },
          ),
          '& .saas-nav-label': {
            opacity: 0,
            whiteSpace: 'nowrap',
            transition: theme.transitions.create('opacity', { duration: 150 }),
          },
          '&:hover, &:focus-within': {
            width: EXPANDED_WIDTH,
            backgroundColor: 'background.paper',
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.04)',
            '& .saas-nav-label': { opacity: 1 },
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '& .saas-nav-label': { transition: 'none' },
          },
        })}
      >
        {/* 로고 — 좌측 여백을 아이콘과 맞춰 접힘/펼침에서 흔들리지 않게 한다 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.125, mb: 2.25, width: ITEM_WIDTH, flexShrink: 0 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: '5px', backgroundColor: 'primary.main', flexShrink: 0 }} />
          <Typography className="saas-nav-label" sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>
            BeautyMaster
          </Typography>
        </Box>
        {NAV_ITEMS.map(item => {
          const { key, label, Icon } = item;
          const isActive = key === activeNav;
          return (
            <Box
              key={key}
              component="button"
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate?.(key)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                width: ITEM_WIDTH,
                flexShrink: 0,
                px: 1.25,
                py: 0.75,
                mb: 0.25,
                borderRadius: '6px',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
                // 펼쳤을 때 배경이 white가 되므로 active는 white 대신 grey.100으로 잡는다
                backgroundColor: isActive ? 'grey.100' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'divider' : 'transparent',
                color: isActive ? 'text.primary' : 'text.secondary',
                '&:hover': { backgroundColor: isActive ? 'grey.100' : 'grey.50' },
              }}
            >
              <Icon sx={{ fontSize: 16, flexShrink: 0 }} />
              <Typography className="saas-nav-label" sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500, lineHeight: 1 }}>
                {label}
              </Typography>
              {key === 'operations' && influencerCount > 0 && (
                <Typography
                  className="saas-nav-label"
                  sx={{ ml: 'auto', fontSize: 11, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}
                >
                  {influencerCount}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Main — 중앙 정렬 없이 프레임 가득. 스크롤은 각 뷰가 소유 */}
      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Global Header — Last synced, Refresh, Dashboard, Settings */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            px: 3,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            Last synced {lastSyncedAt ? lastSyncedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={onRefresh} sx={{ color: 'text.secondary', '&:hover': { backgroundColor: 'grey.100' } }}>
              <RefreshOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          {sheetUrl && (
            <Tooltip title="Open Google Sheet">
              <IconButton
                size="small"
                component="a"
                href={sheetUrl}
                target="_blank"
                rel="noopener"
                sx={{ color: 'text.secondary', '&:hover': { backgroundColor: 'grey.100' } }}
              >
                <OpenInNewOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Sheet settings">
            <IconButton size="small" onClick={onOpenSettings} sx={{ color: 'text.secondary', '&:hover': { backgroundColor: 'grey.100' } }}>
              <SettingsOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default SaasShell;
