# Vibe Dictionary: 타이포그래피 분류체계 정립 리서치 종합 v0.1

---

## 문서 개요

**목적**: 6번째 사전 "타이포그래피 택소노미"의 1차 골격(Parts/Categories 축)과 항목 스키마를 근거 위에 세우기 위한 딥 리서치 종합본. "의도 입력 → 타이포 패턴 + 컴포넌트 추천" 엔진이 최종 목표.

**기존 5개 사전과의 관계**: 독립 SSOT(`src/data/typographyTaxonomyData.js` 예정), 상호 참조. 현재 타이포는 design 사전 Part4 cat-18(12항목)과 ai-slop 사전 Part2(6항목)에 흩어져 있음. 독립 사전 신설 시 ai-slop의 `escape` 필드에 `dict: 'typography'` 라인이 새로 열려야 함(존재 이유).

**현재 상태**: 리서치 3회 완료(2026-06-18). 분류 축·항목 스키마·한글 조판 인코딩 확정. 다음 단계는 `typographyTaxonomyData.js` v0.1 skeleton 작성(미착수).

**리서치 경로**:
- 1차: deep-research 워크플로우(runId `wf_4f8e6122-5a6`, 26소스 / 127주장 / 22 confirmed / 3 refuted)
- 2차: deep-research 에이전트(표현·태도 축 + 한글 조판 보강, `.firecrawl/typo2-*.json`)
- 3차: deep-research 에이전트(한영 페어링 수치 / 키네틱 a11y / 한글 가독성 査読)

---

## 1. 분류 축 판정: 하이브리드 (역할 평면 = 추천 척추)

후보 3개를 비교 평가한 결과, **단일 축이 아니라 하이브리드**를 채택한다. 판정 기준은 "어느 축이 의도 → 패턴 → 토큰 → 컴포넌트로 실제 매핑되는가".

| 후보 축 | 판정 | 근거 |
|---|---|---|
| (a) layout식 스케일 그래디언트 (자소→글자→단어→줄→단락→페이지→시스템) | Part 배열 순서로 채택 | layout v0.2 사전이 입증한 "원리→표현" 그래디언트가 타이포에도 자연스러움 |
| (b) visual식 직교 3축 (서체분류 × 조판규칙 × 표현효과) | 항목 스키마의 직교 차원으로 흡수 | 한 항목이 동시에 분류·조판·표현 속성을 가짐 |
| **(c) 기능 역할 평면 (Display/Headline/Title/Body/Label)** | **추천 척추로 채택** | M3·KRDS 두 프로덕션 시스템이 독립 수렴, 토큰·컴포넌트 매핑이 증명된 유일 축 |

**결정적 근거** [1차, 3-0 검증]:
- Material Design 3: 5역할(Display/Headline/Title/Body/Label) × 3사이즈(L/M/S) = 15 기본 스타일, 각각 단일 토큰 + 축별 토큰(font/line-height/size/tracking/weight)
- KRDS(한국 정부 디자인시스템): Display / Heading h1-h5 / Body / Navigation / Label 티어, 각 pc/mobile 픽셀 사이즈 + weight + line-height 페어

**Vox-ATypI 서체 분류는 추천 척추 금지, 서술 메타데이터로만** [1차, 3-0]:
- 11클래스 4패밀리(Classicals/Moderns/Calligraphics/Non-Latin), 세리프 연대순(Humanist/Garalde/Transitional/Didone/Slab)
- ATypI가 2021-04-27 공식 폐기, 현대·디스플레이 서체에 부적합 판정. `voxClass`는 필터 필드로만 유지

**layout의 "구조 축 vs 태도 축" 분리를 계승**: 역할·조판 = 구조 축, 표현 = 태도 축.

---

## 2. v0.1 Parts 골격 (7 Parts)

