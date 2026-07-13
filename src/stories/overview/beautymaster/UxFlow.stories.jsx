import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../../../components/storybookDocumentation';

export default {
  title: 'Overview/BeautyMaster/UX Flow',
  parameters: {
    layout: 'padded',
  },
};

/* ─── 공통 스타일 ─────────────────────────────────── */
const mono = { fontFamily: 'monospace', fontSize: 12 };
const tag = (label, color) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      px: 0.75,
      py: 0.25,
      fontSize: 11,
      fontWeight: 600,
      color: `${color}.main`,
      border: '1px solid',
      borderColor: `${color}.main`,
      lineHeight: 1.4,
    }}
  >
    {label}
  </Box>
);

const CODE_BLOCK = { backgroundColor: 'grey.100', p: 2, fontSize: 12, fontFamily: 'monospace', overflow: 'auto', lineHeight: 1.7 };

/* ─── 유저 시나리오 데이터 ────────────────────────── */
const SCENARIOS = [
  {
    num: '01',
    title: '오늘 방문자 확인',
    badge: '핵심',
    goal: '오늘 방문 예정 인플루언서를 방문 시간 순서로 빠르게 파악',
    steps: [
      '대시보드 접속 → 구글시트 CSV 폴링 자동 시작',
      '좌측 Schedule View에서 TODAY 그룹 즉시 확인 (Time 오름차순 정렬)',
      '각 행에서 이름 · 방문 시각 · 상태 아이콘 4개 한눈에 확인',
      '이름 클릭 → Drawer 오픈 → 소셜 계정 · Note 확인',
    ],
    success: '스크롤 없이 오늘 방문 순서를 3초 이내 파악',
    exception: 'Time 컬럼 비어 있으면 "시간 미정" 표시, 목록 하단 배치',
  },
  {
    num: '02',
    title: '이상 케이스 처리',
    badge: '핵심',
    goal: '즉시 액션이 필요한 케이스 (방문 미확인, 업로드 대기 등) 식별',
    steps: [
      '우측 Alert 배너에서 액션 필요 인원 수 확인',
      '배너 클릭 또는 스크롤 → 인플루언서별 요구 액션 확인',
      '노쇼/일정변경 배지가 뜬 인플루언서는 Contact Status(응답대기·무응답) 확인 후 재연락 여부 판단',
      '해당 인플루언서 클릭 → Drawer에서 Note 이력 파악',
      '구글시트에서 직접 조치 → 60초 이내 대시보드 자동 갱신 확인',
    ],
    success: '"지금 내가 뭘 해야 하는가"가 배너만 봐도 즉시 파악',
    exception: '이상 케이스 없으면 Alert 배너 미표시 (공간 차지 안 함)',
  },
  {
    num: '03',
    title: '전체 현황 점검',
    badge: '',
    goal: '그랜드 오프닝 전체 단계별 진행 수를 빠르게 파악',
    steps: [
      '헤더 KPI 한 줄에서 총원 · 동의 · 방문 · 업로드 · 크레딧 완료 수 확인',
      'Store / Month / Platform / Tier 필터로 특정 그룹만 좁혀 보기',
      '인플루언서 리스트에서 개별 행의 상태 확인',
    ],
    success: '페이지 상단만 봐도 전체 진행률 파악 가능',
    exception: '데이터 없을 때 Skeleton 상태 표시',
  },
  {
    num: '04',
    title: '콘텐츠 성과 평가',
    badge: '',
    goal: '콘텐츠 업로드 인플루언서의 성과 확인 (업로드 후 한 달 경과 시점)',
    steps: [
      'Done 탭 필터 → 완료 인플루언서만 리스트에 표시',
      '행 클릭 → Drawer에서 Views · Likes 등 성과 지표 + Opinion 확인',
      'Collabo Link 클릭 → 소셜 콘텐츠 새 탭 오픈',
    ],
    success: 'Drawer 한 화면에서 성과 지표와 콘텐츠 링크 동시 확인',
    exception: 'Opinion 미입력 상태는 "평가 대기" 뱃지로 표시',
  },
  {
    num: '05',
    title: '새 팀원 온보딩 (Workflow 탭)',
    badge: '핵심',
    goal: '처음 인플루언서 업무를 맡은 팀원이 담당자 설명 없이 전체 프로세스를 스스로 파악',
    steps: [
      'Workflow 탭 진입 → 상단 통계(7 단계 · 5 파일 · 1 handoff)로 규모 파악',
      '01 Prepare부터 순서대로 카드를 펼쳐보며 체크리스트 확인',
      '각 단계의 "관련 파일 · 툴" 태그로 실제로 열어야 할 시트/툴 파악',
      'Files & Systems 섹션에서 각 파일의 용도와 담당(내부용/공유용)을 재확인',
    ],
    success: '문서 하나로 처음 업무를 시작할 수 있음 — 담당자에게 구두로 다시 묻지 않아도 됨',
    exception: '전체가 다 펼쳐져 있으면 처음 보는 사람에게는 부담 — 기본은 01 Prepare만 펼침, 나머지는 접힘',
  },
  {
    num: '06',
    title: '지금 하는 일이 어디에 기록되는지 확인',
    badge: '핵심',
    goal: '업무 도중 "이거 어느 시트에 적어야 하지?" 순간에 빠르게 답 찾기',
    steps: [
      '지금 하고 있는 작업과 일치하는 단계 카드를 펼침',
      '체크리스트에서 지금 하는 작업 항목을 확인',
      '옆의 "관련 파일 · 툴" 태그 확인 — 채워진 태그는 기록이 필요한 파일',
      '태그의 파일명으로 Files & Systems에서 상세 설명 재확인',
    ],
    success: '3번 클릭 이내에 "어느 시트, 어느 컬럼"까지 도달',
    exception: 'Find·Send 단계처럼 태그가 없는 경우 Wix/DM 안에서 끝나는 작업 — 태그가 없는 것 자체가 "시트 기록 불필요"라는 정보',
  },
  {
    num: '07',
    title: '담당자 부재 시 업무 커버',
    badge: '핵심',
    goal: '원래 담당자가 자리를 비웠을 때 다른 팀원이 중단된 지점부터 이어받기',
    steps: [
      'Influencer Tracking List에서 해당 인플루언서의 마지막 상태(Contact Status 등) 확인',
      '그 상태에 대응하는 단계를 Workflow 탭에서 찾음 (예: pending-reply → 05 Follow Up)',
      '해당 단계 체크리스트를 보고 다음 행동 결정',
      'Store Manager handoff가 필요한 단계(06 Share)인지 배지로 확인',
    ],
    success: '담당자 본인의 설명 없이도 다음 행동을 스스로 판단 가능',
    exception: '두 단계에 걸친 케이스(팔로업 중 + 공유 대기)는 두 카드를 모두 확인해야 함 — 향후 상태 기반 하이라이트로 개선 여지',
  },
  {
    num: '08',
    title: '프로세스 변경 논의',
    badge: '',
    goal: '팀 회의에서 특정 단계를 바꾸자는 논의가 나왔을 때 공통 기준점으로 사용',
    steps: [
      'Workflow 탭을 공유 화면에 띄우고 논의할 단계로 스크롤',
      '체크리스트 항목 단위로 변경 지점을 지목',
      '변경 확정 시 체크리스트 · 파일 태그를 함께 업데이트',
    ],
    success: '말로 설명하는 대신 문서를 함께 보며 논의 가능',
    exception: '문서가 실제 운영과 어긋나면(stale) 오히려 혼란 — 콘텐츠 업데이트 오너가 필요 (미해결 과제)',
  },
];

