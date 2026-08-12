import Box from '@mui/material/Box';
import SaasKpiItem from './SaasKpiItem';
import { SAAS_FONT } from './SaasShell';

export default {
  title: 'BeautyMaster/Atom/SaasKpiItem',
  component: SaasKpiItem,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: '지표 이름' },
    value: { control: 'text', description: '지표 값 (숫자 또는 포맷된 문자열)' },
    total: { control: { type: 'number' }, description: '값 옆에 "of N"으로 붙일 모수. null이면 생략' },
    isFirst: { control: 'boolean', description: '첫 셀 여부 — 좌측 divider와 padding을 없앤다' },
    isAlert: { control: 'boolean', description: '주의 상태 — 라벨·값을 warning 색으로 렌더' },
    note: { control: 'text', description: '값 아래 한 줄 — 수치가 스스로 말하지 못하는 단서' },
  },
  decorators: [
    Story => (
      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
};

/** 기본 — 값만 표시 */
export const Default = {
  args: { label: 'Tracked', value: 189, isFirst: true },
};

/** 모수 병기 — "of N"이 붙어 비율을 함께 읽는다 */
export const WithTotal = {
  args: { label: 'Agreement', value: 185, total: 189, isFirst: true },
};

/** 주의 상태 — Review queue처럼 사람이 손대야 하는 지표 */
export const Alert = {
  args: { label: 'Needs attention', value: 86, isAlert: true, isFirst: true },
};

/**
 * 단서 한 줄 — 수치가 스스로 말하지 못하는 것을 값 **아래**에 붙인다.
 *
 * "Credit used 12 of 44"만 보면 나머지 32건이 미사용으로 읽힌다. 실제로는 시트의
 * Credit Used 칸이 비어 있어 측정 자체가 없는 건이다(실데이터 211행 중 19행만 기록).
 * 스트립 밖 각주로 빼면 어느 셀 이야기인지 잃으므로 숫자 바로 아래에 둔다.
 */
export const WithNote = {
  args: { label: 'Credit used', value: 12, total: 44, note: '25 not recorded', isFirst: true },
};

/**
 * 스트립 구성 — 실제로는 여러 셀을 나란히 놓고 첫 셀만 isFirst를 준다.
 * 셀 구분은 카드가 아니라 좌측 1px divider로만 한다.
 * 한 셀에 note가 붙어도 나머지 셀의 라벨·숫자 baseline은 그대로다.
 */
export const Strip = {
  parameters: { controls: { disable: true } },
  render: () => (
    <>
      <SaasKpiItem label="Agreement" value={185} total={189} isFirst />
      <SaasKpiItem label="Visit" value={130} total={189} />
      <SaasKpiItem label="Upload" value={101} total={189} />
      <SaasKpiItem label="Credit" value={102} total={189} />
      <SaasKpiItem label="Credit used" value={12} total={102} note="83 not recorded" />
    </>
  ),
};
