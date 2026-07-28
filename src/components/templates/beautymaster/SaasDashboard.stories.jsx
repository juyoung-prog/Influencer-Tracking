import Box from '@mui/material/Box';
import SaasDashboard from './SaasDashboard';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';

const LAST_SYNCED_AT = new Date('2026-07-27T09:56:00');

export default {
  title: 'BeautyMaster/Page/SaasDashboard',
  component: SaasDashboard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    influencers: { control: 'object', description: '전체 인플루언서 목록 (Influencer[] typedef)' },
    inviteCounts: { control: 'object', description: '"Number" 탭 초대 인원 데이터 (store→tier→count)' },
    lastSyncedAt: { control: 'date', description: '마지막 시트 동기화 시각' },
    defaultView: {
      control: 'radio',
      options: ['operations', 'analytics', 'workflow'],
      description: '최초 활성 뷰',
    },
    selectedId: { control: 'text', description: '현재 선택된 인플루언서 ID' },
    isLoading: { control: 'boolean', description: '최초 로딩 여부 (목록이 비었을 때만 스켈레톤)' },
    isSyncing: { control: 'boolean', description: '폴링/새로고침 진행 중 — 사이드바 하단 Refresh 표시에 반영' },
    error: { control: false, description: '조회 실패 에러 — 상단 배너로 표시' },
    onSelect: { action: 'selected', description: '인플루언서 행 클릭 핸들러' },
    onRefresh: { action: 'refreshed', description: '헤더 새로고침 핸들러' },
    onOpenSettings: { action: 'settings', description: '헤더 설정 아이콘 클릭 핸들러' },
    onRetry: { action: 'retried', description: '에러 배너 Retry 핸들러' },
    sx: { control: 'object', description: '루트 Box에 적용할 MUI sx 오버라이드' },
  },
  decorators: [
    Story => (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </Box>
    ),
  ],
};

/** Operations — Visit schedule 레일과 목록이 한 화면. 사이드바로 다른 뷰 전환 */
export const Default = {
  args: {
    influencers: MOCK_INFLUENCERS,
    lastSyncedAt: LAST_SYNCED_AT,
    defaultView: 'operations',
  },
};

/** Analytics — 전환 KPI + 퍼널 + By store/tier 테이블 */
export const Analytics = {
  args: {
    ...Default.args,
    inviteCounts: {
      Duluth: { tier1: 40, tier2: 25 },
      Atlanta: { tier1: 30, tier2: 20 },
    },
    defaultView: 'analytics',
  },
};

/** Workflow — 7단계 참조 문서 */
export const Workflow = {
  args: {
    ...Default.args,
    defaultView: 'workflow',
  },
};

/** 빈 상태 — 시트는 연결됐지만 아직 행이 없을 때 */
export const Empty = {
  args: {
    influencers: [],
    lastSyncedAt: null,
    defaultView: 'operations',
  },
};

/** 최초 로딩 — 데이터가 아직 없을 때만 스켈레톤. 폴링 중에는 직전 목록을 유지한다 */
export const Loading = {
  args: {
    influencers: [],
    lastSyncedAt: null,
    defaultView: 'operations',
    isLoading: true,
  },
};

/** 조회 실패 — 목록을 지우지 않고 상단 배너로만 알리고 Retry를 제공한다 */
export const LoadError = {
  args: {
    ...Default.args,
    error: new Error('Google Sheets returned 403 (check sharing settings)'),
  },
};

/** 폴링 진행 중 — 목록은 그대로 두고 사이드바 Refresh만 진행 상태로 바뀐다 */
export const Syncing = {
  args: { ...Default.args, isSyncing: true },
};
