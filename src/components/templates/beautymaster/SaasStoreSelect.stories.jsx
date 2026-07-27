import Box from '@mui/material/Box';
import SaasStoreSelect from './SaasStoreSelect';
import { SAAS_FONT } from './SaasShell';
import { ALL_STORES } from '../../../data/beautymaster/schema.js';

const STORES = ['BF1', 'BF2', 'BF3', 'BF4', 'BF5', 'G02', 'G09', 'G10'];

export default {
  title: 'BeautyMaster/Atom/SaasStoreSelect',
  component: SaasStoreSelect,
  tags: ['autodocs'],
  argTypes: {
    stores: { control: 'object', description: '선택 가능한 스토어 목록. 비면 아무것도 렌더하지 않는다' },
    value: { control: 'select', options: [ALL_STORES, ...STORES], description: "선택된 스토어 ('all'이면 전체)" },
    onChange: { action: 'storeChanged', description: '변경 핸들러 (store) => void' },
    sx: { control: 'object', description: 'Select에 적용할 MUI sx 오버라이드' },
  },
  decorators: [
    Story => (
      <Box sx={{ p: 3, fontFamily: SAAS_FONT }}>
        <Story />
      </Box>
    ),
  ],
};

/** 기본 — 전체 스토어 */
export const Default = {
  args: { stores: STORES, value: ALL_STORES },
};

/** 특정 스토어 선택 — Operations/Analytics/Workflow 세 뷰가 이 값을 공유한다 */
export const StoreSelected = {
  args: { stores: STORES, value: 'G10' },
};

/** 스토어가 없으면 컨트롤 자체를 숨긴다 (빈 드롭다운을 노출하지 않는다) */
export const NoStores = {
  args: { stores: [], value: ALL_STORES },
};
