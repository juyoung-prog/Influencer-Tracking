# Components

Vibe Dictionary 텍소노미 v0.4 기반 분류. 번호는 텍소노미 카테고리 번호.

## 참조 문서

- 전체 텍소노미: `.claude/skills/component-work/resources/taxonomy-v0.4.md`
- 빠른 인덱스: `.claude/skills/component-work/resources/taxonomy-index.md`

새 컴포넌트 생성 시 위 문서에서 해당 카테고리 번호와 컴포넌트 원형을 확인한 후 구현할 것.

---

## 1. Typography — 텍스트 표현과 장식

- FitText: 컨테이너에 맞춤 텍스트 (`components/typography/FitText.jsx`)
- HighlightedTypography: 하이라이트 타이포그래피 (`components/typography/HighlightedTypography.jsx`)
- InlineTypography: 인라인 타이포그래피 (`components/typography/InlineTypography.jsx`)
- StretchedHeadline: 스트레치 헤드라인 (`components/typography/StretchedHeadline.jsx`)
- StyledParagraph: 스타일드 문단 (`components/typography/StyledParagraph.jsx`)
- Title: 타이틀 컴포넌트 (`components/typography/Title.jsx`)
- QuotedContainer: 인용 컨테이너 (`components/typography/QuotedContainer.jsx`)

## 2. Container — 시각적 경계와 그룹핑

- SectionContainer: 페이지 섹션 컨테이너. MUI Container 기반 (`components/container/SectionContainer.jsx`)
- CarouselContainer: 캐로셀 컨테이너 (`components/container/CarouselContainer.jsx`)
- RatioContainer: 비율 기반 컨테이너 (`components/container/RatioContainer.jsx`)

## 3. Card — 독립적 정보 단위

- CardContainer: 카드 기본 컨테이너. variant, padding, elevation (`components/card/CardContainer.jsx`)
- CustomCard: 미디어+콘텐츠 카드. vertical/horizontal/overlay 레이아웃 (`components/card/CustomCard.jsx`)
- ImageCard: 이미지 카드 (`components/card/ImageCard.jsx`)
- MoodboardCard: 무드보드 컬렉션 카드. 2x2 썸네일 그리드 (`components/card/MoodboardCard.jsx`)
- Card: MUI Card 컴포넌트 [MUI]

## 4. Media — 이미지, 비디오 표시

- AspectMedia: 비율 기반 미디어 컨테이너 (`components/media/AspectMedia.jsx`)
- ImageCarousel: 이미지 캐로셀 (`components/media/ImageCarousel.jsx`)
- ImageTransition: 이미지 트랜지션 효과 (`components/media/ImageTransition.jsx`)
- CarouselIndicator: 캐로셀 인디케이터 (`components/media/CarouselIndicator.jsx`)

## 5. Data Display — 구조화된 데이터 시각화

- Table: MUI Table 컴포넌트 [MUI]

## 6. In-page Navigation — 페이지 내 탐색

- CategoryTab: 카테고리 탭 (`components/in-page-navigation/CategoryTab.jsx`)
- Tabs: MUI Tabs 컴포넌트 [MUI]

## 7. Input & Control — 사용자 입력

- FileDropzone: 파일 드래그&드롭 영역 (`components/input/FileDropzone.jsx`)
- SearchBar: 검색 입력 바 (`components/input/SearchBar.jsx`)
- TagInput: 태그 입력 필드 (`components/input/TagInput.jsx`)
- Button: MUI Button 컴포넌트 [MUI]
- Checkbox: MUI Checkbox 컴포넌트 [MUI]
- Select: MUI Select 컴포넌트 [MUI]
- Switch: MUI Switch 컴포넌트 [MUI]
- TextField: MUI TextField 컴포넌트 [MUI]

## 8. Layout — 공간 배치와 구조

