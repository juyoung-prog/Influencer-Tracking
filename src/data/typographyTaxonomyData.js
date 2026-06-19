/**
 * Vibe Dictionary: Typography Taxonomy v0.1 데이터
 *
 * 7 Parts · 18 Categories · 66 Keywords
 *
 * 분류축: 원리 → 분류 → 역할 → 조판 → 반응 → 페어링 → 표현 의 스케일·성숙도 그래디언트.
 * layout 사전과 같은 철학으로 "구조 축"(Part 1·3·4·5·6)과 "태도 축"(Part 7)을 분리한다.
 *
 * 추천 척추: Part 3 역할·위계 시스템(Display/Headline/Title/Body/Label). M3·KRDS 두 프로덕션
 * 디자인 시스템이 독립 수렴한, 의도 → 토큰 → 컴포넌트 매핑이 증명된 유일 축이다.
 * Vox-ATypI 라틴 분류(Part 2)는 ATypI 가 2021 폐기한 서술 메타데이터로만 두고 추천을 구동하지 않는다.
 *
 * 목적: 유저의 기획·콘텐츠·UX 의도를 입력받아 맞는 타이포 패턴 + 컴포넌트를 도출하는 매칭 사전.
 * ai-slop 사전(음화)의 타이포 클리셰("Inter 도배", "그라디언트 텍스트")가 escape dict:'typography'
 * 로 이 사전의 양화 패턴에 연결된다.
 *
 * item type 'typography' 필드:
 * - name / koName / maturity(foundational·mainstream·emerging·experimental) / description
 * - evidence: 'standard'(W3C·MDN·Material·KRDS·査読 등 권위 정의) | 'practice'(실무 블로그 관행)
 * - durability: 'principle'(지속 원리, 명세·접근성 근거) | 'trend'(일시 유행, 트렌드 매체 근거). maturity 와 직교.
 * - aliases: 같은 개념의 다른 통용명 (의도 매칭 입력 커버리지)
 * - bestFor / avoidFor: 어떤 의도에 맞나 / 쓰면 안 되는 맥락 (매칭·오추천 방지)
 * - build: 트리거되는 CSS 속성·토큰 (키워드 → CSS 결정. 항상 명기)
 * - promptExample: AI 에 던질 프롬프트 조각 (선택)
 * - relatedComponents: 함께 구성하는 design 택소노미 컴포넌트
 * - goodWith / avoidWith: 조합 가이드 (선택)
 * 타이포 전용 스펙(선택, 항목별로 해당하는 것만):
 * - typeScale: 모듈러 스케일 비율 / sizePc·sizeMobile: 역할 티어 페어 사이징
 * - lineHeight: 'percent'|'fixed'|'space'|'min' / tracking / opticalSize(opsz) / lineLength
 * - fontStack: { style, width } 2축 / openType: feature tags / textWrap / anatomy
 * - fluidScale / a11yFloor / variableAxes / containerUnit / fontLoading
 * - koPairing: { latinFont, latinScalePct, baselineShift, strokeMatch } / styleMatch
 * - printAssumption / webCorrection: 인쇄 가정 → 웹 보정 (foundational 항목)
 * - pending: true (스펙 미확보, 후속 보강 대상)
 *
 * 출처 등급 주의: Part 1·3·4·5 의 명세·표준은 'standard', Part 7 표현·실험은 'practice'+durability 'trend'.
 * 한글 조판(Part 2·4·6)은 W3C KLREQ, 한영 페어링 수치는 한국타이포그라피학회 査読(tier A) 근거.
 */

export const TYPOGRAPHY_TAXONOMY_STATS = {
  parts: 7,
  categories: 18,
  keywords: 66,
};