/* ─── 데이터 모델 필드 ─────────────────────────────── */
const MODEL_FIELDS = [
  { group: '식별', fields: [
    ['id', 'string', 'derived', '`${sheetTab}_${rowIndex}` — 시트에 고유 ID 없으므로 파생'],
    ['sheetStatus', "'Processing' | 'Done'", 'derived', '탭 구분'],
  ]},
  { group: '공통 메타', fields: [
    ['store', 'string', 'Store', 'e.g. "G10"'],
    ['month', 'number', 'Month', 'parseInt'],
    ['barcode', 'string', 'Barcode', '그대로'],
    ['tier', "'tier1' | 'tier2'", 'derived', 'barcode length 비교로 파생 (G10INF2026 → T1 / G10INF202620 → T2)'],
    ['platform', "'Instagram' | 'TikTok'", 'Platform', '그대로'],
    ['category', "'general' | 'kbeauty' | 'specific'", 'Category', 'toLowerCase'],
    ['creditType', "'$100 Credit' | '$20 Credit_Tier2'", 'Type', '그대로'],
  ]},
  { group: '프로필', fields: [
    ['imageUrl', 'string', 'Image', '그대로'],
    ['fullName', 'string', 'Full name', '그대로'],
    ['socialAccountUrl', 'string', 'Social Account', '클릭 시 새 탭 오픈'],
    ['email', 'string', 'Email', '그대로'],
    ['scheduledTime', 'Date | null', 'Time', 'Date 파싱 실패 시 null → scheduleGroup: no-time'],
  ]},
  { group: '상태 체크', fields: [
    ['agreement', 'boolean', 'Agreement', '"TRUE"/체크 → true'],
    ['attend', 'boolean', 'Attend', '"TRUE"/체크 → true'],
    ['collaboShared', 'boolean', 'Collabo Shared', '"TRUE"/체크 → true'],
    ['collaboLink', 'string', 'Collabo Link', 'URL 또는 빈 문자열'],
    ['uploadDate', 'Date | null', 'Upload Date', 'Date 파싱 실패 시 null'],
    ['creditShared', 'boolean', 'Credit Shared', '"TRUE"/체크 → true'],
    ['creditUsed', 'boolean', 'Credit Used', '"TRUE"/체크 → true'],
    ['serialNumber', 'string', 'serial#', '그대로'],
  ]},
  { group: '연락 상태 (노쇼 · 일정변경)', fields: [
    ['contactReason', "'no-show' | 'reschedule-request' | null", 'Contact Reason', '재연락 유발 사유'],
    ['contactStatus', "'pending-reply' | 'replied' | 'no-response' | null", 'Contact Status', '재연락 응답 상태'],
    ['lastContactDate', 'Date | null', 'Last Contact Date', '최근 연락 시각, 무응답 경과일 계산 기준'],
    ['requestedDate', 'Date | null', 'Requested Date', '인플루언서가 제시한 희망일 — 확정 전 임시값, 확정 시 scheduledTime으로 승격'],
  ]},
  { group: '성과 · 평가 (Drawer 전용)', fields: [
    ['opinion', "'USE' | 'MAYBE' | \"DON'T\" | null", 'Opinion', '한 달 후 성과 평가'],
    ['views', 'number | null', 'Views', 'parseInt, 실패 시 null'],
    ['likes', 'number | null', 'Likes', 'parseInt, 실패 시 null'],
    ['shares', 'number | null', 'Shares', 'parseInt, 실패 시 null'],
    ['saves', 'number | null', 'Saves', 'parseInt, 실패 시 null'],
    ['comments', 'number | null', 'Comments', 'parseInt, 실패 시 null'],
    ['reposts', 'number | null', 'Reposts', 'parseInt, 실패 시 null'],
    ['note', 'string', 'Note', '그대로'],
  ]},
  { group: 'Derived (프론트 계산)', fields: [
    ['alertFlags', 'AlertFlag[]', '—', 'boolean 조합으로 계산. 서버 저장 없음'],
    ['scheduleGroup', "'today' | 'upcoming' | 'past' | 'no-time'", '—', 'scheduledTime 기준 분류'],
  ]},
];

