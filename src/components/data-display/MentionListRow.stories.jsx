import Box from '@mui/material/Box';
import MentionListRow from './MentionListRow';
import { MOCK_MENTIONS } from '../../data/beautymaster/mentions.js';

export default {
  title: 'BeautyMaster/Molecule/MentionListRow',
  component: MentionListRow,
  tags: ['autodocs'],
  argTypes: {
    mention: { control: 'object', description: '멘션 데이터 객체 (Mention typedef)' },
    onApprove: { action: 'approved', description: '검토 대기열 행의 Approve 클릭 핸들러' },
    onDismiss: { action: 'dismissed', description: '검토 대기열 행의 Dismiss 클릭 핸들러' },
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 960, border: '1px solid', borderColor: 'divider', borderBottom: 'none', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
        <Story />
      </Box>
    ),
  ],
};

/** 자격 통과(qualified) 멘션 — 팔로워·ER·좋아요 지표 표시 */
export const Default = {
  args: {
    mention: MOCK_MENTIONS[0],
  },
};

/** 주요 변형 — qualified / 협업 매칭 / 검토 대기열(익명) / 기준 미달 */
export const Variants = {
  render: args => (
    <>
      <MentionListRow {...args} mention={MOCK_MENTIONS[0]} />
      <MentionListRow {...args} mention={MOCK_MENTIONS[2]} />
      <MentionListRow {...args} mention={MOCK_MENTIONS[4]} />
      <MentionListRow {...args} mention={MOCK_MENTIONS[9]} />
    </>
  ),
};