export const TYPOGRAPHY_TAXONOMY = [
  // ================================================================
  // Part 1: 타이포 기초 원리 (구조)
  // ================================================================
  {
    id: 'typ-part-1',
    number: 1,
    label: '타이포 기초 원리',
    description: '도구·화면과 무관하게 적용되는 타입의 문법',
    type: 'typography',
    count: 13,
    categories: [
      {
        id: 'typ-cat-1',
        number: 1,
        name: 'Type Scale',
        subtitle: '타입 스케일',
        definition: '크기 단계를 한 비율로 묶어 조화로운 위계를 만드는 체계.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'modular-scale', name: 'Modular Scale', koName: '모듈러 스케일', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '한 비율(1.2·1.25·1.333·1.5·1.618 등)을 곱해 만든 조화로운 크기열. 폰트 크기를 그때그때 정하는 대신 공통 비율로 단계를 도출한다.', aliases: ['Type Scale Ratio', '타입 스케일 비율'], bestFor: 'UI·대시보드는 1.2~1.25(minor·major third), 에디토리얼·마케팅은 1.333~1.618', avoidFor: 'UI 에 1.618(golden) 은 과대비라 단계가 띈다', typeScale: '1.2 | 1.25 | 1.333 | 1.5 | 1.618', build: ['CSS custom properties', '--ratio', 'calc()', 'clamp()'], promptExample: '타입 스케일은 1.25 major third 기준', relatedComponents: ['Heading', 'Display', 'Paragraph'], goodWith: ['Vertical Rhythm', 'Exaggerated Hierarchy'] },
              { id: 'vertical-rhythm', name: 'Vertical Rhythm', koName: '수직 리듬', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '줄간격과 여백을 한 단위(예 8px)의 배수로 묶어 세로 흐름을 통일하는 원리. 인쇄의 베이스라인 그리드를 웹에서 근사한다.', bestFor: '롱폼 본문, 다단 텍스트의 줄 정렬', avoidFor: '이미지·blockquote 가 섞인 가변 콘텐츠에선 리듬이 깨진다', lineHeight: 'percent', build: ['CSS', 'line-height (정수배)', 'margin (8px 배수)', 'rlh'], printAssumption: 'baseline 은 조판 단위라 모든 줄이 격자에 스냅된다', webCorrection: '브라우저에 진짜 baseline 개념이 없다. block-step·Line Grid 명세는 미구현이라 line-height 정수배·rlh·JS 보정으로 근사', goodWith: ['Baseline Grid', 'Modular Scale'] },
              { id: 'baseline-grid', name: 'Baseline Grid', koName: '베이스라인 그리드', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '모든 줄의 밑선을 공통 가로 격자에 맞춰 세로 리듬을 통일하는 체계. Müller-Brockmann Grid Systems(1981) 의 정전 원리. 인쇄에선 엄격, 웹에선 수직 리듬으로 근사.', bestFor: '인쇄 수준 타이포, 다단 본문의 줄 정렬', avoidFor: '반응형 이미지·가변 높이 콘텐츠와 혼재', build: ['CSS', 'line-height (8px 배수)', 'rlh'], goodWith: ['Vertical Rhythm', 'Manuscript Grid'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-2',
        number: 2,
        name: 'Hierarchy',
        subtitle: '위계',
        definition: '크기·굵기·공간으로 시선의 순서를 만드는 원리.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'visual-hierarchy', name: 'Visual Hierarchy', koName: '시각 위계', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '크기·굵기·위치·공간의 조합으로 읽는 순서를 만드는 것. Bringhurst 의 제1원칙 "타이포그래피는 콘텐츠를 섬긴다" 가 철학적 기반. 의미 구조(h1-h6) 와 시각 스타일이 일치해야 접근성·SEO 를 함께 충족한다.', bestFor: '모든 텍스트 화면의 기본 골격', avoidFor: '의미 태그(h1-h6) 를 시각 효과로만 쓰는 것(접근성·SEO 훼손)', build: ['semantic h1-h6', 'font-size', 'font-weight', 'margin'], relatedComponents: ['Heading', 'Display', 'Caption'], goodWith: ['Modular Scale', 'Size Contrast'] },
              { id: 'size-contrast', name: 'Size Contrast', koName: '크기 대비', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '큰 제목과 작은 본문의 크기 차로 위계를 만드는 가장 직접적인 수단. 모듈러 스케일 안에서 단계를 떼어 쓴다.', bestFor: '헤드라인 강조, 정보 우선순위 표현', avoidFor: '중간 단계 없이 양극단만 두면 위계가 아니라 충돌로 읽힌다', build: ['font-size', 'modular scale steps'], goodWith: ['Weight Contrast', 'Exaggerated Hierarchy'], avoidWith: ['Extreme Hierarchy Cliché'] },
              { id: 'weight-contrast', name: 'Weight Contrast', koName: '굵기 대비', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '같은 크기에서 굵기 차이로 강조를 만드는 수단. 색·크기 변화 없이 위계를 만들 수 있어 절제된 화면에 적합.', bestFor: '미니멀 UI, 라벨·강조어, 색을 아끼는 화면', avoidFor: 'bold 남발은 강조력을 소진시킨다', build: ['font-weight', 'variable font wght axis'], goodWith: ['Size Contrast', 'Variable Fonts'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-3',
        number: 3,
        name: 'Units & Measure',
        subtitle: '단위·측정',
        definition: '크기와 줄길이를 어떤 단위로 재는가의 결정.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'rem-unit', name: 'rem (root em)', koName: 'rem 단위', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '루트 폰트 크기에 상대적인 단위. 사용자가 기본 폰트를 키우면 rem 기반 크기가 비례 확대된다. 접근성의 기본 단위.', aliases: ['root em'], bestFor: '모든 폰트 크기·spacing 의 기본 단위', avoidFor: 'px 고정(사용자 기본폰트·줌 무시로 접근성 실패)', a11yFloor: '본문 >=1rem(16px)', build: ['font-size: 1rem', 'rem 기반 토큰'], printAssumption: '폰트 크기는 고정된 물리값이다', webCorrection: 'px 고정은 사용자 기본폰트·줌을 무시해 WCAG 1.4.4(200% 확대) 를 깬다. rem 으로 사용자 설정에 비례', goodWith: ['clamp()', 'Modular Scale'] },
              { id: 'ch-unit', name: 'ch unit', koName: 'ch 단위', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: "'0' 글자의 advance 폭에 상대적인 단위. 라틴 본문 줄길이를 글자 수로 제한할 때 쓴다(max-inline-size: 66ch).", bestFor: '라틴 본문 줄길이 제한', avoidFor: 'CJK·한글 본문(전각 폭을 0 글자폭이 못 예측해 부정확)', lineLength: '라틴 66ch', build: ['max-inline-size: 66ch', 'margin-inline: auto'], goodWith: ['Line Length (Measure)'] },
              { id: 'cpl-measure', name: 'CPL (Characters Per Line)', koName: '줄당 글자 수', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: 'CJK·한글 본문 줄길이를 글자 수로 재는 단위. ch 가 전각에 부정확하므로 한글은 CPL 로 잰다.', bestFor: '한글·CJK 본문 줄길이 기준', lineLength: '한글 50자(속독 최적) / a11y 상한 40자', build: ['max-inline-size (CPL 환산 폭)'], goodWith: ['Line Length (Measure)'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-4',
        number: 4,
        name: 'Type Anatomy',
        subtitle: '타입 해부학',
        definition: '글자꼴의 물리 구조. "왜 이 크기에서 읽히나" 를 서체 선택 결정에 연결한다.',
        count: 4,
        groups: [
          {
            label: null,
            items: [
              { id: 'x-height', name: 'x-height', koName: '엑스하이트', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '소문자 본체 높이(어센더·디센더 제외). 큰 x-height 는 같은 pt 에서 더 커 보여 작은 크기에서도 읽힌다.', bestFor: '큰 x-height 서체는 소형 UI·모바일 본문에 유리', avoidFor: '큰 x-height 서체를 과대 leading 과 결합하면 느슨해진다', anatomy: { axis: 'x-height' }, build: ['font-family 선택 기준'], goodWith: ['Body Tier', 'Counter & Aperture'] },
              { id: 'cap-height', name: 'Cap height', koName: '캡하이트', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '베이스라인에서 대문자 상단까지의 높이. all-caps 헤딩의 광학 정렬과 line-height 산정 기준.', bestFor: 'all-caps 라벨·헤딩의 정렬 기준', anatomy: { axis: 'cap-height' }, build: ['line-height 산정', 'letter-spacing'], goodWith: ['Label Tier'] },
              { id: 'counter-aperture', name: 'Counter & Aperture', koName: '카운터·어퍼처', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '글자 내부의 닫힌 공간(counter) 과 열린 정도(aperture). 넓은 aperture 산세리프는 작은 크기·저해상에서 가독성이 높다.', bestFor: '넓은 aperture 서체는 캡션·폼·모바일 본문', avoidFor: '좁은 aperture 서체를 소형 본문에', anatomy: { axis: 'aperture' }, build: ['font-family 선택 기준'], goodWith: ['Body Tier'] },
              { id: 'stroke-contrast', name: 'Stroke Contrast', koName: '획 대비', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '굵은 획과 가는 획의 차이. 고대비(Didone) 는 디스플레이 전용, 저대비는 본문용이라는 크기별 서체 선택의 분기 기준.', bestFor: '크기에 따른 서체 선택 분기', avoidFor: '고대비 서체를 소형 본문에(헤어라인 소실)', anatomy: { axis: 'stroke-contrast' }, build: ['font-family 선택', 'optical sizing(opsz)'], goodWith: ['Didone Serif', 'Optical Sizing'] },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 2: 서체 분류 (서술 메타. 추천 구동 금지)
  // ================================================================
  {
    id: 'typ-part-2',
    number: 2,
    label: '서체 분류',
    description: '이 서체는 어떤 종류인가. Vox-ATypI(라틴)는 ATypI 가 2021 폐기한 서술 메타로만 둔다',
    type: 'typography',
    count: 13,
    categories: [
      {
        id: 'typ-cat-5',
        number: 5,
        name: 'Latin Classification (Vox-ATypI)',
        subtitle: '라틴 서체 분류',
        definition: 'Vox-ATypI 분류 어휘. 2021-04-27 ATypI 가 공식 폐기했고 2025-11 기준 대체안 미발표. 서체 톤 지시 키워드로만 유효하다.',
        count: 8,
        groups: [
          {
            label: null,
            items: [
              { id: 'humanist-serif', name: 'Humanist / Venetian Serif', koName: '휴머니스트 세리프', maturity: 'foundational', evidence: 'standard', durability: 'principle', voxClass: 'Humanist', description: '15세기 베네치아 기원, 낮은 획대비, 기울어진 축. 따뜻한 본문용.', bestFor: '장문 본문, 인문서, 따뜻한 에디토리얼', avoidFor: '데이터 밀집 UI, 초소형 캡션', fontStack: { style: 'serif' }, build: ['font-family (Jenson 류)'], goodWith: ['Body Tier'] },
              { id: 'garalde-serif', name: 'Garalde Serif', koName: '개럴드 세리프', maturity: 'foundational', evidence: 'standard', durability: 'principle', voxClass: 'Garalde', description: 'Garamond·Caslon 류, 16~17세기, 우아하고 중간 대비. 책·롱폼 본문.', bestFor: '책, 롱폼 본문', fontStack: { style: 'serif' }, openType: ['oldstyle-nums'], build: ['font-family (Garamond 류)', 'font-variant-numeric: oldstyle-nums'], styleMatch: '한글 명조(바탕) 와 페어링', goodWith: ['Myeongjo'] },
              { id: 'transitional-serif', name: 'Transitional Serif', koName: '트랜지셔널 세리프', maturity: 'foundational', evidence: 'standard', durability: 'principle', voxClass: 'Transitional', description: 'Baskerville 류, 수직축, 중간 대비. 본문·제목 양용.', bestFor: '신문·잡지 본문, 제목 양용', fontStack: { style: 'serif' }, build: ['font-family (Baskerville 류)'] },
              { id: 'didone-serif', name: 'Didone Serif', koName: '디돈 세리프', maturity: 'foundational', evidence: 'standard', durability: 'principle', voxClass: 'Didone', description: 'Bodoni·Didot 류, 극단적 획대비, 가는 헤어라인 세리프. 대형 디스플레이 전용.', bestFor: '패션·럭셔리 헤드라인, 대형 디스플레이', avoidFor: '본문, 저해상·소형(헤어라인 소실)', fontStack: { style: 'serif' }, opticalSize: '큰 크기 전용', build: ['font-family (Bodoni 류)', 'optical sizing'], goodWith: ['Display Tier', 'Stroke Contrast'] },
              { id: 'slab-serif', name: 'Slab Serif', koName: '슬랩 세리프', maturity: 'mainstream', evidence: 'standard', durability: 'principle', voxClass: 'Mechanistic', description: '기하학적 두꺼운 세리프. 강한 헤드라인·포스터.', bestFor: '강조 헤드라인, 포스터', avoidFor: '섬세한 본문', fontStack: { style: 'serif' }, build: ['font-family', 'font-weight (bold)'] },
              { id: 'grotesque-sans', name: 'Grotesque / Neo-Grotesque Sans', koName: '그로테스크 산세리프', maturity: 'mainstream', evidence: 'standard', durability: 'principle', voxClass: 'Lineal', description: 'Helvetica·Inter·Geist 류. UI·본문·헤드라인 전방위. SaaS 지배 서체.', aliases: ['Neo-Grotesque Sans'], bestFor: 'UI, 본문, 헤드라인 전방위', avoidFor: '모든 텍스트에 Inter 일색은 브랜드 목소리를 지운다(ai-slop "Inter 도배")', fontStack: { style: 'sans', width: 'proportional' }, build: ['font-family (Inter·Geist)'], goodWith: ['Body Tier', 'Variable Fonts'] },
              { id: 'humanist-sans', name: 'Humanist Sans', koName: '휴머니스트 산세리프', maturity: 'mainstream', evidence: 'standard', durability: 'principle', voxClass: 'Lineal', description: '손글씨 비례를 품은 산세리프(FF Meta·Myriad 류). 넓은 aperture 로 가독성 높음.', bestFor: '본문, 긴 글, 한글 고딕과 페어링', fontStack: { style: 'sans' }, styleMatch: '한글 고딕(돋움) 과 페어링', build: ['font-family (Myriad·FF Meta)'], goodWith: ['Gothic Hangul'] },
              { id: 'geometric-sans', name: 'Geometric Sans', koName: '지오메트릭 산세리프', maturity: 'mainstream', evidence: 'standard', durability: 'principle', voxClass: 'Lineal', description: '원·사각의 기하 형태 기반 산세리프(Futura·Poppins 류). 디스플레이·브랜딩.', bestFor: '브랜딩, 헤드라인', avoidFor: '장문 본문(균질 형태로 가독성 저하)', fontStack: { style: 'sans' }, build: ['font-family (Futura·Poppins)'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-6',
        number: 6,
        name: 'Hangul Classification',
        subtitle: '한글 서체 분류',
        definition: 'W3C KLREQ 부록 B 기준의 국문 서체 갈래. style(꼴) 과 width(비례폭·고정폭) 2축으로 본다.',
        count: 5,
        groups: [
          {
            label: null,
            items: [
              { id: 'myeongjo', name: 'Myeongjo (Batang)', koName: '명조 (바탕)', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '붓글씨 기원의 부리(serif) 계열 국문 서체. 획에 맺음이 있고 본문 가독성이 높다.', aliases: ['바탕', '부리 계열'], bestFor: '장문 본문, 인쇄·출판, 차분한 톤', avoidFor: '저해상 소형 UI', fontStack: { style: 'myeongjo' }, styleMatch: '라틴 Garald 계(Garamond·Sabon) 와 페어링', build: ['font-family (본명조·바탕)'], goodWith: ['Garalde Serif'] },
              { id: 'gothic-hangul', name: 'Gothic (Dotum)', koName: '고딕 (돋움)', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '맺음 없는 민부리(sans) 계열 국문 서체. UI·본문 표준. Pretendard 가 대표 본문 서체.', aliases: ['돋움', '민부리 계열'], bestFor: 'UI, 본문, 화면 전방위', fontStack: { style: 'gothic', width: 'proportional' }, styleMatch: '라틴 네오휴머니스트 산스와 페어링', build: ['font-family (Pretendard·돋움)'], goodWith: ['Humanist Sans', 'Body Tier'] },
              { id: 'son-geulssi', name: 'Handwriting', koName: '손글씨', maturity: 'mainstream', evidence: 'practice', durability: 'trend', description: '손으로 쓴 듯한 국문 서체. 장식·감성 표현용.', bestFor: '브랜딩, 감성 카피, 짧은 문구', avoidFor: '본문·UI(가독성·중립성 저하)', fontStack: { style: 'handwriting' }, build: ['font-family (손글씨)'] },
              { id: 'display-hangul', name: 'Display Hangul', koName: '제목용 국문', maturity: 'mainstream', evidence: 'practice', durability: 'trend', description: '큰 크기에서 개성을 드러내는 제목 전용 국문 서체. 본문 가독성보다 인상 우선.', bestFor: '제목, 히어로, 포스터', avoidFor: '본문·소형 텍스트', fontStack: { style: 'display' }, build: ['font-family (제목용)'], goodWith: ['Oversized Display', 'Display Tier'] },
              { id: 'proportional-fixed-hangul', name: 'Proportional vs Fixed-width Hangul', koName: '비례폭·고정폭 한글', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: 'KLREQ §4.1.1 의 한글 폭 구분. 명조/고딕 꼴 축과 직교하는 별도 분류. 고정폭은 표·코드 정렬용.', bestFor: '고정폭은 표·코드·숫자 정렬, 비례폭은 일반 본문', fontStack: { width: 'proportional | fixed' }, build: ['font-family', 'font-variant-numeric: tabular-nums'], goodWith: ['Tabular Numbers'] },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 3: 역할·위계 시스템 (구조 · 추천 척추) ★
  // ================================================================
  {
    id: 'typ-part-3',
    number: 3,
    label: '역할·위계 시스템',
    description: '이 텍스트의 역할은 무엇인가. M3·KRDS 가 수렴한 추천 척추',
    type: 'typography',
    count: 5,
    categories: [
      {
        id: 'typ-cat-7',
        number: 7,
        name: 'Role Tiers',
        subtitle: '역할 티어',
        definition: 'Display/Headline/Title/Body/Label 의 역할별 티어. 각 티어가 pc·mobile 사이즈·굵기·행간 토큰을 가진다.',
        count: 5,
        groups: [
          {
            label: null,
            items: [
              { id: 'display-tier', name: 'Display', koName: '디스플레이', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '화면에서 가장 큰 텍스트. 브랜드 스테이트먼트·히어로용. KRDS Display Large 기준 pc 60px / mobile 44px, 굵기 700, 행간 150%.', bestFor: '히어로, 브랜드 메시지, 텍스트-온리 랜딩', avoidFor: '정보 밀도 높은 화면', sizePc: '57~60px', sizeMobile: '44~45px', lineHeight: 'percent', weight: 700, fluidScale: 'clamp() 적용 대상', build: ['font-size: clamp()', 'text-wrap: balance'], relatedComponents: ['Display', 'Hero'], goodWith: ['Oversized Display', 'Fluid Typography'] },
              { id: 'headline-tier', name: 'Headline', koName: '헤드라인', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '섹션·페이지 제목. Display 보다 작지만 본문보다 큰 강조 텍스트.', bestFor: '섹션 제목, 페이지 헤딩', sizePc: '32~45px', sizeMobile: '24~28px', lineHeight: 'percent', fluidScale: 'clamp() 적용 대상', build: ['semantic h1-h2', 'font-size: clamp()', 'text-wrap: balance'], relatedComponents: ['Heading'], goodWith: ['Text-wrap Balance'] },
              { id: 'title-tier', name: 'Title', koName: '타이틀', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '카드·블록 단위의 작은 제목. 본문 위 한 단계 강조.', bestFor: '카드 제목, 리스트 헤더, 폼 섹션', sizePc: '20~24px', sizeMobile: '18~20px', lineHeight: 'percent', build: ['semantic h3-h4', 'font-weight'], relatedComponents: ['Card', 'ListItem'] },
              { id: 'body-tier', name: 'Body', koName: '본문', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '읽기 위한 본문 텍스트. 한글 베이스(Pretendard GOV) 는 광학적으로 작게 렌더되어 KRDS 가 본문 17px 를 권한다. 행간 150%.', bestFor: '문단, 설명, 읽기 콘텐츠', sizePc: '16~17px', sizeMobile: '15~16px', lineHeight: 'percent', lineLength: '라틴 66ch / 한글 50자', a11yFloor: '>=1rem(16px)', build: ['font-size: 1.0625rem(17px)', 'line-height: 1.5', 'max-inline-size'], relatedComponents: ['Paragraph'], goodWith: ['Line Length (Measure)', 'Text-wrap Pretty'] },
              { id: 'label-tier', name: 'Label', koName: '라벨', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '버튼·태그·캡션 등 UI 요소의 짧은 텍스트. 가장 작은 역할 티어.', bestFor: '버튼, 태그, 캡션, 폼 라벨', avoidFor: 'text.disabled 토큰을 본문 보조 텍스트에 쓰는 것(저대비)', sizePc: '12~14px', sizeMobile: '12~13px', lineHeight: 'percent', build: ['font-size', 'font-weight (medium)'], relatedComponents: ['Button', 'Chip', 'Caption'] },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 4: 조판 규칙 (구조)
  // ================================================================
  {
    id: 'typ-part-4',
    number: 4,
    label: '조판 규칙',
    description: '텍스트를 어떻게 짜는가. 줄길이·행간·자간·한글 조판·미시 타이포',
    type: 'typography',
    count: 14,
    categories: [
      {
        id: 'typ-cat-8',
        number: 8,
        name: 'Measure & Leading',
        subtitle: '줄길이·행간',
        definition: '한 줄에 몇 글자, 줄 사이를 얼마나 띄우는가. Bringhurst 정전 수치.',
        count: 4,
        groups: [
          {
            label: null,
            items: [
              { id: 'line-length-measure', name: 'Line Length (Measure)', koName: '줄길이 (measure)', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '한 줄의 글자 수. 단일 컬럼 45~75자(66 이상적), 멀티컬럼 40~50자. 한글은 50자 속독 최적, a11y 상한 40자(CJK = 비CJK 의 절반).', aliases: ['measure', '한 줄 글자 수'], bestFor: '본문 블록', avoidFor: '풀폭 텍스트, 대시보드', lineLength: '라틴 45-75ch(66) / 한글 40-50자', build: ['max-inline-size: 66ch (라틴)', 'CPL 환산 폭 (한글)', 'margin-inline: auto'], goodWith: ['ch unit', 'CPL'] },
              { id: 'leading', name: 'Leading (line-height)', koName: '행간 (leading)', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '베이스라인 간 거리. 웹은 unitless 권장, 본문 1.4~1.6(한글 150%). 황금비 1.618 은 가이드일 뿐 x-height·measure 로 조정한다.', bestFor: '본문 1.5 안팎, 헤드라인은 더 타이트', avoidFor: '"타입+2pt"·"1.5" 를 못박힌 상수로 적용(Bringhurst 도 가변으로 다룸)', lineHeight: 'percent', build: ['line-height: 1.5 (unitless)'], goodWith: ['Vertical Rhythm'] },
              { id: 'justified-min', name: 'Justified Minimum', koName: '양끝맞춤 하한', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: '양끝맞춤(justify) 시 줄당 38~40자 미만이면 단어 사이 흰 구멍("white acne") 이 생긴다는 Bringhurst 하한.', bestFor: '양끝맞춤 본문은 줄당 38자 이상 확보', avoidFor: '좁은 컬럼에서 justify(흰 구멍)', build: ['text-align: justify (38ch+ 일 때만)'], goodWith: ['Hyphenation'] },
              { id: 'hyphenation', name: 'Hyphenation', koName: '하이프네이션', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '긴 단어를 줄 끝에서 나누는 규칙. Bringhurst: 뒤 2자 이상 남기고 앞 3자 이상 가져가며, 연속 3줄 초과 금지.', bestFor: '양끝맞춤 본문, 좁은 컬럼 라틴 텍스트', avoidFor: '한글(음절 단위라 하이프네이션 불필요)', build: ['hyphens: auto', 'lang 속성'], goodWith: ['Justified Minimum'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-9',
        number: 9,
        name: 'Tracking & Hangul Setting',
        subtitle: '자간·한글 조판',
        definition: 'W3C KLREQ 정규 규칙. 한글 본문 자간 기본은 0.',
        count: 4,
        groups: [
          {
            label: null,
            items: [
              { id: 'tracking', name: 'Tracking (letter-spacing)', koName: '자간 (tracking)', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: 'KLREQ §7.3.1: 한글·한자·가나 본문 자간 기본값은 0. 음수 자간은 디스플레이 한정 예외, 넓혀짜기는 양끝맞춤 보조.', bestFor: '본문 0(기본), 디스플레이는 tight, 양끝맞춤은 loose', avoidFor: '본문에 음수 자간 남용(표준은 0)', tracking: '0(기본) | tight | loose', build: ['letter-spacing: normal (본문)'], goodWith: ['Cap Height'] },
              { id: 'jangpyeong', name: 'Jangpyeong (width scaling)', koName: '장평', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '글자의 가로 폭 비율 조절. 제목에서 인상을 바꾸거나 좁은 폭에 맞출 때 쓴다.', bestFor: '제목 인상 조절, 폭 맞춤', avoidFor: '본문 장평 변형(가독성 저하)', build: ['font-stretch', 'variable font wdth axis', 'transform: scaleX (지양)'], goodWith: ['Variable Fonts'] },
              { id: 'line-break-keepall', name: 'word-break: keep-all', koName: '줄바꿈 (keep-all)', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: 'KLREQ §7.1: 한글 본문은 단어 단위로 줄바꿈(keep-all). BudouX 공식 README 도 한국어는 keep-all 을 권한다. auto-phrase 는 일본어용이라 한국어 미적용.', bestFor: '한국어 헤딩·짧은 텍스트', avoidFor: '좁은 폭의 긴 단어(오버플로 가능, 소형 화면 해제 고려)', build: [':lang(ko) { word-break: keep-all }', '@media 로 좁은 폭 해제'], goodWith: ['Text-wrap Balance'] },
              { id: 'paragraph-indent', name: 'Paragraph Indent', koName: '들여짜기', maturity: 'foundational', evidence: 'standard', durability: 'principle', description: 'KLREQ §7.2.3: 단락 첫줄 들여짜기(전각 1자 관습) 또는 내어짜기. 단락 구분 수단.', bestFor: '인쇄·출판형 본문의 단락 구분', avoidFor: '단락 간 여백(margin) 과 들여짜기 중복 적용', build: ['text-indent: 1em'], goodWith: ['Myeongjo'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-10',
        number: 10,
        name: 'Micro-typography (OpenType)',
        subtitle: '미시 타이포',
        definition: 'OpenType 기능으로 숫자·글자를 정교하게 제어한다.',
        count: 4,
        groups: [
          {
            label: null,
            items: [
              { id: 'tabular-nums', name: 'Tabular Numbers', koName: '고정폭 숫자', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '모든 숫자 폭을 같게 맞추는 OpenType 기능(tnum). 표·가격·데이터의 세로 정렬에 필수.', bestFor: '표, 가격, 대시보드 수치, 카운터', avoidFor: '본문 인라인 숫자(올드스타일이 더 자연스러움)', openType: ['tabular-nums'], build: ['font-variant-numeric: tabular-nums'], relatedComponents: ['Table', 'DataGrid'], goodWith: ['Fixed-width Hangul'] },
              { id: 'oldstyle-nums', name: 'Oldstyle Numbers', koName: '올드스타일 숫자', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '어센더·디센더를 가진 본문용 숫자(onum). 본문 흐름에 자연스럽게 섞인다.', bestFor: '본문 인라인 숫자, 에디토리얼', avoidFor: '표·정렬이 필요한 수치', openType: ['oldstyle-nums'], build: ['font-variant-numeric: oldstyle-nums'], goodWith: ['Garalde Serif'] },
              { id: 'slashed-zero', name: 'Slashed Zero', koName: '슬래시 제로', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '0 과 O 를 구분하는 빗금 친 0(zero). 코드·일련번호·데이터에서 혼동 방지.', bestFor: '코드, 일련번호, 데이터', openType: ['slashed-zero'], build: ['font-variant-numeric: slashed-zero'], relatedComponents: ['CodeBlock'] },
              { id: 'font-feature-settings', name: 'font-feature-settings', koName: '폰트 피처 설정', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '리거처·스몰캡스·스타일 세트 등 저수준 OpenType 기능 제어. 가능하면 표준 font-variant-* 속성을 우선한다.', bestFor: '서체 고유 기능(리거처·스몰캡스) 활성화', avoidFor: '표준 font-variant-* 로 되는 것을 저수준으로 처리', build: ['font-feature-settings', 'font-variant-* (우선)'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-11',
        number: 11,
        name: 'Line Wrapping',
        subtitle: '줄바꿈 품질',
        definition: 'CSS 가 줄바꿈 위치를 다듬어 미관·가독성을 높인다.',
        count: 2,
        groups: [
          {
            label: null,
            items: [
              { id: 'text-wrap-balance', name: 'text-wrap: balance', koName: '균형 줄바꿈', maturity: 'emerging', evidence: 'standard', durability: 'principle', description: '헤딩 줄들을 균등 폭으로 분배. 줄 수를 늘리지 않는 최소 폭을 이진 탐색한다. Chromium ≤6줄·Firefox ≤10줄 초과 시 일반 wrap.', bestFor: '헤딩, 카드 타이틀, CTA, 짧은 텍스트', avoidFor: '긴 본문(성능), 카드처럼 경계 있는 컨테이너(우측 여백 불균형)', textWrap: 'balance', build: ['text-wrap: balance', '@supports 가드'], relatedComponents: ['Heading'], goodWith: ['Headline Tier'] },
              { id: 'text-wrap-pretty', name: 'text-wrap: pretty', koName: '고아단어 방지', maturity: 'emerging', evidence: 'standard', durability: 'principle', description: '본문 마지막 몇 줄을 조정해 고아 단어(orphan) 를 막는다. 전체 재균형이 아니라 끝부분만 다듬는 느린 알고리즘.', bestFor: '블로그 본문, 아티클, 긴 텍스트', avoidFor: '전체 줄 재균형을 기대하는 경우', textWrap: 'pretty', build: ['text-wrap: pretty', '@supports 가드'], relatedComponents: ['Paragraph'], goodWith: ['Body Tier'] },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 5: 반응·유동 거동 (구조)
  // ================================================================
  {
    id: 'typ-part-5',
    number: 5,
    label: '반응·유동 거동',
    description: '뷰포트·컨테이너에 따라 타입이 어떻게 변하는가',
    type: 'typography',
    count: 7,
    categories: [
      {
        id: 'typ-cat-12',
        number: 12,
        name: 'Fluid & Variable',
        subtitle: '유동·가변',
        definition: '뷰포트와 폰트 축에 따라 크기·형태가 연속 변한다.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'fluid-clamp', name: 'Fluid Typography (clamp)', koName: '유동 타이포 (clamp)', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: 'clamp(min, vw+rem, max) 로 브레이크포인트 없이 크기를 연속 조절. 큰/강조 텍스트용이고 본문에는 부적합(범위가 몇 px 뿐).', bestFor: 'Display·Headline 등 큰 텍스트', avoidFor: '본문(범위 작음), 순수 vw(줌 불응)', fluidScale: 'clamp(min_rem, calc(rem+vw), max_rem)', a11yFloor: 'rem 혼합 필수, 본문 >=1rem', build: ['font-size: clamp(1rem, calc(0.8rem + 1vw), 1.5rem)'], printAssumption: 'vw 로 묶으면 반응형이다', webCorrection: 'vw 단독은 200% 줌에 불응해 WCAG 1.4.4 실패. clamp 안에 rem 을 섞어 줌 대응', goodWith: ['Display Tier', 'rem'] },
              { id: 'variable-fonts', name: 'Variable Fonts', koName: '가변 폰트', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '한 파일에 weight·width·opsz 등 축을 담은 폰트. 굵기를 이산 값이 아니라 연속 범위로 다룬다. 2018 이후 브라우저 지원.', bestFor: '여러 굵기 사용, 반응형, 키네틱, 파일 절감', avoidFor: '단일 굵기만 필요할 때(과투자)', variableAxes: 'wght | wdth | opsz', build: ['font-variation-settings', 'font-weight (가능하면 표준 속성)', 'font-optical-sizing'], goodWith: ['Weight Contrast', 'Optical Sizing'] },
              { id: 'optical-sizing', name: 'Optical Sizing (opsz)', koName: '광학 사이징 (opsz)', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '크기에 맞춰 글자꼴을 보정하는 가변 축. 작은 글자는 굵은 획·큰 x-height, 큰 글자는 섬세·고대비. 폰트에 축이 있으면 기본 활성.', bestFor: '본문~디스플레이를 한 서체로 폭넓게 쓸 때', opticalSize: 'opsz auto', variableAxes: 'opsz', build: ['font-optical-sizing: auto', 'font-variation-settings: "opsz"'], goodWith: ['Stroke Contrast', 'Variable Fonts'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-13',
        number: 13,
        name: 'Container Responsive',
        subtitle: '컨테이너 반응형',
        definition: '뷰포트가 아니라 부모 컨테이너 크기에 반응한다.',
        count: 1,
        groups: [
          {
            label: null,
            items: [
              { id: 'container-query-units', name: 'Container Query Units (cqi)', koName: '컨테이너 쿼리 단위', maturity: 'emerging', evidence: 'standard', durability: 'principle', description: '컨테이너 inline 크기의 1%(cqi). 카드·사이드바·대시보드 등 컴포넌트 단위 반응형 타이포. 2023 브라우저 지원.', bestFor: '카드·사이드바 등 컴포넌트 단위 반응형', avoidFor: '컨테이너가 자기 자신을 쿼리하는 경우', containerUnit: 'cqi', build: ['container-type: inline-size', 'font-size: clamp(1rem, 5cqi, 2rem)'], goodWith: ['Fluid Typography (clamp)'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-14',
        number: 14,
        name: 'Font Loading & CLS',
        subtitle: '폰트 로딩',
        definition: '폰트 로딩 전략이 가시성과 레이아웃 시프트를 좌우한다.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'font-display', name: 'font-display', koName: '폰트 디스플레이', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '폰트 로딩 중 렌더 전략. swap(FOUT)=본문 가시성, optional=성능 우선, block(FOIT)=아이콘 폰트 한정.', bestFor: 'swap=본문, optional=성능 우선, block=아이콘 폰트', avoidFor: 'block 을 본문에(LCP 악화)', fontLoading: 'swap | optional | block', build: ['@font-face { font-display: swap }'], goodWith: ['Fallback Metrics (CLS)'] },
              { id: 'fout-foit', name: 'FOUT / FOIT', koName: '폰트 깜빡임', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '무스타일 텍스트 깜빡임(FOUT, swap) / 비가시 텍스트 깜빡임(FOIT, block). 로딩 전략의 결과로 나타나는 현상.', bestFor: '로딩 전략 선택 시 트레이드오프 이해', build: ['font-display 선택의 결과'], goodWith: ['font-display', 'Fallback Metrics (CLS)'] },
              { id: 'fallback-metrics', name: 'Fallback Metrics (CLS)', koName: '폴백 메트릭 정합', maturity: 'emerging', evidence: 'standard', durability: 'principle', description: 'size-adjust·ascent-override 로 폴백 폰트 메트릭을 웹폰트에 맞춰 레이아웃 시프트(CLS) 를 제거한다.', bestFor: '웹폰트 교체 시 CLS 제거', fontLoading: 'size-adjust | ascent-override', build: ['@font-face { size-adjust; ascent-override }'], relatedComponents: ['Paragraph'], goodWith: ['font-display'] },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 6: 페어링·조합 (구조)
  // ================================================================
  {
    id: 'typ-part-6',
    number: 6,
    label: '페어링·조합',
    description: '서체를 무엇과 짝짓는가. 한영 혼용과 서체 짝짓기',
    type: 'typography',
    count: 7,
    categories: [
      {
        id: 'typ-cat-15',
        number: 15,
        name: 'Korean-Latin Pairing',
        subtitle: '한영 페어링',
        definition: 'KLREQ §7.3.2 섞어짜기. 한글과 라틴을 한 문장에 자연스럽게 섞는 보정.',
        count: 4,
        groups: [
          {
            label: null,
            items: [
              { id: 'hangul-latin-pairing', name: 'Hangul-Latin Mixed Setting', koName: '한영 섞어짜기', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '한글 본문에 라틴·숫자를 섞을 때 크기·기준선·굵기를 시각 보정하는 조판. 합성글꼴(Composite Font) 이 멘탈모델 원형.', aliases: ['섞어짜기', 'Composite Font'], bestFor: '한글 본문에 영문·숫자가 섞이는 모든 화면', koPairing: { latinScalePct: 105, baselineShift: 'top: -0.05em', strokeMatch: '라틴이 약간 두꺼우면 굵기 맞춤' }, build: ['per-span 래핑', 'font-family 분리'], goodWith: ['Latin Scale Adjust', 'Baseline Shift Pairing'] },
              { id: 'latin-scale-adjust', name: 'Latin Scale Adjustment', koName: '라틴 크기 보정', maturity: 'mainstream', evidence: 'practice', durability: 'principle', description: '같은 pt 에서 라틴이 한글보다 작아 보이는 문제 보정. Adobe 는 em-box 기준 약 105%, 타입코드는 cap-height 기준 80~90%. 측정 기준이 다른 같은 결론.', bestFor: '한영 혼용 본문의 라틴 크기 맞춤', koPairing: { latinScalePct: 105, basis: 'em-box (Adobe) / cap-height 80-90 (타입코드)' }, build: ['라틴 span font-size 조정'], goodWith: ['Hangul-Latin Mixed Setting'] },
              { id: 'baseline-shift-pairing', name: 'Baseline Shift (pairing)', koName: '기준선 보정', maturity: 'mainstream', evidence: 'standard', durability: 'principle', description: '한글은 활자틀 시각중심, 라틴은 baseline 기준이라 라틴이 처져 보인다. multilingual.js(한국타이포그라피학회 査読) 는 라틴 span 에 top -0.05em, letter-spacing -0.02em 적용.', bestFor: '한영 혼용 시 라틴·숫자의 세로 정렬', koPairing: { baselineShift: 'top: -0.05em', letterSpacing: '-0.02em' }, build: ['position: relative; top: -0.05em', 'letter-spacing: -0.02em'], goodWith: ['Hangul-Latin Mixed Setting'] },
              { id: 'stroke-weight-match', name: 'Stroke Weight Match', koName: '획 굵기 맞춤', maturity: 'mainstream', evidence: 'practice', durability: 'principle', description: '라틴이 한글보다 약간 두꺼운 경우가 많아 인위적으로 굵기를 맞춰 판면 질감을 균일화한다. 정량 수치 없는 시각 판단.', bestFor: '한영 혼용 판면의 질감 통일', avoidFor: '단일 정량값 기대(폰트마다 다름)', koPairing: { strokeMatch: '시각 판단' }, build: ['라틴 span font-weight 조정'], pending: true },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-16',
        number: 16,
        name: 'Style Pairing',
        subtitle: '서체 짝짓기',
        definition: '둘 이상 서체를 대비로 묶어 위계를 만든다.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'serif-sans-pairing', name: 'Serif + Sans Pairing', koName: '세리프·산스 페어링', maturity: 'mainstream', evidence: 'practice', durability: 'principle', description: '세리프 제목과 산세리프 본문(또는 반대) 의 양식 대비. 명조→Garald 계, 고딕→네오휴머니스트 산스가 정석 페어.', bestFor: '에디토리얼, 위계가 분명한 콘텐츠', styleMatch: '명조→Garald, 고딕→네오휴머니스트 산스', build: ['2개 font-family 토큰'], goodWith: ['Style Match'] },
              { id: 'neo-serif-mono-pairing', name: 'Neo-serif + Monospace Pairing', koName: '네오세리프·모노 페어링', maturity: 'emerging', evidence: 'practice', durability: 'trend', description: '우아한 세리프 헤딩에 데이터·메타용 모노스페이스를 더하는 조합. 모노에 tabular-nums 를 함께 쓴다.', bestFor: '테크·데이터 제품의 에디토리얼 톤', avoidFor: '본문 가독성이 최우선인 장문', openType: ['tabular-nums'], build: ['2개 font-family', 'font-variant-numeric: tabular-nums'], goodWith: ['Tabular Numbers'] },
              { id: 'style-match', name: 'Style Match', koName: '양식 매칭', maturity: 'mainstream', evidence: 'practice', durability: 'principle', description: '페어링할 두 서체의 양식·시대·획 특성을 맞추는 원칙. 숫자는 항상 라틴 설정을 따른다.', bestFor: '서체 페어링의 일관성 확보', build: ['font-family 선택 원칙'], goodWith: ['Serif + Sans Pairing'] },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 7: 표현·실험 타이포 (태도 축)
  // ================================================================
  {
    id: 'typ-part-7',
    number: 7,
    label: '표현·실험 타이포',
    description: '어떤 태도를 입히는가. 정의 가능한 표현 메커니즘만 항목화한다',
    type: 'typography',
    count: 7,
    categories: [
      {
        id: 'typ-cat-17',
        number: 17,
        name: 'Expressive Type',
        subtitle: '표현 타이포',
        definition: '주목·정체성을 위해 가독성 규범을 의도적으로 변형한다. 본문 영역 적용 금지.',
        count: 4,
        groups: [
          {
            label: null,
            items: [
              { id: 'kinetic-typography', name: 'Kinetic Typography', koName: '키네틱 타이포그래피', maturity: 'emerging', evidence: 'practice', durability: 'trend', description: '움직이는 텍스트. Brownie 의 temporal typography(motion: scrolling·dynamic layout / fluid) 가 학술 분류. GSAP 무료화로 진입장벽 하락.', bestFor: '히어로, 인터랙티브 브랜딩, 스크롤 스토리텔링', avoidFor: '전정장애·모션 민감 사용자, 본문 가독성 영역', build: ['@media (prefers-reduced-motion: reduce) 리셋', 'matchMedia', '@keyframes | Web Animations API | GSAP'], a11yFloor: 'WCAG 2.3.3(상호작용 모션) / 2.2.2(자동재생) 구분, prefers-reduced-motion 필수', relatedComponents: ['Hero', 'Display'], goodWith: ['Variable Fonts', 'Oversized Display'] },
              { id: 'oversized-display', name: 'Oversized Display', koName: '오버사이즈 디스플레이', maturity: 'mainstream', evidence: 'practice', durability: 'trend', description: '48~120px+ 대형 헤드라인. 텍스트가 히어로 이미지를 대체. opsz 축·fluid clamp 와 연결.', bestFor: '히어로, 브랜드 스테이트먼트, 텍스트-온리 랜딩', avoidFor: '본문, 정보 밀도 화면', fluidScale: 'clamp() 상한 크게', build: ['font-size: clamp()', 'text-wrap: balance', 'optical sizing'], relatedComponents: ['Display'], goodWith: ['Display Tier', 'Fluid Typography (clamp)'] },
              { id: 'brutalist-typography', name: 'Brutalist Typography', koName: '브루탈리스트 타이포', maturity: 'emerging', evidence: 'practice', durability: 'trend', description: '날것의 거친 타입, 시스템 폰트, 고대비, 0px 기하. 의도된 반세련으로 차별화(UMich Dialectic 査読 분석 대상).', bestFor: '아트디렉션 강한 랜딩, 캠페인, 차별화', avoidFor: '본문·폼·내비게이션, 접근성 필수 페이지', build: ['system-ui font', 'border-radius: 0', 'font-weight 대비'], goodWith: ['Anti-design Typography'], avoidWith: ['Body Tier'] },
              { id: 'anti-design-typography', name: 'Anti-design Typography', koName: '안티디자인 타이포', maturity: 'experimental', evidence: 'practice', durability: 'trend', description: '의도적 미숙함·불완전성을 연출하는 타입. 브루탈리즘이 거친 진정성이라면 이건 "미숙성 위장" 으로 의도가 다르다.', bestFor: '인디 브랜드, 패션, 카운터컬처 톤', avoidFor: '신뢰·명료성이 중요한 제품, 본문', build: ['불규칙 letter-spacing', 'transform: rotate', '의도적 misalign'], goodWith: ['Brutalist Typography'], avoidWith: ['Body Tier'] },
            ],
          },
        ],
      },
      {
        id: 'typ-cat-18',
        number: 18,
        name: 'Deconstruction',
        subtitle: '해체',
        definition: '위계·가독성·그리드를 의도적으로 전복해 감정·주목과 거래한다. 웹 접근성(WCAG 1.4.x) 과 정면충돌.',
        count: 3,
        groups: [
          {
            label: null,
            items: [
              { id: 'deconstructed-type', name: 'Deconstructed / Experimental Type', koName: '해체 타이포', maturity: 'experimental', evidence: 'practice', durability: 'trend', description: '위계·정렬·가독성을 의도적으로 파괴. 계보는 Weingart→Cranbrook(McCoy)→Carson/Emigre. 가독성을 감정·주목과 맞바꾼다.', bestFor: '아트디렉션 강한 랜딩, 전시, 포스터, 단발 캠페인', avoidFor: '본문·UI·접근성 필수 페이지, 다국어', build: ['position: absolute', '음수 letter-spacing/margin', 'transform: rotate', 'z-index 레이어'], avoidWith: ['Body Tier', 'Line Length (Measure)'] },
              { id: 'overlapping-layered', name: 'Overlapping / Layered Type', koName: '중첩 레이어 타이포', maturity: 'experimental', evidence: 'practice', durability: 'trend', description: '텍스트와 이미지·텍스트를 겹쳐 깊이를 만든다. 히어로·표지용.', bestFor: '히어로, 표지, 아트워크', avoidFor: '대비비(WCAG 1.4.3) 확보가 어려운 경우', build: ['mix-blend-mode', 'z-index', 'position'], goodWith: ['Deconstructed / Experimental Type'] },
              { id: 'reverse-disrupted-reading', name: 'Reverse / Disrupted Reading', koName: '역방향·비선형 읽기', maturity: 'experimental', evidence: 'practice', durability: 'trend', description: '읽기 순서를 역방향·비선형으로 흩뜨린다. 시각 순서와 DOM 순서가 어긋날 위험.', bestFor: '인쇄·정적 아트워크', avoidFor: '스크린리더 논리 순서가 필요한 모든 화면', build: ['시각 순서 != DOM 순서 (위험)'], avoidWith: ['Body Tier'] },
            ],
          },
        ],
      },
    ],
  },
];
