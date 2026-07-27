import Box from '@mui/material/Box';
import OperationsPanelSaas from './OperationsPanelSaas';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';

export default {
  title: 'BeautyMaster/Section/OperationsPanelSaas',
  component: OperationsPanelSaas,
  tags: ['autodocs'],
  argTypes: {
    influencers: { control: 'object', description: '전체 인플루언서 목록 (Influencer[] typedef)' },
    lastSyncedAt: { control: 'date', description: '마지막 시트 동기화 시각' },
    onSelect: { action: 'selected', description: '행 클릭 핸들러' },
    selectedId: { control: 'text', description: '현재 선택된 인플루언서 ID' },
    sx: { control: 'object', description: '루트 Box에 적용할 MUI sx 오버라이드' },
  },
  decorators: [
    Story => (
      <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </Box>
    ),
  ],
};

/** 모던 SaaS 문법 시안 — 라운드 카드(16px) + 소프트 섀도 + Inter. 기존 Operations 뷰(flat)와 비교용 */
export const Default = {
  args: {
    influencers: MOCK_INFLUENCERS,
    lastSyncedAt: new Date('2026-07-27T09:56:00'),
  },
};

/** 빈 상태 — 시트 데이터가 없을 때 */
export const Empty = {
  args: {
    influencers: [],
    lastSyncedAt: new Date('2026-07-27T09:56:00'),
  },
};
