import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { parseDateKey, toDateKey } from '../../../data/beautymaster/schema.js';

/** 자정으로 내린 사본 — 시각이 섞이면 같은 날인데도 프리셋 비교가 어긋난다 */
const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) => {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
};

/**
 * 프리셋 — 자주 묻는 기간을 버튼 하나로 만든다.
 * 주는 일요일 시작이다(매장이 미국에 있고 화면 전체가 en-US 표기를 쓴다).
 */
const PRESETS = [
  { key: 'all', label: 'All', build: () => ({ from: null, to: null }) },
  { key: 'week', label: 'This week', build: today => ({ from: addDays(today, -today.getDay()), to: startOfDay(today) }) },
  { key: 'month', label: 'This month', build: today => ({ from: new Date(today.getFullYear(), today.getMonth(), 1), to: startOfDay(today) }) },
  { key: '30d', label: 'Last 30 days', build: today => ({ from: addDays(today, -29), to: startOfDay(today) }) },
];

/** 두 범위가 같은 날짜를 가리키는지 — Date 객체 비교는 항상 false라 키로 본다 */
const isSameRange = (a, b) => toDateKey(a?.from) === toDateKey(b?.from) && toDateKey(a?.to) === toDateKey(b?.to);

const inputSx = {
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: 12,
    borderRadius: '6px',
    backgroundColor: 'background.paper',
  },
  /* SaasStoreSelect와 같은 컨트롤 문법 — 기본 테두리만 divider로 낮추고
     포커스 규칙은 테마 것을 덮지 않는다(덮으면 포커스가 회색으로 남는다). */
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: 'accent.main' },
  '& .MuiOutlinedInput-root.Mui-focused': { boxShadow: theme => `0 0 0 3px ${theme.palette.accent.ring}` },
  '& input': { py: 0, fontVariantNumeric: 'tabular-nums' },
};

/**
 * SaasDateRangeSelect component
 *
 * flat-SaaS 시안의 기간(시작~종료) 선택 컨트롤. 프리셋 버튼 + 날짜 입력 두 칸이
 * 같은 값을 가리킨다 — 프리셋을 누르면 입력이 따라가고, 입력을 직접 고치면
 * 프리셋 선택이 풀린다(없는 프리셋을 눌린 채로 두면 화면이 거짓말을 한다).
 *
 * 날짜 문자열 ↔ Date 변환은 schema의 toDateKey/parseDateKey 한 쌍만 쓴다.
 * new Date('2026-08-20')은 UTC 자정으로 읽혀 하루가 밀린다.
 *
 * Props:
 * @param {object} value - 현재 기간 { from: Date|null, to: Date|null }. null은 열린 끝(전체) [Required]
 * @param {function} onChange - 변경 핸들러 ({ from, to }) => void [Optional]
 * @param {Date} today - 프리셋 기준일. 테스트 주입점 [Optional, 기본값: new Date()]
 * @param {object} sx - 바깥 Box에 적용할 MUI sx 오버라이드 [Optional]
 *
 * Example usage:
 * <SaasDateRangeSelect value={range} onChange={setRange} />
 */
function SaasDateRangeSelect({ value, onChange, today = new Date(), sx }) {
  const range = value ?? { from: null, to: null };
  const activePreset = PRESETS.find(p => isSameRange(p.build(today), range))?.key ?? null;

  /* 시작이 종료보다 뒤면 결과가 늘 0이 된다. 입력을 막는 대신 방금 건드리지 않은
     쪽을 끌고 온다 — 사람이 고친 값은 그대로 두는 게 예측 가능하다. */
  const emitEdge = (edge, date) => {
    const next = { ...range, [edge]: date };
    if (next.from && next.to && next.from > next.to) {
      if (edge === 'from') next.to = date;
      else next.from = date;
    }
    onChange?.(next);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, ...sx }}>
      {/* 테마는 flat(shape.borderRadius 0)이라 그룹에 radius를 직접 줘야 한다 —
          빼먹으면 이 그룹만 완전 각짐으로 렌더돼 옆 입력(6px)과 어긋난다(issue11).
          모서리는 그룹과 양끝 버튼이 따로 갖고 있어 세 군데 다 맞춘다. */}
      <ToggleButtonGroup
        size="small"
        value={activePreset}
        exclusive
        onChange={(_, key) => {
          const preset = PRESETS.find(p => p.key === key);
          if (preset) onChange?.(preset.build(today));
        }}
        sx={{
          borderRadius: '6px',
          '& .MuiToggleButtonGroup-firstButton': { borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' },
          '& .MuiToggleButtonGroup-lastButton': { borderTopRightRadius: '6px', borderBottomRightRadius: '6px' },
        }}
      >
        {PRESETS.map(preset => (
          /* 높이 36은 inputSx와 같은 값 — 한 줄에 놓이는 컨트롤은 같은 문법을 쓴다 */
          <ToggleButton key={preset.key} value={preset.key} sx={{ height: 36, px: 1.25, py: 0, fontSize: 11 }}>
            {preset.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          type="date"
          size="small"
          value={toDateKey(range.from)}
          onChange={e => emitEdge('from', parseDateKey(e.target.value))}
          slotProps={{ htmlInput: { 'aria-label': 'Start date' } }}
          sx={inputSx}
        />
        {/* 두 입력 사이를 잇는 기호. 텍스트가 아니라 관계라서 스크린리더에서 뺀다 */}
        <Typography aria-hidden sx={{ fontSize: 12, color: 'text.disabled' }}>–</Typography>
        <TextField
          type="date"
          size="small"
          value={toDateKey(range.to)}
          onChange={e => emitEdge('to', parseDateKey(e.target.value))}
          slotProps={{ htmlInput: { 'aria-label': 'End date' } }}
          sx={inputSx}
        />
      </Box>
    </Box>
  );
}

export default SaasDateRangeSelect;