```
[타이포그래피 택소노미 v0.1]  (★표시 = 외부 리서치 대조로 보강된 카테고리, §8 참조)
├── Part 1: 타이포 기초 원리 ──── "타입의 문법" (구조)
│     ├ 타입 스케일·모듈러 스케일(비율→맥락 매핑 ★), 베이스라인 그리드, 위계, 단위(ch/rem/em/CPL/rlh ★)
│     └ 타입 해부학 ★ (x-height, cap-height, ascender/descender, counter/aperture, stroke-contrast)
├── Part 2: 서체 분류 ─────────── "이 서체는 어떤 종류인가" (서술 메타)
│     Vox-ATypI(라틴, deprecated 표기) + 한글(명조/고딕/손글씨/디스플레이)
├── Part 3: 역할·위계 시스템 ──── "이 텍스트의 역할은" (구조 · 추천 척추) ★★
│     Display / Headline / Title / Body / Label + pc/mobile 사이징
├── Part 4: 조판 규칙 ─────────── "어떻게 짜는가" (구조)
│     ├ measure(줄길이), leading(행간), tracking(자간), 정렬, 한글 조판 특수
│     ├ 미시 타이포(OpenType) ★ (tabular/oldstyle-nums, slashed-zero, font-feature-settings, font-variant-*)
│     └ 텍스트 줄바꿈 제어 ★ (text-wrap balance/pretty, word-break keep-all/auto-phrase, hyphenation)
├── Part 5: 반응·유동 거동 ────── "뷰포트에 따라 어떻게 변하는가" (구조)
│     ├ fluid clamp, variable font axes, optical sizing(opsz), a11y 줌 floor
│     ├ 컨테이너 단위 반응형 ★ (container query units cqi)
│     └ 폰트 로딩·CLS ★ (font-display swap/optional/block, FOUT/FOIT, size-adjust/ascent-override)
├── Part 6: 페어링·조합 ───────── "무엇과 짝짓는가" (구조)
│     한영 페어링, 서체 짝짓기(styleMatch), 본문/제목 조합 레시피
└── Part 7: 표현·실험 타이포 ──── "어떤 태도인가" (태도 축)
      ├ kinetic / brutalist / anti-design / oversized-display (4항목 한정 출범)
      └ 해체·실험 ★ (deconstructed/experimental, overlapping/layered, reverse/disrupted reading)
              계보: Weingart → Cranbrook(McCoy) → Carson/Emigre. 가독성·위계를 감정·주목과 거래

  ↕ escape 역방향 연결
[ai-slop 사전]: "Inter-everywhere", "gradient text" 등 → dict: 'typography'
```

**Part 7(표현 축) 출범 범위 한정** [2차 판정]: "트렌드 목록"이 아니라 "정의 가능한 표현 메커니즘"만 항목화.
- `kinetic-typography`: Barbara Brownie의 temporal typography 모델(motion → scrolling/dynamic layout + fluid) + CMU Kinetic Typography Engine 논문
- `brutalist-typography`, `anti-design-typography`: UMich Dialectic 査読 저널. 둘은 의도가 다름(고의적 거칢 vs 미숙성 위장)이라 별 항목
- `oversized-display`: 복수 소스 교차 생존, opsz 축과 연결
- 보류: `maximalist`(단일 listicle 의존 → metadata only). variable-font는 표현이 아니라 Part 5 구조 축의 opsz/축 메커니즘으로(1차 검증과 일관)

---

## 3. 항목(Item) 스키마

layout v0.2 스키마를 베이스로, 타이포 전용 + 한글 필드를 추가한다.