- PhiSplit: 황금비 분할 레이아웃 (`components/layout/PhiSplit.jsx`)
- SplitScreen: 좌우 분할 레이아웃. ratio, stackAt, stackOrder 지원 (`components/layout/SplitScreen.jsx`)
- BentoGrid: 벤토 그리드 레이아웃 (`components/layout/BentoGrid.jsx`)
- LineGrid: 그리드 아이템 사이 1px 라인 자동 삽입 (`components/layout/LineGrid.jsx`)
- FullPageContainer: 전체 페이지 컨테이너 (`components/layout/FullPageContainer.jsx`)
- PageContainer: 반응형 페이지 컨테이너. PC maxWidth 고정, 모바일 100% (`components/layout/PageContainer.jsx`)
- AppShell: 반응형 앱 셸. GNB + 메인 콘텐츠 영역 (`components/layout/AppShell.jsx`)
- StickyAsideCenterLayout: 대칭 3열 그리드. sticky aside + 페이지 정중앙 콘텐츠 + 빈 대칭 칼럼 (`components/layout/StickyAsideCenterLayout.jsx`)
- Grid: MUI Grid 컴포넌트 [MUI]
- Masonry: MUI Masonry 컴포넌트 [MUI]

## 9. Overlay & Feedback — 맥락적 정보 표시

- Dialog: MUI Dialog 컴포넌트 [MUI]

## 10. Navigation (Global) — 페이지 간 이동

- GNB: 반응형 글로벌 네비게이션 바. 데스크탑 메뉴 / 모바일 Drawer (`components/navigation/GNB.jsx`)
- NavMenu: 네비게이션 메뉴 (`components/navigation/NavMenu.jsx`)
- SlidingHighlightMenu: 슬라이딩 하이라이트 메뉴. hover 시 layoutId 기반 인디케이터 이동, background/underline, horizontal/vertical (`components/navigation/SlidingHighlightMenu.jsx`)

## 11. KineticTypography (Interactive) — 텍스트 애니메이션 효과

- RandomRevealText: 랜덤 순서 blur 리빌 타이포그래피. Fisher-Yates 셔플 기반 (`components/kinetic-typography/RandomRevealText.jsx`)
- ScrambleText: 텍스트 스크램블 전환 효과. requestAnimationFrame 기반 (`components/kinetic-typography/ScrambleText.jsx`)
- ScrollRevealText: 스크롤 진행에 따른 텍스트 순차 리빌 (`components/kinetic-typography/ScrollRevealText.jsx`)

## 13. ContentTransition (Interactive) — 섹션 간 전환

- HorizontalScrollContainer: 세로 스크롤→가로 이동 변환 컨테이너. 픽셀 기반 DOM 측정, Framer Motion (`components/content-transition/HorizontalScrollContainer.jsx`)

## 12. Scroll (Interactive) — 스크롤 기반 효과

- VideoScrubbing: 스크롤 기반 비디오 스크러빙 (`components/scroll/VideoScrubbing.jsx`)
- ScrollScaleContainer: 뷰포트 노출 비율 연동 스케일 컨테이너. Framer Motion useScroll + useTransform (`components/scroll/ScrollScaleContainer.jsx`)

## 14. Motion (Interactive) — 스토리텔링 모션

- FadeTransition: 기본 opacity 전환 애니메이션. 등장/퇴장 페이드 + 방향 슬라이드, IntersectionObserver 자동 트리거 (`components/motion/FadeTransition.jsx`)
- PerspectiveTransition: 3D 원근 회전 전환. 뒤로 누워있다가 세워지는 효과, CSS perspective + rotateX, IntersectionObserver 자동 트리거 (`components/motion/PerspectiveTransition.jsx`)
- MarqueeContainer: 무한 루프 수평 흐름 컨테이너. CSS keyframes 기반 (`components/motion/MarqueeContainer.jsx`)

## 15. DynamicColor (Interactive) — 동적 색상 변화

- GradientOverlay: Three.js WebGL 스크롤 반응형 그라데이션 배경. Simplex Noise + 필름 그레인 (`components/dynamic-color/GradientOverlay.jsx`)
- GradientOverlayDynamic: Next.js 동적 import 래퍼 (ssr: false). 페이지에서 사용 시 이것을 import (`components/dynamic-color/GradientOverlayDynamic.jsx`)

---

## Common (유틸리티)

- Indicator: 범용 인디케이터 (`common/ui/Indicator.jsx`)
- Placeholder: 스토리 예제용 FPO 플레이스홀더 시스템. Box/Image/Media/Text/Line/Paragraph/Card 서브컴포넌트 (`common/ui/Placeholder.jsx`)
- FilterBar: 필터 바 (`components/templates/FilterBar.jsx`)