/* ─── 컴포넌트 리스트 (Operations 탭 기준 — 실제 구현과 동기화됨) ─── */
/* Analytics 탭 컴포넌트는 AnalyticsPlan.stories.jsx, 시트 연동은 SheetConnectionPlan.stories.jsx 참고 */
const COMPONENTS = [
  { name: 'AppShell', desc: '전역 헤더 + 사이드 네비 래퍼 (App.jsx에서 앱 전체에 적용)', type: '재활용', path: 'components/layout/AppShell.jsx' },
  { name: 'CategoryTab', desc: 'All / Processing / Done 탭 전환', type: '재활용', path: 'components/in-page-navigation/CategoryTab.jsx' },
  { name: 'SearchBar', desc: '인플루언서 이름 검색', type: '재활용', path: 'components/input/SearchBar.jsx' },
  { name: 'MUI Avatar', desc: '인플루언서 프로필 이미지 (리스트 행 · Drawer)', type: '재활용', path: 'MUI' },
  { name: 'MUI Drawer', desc: '인플루언서 상세 패널', type: '재활용', path: 'MUI' },
  { name: 'MUI Skeleton', desc: '데이터 로딩 플레이스홀더', type: '재활용', path: 'MUI' },
  { name: 'MUI Tooltip', desc: '상태 아이콘 · 동기화 버튼 설명', type: '재활용', path: 'MUI' },
  { name: 'MUI Select', desc: '필터 · 시트 설정 드롭다운', type: '재활용', path: 'MUI' },
  { name: 'MUI Alert', desc: 'CSV 로드 실패 에러 배너', type: '재활용', path: 'MUI' },
  { name: 'MUI IconButton', desc: '새로고침 · 설정 버튼', type: '재활용', path: 'MUI' },
  { name: 'KpiBar', desc: '헤더 KPI 한 줄 요약 — 총원 · 동의 · 방문 · 업로드 · 크레딧', type: '신규', path: 'components/data-display/KpiBar.jsx' },
  { name: 'StatusIconRow', desc: '동의 · 방문 · 업로드 · 크레딧 아이콘 4개 한 줄', type: '신규', path: 'components/data-display/StatusIconRow.jsx' },
  { name: 'InfluencerListRow', desc: '가로형 리스트 행 — avatar + 이름/시간/노트 + 플랫폼·티어 + 스테이지 + overdue + 노쇼/일정변경 연락 배지. 최종 UI는 카드 그리드가 아니라 이 리스트 행으로 결정됨', type: '신규', path: 'components/data-display/InfluencerListRow.jsx' },
  { name: 'InfluencerFilterBar', desc: 'Store · Month · Platform · Tier 필터 바', type: '신규', path: 'components/data-display/InfluencerFilterBar.jsx' },
  { name: 'ScheduleTimeline', desc: 'Time 기준 정렬 방문 예정 리스트 (TODAY 강조)', type: '신규', path: 'components/data-display/ScheduleTimeline.jsx' },
  { name: 'InfluencerDrawer', desc: '성과지표 · Note · Collabo Link · Opinion 상세 패널', type: '신규', path: 'components/overlay-feedback/InfluencerDrawer.jsx' },
  { name: 'SyncStatusBar', desc: '마지막 동기화 시각 + 새로고침 버튼', type: '신규', path: 'components/layout/SyncStatusBar.jsx' },
  { name: 'DashboardHeader', desc: '상단 섹션 — 타이틀 + SyncStatusBar + KpiBar 조합', type: '신규', path: 'components/templates/beautymaster/DashboardHeader.jsx' },
  { name: 'SchedulePanel', desc: '좌측 패널 — Visit Schedule 레이블 + ScheduleTimeline', type: '신규', path: 'components/templates/beautymaster/SchedulePanel.jsx' },
  { name: 'InfluencerPanel', desc: '우측 패널(스마트) — SearchBar + FilterBar + CategoryTab + 섹션별 InfluencerListRow', type: '신규', path: 'components/templates/beautymaster/InfluencerPanel.jsx' },
  { name: 'useSheetData', desc: '구글시트 CSV fetch + localStorage 설정 + 60초 폴링 훅. storeDocs(store별 문서 링크)·influencerTrackingListUrl(공통 고정 링크)도 함께 반환', type: '신규', path: 'src/hooks/useSheetData.js' },
  { name: 'parseInfluencerCsv', desc: 'CSV row → Influencer 객체 변환 유틸', type: '신규', path: 'src/utils/parseInfluencerCsv.js' },
  { name: 'InfluencerCard', desc: '초기 기획은 카드 그리드였으나 최종 UI는 리스트로 피벗됨. 컴포넌트는 남아있고 ComponentGalleryPage 데모에서만 사용, 실제 대시보드에는 미연결', type: '수정', path: 'components/card/InfluencerCard.jsx' },
  { name: 'AlertBanner', desc: '경보 배너로 계획했으나 실제로는 InfluencerPanel의 "ACTION REQUIRED" 섹션이 그 역할을 대체함. ComponentGalleryPage 데모 전용, 실제 대시보드에는 미연결', type: '수정', path: 'components/overlay-feedback/AlertBanner.jsx' },
  { name: 'WorkflowGuide', desc: 'Workflow 탭 콘텐츠 — 구현 완료. 7단계 아코디언 + Files & Systems, `selectedStore`/`storeDocs`/`influencerTrackingListUrl` prop으로 스토어별 실제 문서 링크 렌더링(단계 안 파일 태그도 동일 로직으로 클릭 가능)', type: '신규', path: 'components/templates/beautymaster/WorkflowGuide.jsx' },
  { name: 'parseStoreDocsCsv', desc: 'Links 탭 CSV → `{ [store]: { tier1ConsentFormUrl, tier2ConsentFormUrl, tier1InfluencerListUrl, tier2InfluencerListUrl } }` 변환 유틸', type: '신규', path: 'src/utils/parseStoreDocsCsv.js' },
  { name: 'MUI Accordion', desc: 'Workflow 단계별 펼침/접힘. 기본값: 01 Prepare만 open', type: '신규', path: 'MUI' },
  { name: 'FileTag / ToolTag / HandoffTag', desc: 'Workflow 전용 커스텀 태그(Box 기반, MUI Chip 아님). FileTag는 href 있으면 <a>로 렌더 — 관련 파일 · 툴 · Handoff 배지 구분', type: '신규', path: 'components/templates/beautymaster/WorkflowGuide.jsx (내부)' },
];

