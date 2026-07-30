/**
 * 인플루언서 아바타 표기 — 이니셜과 색.
 *
 * 목록 행과 상세 패널이 같은 사람을 같은 모습으로 보여줘야 해서 한 곳에 둔다.
 * 예전에는 목록만 두 글자 + 색이고 패널은 한 글자 + 회색이라, 행을 눌러 패널을
 * 열면 방금 본 원과 다른 원이 나왔다.
 */

/* 색 팔레트 — HSL 색상환을 10등분해 만든 값(배경 L 91.5%/S 20%, 글자 L 29.5%/S 22%).
   손으로 고르면 두 색이 거의 같아지는 조합이 생겨서(채널 합 6 차이) 균등 간격을
   색상환에서 보장했다.

   왜 필요한가: 이니셜이 같은 사람이 인접해 앉는다. 실제 데이터 191명에서 이런 쌍이
   두 건 있다 — Aurora Garcia/Alexis Garrett(AG), Sherian McGhee/Sharon Mijares(SM).
   같은 원 두 개가 붙어 있으면 스크롤 중에 같은 사람으로 읽힌다.

   구분은 주로 **글자색**이 진다(간격 19~96). 배경은 일부러 옅게 남겨 목록이
   알록달록해지지 않게 했다 — 앰버(경보)·파랑(선택)이 이 화면에서 의미를 지고 있어서
   아바타가 색으로 경쟁하면 안 된다. 모든 조합이 대비 6.1:1 이상으로 AA를 넘는다
   (예전에 흰 글자 + grey.400 조합이 1.88:1로 미달이었다).

   색은 보조 신호다 — 이름이 바로 옆에 적혀 있어 색만으로 사람을 구분하게 두지 않는다.
   해시는 10칸이라 이름이 다른 동일 이니셜 쌍의 97%(63/65)를 갈라낸다. 100%는 아니다. */
export const AVATAR_TINTS = [
  { bg: '#EEE7E5', fg: '#5C433B' },
  { bg: '#EEECE5', fg: '#5C563B' },
  { bg: '#EAEEE5', fg: '#4D5C3B' },
  { bg: '#E5EEE5', fg: '#3B5C3C' },
  { bg: '#E5EEEB', fg: '#3B5C50' },
  { bg: '#E5ECEE', fg: '#3B545C' },
  { bg: '#E5E6EE', fg: '#3B405C' },
  { bg: '#E9E5EE', fg: '#493B5C' },
  { bg: '#EEE5ED', fg: '#5C3B5A' },
  { bg: '#EEE5E8', fg: '#5C3B47' },
];

/**
 * 이름에서 아바타 색을 고른다. 같은 사람은 언제나 같은 색이어야 하므로
 * 목록 순서가 아니라 이름 문자열에서 뽑는다(필터·정렬로 순서가 바뀌어도 색이 유지된다).
 * 시트에 같은 사람이 두 번 들어온 행들도 같은 색으로 묶인다.
 *
 * FNV-1a를 쓴다. 처음 쓴 `h*31 + c`는 섞임이 약해서 앞부분이 비슷한 이름이 같은 칸에
 * 떨어졌다 — 실제로 Aurora Garcia와 Alexis Garrett이 같은 색이 됐다(스토리가 잡았다).
 *
 * @param {string} name - 표시용으로 정규화된 이름(toDisplayName 결과)
 * @returns {{bg: string, fg: string}}
 */
export function avatarTint(name) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < name.length; i += 1) {
    hash ^= name.charCodeAt(i);
    // 32비트 곱셈을 넘어가지 않게 Math.imul을 쓴다 — 곱셈 연산자는 정밀도가 새어 나간다
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

/**
 * 아바타 이니셜. 두 단어 이상이면 앞 두 단어의 첫 글자, 한 단어면 앞 두 글자.
 *
 * 한 글자만 쓰면("Nicole" → "N") 나머지가 두 글자인 열에서 그 행만 비어 보인다.
 * 앞의 기호는 이니셜이 될 수 없다 — 핸들이 이름 자리에 온 행("_d1stylez_")이 "_D"가 됐다.
 *
 * @param {string} name - 표시용으로 정규화된 이름(toDisplayName 결과)
 * @returns {string}
 */
export function avatarInitials(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '—';
  const clean = w => w.replace(/[^\p{L}\p{N}]/gu, '');
  if (words.length === 1) return clean(words[0]).slice(0, 2).toUpperCase() || '—';
  return ((clean(words[0])[0] || '') + (clean(words[1])[0] || '')).toUpperCase() || '—';
}