```js
{
  // 정체성
  id, name, koName, aliases,

  // 분류 메타
  voxClass,        // 서술 메타(deprecated). 추천 구동 금지
  maturity,        // foundational | mainstream | emerging | experimental
  evidence,        // standard | practice
  durability,      // ★ principle | trend. maturity와 직교한 수명 판정(외부 리서치)
                   //   rem·measure·variable=principle / kinetic·brutalism·mono=trend

  // 의도 매칭
  bestFor, avoidFor, promptExample,

  // 인쇄→웹 보정 (★ 외부 리서치 프레이밍. foundational 항목용)
  printAssumption, // 인쇄가 전제한 가정 (예: "폰트 크기는 고정 물리값")
  webCorrection,   // 웹에서 거짓이 된 이유 + CSS 보정 (예: "rem으로 사용자 줌 대응, WCAG 1.4.4")

  // 타이포 전용 스펙
  typeScale,       // ratio (golden 1.618 / perfect-fourth 등). 가이드, 강제 아님
  sizePc, sizeMobile,   // 역할 티어 페어 사이징 (M3/KRDS 패턴)
  lineHeight,      // 표현법 enum: percent | fixed | space | min. 본문 150%
  tracking,        // 0(기본) | tight(디스플레이) | loose(넓혀짜기)
  weight,
  opticalSize,     // opsz 축 (작은 글자=굵은 획·큰 x-height, 큰 글자=섬세·고대비)
  lineLength,      // 라틴=ch(66ch), CJK=CPL(글자 수). 양끝맞춤 하한 38-40자 ★
  fontStack,       // style × width 2축 (아래 §4 참조)
  openType,        // ★ feature tags: tabular-nums/oldstyle-nums/slashed-zero 등
  textWrap,        // ★ balance(헤딩, ≤6줄 Chromium) | pretty(본문 고아단어)
  anatomy,         // ★ { xHeight, aperture, strokeContrast } 가독성 근거(해부학)

  // 반응
  fluidScale,      // clamp(min, vw+rem, max). Display/Heading만, 본문 금지
  a11yFloor,       // minRem (>=1rem/16px). WCAG 1.4.4 200% 줌 보장. + 1.4.12 Text Spacing ★
  variableAxes,    // weight/width/opsz 연속 범위 (가변폰트일 때)
  containerUnit,   // ★ cqi (컨테이너 inline 1%). 컴포넌트 단위 반응형
  fontLoading,     // ★ font-display(swap/optional/block) + size-adjust/ascent-override→CLS

  // 페어링 (한영)
  koPairing,       // { latinFont, latinScalePct, baselineShift, strokeMatch }
  styleMatch,      // 명조→Garald, 고딕→네오휴머니스트 산스

  // 관계망
  relatedComponents,  // 강·필수
  goodWith,           // 중·권장
  avoidWith,          // 중·경고

  // 미리보기 (layout 패턴)
  previewImage, previewSpec
}
```

---

## 4. 검증된 스펙 기준값 (필드 직결)

### 4.1 라틴/웹 조판 [1차 검증]

| 필드 | 기준값 | 출처 | tier |
|---|---|---|---|
| `lineLength` | 인쇄 45-75ch(이상 66), 웹 45-85ch, ch 단위 구현(`max-width: 66ch`) | Bringhurst, Smashing | 3-0 |
| `opticalSize`(opsz) | 작은 글자=굵은 획·큰 x-height, 큰 글자=섬세·고대비. `font-variation-settings`, 폰트에 축 있으면 기본 on | MDN, Google Fonts | 3-0 |
| `lineHeight` | 황금비 1.618em 가이드(엄격한 규칙 아님, x-height·measure로 조정, 실무 1.6-1.65) | Inkwell | 2-1 |
| `fluidScale`(clamp) | Display/Heading용, 본문 금지. 순수 vw는 200% 줌 깨짐(WCAG 1.4.4) → rem floor 필수 | Smashing(Roselli) | 3-0 |
| `evidence` 앵커 | Bringhurst "The Elements of Typographic Style" = 정통 인용처 | Wikipedia/HF&J | 3-0 |
| `variableAxes` | 가변폰트 = weight/width/opsz를 이산 enum이 아니라 연속 범위로 모델링 | CreativeBloq(2차 출처) | medium |

**반박된 주장**(채택 금지): Vox-ATypI "현행 공식 분류"(0-3, 2021 폐기), "perfect measure 65 CPL"(1-2), CreativeBloq 5대 트렌드 목록(0-3).

### 4.2 한글 조판: W3C KLREQ 1:1 매핑 [2차 검증, tier A]

W3C "Requirements for Hangul Text Layout(KLREQ)"가 단일 권위 소스로 거의 전부 정규화. 국내 블로그 관습보다 인용 우위.

