import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import SaasShell from './SaasShell';

/** 셸 자체를 보여주기 위한 최소 본문 — 실제 뷰 대신 자리만 채운다 */
function BodyStub() {
  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
        본문 영역 — 사이드바를 펼쳐도 이 영역의 폭·위치는 변하지 않는다
      </Typography>
    </Box>
  );
}

export default {
  title: 'BeautyMaster/Page/SaasShell',
  component: SaasShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    activeNav: {
      control: 'radio',
      options: ['operations', 'analytics', 'workflow'],
      description: '활성 네비 키',
    },
    influencerCount: { control: { type: 'number' }, description: 'Operations 항목 옆 카운트 (0이면 숨김)' },
    lastSyncedAt: { control: 'date', description: '마지막 동기화 시각 — 사이드바 하단에 펼침 시 표시' },
    sheetUrl: { control: 'text', description: 'Google Sheet 원본 링크. 비면 해당 줄을 숨긴다' },
    onNavigate: { action: 'navigated', description: '네비 항목 클릭 핸들러 (key) => void' },
    onRefresh: { action: 'refreshed', description: 'Refresh 클릭 핸들러' },
    onOpenSettings: { action: 'settingsOpened', description: 'Settings 클릭 핸들러' },
    children: { control: false, description: '본문 뷰' },
    sx: { control: 'object', description: '루트 Box에 적용할 MUI sx 오버라이드' },
  },
  args: {
    // action argType은 스파이가 아니라서 play에서 호출을 단언할 수 없다 — fn()으로 준다
    onNavigate: fn(),
    onRefresh: fn(),
    onOpenSettings: fn(),
    activeNav: 'operations',
    influencerCount: 189,
    lastSyncedAt: new Date('2026-07-27T15:39:00'),
    sheetUrl: 'https://docs.google.com/spreadsheets/d/EXAMPLE/edit',
    children: <BodyStub />,
  },
  decorators: [
    Story => (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </Box>
    ),
  ],
};

/**
 * 기본 — 접힌 아이콘 레일(56px). 라벨은 숨고 아이콘만 보인다.
 * 레일에 마우스를 올리면 248px로 펼쳐진다(직접 hover해서 확인).
 */
export const Collapsed = {};

/**
 * 펼침 — 라벨이 나타나고, 펼침이 본문 위 오버레이라 본문 폭·위치는 그대로다.
 *
 * 확장은 `&:hover, &:focus-within` 한 규칙으로 걸려 있는데, CSS `:hover`는
 * 실제 포인터 위치로만 발동해 합성 이벤트로는 재현되지 않는다. 그래서 자동 검증은
 * 같은 규칙의 `:focus-within` 쪽(키보드 진입)으로 한다 — 펼침 결과는 동일하다.
 */
export const Expanded = {
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav');
    const main = canvasElement.querySelector('main');
    const collapsedWidth = nav.getBoundingClientRect().width;
    const mainBefore = main.getBoundingClientRect();

    nav.querySelector('button').focus();

    await waitFor(async () => {
      await expect(nav.getBoundingClientRect().width).toBeGreaterThan(collapsedWidth);
    });

    // 본문은 밀리지 않아야 한다 — 오버레이 방식의 핵심 조건
    const mainAfter = main.getBoundingClientRect();
    await expect(Math.round(mainAfter.x)).toBe(Math.round(mainBefore.x));
    await expect(Math.round(mainAfter.width)).toBe(Math.round(mainBefore.width));

    const canvas = within(canvasElement);
    await expect(canvas.getByText('Operations')).toBeVisible();
  },
};

/** 네비 항목 클릭 — onNavigate로 키가 올라간다 */
export const NavigateByClick = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Analytics'));
    await expect(args.onNavigate).toHaveBeenCalledWith('analytics');
  },
};

/** 시트 링크가 없으면 Open Google Sheet 줄을 숨긴다 */
export const NoSheetUrl = {
  args: { sheetUrl: '' },
};

/** 아직 한 번도 동기화되지 않은 상태 */
export const NotSynced = {
  args: { lastSyncedAt: null, influencerCount: 0 },
};

/** Analytics 활성 */
export const AnalyticsActive = {
  args: { activeNav: 'analytics' },
};
