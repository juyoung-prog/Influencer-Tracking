import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ALL_STORES } from '../../../data/beautymaster/schema.js';

/**
 * SaasStoreSelect component
 *
 * flat-SaaS 시안의 스토어 선택 드롭다운. Operations / Analytics / Workflow 세 뷰가
 * 같은 스토어 상태를 공유하므로 컨트롤도 하나로 공유한다 — 어느 뷰에서 바꾸든
 * 나머지 뷰가 따라온다(셸이 상태를 소유).
 * 높이 36px · radius 6px · 섀도 없음으로 검색 input과 같은 컨트롤 문법을 따른다.
 *
 * Props:
 * @param {string[]} stores - 선택 가능한 스토어 목록 [Required]
 * @param {string} value - 현재 선택된 스토어 ('all'이면 전체) [Optional, 기본값: 'all']
 * @param {function} onChange - 변경 핸들러 (store) => void [Optional]
 * @param {object} sx - Select에 적용할 MUI sx 오버라이드 [Optional]
 *
 * Example usage:
 * <SaasStoreSelect stores={stores} value={selectedStore} onChange={setSelectedStore} />
 */
function SaasStoreSelect({ stores, value = ALL_STORES, onChange, sx }) {
  if (!stores || stores.length === 0) return null;

  return (
    <Select
      value={value}
      onChange={e => onChange?.(e.target.value)}
      size="small"
      sx={{
        height: 36,
        fontSize: 12,
        borderRadius: '6px',
        backgroundColor: 'background.paper',
        /* 기본 테두리만 divider로 낮춘다. 조건 없이 두면 sx가 테마의 포커스
           규칙을 덮어써서, 열려 있는데도 테두리가 회색으로 남는다. */
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: 'accent.main' },
        '&.Mui-focused': { boxShadow: theme => `0 0 0 3px ${theme.palette.accent.ring}` },
        '& .MuiSelect-icon': { fontSize: 18, right: 6 },
        ...sx,
      }}
    >
      <MenuItem value={ALL_STORES} sx={{ fontSize: 12 }}>All stores</MenuItem>
      {stores.map(store => (
        <MenuItem key={store} value={store} sx={{ fontSize: 12 }}>
          {store}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SaasStoreSelect;
