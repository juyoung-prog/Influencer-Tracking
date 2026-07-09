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
- InfluencerListRow: 인플루언서 리스트 행. 가로형. avatar + 이름/시간/노트 + 플랫폼·티어 + 스테이지 + overdue + 노쇼/일정변경 연락 상태 배지(warning 컬러, contactStatus가 no-response면 경과일수 강조) (`components/data-display/InfluencerListRow.jsx`)
- InfluencerFilterBar: 스토어·월·플랫폼·티어 필터 바 (`components/data-display/InfluencerFilterBar.jsx`)
- ScheduleTimeline: 방문 일정 타임라인 패널. 날짜 그룹(오늘·예정·과거·미정)별 행 (`components/data-display/ScheduleTimeline.jsx`)
- InfluencerFunnel: Invited → Credit Used 전환 퍼널. "Number" 탭 초대 인원 데이터가 있으면 Invited/Agreement 사이에 Responded 단계 추가 표시 (`components/data-display/InfluencerFunnel.jsx`)
- StoreBreakdown: 스토어별 성과 비교 테이블. Count 옆 Invited 컬럼(해당 스토어 초대 데이터 있을 때만 표시) (`components/data-display/StoreBreakdown.jsx`)
- CategoryBreakdown: 카테고리(General/K-Beauty/Specific)별 성과 비교 테이블. Count 옆 Invited 컬럼 (`components/data-display/CategoryBreakdown.jsx`)
- FunnelSummaryTable: InfluencerFunnel과 같은 데이터의 표 형태 버전. Stage/Count/% of Invited 3컬럼, Invited 행 아래 Tier별 초대 인원 caption. AnalyticsDashboard에서 InfluencerFunnel과 토글로 전환(둘 다 항상 렌더링하지 않음) (`components/data-display/FunnelSummaryTable.jsx`)
- TierMetricsTable: Tier가 행인 통합 지표 테이블. Invited/Agreement(%)/Visited(%)/Scheduled/Content(%), Total 행은 raw count 합산 후 재계산. 예전 컬럼형 TierComparison을 대체함(삭제됨, 중복 뷰 정리) (`components/data-display/TierMetricsTable.jsx`)

### Section / 섹션

- DashboardHeader: 대시보드 상단 섹션. 타이틀 + SyncStatusBar + KpiBar 조합. `sheetUrl` prop이 있으면 Settings 아이콘 옆에 연동된 구글시트를 새 탭으로 여는 아이콘 노출(없으면 숨김) (`components/templates/beautymaster/DashboardHeader.jsx`)
- SchedulePanel: 왼쪽 패널. Visit Schedule 레이블 + ScheduleTimeline. forwardRef(스크롤 싱크) (`components/templates/beautymaster/SchedulePanel.jsx`)
- InfluencerPanel: 오른쪽 패널(스마트). SearchBar + FilterBar + CategoryTab + 섹션별 InfluencerListRow 목록. 탭·필터·검색 상태 소유. forwardRef(스크롤 싱크) (`components/templates/beautymaster/InfluencerPanel.jsx`)
- AnalyticsDashboard: Analytics 탭 리포트 뷰. Funnel/Tier/Store/Category breakdown 조합, `inviteCounts` prop으로 초대 인원 데이터를 store 필터에 맞춰 반영. sticky 상단바(선택된 store chip + 섹션 점프 링크), Conversion Funnel은 바차트/표 토글 (`components/templates/beautymaster/AnalyticsDashboard.jsx`)

### Overlay / 오버레이

- InfluencerDrawer: 인플루언서 상세 Drawer. 전체 데이터 + Contact + 통계 표시 (`components/overlay-feedback/InfluencerDrawer.jsx`)
- SheetSettingsModal: Google Sheets 연동 설정 모달. 멀티 소스(매장별 label + Processing/Done URL) + Invite counts("Number" 탭, optional) + 폴링 간격 + Default store. "Publish to web" pubhtml 링크와 일반 "탭 우클릭 → 링크 복사" edit 링크(`/d/{ID}/edit#gid=`) 둘 다 CSV export URL로 변환 (`components/overlay-feedback/SheetSettingsModal.jsx`)

### Page / 페이지

- BeautymasterDashboard: 전체 대시보드 페이지. selectedId·drawerOpen 상태 + 양방향 스크롤 싱크 (`stories/page/BeautymasterDashboard.stories.jsx`)
