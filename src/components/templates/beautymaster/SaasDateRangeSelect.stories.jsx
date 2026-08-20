import Box from '@mui/material/Box';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import SaasDateRangeSelect from './SaasDateRangeSelect';
import { SAAS_FONT } from './SaasShell';

/** 프리셋은 "오늘"에서 계산된다 — 스토리가 날짜에 따라 흔들리지 않도록 고정한다 */
const TODAY = new Date(2026, 7, 20); // 2026-08-20 (목)

const D = (y, m, d) => new Date(y, m - 1, d);

export default {
  title: 'BeautyMaster/Atom/SaasDateRangeSelect',
  component: SaasDateRangeSelect,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object', description: '현재 기간 { from, to }. null은 열린 끝(전체)' },
    onChange: { action: 'rangeChanged', description: '변경 핸들러 ({ from, to }) => void' },
    today: { control: 'date', description: '프리셋 기준일. 테스트 주입점' },
    sx: { control: 'object', description: '바깥 Box에 적용할 MUI sx 오버라이드' },
  },
  args: {
    value: { from: null, to: null },
    today: TODAY,
    onChange: fn(),
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
};

/** 기본 — 전체 기간. 양끝이 열려 있으면 All 프리셋이 눌린 상태다 */
export const Default = {};

/** 이번 달 — 프리셋이 계산한 값이 그대로 입력 두 칸에 보인다 */
export const ThisMonth = {
  args: { value: { from: D(2026, 8, 1), to: D(2026, 8, 20) } },
};

/**
 * 직접 고른 기간 — 어떤 프리셋과도 맞지 않으면 프리셋 선택이 풀린다.
 * 맞지 않는 프리셋을 눌린 채로 두면 화면이 거짓말을 한다.
 */
export const CustomRange = {
  args: { value: { from: D(2026, 6, 20), to: D(2026, 7, 14) } },
};

/** 한쪽 끝만 — 시작일만 고르면 그 뒤 전부가 대상이다 */
export const OpenEnded = {
  args: { value: { from: D(2026, 7, 1), to: null } },
};

/**
 * 프리셋은 기준일에서 계산된다.
 *
 * This week는 일요일 시작이다(매장이 미국에 있고 화면 전체가 en-US 표기를 쓴다).
 * 2026-08-20은 목요일이므로 8/16(일)~8/20이 나와야 한다.
 */
export const PresetEmitsRange = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'This week' }));
    const week = args.onChange.mock.calls.at(-1)[0];
    await expect(week.from.getDate()).toBe(16);
    await expect(week.to.getDate()).toBe(20);

    await userEvent.click(canvas.getByRole('button', { name: 'This month' }));
    const month = args.onChange.mock.calls.at(-1)[0];
    await expect(month.from.getDate()).toBe(1);
    await expect(month.from.getMonth()).toBe(7);

    await userEvent.click(canvas.getByRole('button', { name: 'Last 30 days' }));
    const last30 = args.onChange.mock.calls.at(-1)[0];
    await expect(last30.from.getMonth()).toBe(6); // 7월 22일
    await expect(last30.from.getDate()).toBe(22);
  },
};

/**
 * 날짜 문자열은 로컬 자정으로 읽는다.
 *
 * new Date('2026-08-20')은 UTC 자정이라 미국 동부에서는 8/19가 된다 —
 * 그러면 사용자가 고른 날과 세는 날이 하루 어긋나 경계일 방문이 조용히 빠진다.
 */
export const ParsesAsLocalMidnight = {
  play: async ({ args, canvasElement }) => {
    const start = within(canvasElement).getByLabelText('Start date');

    await fireEvent.change(start, { target: { value: '2026-08-20' } });
    const emitted = args.onChange.mock.calls.at(-1)[0];
    await expect(emitted.from.getFullYear()).toBe(2026);
    await expect(emitted.from.getMonth()).toBe(7);
    await expect(emitted.from.getDate()).toBe(20);
    await expect(emitted.from.getHours()).toBe(0);
  },
};

/**
 * 시작이 종료보다 뒤로 가면 결과가 늘 0이 된다.
 * 입력을 막는 대신 방금 건드리지 않은 쪽을 끌고 온다 — 사람이 고친 값은 그대로 둔다.
 */
export const KeepsRangeOrdered = {
  args: { value: { from: D(2026, 7, 1), to: D(2026, 7, 14) } },
  play: async ({ args, canvasElement }) => {
    const start = within(canvasElement).getByLabelText('Start date');

    await fireEvent.change(start, { target: { value: '2026-07-20' } });
    const emitted = args.onChange.mock.calls.at(-1)[0];
    // 사람이 고친 쪽(from)은 그대로, 뒤집힌 종료일이 따라온다
    await expect(emitted.from.getDate()).toBe(20);
    await expect(emitted.to.getDate()).toBe(20);
  },
};