const typeColor = (t) => t === '신규' ? 'error' : t === '수정' ? 'warning' : 'success';

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster — UX Flow"
        status="Available"
        note="Operations · Analytics · Workflow 모두 구현 완료. Workflow는 Links 시트 기반 store별 실제 문서 링크까지 연동됨"
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="3.3"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>UX Flow</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          유저 시나리오 · 정보 구조(IA) · 라우팅 · 데이터 모델 · 컴포넌트 리스트
        </Typography>

        {/* ① 유저 시나리오 */}
        <SectionTitle title="유저 시나리오" />
        {SCENARIOS.map((s) => (
          <Box key={s.num} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ ...mono, color: 'text.disabled' }}>{s.num}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{s.title}</Typography>
              {s.badge && tag(s.badge, 'primary')}
            </Box>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '14%', verticalAlign: 'top' }}>목표</TableCell>
                    <TableCell>{s.goal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>플로우</TableCell>
                    <TableCell sx={{ p: 0 }}>
                      <Table size="small">
                        <TableBody>
                          {s.steps.map((step, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ ...mono, color: 'text.disabled', width: 28, borderBottom: 'none' }}>{i + 1}</TableCell>
                              <TableCell sx={{ borderBottom: i === s.steps.length - 1 ? 'none' : undefined }}>{step}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>성공 조건</TableCell>
                    <TableCell>{s.success}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>예외</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{s.exception}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Divider sx={{ my: 4 }} />

        {/* ② UX 플로우 다이어그램 */}
        <SectionTitle title="UX 플로우 다이어그램" />
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '22%' }}>단계</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>내용</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '28%' }}>분기 / 결과</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['접속', '대시보드 URL 진입', 'CSV 폴링 시작 (Processing + Done 탭)'],
                ['데이터 로드', 'Published CSV fetch', '성공 → 렌더링 / 실패 → 에러 배너 + 재시도'],
                ['렌더링', '대시보드 3영역 동시 표시', '① Schedule View (좌) ② Alert 배너 (우상) ③ 그리드 (우하)'],
                ['Schedule View', 'Time 오름차순 정렬', 'TODAY 그룹 강조 → UPCOMING → 시간 미정'],
                ['Alert 배너', '이상 케이스 감지', '있음 → 유형별 인원 수 배너 표시 / 없음 → 미표시'],
                ['그리드', '필터 적용', 'Store / Month / Platform / Tier / 탭 필터 → 카드 재렌더'],
                ['카드 클릭', '진입점 2곳 (Schedule 행 OR 카드)', 'Drawer 즉시 오픈 — 그리드 스크롤 이동 없음'],
                ['Drawer', '성과 · Note · Collabo Link 표시', 'Collabo Link 클릭 → 소셜 계정 새 탭'],
                ['자동 갱신', '60초 폴링 인터벌', '→ 데이터 로드 단계로 반복'],
              ].map(([step, content, result]) => (
                <TableRow key={step}>
                  <TableCell sx={{ fontWeight: 600 }}>{step}</TableCell>
                  <TableCell>{content}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
          원본 Mermaid flowchart는 docs/beautymaster-influencer-dashboard/02-ux-flow.md 참조
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ③ 정보 구조 (IA) */}
        <SectionTitle title="정보 구조 (IA) — 데스크탑 2컬럼 레이아웃" />
        <Box component="pre" sx={{ ...CODE_BLOCK, mb: 1 }}>
{`┌─────────────────────────────────────────────────────────────────┐
│  헤더 (sticky 56px)                                              │
│  타이틀 · KPI 한 줄 · 동기화 상태 · 새로고침                        │
├──────────────────────┬──────────────────────────────────────────┤
│  좌측 패널 (고정)      │  우측 메인 (독립 스크롤)                    │
│  264px               │  나머지 너비                              │
│  배경: grey.50        │  배경: white                            │
│                      │                                         │
│  ① Schedule View     │  ② Alert 배너 (이상 케이스 있을 때만)      │
│                      │                                         │
│  TODAY               │  ③ 인플루언서 그리드                      │
│  ─ 14:00 김○○  ●●○○ │  [필터 바 + Processing / Done 탭]        │
│  ─ 15:30 박○○  ●●●○ │                                         │
│                      │  [카드] [카드] [카드]                     │
│  UPCOMING            │  [카드] [카드] [카드]                     │
│  ─ 07/03 이○○  ●○○○ │                                         │
│                      │                                         │
│  시간 미정            │                                         │
│  ─ 최○○      ●○○○  │                                         │
└──────────────────────┴──────────────────────────────────────────┘`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
          ● = 완료 아이콘 (success.main) / ○ = 미완료 아이콘 (grey.300) — 동의 · 방문 · 업로드 · 크레딧 순
        </Typography>

        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>영역</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>내용</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>세부 구성</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['헤더 (sticky)', '타이틀 + KPI 한 줄 + 동기화 상태', '전체 N명 · 동의 N · 방문 N · 업로드 N · 크레딧 N'],
                ['① Schedule View (좌측 고정)', 'Time 기준 정렬 방문 리스트', 'TODAY 그룹 (강조) → UPCOMING (날짜별) → 시간 미정 (하단)'],
                ['② Alert 배너 (우측 상단)', '이상 케이스 있을 때만 표시', '방문 미확인 N명 · 업로드 대기 N명 · 크레딧 미발송 N명'],
                ['③ 인플루언서 그리드 (우측)', '필터 + 카드 목록', '필터 바 → Processing/Done 탭 → 카드 3열'],
                ['인플루언서 카드', '3계층 정보 위계', '1순위(Hero): 이름+시각 / 2순위: 상태 아이콘 4개 / 3순위: Alert 뱃지'],
                ['Drawer (우측 슬라이드)', '카드/스케줄 행 클릭 시 오픈', '성과지표 · Note · Collabo Link · Opinion · 소셜 계정'],
              ].map(([area, content, detail]) => (
                <TableRow key={area}>
                  <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>{area}</TableCell>
                  <TableCell sx={{ verticalAlign: 'top' }}>{content}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top' }}>{detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ④-1 정보 구조 (IA) — Workflow 탭 */}
        <SectionTitle title="정보 구조 (IA) — Workflow 탭" description="Operations의 2컬럼 레이아웃과 달리 좌측 패널 없는 단일 컬럼 문서형 구성" />
        <Box component="pre" sx={{ ...CODE_BLOCK, mb: 1 }}>
{`┌───────────────────────────────────────────────────┐
│  탭 바: Operations · Analytics · Workflow  [Store ▾] │
├───────────────────────────────────────────────────┤
│  헤더: 목적 한 줄 + 통계(7 단계 · 6 파일 · 1 handoff)   │
├───────────────────────────────────────────────────┤
│  ① 프로세스 아코디언 (7단계)                          │
│    01 Prepare   ▾ (기본 open — 체크리스트 + 파일 태그) │
│    02 Find      ▸ (collapsed)                       │
│    03 Send      ▸ (collapsed)                       │
│    04 Record    ▸ (collapsed)                       │
│    05 Follow Up ▸ (collapsed)                       │
│    06 Share     ▸ [Handoff → Store Manager]          │
│    07 Report    ▸ (collapsed)                       │
├───────────────────────────────────────────────────┤
│  ② Files & Systems (6행 그리드, store별 실제 링크)     │
└───────────────────────────────────────────────────┘`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
          새 라우트 없음 — Operations · Analytics와 마찬가지로 BeautymasterDashboard.jsx의 activeTab 로컬 state에 세 번째 값(index 2)만 추가. 아래 라우팅 설계 표의 URL들과 달리 이 탭 전환 자체는 URL에 반영되지 않음.
          우측 상단 store 셀렉터는 Analytics 탭과 완전히 같은 state(`analyticsStore`)를 공유 — 새 셀렉터를 만들지 않고 조건(`activeTab === 1 || activeTab === 2`)만 넓힘.
        </Typography>

        <SectionTitle
          title="Links 시트 — 스토어별 문서 링크 데이터"
          description="Tier1/2 Consent Form · Tier1/2 Influencer Tracking List(manager) 링크는 스토어가 열릴 때마다 바뀌므로, 메인 GA/FL 시트를 건드리지 않는 별도 구글시트에 'Links' 탭으로 관리 — 코드 배포 없이 시트에 한 줄만 추가하면 새 스토어 반영"
        />
        <Box component="pre" sx={{ ...CODE_BLOCK, mb: 1 }}>
{`Store, Tier1 Consent Form Url, Tier2 Consent Form Url, Tier1 Influencer List Url, Tier2 Influencer List Url
G10,    https://forms.gle/...,   https://forms.gle/...,   https://docs.google.com/...,     https://docs.google.com/...`}
        </Box>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['Influencer Tracking List', '스토어 무관 고정 링크 — Links 시트에 없음, useSheetData.js에 SHEET_ID 재사용한 편집 링크로 하드코딩 (Publish to web 링크는 항상 읽기 전용이라 사용 안 함)'],
                ['Tier1/2 Consent Form, Tier1/2 Influencer List', 'Links 탭 CSV를 polling(parseStoreDocsCsv.js) → storeDocs[store] 형태로 useSheetData가 반환'],
                ['3가지 표시 상태', '① 링크 있음 → 클릭 가능 ② store 미선택("All Stores") → "스토어를 선택하세요" 안내 ③ store는 선택했는데 그 store에 값 없음 → "설정 필요" 안내. 셋 다 Files & Systems 카드와 단계 안 파일 태그에 동일하게 적용'],
              ].map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell sx={{ fontWeight: 600, width: '26%' }}>{k}</TableCell>
                  <TableCell sx={{ fontSize: 12.5 }}>{v}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ④ 인터랙션 원칙 */}
        <SectionTitle title="인터랙션 원칙" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['Drawer 진입점', '좌측 Schedule 행 클릭 OR 우측 그리드 카드 클릭 — 동일하게 Drawer 즉시 오픈'],
                ['Schedule 행 클릭', '우측 그리드 스크롤 이동 없음. 스케줄은 빠른 접근 / 그리드는 전체 현황 파악'],
                ['카드 위계 원칙', '"지금 이 사람이 누구고 언제 오는가"만 카드에서 전달. 나머지는 Drawer에서.'],
                ['Workflow 기본 펼침 상태', '01 Prepare만 기본 open, 나머지는 collapsed — 7단계를 한 번에 다 보여주면 스캔 난이도 상승'],
                ['Workflow 태그 구분', '채워진 태그 = 추적 파일(기록 필요) / 테두리 태그 = 외부 툴(Wix, DM) — "기록이 남는 일 vs 안 남는 일"을 시각적으로 구분'],
                ['Workflow 파일 태그 클릭', '채워진 파일 태그는 Files & Systems 카드와 같은 링크 해석 로직(resolveFileHref)을 공유 — 링크가 있으면 그 자리에서 바로 열림, 없으면 지금처럼 클릭 안 되는 텍스트로 유지'],
                ['Workflow Handoff 배지', 'Store Manager 등 외부 이해관계자가 개입하는 단계에만 표시 (현재 06 Share 1곳)'],
                ['Workflow 클릭 진입점', '아코디언 헤더 클릭 = 펼침/접힘 토글만 수행. 파일 태그·Files & Systems 카드 클릭 = 새 탭에서 구글시트/폼 오픈(target="_blank")'],
              ].map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell sx={{ fontWeight: 600, width: '26%' }}>{k}</TableCell>
                  <TableCell>{v}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ⑤ 라우팅 */}
        <SectionTitle title="라우팅 설계" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>경로</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>설명</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['/', '/dashboard 리다이렉트'],
                ['/dashboard', '메인 대시보드 (단일 페이지)'],
                ['/dashboard?tab=processing', 'Processing 탭 활성 상태'],
                ['/dashboard?tab=done', 'Done 탭 활성 상태'],
                ['/dashboard?store=G10&month=7', '필터 상태 URL 유지'],
              ].map(([path, desc]) => (
                <TableRow key={path}>
                  <TableCell sx={{ ...mono }}>{path}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
          별도 상세 페이지 없음 — 인플루언서 상세는 우측 Drawer
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ⑥ Alert 언어 정의 */}
        <SectionTitle title="Alert 언어 정의" description="시트 컬럼 언어 → 운영자 액션 언어로 변환" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>내부 AlertFlag</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>카드 뱃지</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Alert 배너 문구</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>조건</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>배너 표시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['agreement_no_attend', '방문 미확인', '방문 미확인 N명 — 동의 완료 후 방문 체크 필요', 'Agreement O + Attend X', 'O'],
                ['attend_no_collabo', '업로드 대기', '업로드 대기 N명 — 방문 후 콘텐츠 업로드 미확인', 'Attend O + Collabo Shared X', 'O'],
                ['collabo_no_credit', '크레딧 미발송', '크레딧 미발송 N명 — 업로드 확인 후 크레딧 전송 필요', 'Collabo Shared O + Credit Shared X', 'O'],
                ['credit_shared_no_used', '크레딧 미사용', '(참고용)', 'Credit Shared O + Credit Used X', 'X'],
              ].map(([flag, badge, banner, cond, show]) => (
                <TableRow key={flag}>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{flag}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{badge}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{banner}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{cond}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: show === 'O' ? 'success.main' : 'text.disabled' }}>{show}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑦ 데이터 모델 */}
        <SectionTitle title="데이터 모델 — Influencer 엔티티" />
        {MODEL_FIELDS.map(({ group, fields }) => (
          <Box key={group} sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
              {group}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '22%' }}>필드</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '28%' }}>타입</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '18%' }}>CSV 컬럼</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>설명</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map(([field, type, src, desc]) => (
                    <TableRow key={field}>
                      <TableCell sx={{ ...mono }}>{field}</TableCell>
                      <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{type}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{src}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          KpiSummary (헤더 한 줄 요약용)
        </Typography>
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableBody>
              {[
                ['total', 'number', 'Processing + Done 합산'],
                ['agreementCount', 'number', '동의 완료 수'],
                ['attendCount', 'number', '방문 완료 수'],
                ['collaboSharedCount', 'number', '업로드 완료 수'],
                ['creditSharedCount', 'number', '크레딧 발송 완료 수'],
                ['alertCount', 'number', '액션 필요 총 인원 수'],
              ].map(([f, t, d]) => (
                <TableRow key={f}>
                  <TableCell sx={{ ...mono, width: '28%' }}>{f}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary', width: '16%' }}>{t}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{d}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 4, display: 'block' }}>
          FunnelStep 제거 — KpiSummary 숫자 한 줄로 대체
        </Typography>

        {/* ⑧ CSV 매핑 */}
        <SectionTitle title="구글시트 CSV → 데이터 매핑" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>CSV 컬럼명</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>모델 필드</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>변환 로직</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Store', 'store', '그대로'],
                ['Month', 'month', 'parseInt'],
                ['Barcode', 'barcode, tier', 'length 비교로 tier 파생'],
                ['Platform', 'platform', '그대로'],
                ['Category', 'category', 'toLowerCase'],
                ['Type', 'creditType', '그대로'],
                ['Image', 'imageUrl', '그대로'],
                ['Full name', 'fullName', '그대로'],
                ['Social Account', 'socialAccountUrl', '그대로'],
                ['Email', 'email', '그대로'],
                ['Time', 'scheduledTime', 'Date 파싱, 실패 시 null'],
                ['Attend', 'attend', '"TRUE"/체크 → true'],
                ['Agreement', 'agreement', '"TRUE"/체크 → true'],
                ['Collabo Shared', 'collaboShared', '"TRUE"/체크 → true'],
                ['Collabo Link', 'collaboLink', '그대로'],
                ['Upload Date', 'uploadDate', 'Date 파싱, 실패 시 null'],
                ['Credit Shared', 'creditShared', '"TRUE"/체크 → true'],
                ['Credit Used', 'creditUsed', '"TRUE"/체크 → true'],
                ['serial#', 'serialNumber', '그대로'],
                ["Opinion", 'opinion', "'USE'/'MAYBE'/\"DON'T\"/null"],
                ['Views', 'views', 'parseInt, 실패 시 null'],
                ['Likes', 'likes', 'parseInt, 실패 시 null'],
                ['Shares', 'shares', 'parseInt, 실패 시 null'],
                ['Saves', 'saves', 'parseInt, 실패 시 null'],
                ['Comments', 'comments', 'parseInt, 실패 시 null'],
                ['Reposts', 'reposts', 'parseInt, 실패 시 null'],
                ['Note', 'note', '그대로'],
              ].map(([csv, field, logic]) => (
                <TableRow key={csv}>
                  <TableCell sx={{ ...mono }}>{csv}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{field}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{logic}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑨ 컴포넌트 리스트 */}
        <SectionTitle title="컴포넌트 리스트" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>컴포넌트</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>용도</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '10%' }}>구분</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>경로 / 카테고리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {COMPONENTS.map(({ name, desc, type, path }) => (
                <TableRow key={name}>
                  <TableCell sx={{ ...mono }}>{name}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{desc}</TableCell>
                  <TableCell>{tag(type, typeColor(type))}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{path}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
