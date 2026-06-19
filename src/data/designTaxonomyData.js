/**
 * Vibe Dictionary: Design Taxonomy v0.5 데이터
 *
 * 4 Parts · 20 Categories · 207+ Keywords
 */

export const DESIGN_TAXONOMY_STATS = {
  parts: 4,
  categories: 20,
  keywords: 209,
};

/**
 * Part type에 따라 렌더링 방식이 달라진다:
 * - 'components': 기본 컴포넌트 (이름 · 설명 · 출처)
 * - 'interactive': 인터랙티브 패턴 (이름 · 설명 · 의존성 · 사용 빈도)
 * - 'movements': 디자인 사조 (이름 · 핵심 느낌 · 사용 맥락)
 * - 'reference': 레이아웃/타이포/컬러 레퍼런스 (다양한 구조)
 */
export const DESIGN_TAXONOMY = [
  // ================================================================
  // Part 1: 기본 컴포넌트
  // ================================================================
  {
    id: 'part-1',
    number: 1,
    label: '기본 컴포넌트',
    description: '정적 UI 구성 요소',
    type: 'components',
    count: 123,
    categories: [
      {
        id: 'cat-1',
        number: 1,
        name: 'Typography',
        subtitle: '텍스트 표현과 장식',
        definition: '텍스트의 의미적 표현과 시각적 장식을 위한 패턴',
        count: 9,
        groups: [
          {
            label: null,
            items: [
              { name: 'Heading', description: '제목 계층 (h1-h6)', source: '공통' },
              { name: 'Paragraph', description: '본문 텍스트', source: '공통' },
              { name: 'Label', description: '폼/UI 요소 라벨', source: '공통' },
              { name: 'Link', description: '텍스트 링크', source: '공통' },
              { name: 'Caption', description: '보조 설명 텍스트', source: '공통' },
              { name: 'Blockquote', description: '인용문', source: 'Shadcn, Ant' },
              { name: 'Code', description: '코드 블록/인라인', source: 'Shadcn' },
              { name: 'Kbd', description: '키보드 단축키 표시', source: 'Shadcn' },
              { name: 'List', description: '순서/비순서 목록', source: '공통' },
            ],
          },
        ],
      },
      {
        id: 'cat-2',
        number: 2,
        name: 'Container',
        subtitle: '시각적 경계와 그룹핑의 기본 단위',
        definition: '다른 요소를 담는 시각적 경계의 기본 단위. 독립적 의미 없이 구조적 역할 수행',
        count: 6,
        groups: [
          {
            label: null,
            items: [
              { name: 'Box', description: '기본 래퍼 컨테이너', source: '공통' },
              { name: 'Separator / Divider', description: '구분선', source: 'Shadcn, MD3, Ant' },
              { name: 'Collapse / Accordion', description: '접히는 컨테이너', source: 'Shadcn, Ant' },
              { name: 'ScrollArea', description: '스크롤 가능 영역', source: 'Shadcn' },
              { name: 'AspectRatio', description: '비율 고정 컨테이너', source: 'Shadcn' },
              { name: 'Space', description: '간격 조절 컨테이너', source: 'Ant' },
            ],
          },
        ],
      },
      {
        id: 'cat-3',
        number: 3,
        name: 'Card',
        subtitle: '독립적 정보 단위의 표준 패턴',
        definition: '자기완결적 정보 단위를 그룹핑하는 패턴. 단독으로 의미 전달 가능',
        count: 13,
        groups: [
          {
            label: '기본 컴포넌트',
            items: [
              { name: 'BaseCard', description: '기본 카드 구조', source: '공통' },
              { name: 'ElevatedCard', description: '그림자 강조 카드', source: 'MD3' },
              { name: 'OutlinedCard', description: '테두리 강조 카드', source: 'MD3' },
              { name: 'FilledCard', description: '배경색 강조 카드', source: 'MD3' },
              { name: 'MediaCard', description: '미디어 포함 카드', source: '공통' },
              { name: 'ActionCard', description: '액션 버튼 포함 카드', source: 'Ant' },
            ],
          },
          {
            label: '구조적 확장',
            items: [
              { name: 'BentoCard', description: '벤토 그리드용 가변 크기 카드', source: 'Common' },
              { name: 'TallCard', description: '9:16 세로형 (모바일/소셜 최적화)', source: 'Common' },
              { name: 'StackedCard', description: '레이어드 카드 덱', source: 'Unusual' },
              { name: 'SwipeableCard', description: '틴더 스타일 스와이프 카드', source: 'Common' },
              { name: 'ExpandingCard', description: '클릭시 확장되는 카드', source: 'Common' },
              { name: 'FramelessCard', description: '경계선 없는 콘텐츠 카드', source: 'Unusual' },
              { name: 'SplitCard', description: '내부 분할 카드', source: 'Common' },
            ],
          },
        ],
      },
      {
        id: 'cat-4',
        number: 4,
        name: 'Media',
        subtitle: '이미지, 비디오, 오디오 표시 및 관리',
        definition: '미디어 콘텐츠의 표시와 인터랙션 관리',
        count: 8,
        groups: [
          {
            label: '기본 컴포넌트',
            items: [
              { name: 'Image', description: '이미지 표시 (lazy load, fallback)', source: 'Ant' },
              { name: 'Avatar', description: '프로필 이미지', source: 'Shadcn, Ant' },
              { name: 'Carousel', description: '미디어 슬라이더', source: 'Shadcn, MD3, Ant' },
              { name: 'Gallery', description: '이미지 갤러리/그리드', source: '-' },
              { name: 'Lightbox', description: '전체화면 미디어 뷰어', source: '-' },
              { name: 'QRCode', description: 'QR 코드 생성', source: 'Ant' },
            ],
          },
          {
            label: '확장',
            items: [
              { name: 'VideoBackground', description: '섹션 배경 비디오', source: 'Common' },
              { name: '3DObjectEmbed', description: '3D 모델 임베드', source: 'Unusual' },
            ],
          },
        ],
      },
      {
        id: 'cat-5',
        number: 5,
        name: 'Data Display',
        subtitle: '구조화된 데이터의 시각화',
        definition: '반복적/비교적 데이터를 보여주는 패턴',
        count: 13,
        groups: [
          {
            label: null,
            items: [
              { name: 'Table', description: '데이터 테이블', source: 'Shadcn, Ant' },
              { name: 'DataTable', description: '정렬/필터/페이지네이션 테이블', source: 'Shadcn' },
              { name: 'List', description: '데이터 목록', source: 'MD3, Ant' },
              { name: 'Tree', description: '트리 구조', source: 'Ant' },
              { name: 'Timeline', description: '시간순 이벤트', source: 'Ant' },
              { name: 'Statistic', description: '통계 수치 표시', source: 'Ant' },
              { name: 'Descriptions', description: '키-값 설명 목록', source: 'Ant' },
              { name: 'Badge', description: '상태/수량 표시', source: 'Shadcn, MD3, Ant' },
              { name: 'Tag', description: '라벨/카테고리 표시', source: 'Ant' },
              { name: 'Progress', description: '진행률 표시', source: 'Shadcn, MD3, Ant' },
              { name: 'Calendar', description: '캘린더/날짜 표시', source: 'Ant' },
              { name: 'Empty', description: '빈 상태 표시', source: 'Shadcn, Ant' },
              { name: 'Skeleton', description: '로딩 스켈레톤', source: 'Shadcn, Ant' },
            ],
          },
        ],
      },
      {
        id: 'cat-6',
        number: 6,
        name: 'In-page Navigation',
        subtitle: '페이지 내 콘텐츠 탐색',
        definition: '같은 페이지 내 다른 콘텐츠를 연결하는 패턴. 페이지/라우트 전환 없이 동일 페이지 내 이동',
        count: 6,
        groups: [
          {
            label: null,
            items: [
              { name: 'Tabs', description: '탭 전환', source: 'Shadcn, MD3, Ant' },
              { name: 'Anchor', description: '목차/앵커 링크', source: 'Ant' },
              { name: 'Steps', description: '단계 표시', source: 'Ant' },
              { name: 'Pagination', description: '페이지네이션', source: 'Shadcn, Ant' },
              { name: 'Breadcrumb', description: '경로 표시', source: 'Shadcn, Ant' },
              { name: 'SegmentedControl', description: '세그먼트 선택', source: 'MD3' },
            ],
          },
        ],
      },
      {
        id: 'cat-7',
        number: 7,
        name: 'Input & Control',
        subtitle: '사용자 입력 수집 및 조작',
        definition: '사용자로부터 값을 받는 패턴',
        count: 24,
        groups: [
          {
            label: null,
            items: [
              { name: 'Button', description: '기본 버튼', source: '공통' },
              { name: 'IconButton', description: '아이콘 버튼', source: 'MD3' },
              { name: 'FAB', description: '플로팅 액션 버튼', source: 'MD3, Ant' },
              { name: 'Input', description: '텍스트 입력', source: '공통' },
              { name: 'Textarea', description: '멀티라인 입력', source: '공통' },
              { name: 'Select', description: '드롭다운 선택', source: '공통' },
              { name: 'Combobox', description: '검색 가능 선택', source: 'Shadcn' },
              { name: 'Checkbox', description: '체크박스', source: '공통' },
              { name: 'Radio', description: '라디오 버튼', source: '공통' },
              { name: 'Switch', description: '토글 스위치', source: '공통' },
              { name: 'Slider', description: '슬라이더', source: '공통' },
              { name: 'DatePicker', description: '날짜 선택', source: 'Shadcn, MD3, Ant' },
              { name: 'TimePicker', description: '시간 선택', source: 'MD3, Ant' },
              { name: 'ColorPicker', description: '색상 선택', source: 'Ant' },
              { name: 'Upload', description: '파일 업로드', source: 'Ant' },
              { name: 'InputOTP', description: 'OTP 입력', source: 'Shadcn' },
              { name: 'InputNumber', description: '숫자 입력', source: 'Ant' },
              { name: 'Rate', description: '별점 입력', source: 'Ant' },
              { name: 'Transfer', description: '항목 이동 선택', source: 'Ant' },
              { name: 'Cascader', description: '계층 선택', source: 'Ant' },
              { name: 'Mentions', description: '@멘션 입력', source: 'Ant' },
              { name: 'AutoComplete', description: '자동완성', source: 'Ant' },
              { name: 'Form', description: '폼 래퍼/검증', source: 'Shadcn, Ant' },
              { name: 'Chip', description: '선택/필터/입력 칩', source: 'MD3' },
            ],
          },
        ],
      },
      {
        id: 'cat-8',
        number: 8,
        name: 'Layout',
        subtitle: '공간 배치와 구조',
        definition: '다른 요소들의 위치를 결정하는 패턴',
        count: 15,
        groups: [
          {
            label: '기본 컴포넌트',
            items: [
              { name: 'Grid', description: '그리드 시스템', source: 'Ant' },
              { name: 'Flex', description: '플렉스 컨테이너', source: 'Ant' },
              { name: 'Layout', description: '페이지 레이아웃 (Header, Sider, Content, Footer)', source: 'Ant' },
              { name: 'Resizable', description: '리사이즈 가능 패널', source: 'Shadcn' },
              { name: 'Splitter', description: '분할 패널', source: 'Ant' },
              { name: 'Masonry', description: '메이슨리 레이아웃', source: 'Ant (v6)' },
              { name: 'Affix', description: '고정 위치', source: 'Ant' },
            ],
          },
          {
            label: '창의적 확장',
            items: [
              { name: 'BentoGrid', description: '벤토 박스 레이아웃 (Apple 스타일)', source: 'Common' },
              { name: 'BrokenGrid', description: '의도적 비대칭 그리드', source: 'Unusual' },
              { name: 'OffsetLayout', description: '불균등 컬럼 (2fr 1fr)', source: 'Common' },
              { name: 'OverlappingStack', description: 'Z-index 레이어드 배치', source: 'Common' },
              { name: 'DiagonalGrid', description: '대각선 배치', source: 'Unusual' },
              { name: 'CollageLayout', description: '이미지/텍스트 콜라주', source: 'Unusual' },
              { name: 'SplitScreen', description: '불균등 분할 히어로 (70/30, 60/40)', source: 'Common' },
              { name: 'FullBleed', description: '전체 너비 섹션', source: 'Common' },
            ],
          },
        ],
      },
      {
        id: 'cat-9',
        number: 9,
        name: 'Overlay & Feedback',
        subtitle: '맥락적 정보 표시와 상태 피드백',
        definition: '콘텐츠 위에 나타나 상태를 전달하거나 입력을 요청하는 패턴',
        count: 17,
        groups: [
          {
            label: null,
            items: [
              { name: 'Modal / Dialog', description: '모달 다이얼로그', source: '공통' },
              { name: 'AlertDialog', description: '확인 다이얼로그', source: 'Shadcn' },
              { name: 'Drawer', description: '드로어 패널', source: 'Shadcn, MD3, Ant' },
              { name: 'Sheet', description: '시트 (Bottom/Side)', source: 'Shadcn, MD3' },
              { name: 'Popover', description: '팝오버', source: 'Shadcn, Ant' },
              { name: 'Tooltip', description: '툴팁', source: '공통' },
              { name: 'HoverCard', description: '호버 카드', source: 'Shadcn' },
              { name: 'Toast', description: '토스트 알림', source: 'Shadcn' },
              { name: 'Snackbar', description: '스낵바', source: 'MD3' },
              { name: 'Alert', description: '인라인 알림', source: 'Shadcn, Ant' },
              { name: 'Message', description: '전역 메시지', source: 'Ant' },
              { name: 'Notification', description: '알림', source: 'Ant' },
              { name: 'Popconfirm', description: '확인 팝오버', source: 'Ant' },
              { name: 'Spin / Spinner', description: '로딩 스피너', source: 'Shadcn, Ant' },
              { name: 'Result', description: '결과 피드백', source: 'Ant' },
              { name: 'Tour', description: '온보딩 투어', source: 'Ant' },
              { name: 'Watermark', description: '워터마크', source: 'Ant' },
            ],
          },
        ],
      },
      {
        id: 'cat-10',
        number: 10,
        name: 'Navigation (Global)',
        subtitle: '페이지/앱 간 이동',
        definition: '페이지 또는 라우트 간 이동을 위한 패턴',
        count: 12,
        groups: [
          {
            label: null,
            items: [
              { name: 'NavigationMenu', description: '메인 네비게이션', source: 'Shadcn' },
              { name: 'Menubar', description: '메뉴바', source: 'Shadcn' },
              { name: 'Sidebar', description: '사이드바', source: 'Shadcn' },
              { name: 'Menu', description: '메뉴 (horizontal, vertical, inline)', source: 'Ant' },
              { name: 'NavigationBar', description: '하단 네비게이션 바', source: 'MD3' },
              { name: 'NavigationRail', description: '사이드 레일', source: 'MD3' },
              { name: 'NavigationDrawer', description: '네비게이션 드로어', source: 'MD3' },
              { name: 'TopAppBar', description: '상단 앱바', source: 'MD3' },
              { name: 'BottomAppBar', description: '하단 앱바', source: 'MD3' },
              { name: 'DropdownMenu', description: '드롭다운 메뉴', source: 'Shadcn, Ant' },
              { name: 'ContextMenu', description: '컨텍스트 메뉴', source: 'Shadcn' },
              { name: 'Command', description: '⌘K 커맨드 팔레트', source: 'Shadcn' },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 2: 인터랙티브 패턴
  // ================================================================
  {
    id: 'part-2',
    number: 2,
    label: '인터랙티브 패턴',
    description: '동적 행동과 효과를 정의하는 패턴',
    type: 'interactive',
    count: 41,
    categories: [
      {
        id: 'cat-11',
        number: 11,
        name: 'KineticTypography',
        subtitle: '텍스트 자체 효과',
        definition: '텍스트 자체에 동적 효과를 부여하는 패턴. 다른 시각 요소에 의존하지 않고 타이포그래피 단독으로 작동',
        count: 8,
        groups: [
          {
            label: null,
            items: [
              { name: 'CharacterStagger', description: '문자/단어/줄 단위 순차 애니메이션', dependency: 'GSAP SplitText / Framer Motion', frequency: '높음' },
              { name: 'TextScramble', description: '무작위 문자 → 최종 텍스트 디코딩 효과', dependency: 'GSAP ScrambleTextPlugin', frequency: '높음' },
              { name: 'Typewriter', description: '한 글자씩 타이핑 + 블링킹 커서', dependency: 'CSS / GSAP', frequency: '높음' },
              { name: 'BlurInReveal', description: '흐릿함 → 선명 포커스 등장', dependency: 'Framer Motion / GSAP', frequency: '높음' },
              { name: 'LettersPullUp', description: '마스크 통과 수직 등장', dependency: 'GSAP SplitText', frequency: '높음' },
              { name: 'GlitchText', description: 'RGB 분리, 디지털 간섭 효과', dependency: '순수 CSS', frequency: '중간' },
              { name: 'FlipWords', description: '단어 회전/순환 애니메이션', dependency: 'Framer Motion / GSAP', frequency: '높음' },
              { name: 'AnimatedGradientText', description: '텍스트 그라디언트 색상 순환', dependency: '순수 CSS', frequency: '중간' },
            ],
          },
        ],
      },
      {
        id: 'cat-12',
        number: 12,
        name: 'Scroll',
        subtitle: '스크롤 위치 기반 요소 효과',
        definition: '스크롤 위치에 따라 개별 요소에 효과를 적용하는 패턴',
        count: 8,
        groups: [
          {
            label: null,
            items: [
              { name: 'Parallax', description: '배경/전경 다중 속도 이동으로 깊이감', dependency: 'GSAP ScrollTrigger', frequency: '높음' },
              { name: 'ScrollReveal', description: '뷰포트 진입 시 페이드/슬라이드 등장', dependency: 'GSAP ScrollTrigger / IO API', frequency: '높음' },
              { name: 'ScrollScrubbing', description: '애니메이션 진행 = 스크롤 위치 연동', dependency: 'GSAP ScrollTrigger scrub', frequency: '높음' },
              { name: 'ImageSequence', description: '스크롤에 따른 이미지 프레임 재생', dependency: 'GSAP + Canvas', frequency: '중간' },
              { name: 'SmoothScroll', description: '관성 기반 부드러운 스크롤', dependency: 'Lenis', frequency: '높음' },
              { name: 'ScrollProgress', description: '페이지 읽기 진행률 표시', dependency: 'CSS / GSAP', frequency: '중간' },
              { name: 'ScrollSnap', description: '섹션 경계 자동 정렬', dependency: '순수 CSS', frequency: '중간' },
              { name: 'Scroll3DEffect', description: '스크롤 연동 3D 회전/이동', dependency: 'GSAP + CSS 3D', frequency: '중간' },
            ],
          },
        ],
      },
      {
        id: 'cat-13',
        number: 13,
        name: 'ContentTransition',
        subtitle: '섹션 간 맥락 연결',
        definition: '섹션 간 전후 맥락을 연결하고 콘텐츠 흐름의 연속성을 만드는 패턴',
        count: 7,
        groups: [
          {
            label: null,
            items: [
              { name: 'StickyStacking', description: '카드가 덱처럼 쌓이는 효과', dependency: 'CSS sticky + GSAP', frequency: '높음' },
              { name: 'HorizontalScroll', description: '세로 스크롤 → 가로 이동 변환', dependency: 'GSAP ScrollTrigger pin', frequency: '높음' },
              { name: 'PinnedContentSwap', description: '섹션 고정 + 내부 콘텐츠만 전환', dependency: 'GSAP ScrollTrigger', frequency: '높음' },
              { name: 'SectionWipe', description: 'clip-path로 섹션 드러내기', dependency: 'GSAP + clip-path', frequency: '중간' },
              { name: 'ViewTransition', description: '브라우저 네이티브 페이지/상태 전환', dependency: 'View Transitions API', frequency: '중간' },
              { name: 'ZoomTransition', description: '스크롤 연동 확대/축소 전환', dependency: 'GSAP ScrollTrigger', frequency: '중간' },
              { name: 'BlockRevealWipe', description: '단색 블록 슬라이드 후 콘텐츠 노출', dependency: 'CSS / GSAP', frequency: '중간' },
            ],
          },
        ],
      },
      {
        id: 'cat-14',
        number: 14,
        name: 'Motion',
        subtitle: '스토리텔링/연출 목적 모션',
        definition: '스토리텔링/연출 목적으로 레이아웃이나 콘텐츠의 상태 변화를 시각화하는 패턴',
        count: 10,
        groups: [
          {
            label: null,
            items: [
              { name: 'FadeTransition', description: '기본 opacity 전환 (등장/퇴장/교차)', dependency: 'CSS / Framer Motion', frequency: '높음' },
              { name: 'LayoutAnimation', description: '동일 요소의 위치/크기 변화 부드러운 전환', dependency: 'Framer Motion layout', frequency: '높음' },
              { name: 'StaggeredReveal', description: '요소들 시간차 순차 애니메이션', dependency: 'Framer Motion / GSAP', frequency: '높음' },
              { name: 'AnimatePresence', description: '퇴장 애니메이션 (DOM 제거 전)', dependency: 'Framer Motion', frequency: '높음' },
              { name: 'SharedLayoutAnimation', description: '서로 다른 요소 간 모핑 전환', dependency: 'Framer Motion layoutId', frequency: '높음' },
              { name: 'FLIPGridAnimation', description: '필터/정렬 시 그리드 아이템 위치 이동', dependency: 'GSAP Flip / Framer Motion', frequency: '높음' },
              { name: 'SpringPhysics', description: '스프링 물리 기반 바운스/오버슈트', dependency: 'Framer Motion / GSAP', frequency: '높음' },
              { name: 'Marquee', description: '무한 루프 수평 흐름 (텍스트/이미지/카드)', dependency: 'CSS / GSAP', frequency: '높음' },
              { name: 'SVGMorphing', description: 'SVG 경로 간 형태 변환', dependency: 'GSAP MorphSVG / Flubber', frequency: '중간' },
              { name: 'LottieAnimation', description: 'After Effects 기반 벡터 애니메이션', dependency: 'lottie-web', frequency: '중간' },
            ],
          },
        ],
      },
      {
        id: 'cat-15',
        number: 15,
        name: 'DynamicColor',
        subtitle: '동적 색상 변화',
        definition: '동적으로 색상 변화를 다루는 패턴',
        count: 8,
        groups: [
          {
            label: null,
            items: [
              { name: 'AuroraBackground', description: '블러 처리된 컬러 블롭 흐름', dependency: '순수 CSS', frequency: '높음' },
              { name: 'CursorReactiveGradient', description: '커서 위치 반응 그라디언트/글로우', dependency: 'JS + CSS 변수', frequency: '높음' },
              { name: 'AnimatedTextGradient', description: '텍스트 그라디언트 색상 순환', dependency: '순수 CSS', frequency: '높음' },
              { name: 'GrainyGradient', description: '노이즈 텍스처 오버레이 그라디언트', dependency: 'SVG 필터 + CSS', frequency: '중간' },
              { name: 'DarkModeTransition', description: '테마 전환 시 확장/와이프 애니메이션', dependency: 'View Transitions API', frequency: '중간' },
              { name: 'Spotlight', description: '특정 영역 집중 조명 효과', dependency: 'CSS radial-gradient', frequency: '중간' },
              { name: 'MeshGradient', description: 'WebGL 기반 유기적 다중 색상 흐름', dependency: 'Three.js / Gradient.js', frequency: '중간' },
              { name: 'AmbientBackground', description: '파티클/블롭 미묘한 지속 움직임', dependency: 'CSS / Canvas', frequency: '중간' },
            ],
          },
        ],
      },
    ],
  },

  // ================================================================
  // Part 3: 디자인 사조
  // ================================================================
  {
    id: 'part-3',
    number: 3,
    label: '디자인 사조',
    description: '시각적 스타일의 철학과 적용 맥락',
    type: 'movements',
    count: 8,
    items: [
      { name: 'Flat Design', feel: '깔끔, 빠름, 명확', whenToUse: '대시보드, SaaS, 복잡한 정보 UI', whenToAvoid: '프리미엄/럭셔리 브랜딩' },
      { name: 'Material Design', feel: '체계적, 일관적, 구글 느낌', whenToUse: 'Android 앱, B2B 엔터프라이즈, 디자인 시스템', whenToAvoid: 'Apple 생태계, 독특한 브랜드 정체성' },
      { name: 'HIG (Apple Style)', feel: '프리미엄, 세련, blur 레이어', whenToUse: 'iOS/macOS 앱, 프리미엄 제품, 미니멀 럭셔리', whenToAvoid: '저사양 기기 타겟, 복잡한 데이터 UI' },
      { name: 'Glassmorphism', feel: '깊이감, 우아함, 모던', whenToUse: '모달/카드 오버레이, 다크모드 UI, 로그인 폼', whenToAvoid: '텍스트 집약 UI, 단순 배경, 저사양 기기' },
      { name: 'Neumorphism', feel: '소프트, 촉각적, 미래적', whenToUse: '뮤직 플레이어, 스마트홈 컨트롤, 토글/슬라이더', whenToAvoid: '텍스트 많은 UI, 접근성 중요 시 (낮은 대비)' },
      { name: 'Claymorphism', feel: '친근, 따뜻, 유기적', whenToUse: '어린이 앱, 핀테크 카드, 친근한 B2C', whenToAvoid: '엔터프라이즈, 진지한 톤' },
      { name: 'Neubrutalism', feel: '대담, 반항, Gen-Z', whenToUse: '크리에이티브 에이전시, 인디 제품, 포트폴리오', whenToAvoid: '금융, 헬스케어, 엔터프라이즈' },
      { name: 'Swiss / Editorial', feel: '명료, 콘텐츠 중심, 시간을 초월', whenToUse: '블로그, 뉴스, 케이스 스터디, 문서 기반', whenToAvoid: '인터랙티브 중심, 시각적 임팩트 필요 시' },
    ],
  },

  // ================================================================
  // Part 4: 레이아웃, 타이포그래피, 컬러
  // ================================================================
  {
    id: 'part-4',
    number: 4,
    label: '레이아웃, 타이포그래피, 컬러',
    description: '공간 배치와 시각적 표현 체계',
    type: 'reference',
    count: 37,
    categories: [
      {
        id: 'cat-16',
        number: 16,
        name: '그리드 시스템',
        subtitle: '콘텐츠 배치의 구조적 프레임워크',
        definition: '콘텐츠 배치의 구조적 프레임워크',
        count: 5,
        groups: [
          {
            label: null,
            items: [
              { name: 'Bento Grid', description: '다양한 크기의 박스가 퍼즐처럼 맞춤', whenToUse: '제품 피처 소개, SaaS 랜딩, 포트폴리오', example: 'Apple, Notion, Framer' },
              { name: 'Card Grid', description: '동일 크기 카드 반복', whenToUse: '이커머스 제품 목록, 갤러리, 피드', example: 'Dribbble, 쇼핑몰' },
              { name: 'Masonry', description: '핀터레스트 스타일, 높이 가변', whenToUse: '이미지 갤러리, UGC 피드, 포트폴리오', example: 'Pinterest, Unsplash' },
              { name: '12-Column', description: '반응형 표준, Flexbox/Grid', whenToUse: '대부분의 반응형 웹사이트', example: 'Bootstrap, Tailwind' },
              { name: 'Broken Grid', description: '의도적 비대칭, 요소 오버랩', whenToUse: '크리에이티브 에이전시, 아트/패션', example: '디자인 스튜디오, 아티스트' },
            ],
          },
        ],
      },
      {
        id: 'cat-17',
        number: 17,
        name: '페이지 레이아웃 패턴',
        subtitle: '페이지 전체 구조와 시선 흐름',
        definition: '페이지 전체 구조와 시선 흐름을 결정하는 패턴',
        count: 7,
        groups: [
          {
            label: null,
            items: [
              { name: 'Hero + 스크롤', description: '큰 히어로 → 아래로 콘텐츠', whenToUse: '랜딩페이지, 제품 소개, 마케팅 사이트' },
              { name: 'Split Screen', description: '화면 양분, 이미지+텍스트', whenToUse: '패션, 비교, 두 가지 선택지 제시' },
              { name: 'Asymmetric Split', description: '불균등 분할 (60/40, 70/30), 시선 유도', whenToUse: '중요 콘텐츠 강조, 동적인 느낌' },
              { name: 'Z-Pattern', description: 'Z자 시선 흐름', whenToUse: '이미지 중심 랜딩, 간결한 페이지' },
              { name: 'F-Pattern', description: 'F자 시선 흐름', whenToUse: '텍스트 중심 페이지, 블로그, 문서' },
              { name: 'Full-Bleed', description: '여백 없이 가장자리까지', whenToUse: '몰입감, 이미지/영상 강조' },
              { name: 'Single Column', description: '단일 컬럼, 집중된 읽기', whenToUse: '아티클, 블로그 포스트, 랜딩' },
            ],
          },
        ],
      },
      {
        id: 'cat-18',
        number: 18,
        name: '타이포그래피',
        subtitle: '텍스트의 시각적 표현 체계',
        definition: '텍스트의 시각적 표현 체계',
        count: 12,
        groups: [
          {
            label: '핵심 트렌드 (지속 + 진화)',
            items: [
              { name: 'Oversized Display', description: '48-120px+ 대형 헤드라인. 텍스트가 히어로 이미지를 대체하는 방향으로 진화', whenToUse: '히어로 섹션, 브랜드 스테이트먼트, 텍스트-온리 랜딩' },
              { name: 'Variable Fonts', description: '단일 파일로 weight/width/slant 등 다축 조절. 웹사이트 40% 채택', whenToUse: '3개+ 웨이트 사용 시, 반응형, 동적 UI, 성능 중요' },
              { name: 'High-Contrast Serif', description: '굵기 대비 강한 세리프. 럭셔리 브랜드 헤리티지 복귀와 맞물림', whenToUse: '에디토리얼, 럭셔리, 패션' },
              { name: 'Neo-Grotesque Sans', description: 'Inter, Satoshi, Geist Sans 등 현대적 산세리프. SaaS 93% 지배', whenToUse: 'SaaS, 테크, 범용 UI, 프로덕티비티 도구' },
              { name: 'Kinetic Typography', description: '움직이는 텍스트. GSAP 무료화(2025.04)로 진입장벽 대폭 하락', whenToUse: '히어로 섹션, 인터랙티브 브랜딩, 스크롤 기반 스토리텔링' },
            ],
          },
          {
            label: '신규 등장 트렌드',
            items: [
              { name: 'Anti-AI Humantouch Type', description: '의도적 불완전성, 흔들리는 아웃라인, 리소그래프 텍스처, "잘못된" 자간', whenToUse: '크리에이티브 에이전시, 패션, 인디 브랜드, 차별화 필요 시' },
              { name: 'Fluid Typography (clamp)', description: 'CSS clamp()로 뷰포트 반응형 폰트 크기. rem + vw 조합 필수', whenToUse: '모든 반응형 웹. 오버사이즈 디스플레이 구현의 기술적 기반' },
              { name: 'CSS text-wrap: balance', description: '헤딩/짧은 텍스트의 줄바꿈 자동 균형', whenToUse: '헤딩, 카드 타이틀, CTA 텍스트' },
              { name: 'CSS text-wrap: pretty', description: '본문 텍스트 orphan(고아 단어) 방지', whenToUse: '블로그 본문, 아티클, 긴 텍스트' },
              { name: 'AI Font Search', description: '자연어로 폰트 검색. 25만+ 폰트 대상', whenToUse: '폰트 선정 워크플로. 크리에이티브 시간 최대 35% 절감' },
              { name: 'COLRv1 Color Fonts', description: '그라디언트, 블렌딩 모드 지원 차세대 컬러 폰트', whenToUse: '디스플레이/장식용 한정. Safari 미지원으로 프로덕션 제한' },
              { name: 'Exaggerated Hierarchy', description: '120px+ 헤드라인과 10-12px 마이크로 텍스트의 극단적 병치', whenToUse: '패션, 에디토리얼, 크리에이티브 랜딩' },
            ],
          },
        ],
      },
      {
        id: 'cat-19',
        number: 19,
        name: '컬러 전략',
        subtitle: 'UI에서 색상의 역할과 적용 규칙',
        definition: 'UI에서 색상의 역할과 적용 규칙',
        count: 7,
        groups: [
          {
            label: '60-30-10 Rule',
            items: [
              { name: '60% Dominant', description: '배경, 빈 공간, surface' },
              { name: '30% Secondary', description: '카드 배경, 네비게이션, 섹션 구분' },
              { name: '10% Accent', description: 'CTA 버튼, 링크, 알림 뱃지, 포커스 상태' },
            ],
          },
          {
            label: '컬러 하모니',
            items: [
              { name: 'Monochromatic', description: '미니멀 SaaS, 포트폴리오', whenToUse: '세련, 집중' },
              { name: 'Analogous', description: '자연/웰니스 앱, 친근한 B2C', whenToUse: '조화, 편안' },
              { name: 'Complementary', description: 'CTA 강조, 게임화', whenToUse: '에너지, 대비' },
              { name: 'Split-Complementary', description: '대부분의 웹사이트', whenToUse: '균형 잡힌 대비' },
            ],
          },
        ],
      },
      {
        id: 'cat-20',
        number: 20,
        name: '조합 레시피',
        subtitle: '사조 + 레이아웃 + 타이포의 실전 조합',
        definition: '사조 + 레이아웃 + 타이포의 실전 조합',
        count: 6,
        groups: [
          {
            label: null,
            items: [
              { name: 'SaaS 랜딩', description: 'Flat + Corporate', layout: 'Bento Grid + Hero', typography: 'Inter + Oversized Display' },
              { name: '크리에이티브 에이전시', description: 'Neubrutalism', layout: 'Broken Grid', typography: 'Space Grotesk + Kinetic' },
              { name: '이커머스', description: 'Material / Flat', layout: 'Card Grid + F-Pattern', typography: 'System UI + Clear Hierarchy' },
              { name: '테크 블로그', description: 'Swiss / Editorial', layout: 'Single Column + F-Pattern', typography: 'Serif Headline + Sans Body' },
              { name: '프리미엄 제품', description: 'HIG + Glassmorphism', layout: 'Full-Bleed Hero + Bento', typography: 'SF Pro / Playfair' },
              { name: '핀테크 앱', description: 'Material + Neumorphism', layout: 'Card Grid', typography: 'Inter + High Contrast' },
            ],
          },
        ],
      },
    ],
  },
];
