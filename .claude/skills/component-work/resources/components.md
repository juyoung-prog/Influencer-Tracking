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
- MentionListRow: 멘션(SNS 언급) 리스트 행. 핸들+수집경로 / 팔로워·ER·좋아요(tabular-nums, xs에서 숨김) / 게시일 / 상태 라벨 + 게시물 새탭 열기. 익명(unverified) 행은 ? 아바타 + 캡션 발췌 + Approve/Dismiss 버튼, below-threshold 행은 opacity 뮤트. 협업 인플루언서 매칭 시 secondary outline "Collab · 이름" 태그 (`components/data-display/MentionListRow.jsx`)
- MentionListRowSaas: MentionListRow의 모던 SaaS 문법 시안 변형(비교용). 데이터·컬럼 동일, 표면만 다름 — 라운드 hover 배경, soft tinted 상태 pill(alpha 8% 배경), pill 형태 Approve/Dismiss, tinted 아바타. 폰트는 부모의 Inter 스택 상속(fontFamily: inherit) (`components/data-display/MentionListRowSaas.jsx`)
- InfluencerListRowSaas: InfluencerListRow의 모던 SaaS 문법 시안 변형(비교용). 데이터·컬럼 동일, 표면만 다름 — 라운드 hover 배경(10px), tinted 아바타(primary alpha 8%), 진행 단계는 텍스트 컬러 대신 soft tinted pill, 카테고리는 grey pill. 폰트는 부모의 Inter 스택 상속(fontFamily: inherit) (`components/data-display/InfluencerListRowSaas.jsx`)

### Section / 섹션