| 스키마 필드 | 인코딩 | KLREQ 근거 |
|---|---|---|
| `tracking` | 본문 **0 기본**(letter-spacing:normal). 음수 자간은 디스플레이 한정 예외 / tight / loose(양끝맞춤 넓혀짜기) | §7.3.1 |
| `lineBreak` | `keep-all`(단어 단위, 한글 본문 권장) vs `normal`(음절 분할). 줄머리/줄끝 금칙·단어분할금지 플래그 | §7.1.2~7.1.4 |
| `lineHeight` | enum: percent(비례%) / fixed(px·pt) / space(여백만) / min. 본문 150% | §7.4.1 (4방식) |
| `koPairing` | 한영 섞어짜기 객체(아래 §4.3) | §7.3.2 |
| `fontStack` | **style × width 2축**: style(명조/바탕 · 고딕/돋움 · 손글씨 · 디스플레이) × width(비례폭 / 고정폭). 후자는 표·코드 정렬용, 명조/고딕과 직교 | §4.1.1, 부록 B(32 클래스) |
| `indent` | 단락 첫줄 들여짜기(전각 1자 관습) / 내어짜기 | §7.2.3.1~3 |

**핵심 교정점**: 디자이너가 흔히 본문에 음수 자간을 남용하나, 표준 기본값은 0. `fontStack`을 명조/고딕 단일 축이 아니라 style × width 2축으로 쪼개는 것이 KLREQ 정규 구분과 맞음.

### 4.3 한영 페어링 수치: `koPairing` [3차 검증]

| 하위 필드 | 값 | 기준/이유 | tier |
|---|---|---|---|
| `latinScalePct` | **105** (기준=em-box, Adobe 공식) 또는 **80~90** (기준=cap-height 활자면, 타입코드) | 모순 아님, 측정 기준이 다름. 같은 nominal pt에서 라틴이 작아 보여 시각 보정. 필드에 `{value, basis}`로 기준 명기 필수 | B / C |
| `baselineShift` | **`top: -0.05em`** (라틴/숫자 span을 위로) | 한글은 활자틀 시각중심, 라틴은 baseline 기준이라 처져 보임. multilingual.js(타이포잔치4, 한국타이포그라피학회 査読) | A |
| 라틴 span `letterSpacing` | **-0.02em** | 같은 査読 구현값 | A |
| `strokeMatch` | "라틴이 한글보다 약간 두꺼움 → 인위적으로 굵기 맞춰 판면 질감 균일화" (정량 미확보, 원칙) | 타입코드 | C |
| `styleMatch` | 명조(부리)→Garald계(Garamond·Sabon·Minion·Bembo), 고딕(민부리)→네오휴머니스트 산스(FF Meta·Myriad). 숫자는 항상 라틴 설정 따름 | 타입코드 | C |

**멘탈모델 원형**: 합성글꼴(Composite Font, InDesign) = 크기·기준선·비율을 독립 설정하는 한영 제어 모델. `koPairing` 구조의 원형.

### 4.4 키네틱 타이포 구현·접근성: `kinetic-typography` [3차 검증]

- `build`: `@media (prefers-reduced-motion: reduce)` 리셋 + JS `window.matchMedia('(prefers-reduced-motion: reduce)')` + 조건부 자산 `<link media="(prefers-reduced-motion: no-preference)">` / `<picture media>` 정지 대체. (web.dev·MDN·GSAP, tier B)
- `avoidFor`: 전정장애(vestibular: 어지러움·메스꺼움·편두통)·모션 민감 사용자, 본문 가독성 영역(인지 부하).
- WCAG 구분: **2.3.3**(AAA, 상호작용 유발 비필수 모션은 끌 수 있어야 함, 핵심 피드백은 유지) vs **2.2.2**(자동재생 모션). 항목 avoidFor에 어느 소관인지 명기. (W3C, tier A)

### 4.5 한글 본문 가독성 정량값 [3차 검증]

줄길이는 하한/최적/상한 축으로 정리:

