import Box from '@mui/material/Box';
import MentionsPanelSaas from './MentionsPanelSaas';
import { MOCK_MENTIONS } from '../../../data/beautymaster/mentions.js';

export default {
  title: 'BeautyMaster/Section/MentionsPanelSaas',
  component: MentionsPanelSaas,
  tags: ['autodocs'],
  argTypes: {
    mentions: { control: 'object', description: '멘션 목록 (Mention[] typedef)' },
    lastCrawledAt: { control: 'date', description: '마지막 일일 크롤 시각' },
    onApprove: { action: 'approved', description: '검토 대기열 Approve 핸들러' },
    onDismiss: { action: 'dismissed', description: '검토 대기열 Dismiss 핸들러' },
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

/** 모던 SaaS 문법 시안 — 라운드 카드(16px) + 소프트 섀도 + Inter. 기존 MentionsPanel(flat)과 비교용 */
export const Default = {
  args: {
    mentions: MOCK_MENTIONS,
    lastCrawledAt: new Date('2026-07-25T07:00:00'),
  },
};

/** 빈 상태 — 크롤 결과가 없을 때 */
export const Empty = {
  args: {
    mentions: [],
    lastCrawledAt: new Date('2026-07-25T07:00:00'),
  },
};
