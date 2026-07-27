import Box from '@mui/material/Box';
import { fn } from 'storybook/test';
import SaasAnalyticsView from './SaasAnalyticsView';
import { SAAS_FONT } from './SaasShell';
import { MOCK_INFLUENCERS } from '../../../pages/beautymaster/BeautymasterDashboard';
import { ALL_STORES, deriveStores } from '../../../data/beautymaster/schema.js';

const STORES = deriveStores(MOCK_INFLUENCERS);

const INVITE_COUNTS = {
  G10: { tier1: 40, tier2: 25 },
  Atlanta: { tier1: 30, tier2: 20 },
};

export default {
  title: 'BeautyMaster/Section/SaasAnalyticsView',
  component: SaasAnalyticsView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    influencers: { control: 'object', description: '전체 인플루언서 목록' },
    inviteCounts: { control: 'object', description: '초대 인원 (store→tier→count). 선택된 스토어로 함께 좁혀진다' },
    stores: { control: 'object', description: '스토어 선택 옵션. 없으면 influencers에서 파생' },
    selectedStore: { control: 'select', options: [ALL_STORES, ...STORES], description: '선택된 스토어 — 세 뷰가 공유' },
    onStoreChange: { action: 'storeChanged', description: '스토어 변경 핸들러' },
  },
  args: {
    influencers: MOCK_INFLUENCERS,
    stores: STORES,
    selectedStore: ALL_STORES,
    onStoreChange: fn(),
  },
  decorators: [
    Story => (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
};

/** 기본 — Campaign summary → Conversion funnel → Breakdown → Tier & Store */
export const Default = {};

/** 초대 인원 연결 — 퍼널에 Invited/Responded 단계가 반영된다 */
export const WithInviteCounts = {
  args: { inviteCounts: INVITE_COUNTS },
};

/**
 * 스토어 한정 — influencers와 inviteCounts를 **함께** 좁힌다.
 * 한쪽만 좁히면 퍼널의 Invited 단계가 목록과 어긋난다.
 */
export const StoreScoped = {
  args: { selectedStore: 'G10', inviteCounts: INVITE_COUNTS },
};

/** 데이터가 없어도 스토어 Select는 남는다 — 다른 스토어로 옮겨갈 수 있어야 하므로 */
export const Empty = {
  args: { influencers: [], stores: STORES },
};