- DashboardHeader: 대시보드 상단 섹션. 타이틀 + SyncStatusBar + KpiBar 조합. `sheetUrl` prop이 있으면 Settings 아이콘 옆에 연동된 구글시트를 새 탭으로 여는 아이콘 노출(없으면 숨김) (`components/templates/beautymaster/DashboardHeader.jsx`)
- SchedulePanel: 왼쪽 패널. Visit Schedule 레이블 + ScheduleTimeline. forwardRef(스크롤 싱크) (`components/templates/beautymaster/SchedulePanel.jsx`)
- InfluencerPanel: 오른쪽 패널(스마트). SearchBar + FilterBar + CategoryTab + 섹션별 InfluencerListRow 목록. 탭·필터·검색 상태 소유. forwardRef(스크롤 싱크) (`components/templates/beautymaster/InfluencerPanel.jsx`)
- AnalyticsDashboard: Analytics 탭 리포트 뷰. Funnel/Tier/Store/Category breakdown 조합, `inviteCounts` prop으로 초대 인원 데이터를 store 필터에 맞춰 반영. sticky 상단바(선택된 store chip + 섹션 점프 링크), Conversion Funnel은 바차트/표 토글. Campaign Summary를 제외한 각 섹션(Funnel/Top Influencers/Opinion/Platform/Category/Tier/Store)은 내부 `SectionCard`(outlined, 1px divider border, radius 1)로 감싸 독립된 카드 단위로 스캔되도록 함 — Divider로 이어붙인 리포트 흐름 대신 위젯 그리드 형태 (`components/templates/beautymaster/AnalyticsDashboard.jsx`)
- MentionsPanel: Mentions 탭 콘텐츠(스마트). 일일 크롤로 수집된 영어 키워드 멘션 트래킹 시안. KPI 스트립(New Today·Qualified·Review Queue(warning)·Contacted·Avg ER) + 마지막 크롤 시각 캡션, SearchBar + 플랫폼/상태 Chip 필터, REVIEW QUEUE(수동 확인)/QUALIFIED(1만+ & ER 통과)/BELOW THRESHOLD 3개 섹션 리스트(MentionListRow). 상수·mock 데이터는 `data/beautymaster/mentions.js` (파이프라인 연결 전까지 MOCK_MENTIONS 사용) (`components/templates/beautymaster/MentionsPanel.jsx`)
- MentionsPanelSaas: MentionsPanel의 모던 SaaS 문법 시안 변형(비교·검토용, 대시보드 미연결). 로직 동일, 표면만 다름 — grey.50 캔버스 위 라운드 카드(radius 16px) + 레이어드 소프트 섀도 + Inter Variable(@fontsource, 컴포넌트에서 import), KPI는 개별 스탯 카드 5장, 섹션은 헤더(제목+부제+카운트 pill) 있는 카드 단위로 분리(MentionListRowSaas). 프로젝트 기본 flat 문법과 의도적으로 다른 시안임 (`components/templates/beautymaster/MentionsPanelSaas.jsx`)
- OperationsPanelSaas: Operations 뷰(DashboardHeader+SchedulePanel+InfluencerPanel 조합)의 모던 SaaS 문법 시안 변형(비교·검토용, 대시보드 미연결). 같은 데이터 규칙, 표면만 다름 — grey.50 캔버스 위 라운드 카드(16px) + 레이어드 소프트 섀도 + Inter Variable, KPI는 개별 스탯 카드 5장(Total/Agreement/Visit/Upload/Credit, deriveKpiSummary 내부 파생), 왼쪽 Visit schedule 카드(오늘·날짜별·과거 그룹) + 오른쪽 SearchBar·플랫폼/티어 Chip 필터 + Action required/Upcoming/Completed 섹션 카드(InfluencerListRowSaas). MentionsPanelSaas와 같은 시안 문법 공유 (`components/templates/beautymaster/OperationsPanelSaas.jsx`)
- WorkflowGuide: Workflow 탭 콘텐츠. 인플루언서 업무 7단계를 MUI Accordion으로 표시(01 Prepare만 기본 open, 번호 마커+연결선으로 순서 강조), 관련 파일(grey.100 filled 태그)·외부 툴(outline 태그)·Store Manager handoff(secondary 태그) 구분 — 파일 태그는 `resolveFileHref`로 Files & Systems와 같은 링크를 공유해 링크 있으면 그 자리에서 바로 클릭 가능. Divider+REFERENCE 라벨로 구분한 하단 Files & Systems 그리드는 `selectedStore`/`storeDocs`/`influencerTrackingListUrl` prop으로 실제 링크 렌더링 — Tier1/2 Consent Form·Tier1/2 Influencer Tracking List (manager)는 store별로 다른 값(Links 시트 탭에서 polling), Influencer Tracking List는 스토어 무관 고정 링크. 스토어 미선택/링크 미입력 시 클릭 대신 안내 문구 표시. success/warning/error 미사용 — 상태 화면이 아닌 참조 문서이기 때문 (`components/templates/beautymaster/WorkflowGuide.jsx`)
- parseStoreDocsCsv: Links 탭 CSV 파서. Store별 Tier1/Tier2 Consent Form URL·Tier1/Tier2 Influencer List URL을 `{ [store]: {...} }` 형태로 반환 (`utils/parseStoreDocsCsv.js`)

### Page / 페이지 시안 (flat-SaaS)