| 값 | 의미 | 출처 | tier |
|---|---|---|---|
| **≤40자** | a11y 상한(CJK = 비CJK의 절반 너비) | WCAG 1.4.8 | A |
| **50 CPL** | 속독 최적 | 신종현·박민용 2003, 대한산업공학회지 v.29 n.3 pp.197-205 (KCI 査読) | A |
| 40-60자, 데스크탑 최대 120자 | 실무 허용(모바일 실측 ~30자, PC ~60자) | 리메인 가이드 | C |

- **measure 단위 = CPL(글자 수) 권장**. ch는 CJK 전각에 부정확(W3C가 CJK 너비 2배로 규정한 근거).
- 기존 KRDS 17px·150% 행간은 유지 + 위 査読 줄길이값 추가.
- 한글 베이스 서체: Pretendard GOV, 본문 17px(16 아님, 광학적으로 작게 렌더), 150% 행간(KRDS, tier A).

---

## 5. 남은 공백 (선택 보강, skeleton 진행에 지장 없음)

1. 네이버 NUUL / 토스 TDS / 카카오 등 국내 디자인시스템 공식 문서의 한영 페어링 **명시 수치**(latinScalePct·baselineShift) 미확보.
2. 산돌·윤디자인·AG타이포그래피 파운드리 공식 가이드의 **폰트별 추천 라틴 페어표** 미확보. (relatedComponents 식 "한글 서체 → 추천 라틴" 매핑에 필요)
3. 키네틱 4구현(CSS @keyframes vs Web Animations API vs GSAP vs SVG SMIL)의 **적용 맥락별 정면 비교** 査読/표준 문서 미확보.
4. baseline shift의 **폰트별 차등 권장값** 미확보(폰트마다 시각 조정이라 단일값 부재가 정설일 가능성).

3차에서 제안된 다음 아젠다: ①국내 디자인시스템 firecrawl-map/scrape ②파운드리 페어표 firecrawl-agent JSON 추출 ③키네틱 구현 비교 firecrawl-search.

---

## 6. 핵심 출처 (tier A 우선)

| Title | URL | tier | 용도 |
|---|---|---|---|
| W3C Requirements for Hangul Text Layout (KLREQ) | https://www.w3.org/International/klreq/ | A | 한글 조판 전 필드 |
| Material Design 3 Type Scale Tokens | https://m3.material.io/styles/typography/type-scale-tokens | A | 역할 평면·토큰화 |
| KRDS 타이포그래피 | https://www.krds.go.kr/html/site/style/style_03.html | A | 한글 역할 티어·17px |
| MDN font-optical-sizing | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing | A(primary) | opsz |
| WCAG 1.4.8 Visual Presentation (CJK 줄너비) | https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html | A | 한글 줄길이 ≤40자 |
| WCAG 2.3.3 Animation from Interactions | https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html | A | 키네틱 avoidFor |
| 신종현·박민용, 한글 웹 가독성, 대한산업공학회지 2003 | https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000904747 | A(査読) | 50 CPL |
| multilingual.js, 한국타이포그라피학회 | http://koreantypography.org/wp-content/uploads/2016/08/kst_13_8_1_01.pdf.pdf | A(査読) | 한영 baseline -0.05em |
| On Web Brutalism, Dialectic (UMich) | https://quod.lib.umich.edu/d/dialectic/14932326.0001.107/ | A(査読) | brutalist 항목 |
| Kinetic typography (Brownie temporal model) | https://en.wikipedia.org/wiki/Kinetic_typography | B(원전 A) | kinetic 분류 |
| The Elements of Typographic Style (Bringhurst) | https://en.wikipedia.org/wiki/The_Elements_of_Typographic_Style | B(원전 A) | measure·scale 앵커 |
| Vox-ATypI classification | https://en.wikipedia.org/wiki/Vox-ATypI_classification | B | voxClass 메타 |
| Modern Fluid Typography (clamp) | https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ | B | fluidScale·a11yFloor |
| 폰트 페어링 기초 (Adobe Fonts KR) | https://helpx.adobe.com/kr/fonts/using/basics-of-font-pairing.html | B | latinScalePct 105 |
| 08_섞어짜기 (타입코드) | https://brunch.co.kr/@typecode/13 | C | strokeMatch·styleMatch |

