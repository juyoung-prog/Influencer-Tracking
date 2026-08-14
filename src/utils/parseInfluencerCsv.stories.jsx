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
  // "upload  date"의 공백 2칸은 오타가 아니다 — 실제 G10 시트 헤더 셀에 줄바꿈이 있어
  // CSV에서 이렇게 온다. 정규화가 빠지면 이 열이 통째로 null이 된다(성과 D+14 큐 전멸).
  'no.,store,month,barcode,platform,category,type,total cost,image,full name,social account,email,time,agreement,attend,collabo shared,collabo link,upload  date,credit shared,credit used,views',
  // views "8,794" — 시트가 천 단위 콤마째 내보낸다. parseInt가 콤마에서 멈추면 8이 된다.
  '1,G10,2026-07,G10INF2026,Instagram,General,$100 Credit,,,Kim Minjung,kimminjung,a@b.com,7/8/2026 2pm,TRUE,TRUE,TRUE,,7/9/2026,TRUE,,"8,794"',
  // 진짜 빈 줄 — 걸러져야 한다
  ',,,,,,,,,,,,,,,,,,,',
  // 이름만 없는 실제 기록 — 소셜 계정으로 사람을 특정할 수 있으므로 들어와야 한다
  '2,BF4,2026-04,BF4INF2026,Instagram,General,$100 Credit,,,,_d1stylez_,,4/13/2026,FALSE,TRUE,TRUE,,,FALSE,',
  // 구간 표시 줄 — 걸러지되 이후 행의 상태를 바꾼다
  'Done,,,,,,,,,,,,,,,,,,,',
  // views "3.4K" — 앱의 축약 표기가 시트에 그대로 옮겨 적힌다. 3으로 잘리면 ER이 폭발한다.
  '3,G10,2026-06,G10INF2026,TikTok,K-Beauty,$100 Credit,,,Lee Jiyeon,leejiyeon,c@d.com,6/2/2026 11am,TRUE,TRUE,TRUE,,6/3/2026,TRUE,3/10/2026,3.4K',
].join('\n');

const parsed = parseInfluencerCsv(CSV, SHEET_STATUS.PROCESSING, 'T_');

/**
 * 핸들 전용 픽스처 — "social account" 칸에 실제로 들어오는 네 가지 모양.
 *
 * 이 칸은 사람이 손으로 적어서 형태가 제각각이다. 목록 행이 이 값을 "@핸들"로
 * 그대로 내보내기 때문에, 파서가 여기서 걸러주지 않으면 화면에 자기소개가 붙는다.
 */
