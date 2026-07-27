import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import '@fontsource-variable/inter';

/** flat-SaaS 시안 공통 폰트 스택 (modern_saas_design_core_features.md 기반 시안 전용) */
export const SAAS_FONT = '"Inter Variable", Inter, "Pretendard Variable", Pretendard, sans-serif';

/** 기존 대시보드의 탭 구성(Operations / Mentions / Analytics / Workflow)을 사이드바로 옮긴 것 */
const NAV_ITEMS = [
  { key: 'operations', label: 'Operations', Icon: ListAltOutlinedIcon },
  { key: 'mentions', label: 'Mentions', Icon: AlternateEmailOutlinedIcon },
  { key: 'analytics', label: 'Analytics', Icon: BarChartOutlinedIcon },
  { key: 'workflow', label: 'Workflow', Icon: RouteOutlinedIcon },
];

/**
 * SaasShell component
 *
 * flat-SaaS 시안의 셸 — 좌측 고정 사이드바(192px) + 유동 본문.
 * 본문은 중앙 정렬 max-width 없이 프레임을 가득 채운다(운영형 SaaS의 공간 포화 정책).
 * 스크롤은 셸이 아니라 각 뷰가 소유한다(본문은 overflow hidden + flex column).
 * 네비는 기존 대시보드 탭 구성(Operations/Mentions/Analytics/Workflow)을 그대로 따르고,
 * 상단 header에는 global utility controls(sync status, refresh, settings)가 있다.
 *
 * Props:
 * @param {string} activeNav - 활성 네비 키 (operations|mentions|analytics|workflow) [Required]
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
        backgroundColor: 'background.paper',
        fontFamily: SAAS_FONT,
        '& .MuiTypography-root, & .MuiButton-root, & .MuiChip-root, & .MuiTableCell-root, & .MuiInputBase-root': {
          fontFamily: 'inherit',
        },
        ...sx,
      }}
    >
      {/* Sidebar — 고정 192px, md 미만 숨김 */}
      <Box
        component="nav"
        sx={{
          width: 192,
          flexShrink: 0,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
          px: 1.25,
          py: 1.75,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, mb: 2.25 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: '5px', backgroundColor: 'primary.main', flexShrink: 0 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>
            BeautyMaster
          </Typography>
        </Box>
        {NAV_ITEMS.map(item => {
          const { key, label, Icon } = item;
          const isActive = key === activeNav;
          return (
            <Box
              key={key}
              onClick={() => onNavigate?.(key)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1,
                py: 0.75,
                mb: 0.25,
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isActive ? 'background.paper' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'divider' : 'transparent',
                color: isActive ? 'text.primary' : 'text.secondary',
                '&:hover': { backgroundColor: isActive ? 'background.paper' : 'grey.100' },
              }}
            >
              <Icon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500, lineHeight: 1 }}>
                {label}
              </Typography>
              {key === 'operations' && influencerCount > 0 && (
                <Typography sx={{ ml: 'auto', fontSize: 11, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>
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