전형적 모던 SaaS 문법(modern_saas_design_core_features.md 기반) 대시보드 시안(비교·검토용, 대시보드 미연결). Linear/Vercel/Stripe 방향 — White 배경 + thin 1px border + 8px radius + 섀도 없음 + Inter, 카드 최소화(KPI 배경 직접 배치·border/spacing 구획), Table 중심, dot+label Status-first, accent는 theme `primary.main`(#0000FF) 1색. 기존 대시보드와 **같은 4분할(Operations/Mentions/Analytics/Workflow)**을 따르고 표면 문법만 다름 — 라운드 카드+소프트 섀도 시안(MentionsPanelSaas/OperationsPanelSaas)과 대비됨. 본문은 중앙 정렬 max-width 없이 프레임을 가득 채운다(운영형 SaaS 공간 포화). 컨트롤 문법 공통: 검색 input·Select는 높이 36px, 필터 chip은 32px, 모두 radius 6px에 섀도 없음(pill 금지), 필터 그룹은 vertical Divider로 구분하고 Reset은 chip이 아닌 저강도 text action.

- SaasShell: flat-SaaS 시안 셸. 좌측 고정 사이드바 192px(grey.50, 활성 항목 white+border, Operations 카운트) + 유동 본문(flex column, overflow hidden — 스크롤은 각 뷰가 소유). 본문 최상단에 글로벌 헤더 행(우측 정렬: Last synced 시각 + Refresh / Open Google Sheet / Settings 아이콘 18px, 배경·섀도 없이 hover만) — 기존 DashboardHeader의 유틸리티 자리. `sheetUrl`을 주면 Open Google Sheet가 새 탭 링크가 되고, 없으면 아이콘 자체를 숨긴다. 네비는 기존 탭 구성 Operations/Mentions/Analytics/Workflow. SAAS_FONT 상수 export. `sidebar-nav-shell` 아키타입 (`components/templates/beautymaster/SaasShell.jsx`)
- SaasDashboardMockup: flat-SaaS 조립 진입점. activeView를 소유하고 SaasShell + 4개 뷰를 조합. 스토어는 Operations/Analytics/Workflow가 공유하므로 여기서 한 번만 들고 세 뷰에 내려보낸다 — 뷰를 옮겨도 보던 스토어가 유지된다. selectedStore는 controlled/uncontrolled 둘 다 지원(페이지가 config.defaultStore로 시딩하는 경우 때문). isLoading/error/onRetry/sheetUrl도 각 뷰·셸로 전달. **실서비스 BeautymasterDashboard가 `?ui=saas`일 때 이걸 렌더한다** — 이름은 mockup이지만 더 이상 목업 전용이 아니며, 레거시 제거 시 개명 예정 (`components/templates/beautymaster/SaasDashboardMockup.jsx`)
- SaasKpiItem: flat-SaaS KPI 스트립 셀 프리미티브. 카드가 아니라 배경 위 직접 배치, 좌측 1px divider로만 구분(isFirst는 생략), `total` 주면 "of N" 병기, `isAlert`면 warning 색. Operations/Mentions 뷰가 공유 (`components/templates/beautymaster/SaasKpiItem.jsx`)
- SaasStoreSelect: flat-SaaS 스토어 선택 드롭다운. Operations/Analytics/Workflow 세 뷰가 같은 스토어 상태를 공유하므로 컨트롤도 하나로 공유한다 — 어디서 바꾸든 나머지가 따라옴. 높이 36px·radius 6px로 검색 input과 같은 컨트롤 문법. `stores`가 비면 렌더하지 않음. 상수 `ALL_STORES`·헬퍼 `deriveStores`는 eslint(only-export-components) 때문에 `data/beautymaster/schema.js`에 있음 (`components/templates/beautymaster/SaasStoreSelect.jsx`)
- SaasOperationsView: Operations 뷰. 기존 SchedulePanel+InfluencerPanel과 같은 구성 — 상단 KPI 스트립(Agreement/Visit/Upload/Credit) + 우측 Needs attention 배너(Review 클릭 시 목록 필터), 필터 툴바는 검색 | 스토어 Select | 플랫폼 | 티어 | 카테고리 순서에 Divider 구분, 하단은 좌 Visit schedule 레일(236px, 그룹별 인원 카운트, 자체 스크롤) + 우 목록(자체 스크롤)이 **한 화면에** 나란히. 목록은 섹션 헤더 행으로 Action required/Upcoming/Completed를 나눈 단일 stickyHeader 테이블(그룹을 나눠도 컬럼 정렬 유지). 상태 소유 — 스토어는 셸이 소유(selectedStore/onStoreChange), 플랫폼·티어·카테고리는 `filters`를 주면 controlled·안 주면 내부 상태(uncontrolled fallback), 검색어·단계는 뷰 내부 일시 상태라 승격하지 않음. 결손 상태 — error는 목록을 지우지 않고 상단 배너+Retry, isLoading은 목록이 비었을 때만 스켈레톤(폴링 중 깜빡임 방지), 빈 상태는 필터 유무에 따라 문구와 Clear filters 분기 (`components/templates/beautymaster/SaasOperationsView.jsx`)
- SaasMentionsView: Mentions 뷰. MentionsPanel과 같은 데이터·섹션 분류를 flat-SaaS 문법으로 옮김 — KPI 스트립(New today/Qualified/Review queue(warning)/Contacted/Avg ER) + 마지막 크롤 캡션, 검색 | 플랫폼 | 상태 필터 툴바, Review queue/Qualified/Below threshold를 섹션 헤더 행으로 나눈 단일 테이블(Account·Platform·Followers·ER·Posted·Status). 익명(unverified) 행은 ? 아바타 + 캡션 발췌 + Approve/Dismiss, below-threshold 행은 opacity 뮤트, 상태는 dot+label. SaasOperationsView와 같은 결손 상태 규약 (`components/templates/beautymaster/SaasMentionsView.jsx`)
- SaasAnalyticsView: Analytics 뷰. deriveAnalyticsSummary 기반 — 상단 스토어 Select 툴바(+우측 tracked 카운트) → Campaign summary → Conversion funnel(수평 바/표 토글, primary 단색 페이드) → Breakdown(Platform·Category) → Tier & Store 비교 테이블(BreakdownTable 내부 공용). 선택된 스토어로 influencers와 inviteCounts를 **함께** 좁힌다 — 퍼널 Invited 단계가 목록과 어긋나지 않도록. 데이터가 없어도 스토어 Select는 계속 보임(다른 스토어로 옮겨갈 수 있어야 하므로) (`components/templates/beautymaster/SaasAnalyticsView.jsx`)
- SaasWorkflowView: Workflow 뷰. WorkflowGuide와 같은 7단계 아코디언, 파일/툴/handoff 태그 구분. 상단에 스토어 Select 툴바. 하단 Files & systems는 선택된 스토어에 따라 링크가 달라짐 — `storeDocs[store][file.field]`에서 Tier1/2 동의서·매니저용 목록을 꺼내고, 스토어 미선택이면 "Select a store", 링크 미입력이면 "Not set for {store}" 안내로 대체. Stats bar 숫자는 PHASES/FILE_DEFS에서 파생(하드코딩 아님). 참조 문서이므로 success/warning/error 미사용 (`components/templates/beautymaster/SaasWorkflowView.jsx`)

### Overlay / 오버레이

- InfluencerDrawer: 인플루언서 상세 Drawer. 전체 데이터 + Contact(MessageTemplateMenu 포함) + 통계 표시 (`components/overlay-feedback/InfluencerDrawer.jsx`)
- SheetSettingsModal: Google Sheets 연동 설정 모달. 멀티 소스(매장별 label + Processing/Done URL) + Invite counts("Number" 탭, optional) + Messages("Messages" 탭, optional — 발신 메시지 템플릿) + 폴링 간격 + Default store. "Publish to web" pubhtml 링크와 일반 "탭 우클릭 → 링크 복사" edit 링크(`/d/{ID}/edit#gid=`) 둘 다 CSV export URL로 변환 (`components/overlay-feedback/SheetSettingsModal.jsx`)
- MessageTemplateMenu: 발신 메시지 템플릿 선택 버튼+메뉴. influencer의 alertFlags/방문일 기준으로 매칭되는 템플릿을 "Suggested" 섹션에 우선 노출, 나머지는 "All Messages"에 나열. 선택 시 플레이스홀더 치환 후 클립보드 복사 + 스낵바 알림 (`components/overlay-feedback/MessageTemplateMenu.jsx`)
- parseMessageTemplatesCsv: Messages 탭 CSV 파서. Id/Label/Track(auto|manual)/Trigger Flag/Body 컬럼을 MessageTemplate 배열로 변환 (`utils/parseMessageTemplatesCsv.js`)

### Page / 페이지

- BeautymasterDashboard: 전체 대시보드 페이지. selectedId·drawerOpen 상태 + 양방향 스크롤 싱크 (`stories/page/BeautymasterDashboard.stories.jsx`)
