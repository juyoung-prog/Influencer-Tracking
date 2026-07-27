import Box from '@mui/material/Box';
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
/** 펼쳤을 때만 자리를 차지하는 sync 캡션 높이 — 접힘 상태에서 빈 틈이 생기지 않게 0으로 접는다 */
const SYNC_ROW_HEIGHT = 22;

/**
 * NavRow — 사이드바의 한 줄 (아이콘 + 라벨).
 *
 * 네비 항목과 하단 유틸리티가 같은 아이콘 크기·행 높이를 쓰도록 공유한다.
 * 접힘 상태에서는 라벨이 nav의 overflow로 잘려 아이콘만 보인다.
 * `rest`로 component/href/onClick 등을 그대로 넘겨 button·anchor 어느 쪽으로도 쓴다.
 *
 * Props:
 * @param {elementType} Icon - 좌측 아이콘 컴포넌트 [Required]
 * @param {string} label - 펼쳤을 때 보이는 라벨 [Required]
 * @param {boolean} isActive - 활성 상태 여부 [Optional, 기본값: false]
 * @param {node} trailing - 라벨 우측에 붙일 요소(카운트 등) [Optional, 기본값: null]
 *
 * Example usage:
 * <NavRow component="button" type="button" onClick={onRefresh} Icon={RefreshOutlinedIcon} label="Refresh" />
 */
function NavRow(props) {
  // Icon은 JSX 엘리먼트명으로만 쓰인다. 이 저장소 eslint에는 eslint-plugin-react가 없어
  // 인자 위치에서 구조분해하면 미사용으로 잡히므로, 변수로 받아 varsIgnorePattern(^[A-Z_])에 맡긴다.
  const { Icon, label, isActive = false, trailing = null, ...rest } = props;

  return (
    <Box
      {...rest}
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
        textDecoration: 'none',
        // 펼치면 배경이 white가 되므로 active는 white 대신 grey.100으로 잡는다
        backgroundColor: isActive ? 'grey.100' : 'transparent',
        border: '1px solid',
        borderColor: isActive ? 'divider' : 'transparent',
        color: isActive ? 'text.primary' : 'text.secondary',
        // action.hover는 반투명이라 접힘(grey.50)·펼침(white) 배경 양쪽에서 모두 보인다
        '&:hover': { backgroundColor: isActive ? 'grey.100' : 'action.hover' },
      }}
    >
      <Icon sx={{ fontSize: 16, flexShrink: 0 }} />
      <Typography className="saas-nav-label" sx={{ fontSize: 13, fontWeight: isActive ? 600 : 500, lineHeight: 1 }}>
        {label}
      </Typography>
      {trailing}
    </Box>
  );
}

/**
 * SaasShell component
 *
 * flat-SaaS 시안의 셸 — 좌측 사이드바 + 유동 본문.
 * 사이드바는 기본이 아이콘만 보이는 56px 레일이고, hover하거나 키보드 포커스가
 * 안으로 들어오면 248px로 펼쳐지며 라벨이 페이드인된다(Meta Ads Manager 방식).
 * 펼침은 본문 **위에 겹쳐서** 일어난다 — absolute로 띄우고 레일 폭만큼 spacer를
 * 흐름에 남겨두므로 본문 폭·위치는 접힘/펼침과 무관하게 고정이다.
 * md 미만에서는 레일과 spacer를 모두 숨긴다(기존과 동일).
 *
 * 전역 유틸리티(sync 시각 / Refresh / Open Google Sheet / Settings)는 상단 헤더가
 * 아니라 사이드바 하단에 있다 — 본문 상단을 비워 목록·표에 세로 공간을 더 준다.
 * 유틸리티는 네비와 divider로 나뉘고, 네비 목록이 남는 높이를 차지해 항상 하단에 붙는다.
 *
 * 본문은 중앙 정렬 max-width 없이 프레임을 가득 채운다(운영형 SaaS의 공간 포화 정책).
 * 스크롤은 셸이 아니라 각 뷰가 소유한다(본문은 overflow hidden + flex column).
 *
 * Props:
 * @param {string} activeNav - 활성 네비 키 (operations|analytics|workflow) [Required]
 * @param {number} influencerCount - Operations 항목 옆 카운트 [Optional, 기본값: 0]
 * @param {Date|null} lastSyncedAt - 마지막 동기화 시각 (사이드바 하단, 펼침 시 표시) [Optional, 기본값: null]
 * @param {function} onNavigate - 네비 항목 클릭 핸들러 (key) => void [Optional]
 * @param {function} onRefresh - Refresh 클릭 핸들러 [Optional]
 * @param {string} sheetUrl - Google Sheet 원본 링크. 없으면 해당 줄을 숨긴다 [Optional, 기본값: '']
 * @param {function} onOpenSettings - Settings 클릭 핸들러 [Optional]
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
          // sync 캡션은 접힘 상태에서 높이까지 0으로 접어 유틸리티 위에 빈 틈을 남기지 않는다
          '& .saas-nav-sync': {
            opacity: 0,
            height: 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: theme.transitions.create(['opacity', 'height'], { duration: 150 }),
          },
          '&:hover, &:focus-within': {
            width: EXPANDED_WIDTH,
            backgroundColor: 'background.paper',
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.04)',
            '& .saas-nav-label': { opacity: 1 },
            '& .saas-nav-sync': { opacity: 1, height: SYNC_ROW_HEIGHT },
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '& .saas-nav-label, & .saas-nav-sync': { transition: 'none' },
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

        {/* 네비 — 남는 높이를 차지해 아래 유틸리티를 하단에 붙인다 */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          {NAV_ITEMS.map(({ key, label, Icon }) => {
            const isActive = key === activeNav;
            return (
              <NavRow
                key={key}
                component="button"
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate?.(key)}
                Icon={Icon}
                label={label}
                isActive={isActive}
                trailing={key === 'operations' && influencerCount > 0 ? (
                  <Typography
                    className="saas-nav-label"
                    sx={{ ml: 'auto', fontSize: 11, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {influencerCount}
                  </Typography>
                ) : null}
              />
            );
          })}
        </Box>

        {/* 전역 유틸리티 — 네비와 divider로 분리, 항상 사이드바 하단 */}
        <Box sx={{ flexShrink: 0, width: ITEM_WIDTH, pt: 1, mt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography
            className="saas-nav-sync"
            sx={{ display: 'block', px: 1.25, fontSize: 11, lineHeight: `${SYNC_ROW_HEIGHT}px`, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}
          >
            Last synced {lastSyncedAt ? lastSyncedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
          </Typography>
          <NavRow
            component="button"
            type="button"
            onClick={onRefresh}
            Icon={RefreshOutlinedIcon}
            label="Refresh"
          />
          {sheetUrl && (
            <NavRow
              component="a"
              href={sheetUrl}
              target="_blank"
              rel="noopener"
              Icon={OpenInNewOutlinedIcon}
              label="Open Google Sheet"
            />
          )}
          <NavRow
            component="button"
            type="button"
            onClick={onOpenSettings}
            Icon={SettingsOutlinedIcon}
            label="Settings"
          />
        </Box>
      </Box>

      {/* Main — 중앙 정렬 없이 프레임 가득. 스크롤은 각 뷰가 소유 */}
      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SaasShell;
