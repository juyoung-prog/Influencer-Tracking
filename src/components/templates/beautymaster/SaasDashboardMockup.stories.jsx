import Box from '@mui/material/Box';
import SaasDashboardMockup from './SaasDashboardMockup';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';

export default {
  title: 'BeautyMaster/Page/SaasDashboardMockup',
  component: SaasDashboardMockup,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    influencers: { control: 'object', description: '전체 인플루언서 목록 (Influencer[] typedef)' },
    inviteCounts: { control: 'object', description: '"Number" 탭 초대 인원 데이터 (store→tier→count)' },
    lastSyncedAt: { control: 'date', description: '마지막 시트 동기화 시각' },
    selectedStore: { control: 'text', description: 'Workflow 뷰 캡션에 표시할 스토어' },
    defaultView: {
      control: 'radio',
      options: ['operations', 'analytics', 'workflow'],
      description: '최초 활성 뷰',
    },
    selectedId: { control: 'text', description: '현재 선택된 인플루언서 ID' },
    onSelect: { action: 'selected', description: '인플루언서 행 클릭 핸들러' },
    onOpenSettings: { action: 'settings', description: '사이드바 설정 아이콘 클릭 핸들러' },
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

/** Operations — Visit schedule 레일과 목록이 한 화면. 사이드바로 Analytics/Workflow 전환 */
export const Default = {
  args: {
    influencers: MOCK_INFLUENCERS,
    lastSyncedAt: new Date('2026-07-27T09:56:00'),
    selectedStore: 'Duluth',
    defaultView: 'operations',
  },
};

/** Analytics — 전환 KPI + 퍼널 + By store/tier 테이블 */
export const Analytics = {
  args: {
    influencers: MOCK_INFLUENCERS,
    inviteCounts: {
      Duluth: { tier1: 40, tier2: 25 },
      Atlanta: { tier1: 30, tier2: 20 },
    },
    lastSyncedAt: new Date('2026-07-27T09:56:00'),
    defaultView: 'analytics',
  },
};

/** Workflow — 7단계 참조 문서 */
export const Workflow = {
  args: {
    influencers: MOCK_INFLUENCERS,
    lastSyncedAt: new Date('2026-07-27T09:56:00'),
    selectedStore: 'Duluth',
    defaultView: 'workflow',
  },
};

/** 빈 상태 — 시트 데이터가 없을 때 */
export const Empty = {
  args: {
    influencers: [],
    lastSyncedAt: null,
    defaultView: 'operations',
  },
};