---

## BeautyMaster (도메인 전용)

인플루언서 대시보드 전용 컴포넌트. Storybook `BeautyMaster/` 카테고리에 등록됨.

### Atom / 원자

- KpiBar: KPI 요약 바. Total·Agreement·Visit·Upload·Credit + Alerts 수치 (`components/data-display/KpiBar.jsx`)
- StatusIconRow: 4단계 파이프라인 아이콘 행. Agreement·Visit·Upload·Credit 체크 상태 (`components/data-display/StatusIconRow.jsx`)
- SyncStatusBar: 마지막 동기화 시각 + 새로고침 버튼 (`components/layout/SyncStatusBar.jsx`)
- AlertBanner: 경보 플래그 배너. activeFlag prop으로 강조 플래그 선택 (`components/overlay-feedback/AlertBanner.jsx`)

### Molecule / 분자

- InfluencerCard: 인플루언서 카드. 280px 폭, avatar + 이름/시간 + StatusIconRow + 스테이지 레이블 (`components/card/InfluencerCard.jsx`)
- InfluencerListRow: 인플루언서 리스트 행. `hasScheduledTimeOfDay`가 false면 시각을 만들어내지 않고 "Jul 8 · time TBD"로 표시한다. 가로형, 세 구역 — avatar + 이름/시간/노트 | 속성 | 상태. **속성**은 플랫폼·티어·카테고리를 필터 바 칩과 같은 순서로 각각 고정 폭 하위 컬럼(72/22/62px)에 넣어 세 값이 세로로 정렬된다(구분자 없이 여백으로 구분, 플랫폼은 `normalizePlatform`으로 공식 표기 통일). **상태**는 최대 2줄 — 경과일(앰버, 행마다 다르고 우선순위를 정하는 값)과 상태 라벨(회색). 연락 상태가 있으면 그게 공식 값(alertFlags 파생)이라 stage 라벨은 생략한다. 회신 대기는 경과일을 병기한다("awaiting reply · 20d") (`components/data-display/InfluencerListRow.jsx`) **핸들** — 이름 아래 줄에서 시각과 한 줄을 공유한다(`@handle · Jul 8 · 02:00 PM`). 줄을 새로 만들지 않는 게 규칙이다(행 높이가 커지면 한 화면 인원이 줄어든다). 값은 파서가 `socialAccountUrl`에서 되짚은 `socialHandle`로, 상세 패널 링크와 같은 출처라 두 곳이 어긋나지 않는다. 핸들 문법(`[A-Za-z0-9._]{1,30}`)에 안 맞는 값은 파서가 버린다 — 시트 social account 칸에 자기소개가 적힌 행이 있어 `@Rosalia | UGC content creator`가 핸들로 나왔다. 이름 칸이 비어 핸들이 이름 자리에 올라온 행(`hasFullName: false`)은 같은 값을 두 번 쓰지 않는다. **이름**은 `toDisplayName`으로 각 단어 첫 글자만 올린다(시트에 성이 소문자인 행이 있다). 전체를 소문자로 깔지 않는 게 중요하다 — `JMag`·`MuhammadPoe`·`O'Brien`이 망가진다. 원본 `fullName`은 그대로 두고 표시만 바꾼다. **아바타**는 두 글자 고정(한 단어 이름은 앞 두 글자, 기호는 제외)이고 배경·글자색을 이름 FNV-1a 해시로 10색 중에서 고른다(`utils/influencerAvatar.js` — 상세 패널과 공유) — 이니셜이 같은 사람이 인접해 앉기 때문이다(실제 데이터에 AG·SM 두 쌍). 색은 이름에서 뽑으므로 필터·정렬로 순서가 바뀌어도 같은 사람은 같은 색이고, 같은 사람이 여러 행으로 들어와도 묶여 보인다. 팔레트는 HSL 색상환 10등분(배경 L91.5/S20, 글자 L29.5/S22)으로 균등 간격을 보장하고 전 조합이 대비 6.1:1 이상이다. 구분은 주로 글자색이 지고 배경은 옅게 남긴다 — 앰버(경보)·파랑(선택)과 색으로 경쟁하지 않게. 해시는 동일 이니셜 쌍의 97%만 갈라낸다(100% 보장 아님, 이름이 옆에 있어 보조 신호다).
- InfluencerFilterBar: 스토어·월·플랫폼·티어 필터 바 (`components/data-display/InfluencerFilterBar.jsx`)
- ScheduleTimeline: 방문 일정 타임라인 패널. 날짜 그룹(오늘·예정·과거·미정)별 행 (`components/data-display/ScheduleTimeline.jsx`)
- InfluencerFunnel: Invited → Credit Used 전환 퍼널. "Number" 탭 초대 인원 데이터가 있으면 Invited/Agreement 사이에 Responded 단계 추가 표시 (`components/data-display/InfluencerFunnel.jsx`)
- StoreBreakdown: 스토어별 성과 비교 테이블. Count 옆 Invited 컬럼(해당 스토어 초대 데이터 있을 때만 표시) (`components/data-display/StoreBreakdown.jsx`)
- CategoryBreakdown: 카테고리(General/K-Beauty/Specific)별 성과 비교 테이블. Count 옆 Invited 컬럼 (`components/data-display/CategoryBreakdown.jsx`)
- FunnelSummaryTable: InfluencerFunnel과 같은 데이터의 표 형태 버전. Stage/Count/% of Invited 3컬럼, Invited 행 아래 Tier별 초대 인원 caption. AnalyticsDashboard에서 InfluencerFunnel과 토글로 전환(둘 다 항상 렌더링하지 않음) (`components/data-display/FunnelSummaryTable.jsx`)
- TierMetricsTable: Tier가 행인 통합 지표 테이블. Invited/Agreement(%)/Visited(%)/Scheduled/Content(%), Total 행은 raw count 합산 후 재계산. 예전 컬럼형 TierComparison을 대체함(삭제됨, 중복 뷰 정리) (`components/data-display/TierMetricsTable.jsx`)
- MentionListRow: 멘션(SNS 언급) 리스트 행. 핸들+수집경로 / 팔로워·ER·좋아요(tabular-nums, xs에서 숨김) / 게시일 / 상태 라벨 + 게시물 새탭 열기. 익명(unverified) 행은 ? 아바타 + 캡션 발췌 + Approve/Dismiss 버튼, below-threshold 행은 opacity 뮤트. 협업 인플루언서 매칭 시 secondary outline "Collab · 이름" 태그 (`components/data-display/MentionListRow.jsx`)
- MentionListRowSaas: MentionListRow의 모던 SaaS 문법 시안 변형(비교용). 데이터·컬럼 동일, 표면만 다름 — 라운드 hover 배경, soft tinted 상태 pill(alpha 8% 배경), pill 형태 Approve/Dismiss, tinted 아바타. 폰트는 부모의 Inter 스택 상속(fontFamily: inherit) (`components/data-display/MentionListRowSaas.jsx`)
- InfluencerListRowSaas: InfluencerListRow의 모던 SaaS 문법 시안 변형(비교용). 데이터·컬럼 동일, 표면만 다름 — 라운드 hover 배경(10px), tinted 아바타(primary alpha 8%), 진행 단계는 텍스트 컬러 대신 soft tinted pill, 카테고리는 grey pill. 폰트는 부모의 Inter 스택 상속(fontFamily: inherit) (`components/data-display/InfluencerListRowSaas.jsx`)