const HANDLE_CSV = [
  'no.,store,month,barcode,platform,category,type,total cost,image,full name,social account,email,time,agreement,attend,collabo shared,collabo link,upload date,credit shared,credit used',
  // 1) 평범한 핸들
  '1,G10,2026-07,G10INF2026,Instagram,General,,,,Jasmin Bean,jasminbean,,7/8/2026 2pm,TRUE,TRUE,,,,,',
  // 2) @가 붙은 핸들
  '2,G10,2026-07,G10INF2026,Instagram,General,,,,Silvia Cusati,@silviacusati,,7/8/2026 2pm,TRUE,TRUE,,,,,',
  // 3) 칸에 URL을 통째로 붙여 넣은 행
  '3,G10,2026-07,G10INF2026,TikTok,General,,,,Cherii Dluxx,https://www.tiktok.com/@cheriidluxx/,,7/8/2026 2pm,TRUE,TRUE,,,,,',
  // 4) 핸들이 아니라 자기소개가 적힌 행(오버라이드 없음) — 실제로 이런 셀이
  //    "@Rosalia | UGC content creator"로 화면에 나갔었다. 픽스처 이름은
  //    SOCIAL_URL_OVERRIDES에 절대 없을 가상 인물이어야 한다(실명을 쓰면
  //    나중에 그 사람이 오버라이드에 등록되는 순간 이 케이스가 무너진다).
  '4,G10,2026-07,G10INF2026,Instagram,General,,,,Mari Vega,Mari | UGC content creator,,7/8/2026 2pm,TRUE,TRUE,,,,,',
  // 5) 4번과 같은 쓰레기 칸이지만 이름이 오버라이드 목록에 있는 행 — 링크가 살아나므로 핸들도 살아난다
  '5,G10,2026-07,G10INF2026,TikTok,General,,,,Jakkah kebbay,\u{1F36D}Jakkah\u{1F380},,7/8/2026 2pm,TRUE,TRUE,,,,,',
  // 6) 핸들 문법은 통과하지만 **이름 한 토막**만 적힌 행 — 4번보다 위험하다.
  //    링크가 만들어져 버리고, 그 주소에는 동명의 남이 산다(실제로 @Jasmaine =
  //    팔로워 3명의 다른 사람). 4번은 눈에 띄지만 이건 조용히 틀린다.
  '6,G10,2026-08,G10INF2026,TikTok,General,,,,Vera Lindqvist,Vera,,8/8/2026 2pm,TRUE,TRUE,,,,,',
  // 7) 이름 칸이 비어 소셜 칸이 이름 자리에 들어온 행 — 6번 규칙이 여기까지 번지면
  //    멀쩡한 핸들이 날아간다. 이름이 곧 셀이므로 규칙에서 빠져야 한다.
  '7,G10,2026-08,G10INF2026,TikTok,General,,,,,solvbrandt,,8/8/2026 2pm,TRUE,TRUE,,,,,',
  // 8) 이름 토막에 마침표를 찍은 행("Ty Coleman → Ty.") — 6번과 같은 경우인데
  //    글자 그대로 비교하면 "ty." ≠ "ty" 라 규칙을 빠져나가 남의 계정으로 링크됐다.
  '8,G10,2026-08,G10INF2026,Instagram,General,,,,Nora Vandelay,Nora.,,8/16/2026 10pm,TRUE,TRUE,,,,,',
].join('\n');

const handleRows = parseInfluencerCsv(HANDLE_CSV, SHEET_STATUS.PROCESSING, 'H_');

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

    // 헤더 셀 안 줄바꿈으로 공백이 2칸이 된 열("upload  date")도 정상 매칭돼야 한다.
    // 이게 어긋나면 열이 조용히 사라진다 — G10에서 Upload Date 전체가 null이 됐었다.
    await expect(byName['Kim Minjung'].uploadDate?.getMonth()).toBe(6);
    await expect(byName['Kim Minjung'].uploadDate?.getDate()).toBe(9);

    // 천 단위 콤마가 든 숫자 셀은 콤마를 벗기고 읽는다 — 8,794가 8이 되면 안 된다
    await expect(byName['Kim Minjung'].views).toBe(8794);
    // "3.4K" 축약 표기도 해석한다 — 3으로 잘리면 ER이 2866.7% 같은 값으로 폭발한다
    await expect(byName['Lee Jiyeon'].views).toBe(3400);

    // credit used 열은 TRUE/FALSE가 아니라 날짜를 적는다 — 값이 있으면 사용한 것
    await expect(byName['Lee Jiyeon'].creditUsed).toBe(true);
    await expect(byName['Lee Jiyeon'].hasCreditUsedValue).toBe(true);
    await expect(byName['Kim Minjung'].creditUsed).toBe(false);
    await expect(byName['Kim Minjung'].hasCreditUsedValue).toBe(false);

    // id는 시트별 접두사로 갈라 둔다 — 두 탭의 행 번호가 겹쳐 다른 사람이 열리던 적이 있다
    for (const inf of parsed) await expect(inf.id.startsWith('T_')).toBe(true);
  },
};