---

## 7. 다음 단계

리서치 3회 모두 완료. 다음은 **`src/data/typographyTaxonomyData.js` v0.1 skeleton 작성**:
- 7 Parts 골격(Part 7 표현 축은 kinetic/brutalist/anti-design/oversized 4항목 한정)
- 위 §3 항목 스키마 적용
- 기존 design 사전 Part4 cat-18(12) + ai-slop Part2(6) 항목을 출처로 흡수·재배치
- `app/dictionary/typography-taxonomy/page.jsx` 렌더 연결
- ai-slop `escape`에 `dict: 'typography'` 신설(양방향 연결)
- 미확보 4건은 해당 필드를 비워두거나 pending 표기
- §8 외부 대조 보강분(타입 해부학·미시 타이포·폰트 로딩·해체 계보·printAssumption/webCorrection 필드) 반영

---

## 8. 외부 리서치 대조·보강 종합 (2026-06-18 2차)

외부 수집집("에디토리얼·웹 타이포그래피 분류 단위 수집집")을 3회 딥리서치 종합본과 대조한 결과. **판정: 상보적. 외부는 내 추천 척추(역할 평면)를 대체하지 않고 웹 미시 타이포·인쇄가정 붕괴 프레이밍·해부학·해체 계보를 보강.** 충돌 0, 재확인 1.

### 8.1 외부가 내 결론을 강화·재확인

| 항목 | 내 종합본 | 외부 보강 |
|---|---|---|
| Vox-ATypI 폐기 | "2021 폐기" | 일자 추가(2021-03-18 이사회 결의 / 04-27 발표) + "2025-11 기준 대체안 미발표" |
| 한국어 줄바꿈 | "한글 본문 keep-all 권장" | **BudouX 공식 README로 재확인**. `word-break: auto-phrase`는 일본어용, 한국어 미적용 명시 |
| measure 단위 | "CJK는 ch 부정확→CPL" | 라틴 본문은 `max-inline-size: 66ch` 확정 → **라틴=ch, CJK=CPL 이중 저장** |

### 8.2 외부가 메우는 실제 공백 → 채택한 신규 카테고리

| 외부 기여 | 적용 위치 | 핵심 항목 |
|---|---|---|
| 타입 해부학 | Part 1 신규 카테고리 | x-height, cap-height, ascender/descender, counter/aperture, stroke-contrast. "왜 이 크기에서 읽히나"를 서체 선택에 연결 |
| 미시 타이포(OpenType) | Part 4 신규 카테고리 | `font-variant-numeric`(tabular/oldstyle-nums), slashed-zero, `font-feature-settings`. 표·수치 조판 |
| 텍스트 줄바꿈 제어 | Part 4 신규 카테고리 | `text-wrap: balance`(헤딩, ≤6줄 Chromium·≤10줄 FF, 카드 컨테이너 불균형 caveat) / `pretty`(본문 고아단어) / hyphenation |
| 폰트 로딩·CLS | Part 5 신규 카테고리 | `font-display`(swap=본문 / optional=성능 / block=아이콘만), FOUT/FOIT, `size-adjust`·`ascent-override`로 폴백 메트릭 정합 → CLS 제거(layout 사전 CLS와 직결) |
| container query units(cqi), rlh | Part 5·Part 1 보강 | 컴포넌트 단위 반응형 타이포(cqi), 베이스라인 리듬 단위(rlh) |
| 해체 타이포 계보 | Part 7 보강 | deconstructed/experimental, overlapping/layered, reverse/disrupted reading. 계보 Weingart→Cranbrook(McCoy)→Carson/Emigre. 가독성·위계를 감정·주목과 거래(WCAG 1.4.x 정면충돌) |

### 8.3 외부 프레이밍을 흡수한 신규 필드