### Section / 섹션

- MentionsPanelSaas: MentionsPanel의 모던 SaaS 문법 시안 변형(비교·검토용, 대시보드 미연결). 로직 동일, 표면만 다름 — grey.50 캔버스 위 라운드 카드(radius 16px) + 레이어드 소프트 섀도 + Inter Variable(@fontsource, 컴포넌트에서 import), KPI는 개별 스탯 카드 5장, 섹션은 헤더(제목+부제+카운트 pill) 있는 카드 단위로 분리(MentionListRowSaas). 프로젝트 기본 flat 문법과 의도적으로 다른 시안임 (`components/templates/beautymaster/MentionsPanelSaas.jsx`)
- OperationsPanelSaas: Operations 뷰(DashboardHeader+SchedulePanel+InfluencerPanel 조합)의 모던 SaaS 문법 시안 변형(비교·검토용, 대시보드 미연결). 같은 데이터 규칙, 표면만 다름 — grey.50 캔버스 위 라운드 카드(16px) + 레이어드 소프트 섀도 + Inter Variable, KPI는 개별 스탯 카드 5장(Total/Agreement/Visit/Upload/Credit, deriveKpiSummary 내부 파생), 왼쪽 Visit schedule 카드(오늘·날짜별·과거 그룹) + 오른쪽 SearchBar·플랫폼/티어 Chip 필터 + Action required/Upcoming/Completed 섹션 카드(InfluencerListRowSaas). MentionsPanelSaas와 같은 시안 문법 공유 (`components/templates/beautymaster/OperationsPanelSaas.jsx`)
- parseStoreDocsCsv: Links 탭 CSV 파서. Store별 Tier1/Tier2 Consent Form URL·Tier1/Tier2 Influencer List URL을 `{ [store]: {...} }` 형태로 반환 (`utils/parseStoreDocsCsv.js`)