/**
 * "social account" 칸이 핸들이 되는 규칙.
 *
 * 목록 행이 이름 아래에 "@핸들"을 그대로 찍기 때문에, 이 칸의 지저분한 값이
 * 그대로 화면에 나간다. 실제로 그랬다 — "@Rosalia | UGC content creator".
 * 상세 패널 링크도 같은 칸에서 나오므로, 검증 없이 URL 틀에 끼우면
 * "https://www.tiktok.com/@Karol en Atlanta 🇺🇸🇭🇳" 같은 없는 주소로 링크됐다.
 *
 * 그래서 핸들 문법 검증을 URL을 만드는 시점에 건다. 핸들이 아닌 셀은 링크도
 * 핸들도 만들지 않는다 — 깨진 링크보다 링크 없음이 낫고, 핸들이 없으면
 * 행은 날짜·시각만 보여준다(InfluencerListRow.NoHandleKeepsDateOnly).
 */
export const HandleContract = {
  render: () => (
    <Box sx={{ fontSize: 13 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
        social account 칸 → 핸들
      </Typography>
      {handleRows.map(inf => (
        <Box key={ inf.id } sx={{ display: 'flex', gap: 2, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 160, fontWeight: 500 }}>{inf.fullName}</Box>
          <Box sx={{ width: 160, color: inf.socialHandle ? 'text.primary' : 'text.secondary' }}>
            {inf.socialHandle ? `@${inf.socialHandle}` : '핸들 없음 → 날짜만'}
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: 12 }}>{inf.socialAccountUrl || '—'}</Box>
        </Box>
      ))}
    </Box>
  ),
  play: async () => {
    const by = Object.fromEntries(handleRows.map(i => [i.fullName, i]));

    // 평범한 핸들, @ 접두, URL 통째 — 셋 다 같은 모양으로 정리된다
    await expect(by['Jasmin Bean'].socialHandle).toBe('jasminbean');
    await expect(by['Silvia Cusati'].socialHandle).toBe('silviacusati');
    await expect(by['Cherii Dluxx'].socialHandle).toBe('cheriidluxx');

    // 자기소개가 적힌 칸은 핸들이 아니다 — 빈 값이어야 화면이 날짜만 보여준다.
    // 링크도 같이 비어야 한다 — 상세 패널이 없는 주소로 링크되던 버그의 회귀 방지
    await expect(by['Mari Vega'].socialHandle).toBe('');
    await expect(by['Mari Vega'].socialAccountUrl).toBe('');

    // 같은 쓰레기 칸이라도 오버라이드로 링크가 살아난 행은 핸들도 살아난다.
    // 목록 핸들과 상세 패널 링크가 같은 출처를 쓴다는 뜻이다.
    await expect(by['Jakkah kebbay'].socialHandle).toBe('oyastormm');
    await expect(by['Jakkah kebbay'].socialAccountUrl).toContain('oyastormm');

    // 이름 한 토막만 적힌 칸도 링크를 만들지 않는다 — 문법은 통과하지만
    // tiktok.com/@Vera 에는 동명의 남이 산다. 없는 링크가 남의 링크보다 낫다
    await expect(by['Vera Lindqvist'].socialAccountUrl).toBe('');
    await expect(by['Vera Lindqvist'].socialHandle).toBe('');

    // 이름 토막 뒤의 마침표는 핸들의 일부가 아니다 — 두 플랫폼 모두 양끝 마침표를
    // 허용하지 않는다. "Nora." 도 "Nora" 와 똑같이 걸러져야 한다
    await expect(by['Nora Vandelay'].socialAccountUrl).toBe('');
    await expect(by['Nora Vandelay'].socialHandle).toBe('');

    // 다만 이름 칸이 비어 셀이 이름 자리에 들어온 행은 그 규칙에서 빠진다 —
    // 그 셀은 적다 만 이름이 아니라 진짜 핸들이다
    await expect(by['solvbrandt'].socialHandle).toBe('solvbrandt');

    // 통과한 값은 전부 핸들 문법을 지킨다 — 공백·기호가 화면에 나가지 않는다
    for (const inf of handleRows) {
      if (inf.socialHandle) await expect(inf.socialHandle).toMatch(/^[A-Za-z0-9._]{1,30}$/);
    }
  },
};
