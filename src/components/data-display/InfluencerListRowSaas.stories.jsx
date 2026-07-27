import Box from '@mui/material/Box';
import InfluencerListRowSaas from './InfluencerListRowSaas';
import { MOCK_INFLUENCERS } from '../../pages/beautymaster/BeautymasterDashboard';

const SAAS_FONT = '"Inter Variable", Inter, "Pretendard Variable", Pretendard, sans-serif';

export default {
  title: 'BeautyMaster/List/InfluencerListRowSaas',
  component: InfluencerListRowSaas,
  tags: ['autodocs'],
  argTypes: {
    influencer: { control: 'object', description: '인플루언서 데이터 객체 (Influencer typedef)' },
    onClick: { action: 'clicked', description: '행 클릭 핸들러' },
    isSelected: { control: 'boolean', description: '선택된 행 하이라이트 여부' },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 720, fontFamily: SAAS_FONT, border: '1px solid', borderColor: 'grey.100', borderRadius: '16px', p: 1 }}>
        <Story />
      </Box>
    ),
  ],
};

/** 모던 SaaS 문법 시안 — 라운드 hover 배경 + tinted 아바타 + soft tinted 단계 pill. 기존 InfluencerListRow(flat)와 비교용 */
export const Default = {
  args: {
    influencer: MOCK_INFLUENCERS[1],
    isSelected: false,
  },
};

/** 주요 단계 변형 비교 — Awaiting Upload / Completed / Credit Not Sent */
export const Variants = {
  render: () => (
    <Box>
      {[MOCK_INFLUENCERS[0], MOCK_INFLUENCERS[1], MOCK_INFLUENCERS[6]].map(inf => (
        <InfluencerListRowSaas key={inf.id} influencer={inf} onClick={() => {}} />
      ))}
    </Box>
  ),
};