### Page / 대시보드 본체 (flat-SaaS)

> 스토리: 이 절의 컴포넌트는 모두 `{ComponentName}.stories.jsx`를 같은 폴더에 둔다. `SaasShell`/`SaasOperationsView`는 인터랙션(사이드바 펼침, 섹션 접기, 상태 탭)이 핵심이라 `play` 함수로 검증한다 — 다만 CSS `:hover`는 합성 이벤트로 발동하지 않으므로 사이드바 펼침은 같은 규칙의 `:focus-within` 쪽으로 단언한다.

**현재 운영 중인 대시보드 UI다** (2026-07-27 리뉴얼, 기존 탭 레이아웃 DashboardHeader/SchedulePanel/InfluencerPanel/AnalyticsDashboard/MentionsPanel/WorkflowGuide를 대체하고 삭제함. Mentions는 수집 파이프라인을 만들지 않기로 해 탭째 제외했다(2026-07-27) — `data/beautymaster/mentions.js`는 남아 있으나 이제 `formatCompact`와 라운드카드 시안·MentionListRow 계열만 쓴다).

modern_saas_design_core_features.md 기반 — Linear/Vercel/Stripe 방향. White 배경 + thin 1px border + 8px radius + 섀도 없음 + Inter, 카드 최소화(KPI 배경 직접 배치·border/spacing 구획), Table 중심, dot+label Status-first, accent는 theme `primary.main`(#0000FF) 1색. 3분할(Operations/Analytics/Workflow)을 탭이 아닌 사이드바로 전환한다. 본문은 중앙 정렬 max-width 없이 프레임을 가득 채운다(운영형 SaaS 공간 포화).

컨트롤 문법 공통: 검색 input·Select는 높이 36px, 필터 chip은 32px, 모두 radius 6px에 섀도 없음(pill 금지), 필터 그룹은 vertical Divider로 구분하고 Reset은 chip이 아닌 저강도 text action.

결손 상태 규약: error는 목록을 지우지 않고 상단 배너 + Retry(직전 데이터 유지), isLoading은 목록이 비었을 때만 스켈레톤(폴링 중 깜빡임 방지), 빈 상태는 필터 유무에 따라 문구와 Clear filters를 분기한다.

> 라운드 카드 + 소프트 섀도 방향(MentionsPanelSaas / OperationsPanelSaas)은 채택되지 않은 대안 시안이며 비교용으로만 남아 있다.

- SaasShell: flat-SaaS 셸. 좌측 사이드바는 **접힌 아이콘 레일 56px가 기본**이고 hover 또는 `:focus-within` 시 248px로 펼쳐지며 라벨이 페이드인(180ms/150ms ease-out, prefers-reduced-motion 시 전환 제거) — Meta Ads Manager 방식. 펼침은 **본문 위 오버레이**다: nav를 absolute로 띄우고 레일 폭만큼 spacer를 흐름에 남겨 본문 폭·위치가 접힘/펼침과 무관하게 고정된다(셸 루트가 `isolation: isolate`, nav는 `theme.zIndex.appBar`). 항목 내용은 항상 펼친 폭 기준으로 배치하고 접힘 상태에서 잘라내 전환 중 텍스트가 흔들리지 않는다. 네비 항목은 `<button>`이라 키보드로 접근·전환 가능(포커스가 들어오면 펼침 유지). 활성 항목은 테두리 없이 `alpha(primary.main, 0.08)` 틴트 + primary 글자색 — outlined 버튼처럼 보이지 않게. 행 자체가 접힘 36px ↔ 펼침 228px로 늘어나므로 활성 배경이 아이콘 주변(둥근 사각)에서 행 전체로 자연스럽게 확장된다. 폭이 바뀌는 요소(로고 행·네비 행·하단 유틸리티 블록)는 모두 `.saas-nav-w` 클래스 하나로 함께 제어한다 — 접힘/펼침용 요소를 따로 두지 않는다. 하단 divider도 유틸리티 블록의 borderTop이라 같은 요소가 늘어난다. sync 캡션은 높이를 항상 차지하고 opacity만 바뀐다 — 접으면 divider와 유틸리티 아이콘이 위아래로 움직이기 때문. 전역 유틸리티(Last synced 캡션 / Refresh / Open Google Sheet / Settings)는 상단 헤더가 아니라 **사이드바 하단**에 있다 — 네비 목록이 남는 높이를 차지해 항상 바닥에 붙고, divider로 분리된다. 네비 항목과 같은 아이콘 크기·행 높이를 쓰도록 내부 `NavRow`를 공유한다(button/anchor 겸용). sync 캡션은 접힘 상태에서 opacity뿐 아니라 height까지 0으로 접어 아이콘 위에 빈 틈을 남기지 않는다. 본문 상단에는 헤더 행이 없다 — 목록·표에 세로 공간을 더 준다 + 유동 본문(flex column, overflow hidden — 스크롤은 각 뷰가 소유). 본문 최상단에 글로벌 헤더 행(우측 정렬: Last synced 시각 + Refresh / Open Google Sheet / Settings 아이콘 18px, 배경·섀도 없이 hover만) — 기존 DashboardHeader의 유틸리티 자리. `sheetUrl`을 주면 Open Google Sheet가 새 탭 링크가 되고, 없으면 아이콘 자체를 숨긴다. 네비는 Operations/Analytics/Workflow. SAAS_FONT 상수 export. `sidebar-nav-shell` 아키타입 (`components/templates/beautymaster/SaasShell.jsx`)
- SaasDashboardMockup: flat-SaaS 조립 진입점. activeView를 소유하고 SaasShell + 3개 뷰를 조합. 스토어는 Operations/Analytics/Workflow가 공유하므로 여기서 한 번만 들고 세 뷰에 내려보낸다 — 뷰를 옮겨도 보던 스토어가 유지된다. selectedStore는 controlled/uncontrolled 둘 다 지원(페이지가 config.defaultStore로 시딩하는 경우 때문). isLoading/error/onRetry/sheetUrl도 각 뷰·셸로 전달. **실서비스 BeautymasterDashboard가 `?ui=saas`일 때 이걸 렌더한다** — 이름은 mockup이지만 더 이상 목업 전용이 아니며, 레거시 제거 시 개명 예정 (`components/templates/beautymaster/SaasDashboardMockup.jsx`)
- SaasKpiItem: flat-SaaS KPI 스트립 셀 프리미티브. 카드가 아니라 배경 위 직접 배치, 좌측 1px divider로만 구분(isFirst는 생략), `total` 주면 "of N" 병기, `isAlert`면 warning 색. Operations 뷰에서 사용 (`components/templates/beautymaster/SaasKpiItem.jsx`)
- SaasStoreSelect: flat-SaaS 스토어 선택 드롭다운. Operations/Analytics/Workflow 세 뷰가 같은 스토어 상태를 공유하므로 컨트롤도 하나로 공유한다 — 어디서 바꾸든 나머지가 따라옴. 높이 36px·radius 6px로 검색 input과 같은 컨트롤 문법. `stores`가 비면 렌더하지 않음. 상수 `ALL_STORES`·헬퍼 `deriveStores`는 eslint(only-export-components) 때문에 `data/beautymaster/schema.js`에 있음 (`components/templates/beautymaster/SaasStoreSelect.jsx`)
- SaasOperationsView: Operations 뷰. 기존 SchedulePanel+InfluencerPanel과 같은 구성 — 상단 KPI 스트립(Agreement/Visit/Upload/Credit — 모수는 스토어·플랫폼·티어·카테고리까지만 반영하고 검색어·단계 필터는 제외한다. 기존 대시보드 filteredKpi와 같은 기준으로, 단계 필터를 넣으면 Review를 누르는 순간 방금 본 경보 수가 바뀌어버린다) + 우측 Needs attention 배너(Review 클릭 시 목록 필터. 카운트는 KPI 모수가 아니라 **목록과 같은 filtered**에서 센다 — scoped로 세면 상태 탭·검색 시 배너 69/섹션 66처럼 갈라진다), 필터 툴바는 검색 | 스토어 Select | 플랫폼 | 티어 | 카테고리 순서에 Divider 구분, 그 아래 테이블 열 헤더 위에 시트 상태 탭(All/Processing/Done — 기존 InfluencerPanel의 TABS를 복원한 것으로 `inf.sheetStatus` 정확히 일치 비교. pill·카드 없이 텍스트 + 2px 하단 인디케이터, 활성은 primary.main), 좌우 인셋은 목록 컬럼 한 곳(24px)에서만 관리하고 자식에는 가로 padding을 두지 않는다. 스크롤 영역과 상단 고정 묶음 모두 `scrollbar-gutter: stable`로 같은 거터를 예약한다 — 안 하면 스크롤되는 목록만 스크롤바 폭만큼 좁아져 우측이 어긋난다. 레일과 목록 사이에는 gap을 두지 않는다(구분은 레일 divider + 컬럼 인셋이 만든다). 하단은 좌 Visit schedule 레일(236px, 그룹별 인원 카운트, 자체 스크롤. 이름은 `toDisplayName`으로 정규화한 뒤 축약한다(목록 "Aurora Garcia" / 레일 "Aurora G." — 정규화가 축약보다 먼저다). 경보는 색 점이 아니라 이름 아래 짧은 상태 문구 'No visit/No upload/No credit/No-show'로 — 점은 색·모양만으로 정보를 전달해 WCAG 1.4.1 위반이고 어떤 문제인지도 알 수 없었다) + 우 목록(자체 스크롤)이 **한 화면에** 나란히. 목록은 Action required/Upcoming/Completed 섹션으로 나뉘고, 행은 컬럼 테이블이 아니라 **InfluencerListRow 요약 행**을 재사용한다 — 아바타+이름·방문시각·카테고리 태그 / 티어·플랫폼 / 상태·overdue·연락사유를 한 덩어리로 읽는다(운영 중엔 컬럼 분산보다 빠르다). 각 섹션은 1px divider 보더 + radius 6px 컨테이너로 묶어 하나의 운영 단위로 읽히게 한다(카드 아님 — 섀도 없음, 행 각각을 카드화하지 않음. 마지막 행의 하단 divider는 컨테이너 보더와 겹쳐 제거). 섹션 헤더는 컨테이너 안에서 sticky이고 접힘/펼침에 따라 radius가 5px ↔ 5px 5px 0 0으로 바뀐다. **섹션은 접었다 펼 수 있다** — 헤더 전체가 button(aria-expanded, 키보드 토글 가능)이고 좌측 chevron이 150ms 회전한다. 기본은 Action required만 펼침 — 긴 섹션을 접어 아래 섹션으로 바로 이동하는 게 목적이다. hover 시 action.hover 배경. 카드·섀도 없이 기존 섹션 헤더 표면(grey.50 + 1px divider)을 그대로 쓴다. 좌측 Visit schedule 레일의 그룹 헤더도 같은 표면·타이포를 공유한다(카운트만 레일에서는 우측 정렬 — 폭이 236px라 라벨과 안 멀어진다). 상태 소유 — 스토어는 셸이 소유(selectedStore/onStoreChange), 플랫폼·티어·카테고리는 `filters`를 주면 controlled·안 주면 내부 상태(uncontrolled fallback), 검색어·단계는 뷰 내부 일시 상태라 승격하지 않음. 결손 상태 — error는 목록을 지우지 않고 상단 배너+Retry, isLoading은 목록이 비었을 때만 스켈레톤(폴링 중 깜빡임 방지), 빈 상태는 필터 유무에 따라 문구와 Clear filters 분기. 레일은 250px 고정, 콘텐츠는 `maxWidth 1500 + mx:'auto'`로 **레일 오른쪽 남은 공간의 가운데**에 놓인다 — 넓은 모니터에서 콘텐츠가 왼쪽으로 쏠려 오른쪽에 큰 빈 덩어리가 생기는 것을 막는다. 상한을 두는 이유는 행이 전폭으로 늘어나면 이름과 상태 사이가 1,000px 넘게 벌어져 같은 행인데 시각적으로 끊기기 때문이다. 폭 상한은 목록이 아니라 KPI·툴바·탭까지 묶는 컨테이너 한 곳에 건다(목록만 묶으면 섹션마다 끝나는 자리가 달라진다). 컬럼에는 `data-content-column` 훅이 있어 스토리가 좌우 여백이 같은지 실측한다 (`components/templates/beautymaster/SaasOperationsView.jsx`)
- SaasAnalyticsView: Analytics 뷰. deriveAnalyticsSummary 기반 — 상단 스토어 Select 툴바(+우측 tracked 카운트) → Campaign summary → Conversion funnel(수평 바/표 토글, primary 단색 페이드) → Breakdown(Platform·Category) → Tier & Store 비교 테이블(BreakdownTable 내부 공용). 선택된 스토어로 influencers와 inviteCounts를 **함께** 좁힌다 — 퍼널 Invited 단계가 목록과 어긋나지 않도록. 데이터가 없어도 스토어 Select는 계속 보임(다른 스토어로 옮겨갈 수 있어야 하므로) (`components/templates/beautymaster/SaasAnalyticsView.jsx`)
- SaasWorkflowView: Workflow 뷰. WorkflowGuide와 같은 7단계 아코디언, 파일/툴/handoff 태그 구분. 상단에 스토어 Select 툴바. 하단 Files & systems는 선택된 스토어에 따라 링크가 달라짐 — `storeDocs[store][file.field]`에서 Tier1/2 동의서·매니저용 목록을 꺼내고, 스토어 미선택이면 "Select a store", 링크 미입력이면 "Not set for {store}" 안내로 대체. Stats bar 숫자는 PHASES/FILE_DEFS에서 파생(하드코딩 아님). 참조 문서이므로 success/warning/error 미사용 (`components/templates/beautymaster/SaasWorkflowView.jsx`)

### Overlay / 오버레이

- InfluencerDrawer: 인플루언서 상세 Drawer. 전체 데이터 + Contact(MessageTemplateMenu 포함) + 통계 표시 (`components/overlay-feedback/InfluencerDrawer.jsx`) 이름·아바타·플랫폼 표기는 목록 행과 **같은 출처**를 쓴다 — `toDisplayName`, `utils/influencerAvatar.js`의 `avatarInitials`/`avatarTint`, `normalizePlatform`. 예전에는 패널만 시트 원본("Aurora garcia")에 한 글자 회색 아바타, "Tiktok" 표기여서 행을 눌러 열면 방금 본 것과 다른 것이 나왔다.
- SheetSettingsModal: Google Sheets 연동 설정 모달. 멀티 소스(매장별 label + Processing/Done URL) + Invite counts("Number" 탭, optional) + Messages("Messages" 탭, optional — 발신 메시지 템플릿) + 폴링 간격 + Default store. "Publish to web" pubhtml 링크와 일반 "탭 우클릭 → 링크 복사" edit 링크(`/d/{ID}/edit#gid=`) 둘 다 CSV export URL로 변환 (`components/overlay-feedback/SheetSettingsModal.jsx`)
- MessageTemplateMenu: 발신 메시지 템플릿 선택 버튼+메뉴. influencer의 alertFlags/방문일 기준으로 매칭되는 템플릿을 "Suggested" 섹션에 우선 노출, 나머지는 "All Messages"에 나열. 선택 시 플레이스홀더 치환 후 클립보드 복사 + 스낵바 알림 (`components/overlay-feedback/MessageTemplateMenu.jsx`)
- parseMessageTemplatesCsv: Messages 탭 CSV 파서. Id/Label/Track(auto|manual)/Trigger Flag/Body 컬럼을 MessageTemplate 배열로 변환 (`utils/parseMessageTemplatesCsv.js`)

### Page / 페이지

- BeautymasterDashboard: 전체 대시보드 페이지. selectedId·drawerOpen 상태 + 양방향 스크롤 싱크 (`stories/page/BeautymasterDashboard.stories.jsx`)