- **`printAssumption` / `webCorrection` 페어**: 인쇄가 전제한 4가지 가정이 웹에서 거짓이 되고 CSS가 보정하는 구조를 항목에 인코딩. 외부 명시 4건:
  1. "폰트 크기는 고정 물리값" → 거짓(사용자 기본폰트·줌 무시, WCAG 1.4.4) → `rem`
  2. "baseline은 조판 단위" → 부분 거짓(브라우저에 진짜 baseline 개념 없음, `block-step`·Line Grid 명세는 미구현) → `line-height` 정수배·`rlh`·JS 보정
  3. "vw로 묶으면 반응형" → 위험한 절반의 진실(줌 불응, WCAG 1.4.4 실패) → `clamp(rem + vw)`
  4. "vertical rhythm은 무료 유지" → 거짓(이미지·blockquote가 리듬 깸) → ResizeObserver/미구현 block-step
- **`durability: 'principle' | 'trend'`**: maturity와 직교한 수명 판정. rem·measure·OpenType·text-wrap=지속 원리(명세·접근성 근거), kinetic·brutalism·technical-mono=일시 유행(트렌드 매체 근거). Part 7 항목은 대부분 trend로 격리 표기.
- **`build` 규율 강화**: 외부의 핵심 가치 "키워드 → 트리거되는 CSS 속성/토큰". 모든 항목 build는 발동되는 CSS 속성을 명기(예: measure → `max-inline-size: 66ch`).

### 8.4 스펙 보강값 (필드 직접 충전)

- **`typeScale` bestFor**: 비율→맥락 매핑. 1.2(minor third)~1.25(major third) = UI·대시보드 / 1.333(perfect fourth)~1.618(golden) = 에디토리얼·마케팅. UI에 1.618은 과대비(avoidFor).
- **`lineLength` 보강**: 단일 컬럼 45-75자(66 이상), 멀티컬럼 40-50자, **양끝맞춤 하한 38-40자**(미만 시 "white acne"). 하이프네이션: 뒤 2자 이상 남기고 앞 3자 이상 가져감, 연속 3줄 초과 금지.
- **a11y**: 기존 1.4.4·1.4.8·2.3.3에 **WCAG 1.4.12 Text Spacing** 추가(line-height≥1.5, 문단≥2em, letter-spacing≥0.12em, word-spacing≥0.16em 적용 시에도 콘텐츠 손실 없어야 → 고정 height·overflow:hidden 금지).
- **근거 강화**: 모듈러 그리드 정전 = Müller-Brockmann *Grid Systems in Graphic Design*(1981) 인용 추가.

### 8.5 충돌 해소·주의 (외부 caveat 반영)

- **Bringhurst leading "타입+2pt"**: 정설 rule-of-thumb이지 책이 못박은 상수 아님. `lineHeight`/`typeScale`은 강제 규칙 아닌 가이드로 표기(내 1차 2-1 판정과 일치). "1.5"·"120%"는 웹 적응치이지 Bringhurst 숫자 아님.
- **baseline grid 웹 한계**: `block-step`(CSS Rhythmic Sizing)·Line Grid 명세는 있으나 주요 브라우저 미구현. 진정한 baseline 스냅은 현재 JS 보정 의존. 해당 항목에 caveat 명기.
- **브라우저 지원 시점성**: `text-wrap: pretty`·`word-break: auto-phrase` 등은 엔진별 구현 차이(Chromium 선행). 프로덕션 적용 전 `@supports` 점진 향상 가드 권장.
- **트렌드 출처 신뢰도**: 외부의 트렌드 섹션 출처(Fontfabric·Creative Bloq·Figma)는 명세·연구 근거가 약함 → `durability: 'trend'` + `evidence: 'practice'`로 표기, 본문 영역 적용 금지.

### 8.6 내 종합본이 유지하는 우위 (외부에 없음 → 그대로 보존)

역할 평면 추천 척추(M3·KRDS), 한글 깊이(KLREQ 6필드·한영 페어링 수치 latinScalePct 105/80-90·baselineShift -0.05em·50CPL 査読·KRDS 17px·150%), kinetic `prefers-reduced-motion` build. 외부는 한글 페어링 수치·역할 평면이 전무하므로 이 축은 내 종합본이 단일 출처.
