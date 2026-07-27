import Box from '@mui/material/Box';
import MentionListRowSaas from './MentionListRowSaas';
import { MOCK_MENTIONS } from '../../data/beautymaster/mentions.js';

const SAAS_FONT = '"Inter Variable", Inter, "Pretendard Variable", Pretendard, sans-serif';

export default {
  title: 'Custom Component/MentionListRowSaas',
  component: MentionListRowSaas,
  tags: ['autodocs'],
  argTypes: {
    mention: { control: 'object', description: '멘션 데이터 객체 (Mention typedef)' },
    onApprove: { action: 'approved', description: 'unverified 행의 Approve 핸들러' },
    onDismiss: { action: 'dismissed', description: 'unverified 행의 Dismiss 핸들러' },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 960, fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
};

/** qualified 행 — 소프트 tinted 상태 pill */
export const Default = {
  args: {
    mention: MOCK_MENTIONS[0],
  },
};

/** unverified 행 — 캡션 발췌 + pill 형태 Approve/Dismiss */
export const Unverified = {
  args: {
    mention: MOCK_MENTIONS.find(m => m.qualification === 'unverified'),
  },
};

/** below-threshold 행 — opacity 뮤트 */
export const BelowThreshold = {
  args: {
    mention: MOCK_MENTIONS.find(m => m.qualification === 'below-threshold'),
  },
};
