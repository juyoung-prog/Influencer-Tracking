import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { expect } from 'storybook/test';
import { parseInfluencerCsv } from './parseInfluencerCsv.js';
import { SHEET_STATUS } from '../data/beautymaster/schema.js';

/**
 * 시트 구조를 그대로 축약한 픽스처.
 *
 * 실제 Done 탭에는 이름 칸이 빈 행이 957개 있는데, 그중 955개는 진짜 빈 줄이고
 * 2개는 이름만 안 적힌 실제 방문 기록이었다. 두 경우를 모두 넣어 구분되는지 본다.
 */
const CSV = [
  'BeautyMaster Influencer Tracking,,,,,,,,,,,,,,,,,,,',
  ',,,,,,,,,,,,,,,,,,,',
  'no.,store,month,barcode,platform,category,type,total cost,image,full name,social account,email,time,agreement,attend,collabo shared,collabo link,upload date,credit shared,credit used',
  '1,G10,2026-07,G10INF2026,Instagram,General,$100 Credit,,,Kim Minjung,kimminjung,a@b.com,7/8/2026 2pm,TRUE,TRUE,TRUE,,7/9/2026,TRUE,',
  // 진짜 빈 줄 — 걸러져야 한다
  ',,,,,,,,,,,,,,,,,,,',
  // 이름만 없는 실제 기록 — 소셜 계정으로 사람을 특정할 수 있으므로 들어와야 한다
  '2,BF4,2026-04,BF4INF2026,Instagram,General,$100 Credit,,,,_d1stylez_,,4/13/2026,FALSE,TRUE,TRUE,,,FALSE,',
  // 구간 표시 줄 — 걸러지되 이후 행의 상태를 바꾼다
  'Done,,,,,,,,,,,,,,,,,,,',
  '3,G10,2026-06,G10INF2026,TikTok,K-Beauty,$100 Credit,,,Lee Jiyeon,leejiyeon,c@d.com,6/2/2026 11am,TRUE,TRUE,TRUE,,6/3/2026,TRUE,3/10/2026',
].join('\n');

const parsed = parseInfluencerCsv(CSV, SHEET_STATUS.PROCESSING, 'T_');

export default {
  title: 'BeautyMaster/Data/parseInfluencerCsv',
  parameters: { layout: 'padded' },
};

/**
 * 파서가 시트의 어떤 행을 사람으로 인정하는지.
 *
 * 이 계약이 무너지면 화면의 모든 숫자가 조용히 어긋난다 — 실제로 두 번 그랬다.
 * 한 번은 credit used 열이 날짜인데 parseBool로 읽어 전부 미사용으로 집계됐고,
 * 한 번은 이름 없는 행을 빈 줄로 보고 실제 방문 2건을 버렸다.
 * 둘 다 화면에는 정상으로 보여서 눈으로는 못 잡는다.
 */
export const RowContract = {
  render: () => (
    <Box sx={{ fontSize: 13 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
        파싱된 행 {parsed.length}개
      </Typography>
      {parsed.map(inf => (
        <Box key={inf.id} sx={{ display: 'flex', gap: 2, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 160, fontWeight: 500 }}>{inf.fullName}</Box>
          <Box sx={{ width: 90, color: 'text.secondary' }}>{inf.store}</Box>
          <Box sx={{ width: 110, color: 'text.secondary' }}>{inf.sheetStatus}</Box>
          <Box sx={{ color: 'text.secondary' }}>
            {inf.hasFullName ? '이름 있음' : '이름 없음 → 소셜 계정 사용'}
          </Box>
        </Box>
      ))}
    </Box>
  ),
  play: async () => {
    // 빈 줄과 구간 표시 줄은 사람으로 세지 않는다
    await expect(parsed.length).toBe(3);

    const byName = Object.fromEntries(parsed.map(i => [i.fullName, i]));
    await expect(Object.keys(byName).sort()).toEqual(['Kim Minjung', 'Lee Jiyeon', '_d1stylez_']);

    // 이름이 없으면 소셜 계정을 이름 자리에 쓰고, 그 사실을 플래그로 남긴다
    await expect(byName._d1stylez_.hasFullName).toBe(false);
    await expect(byName['Kim Minjung'].hasFullName).toBe(true);

    // 이름 없는 행도 상태 값은 그대로 읽힌다 — 이게 빠져서 방문 집계가 적게 나왔다
    await expect(byName._d1stylez_.attend).toBe(true);
    await expect(byName._d1stylez_.collaboShared).toBe(true);
    await expect(byName._d1stylez_.store).toBe('BF4');

    // "Done" 표시 줄 이후의 행은 Done으로 넘어간다
    await expect(byName['Lee Jiyeon'].sheetStatus).toBe(SHEET_STATUS.DONE);
    await expect(byName['Kim Minjung'].sheetStatus).toBe(SHEET_STATUS.PROCESSING);

    // credit used 열은 TRUE/FALSE가 아니라 날짜를 적는다 — 값이 있으면 사용한 것
    await expect(byName['Lee Jiyeon'].creditUsed).toBe(true);
    await expect(byName['Lee Jiyeon'].hasCreditUsedValue).toBe(true);
    await expect(byName['Kim Minjung'].creditUsed).toBe(false);
    await expect(byName['Kim Minjung'].hasCreditUsedValue).toBe(false);

    // id는 시트별 접두사로 갈라 둔다 — 두 탭의 행 번호가 겹쳐 다른 사람이 열리던 적이 있다
    for (const inf of parsed) await expect(inf.id.startsWith('T_')).toBe(true);
  },
};
