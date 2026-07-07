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
  title: 'Overview/BeautyMaster/Analytics Plan',
  parameters: {
    layout: 'padded',
  },
};

const mono = { fontFamily: 'monospace', fontSize: 12 };

const Tag = ({ label, color = 'primary' }) => (
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

const StatusTag = ({ label }) => {
  const map = { '완료': 'success', '계획': 'primary', '재활용': 'secondary' };
  return <Tag label={label} color={map[label] || 'primary'} />;
};

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster — Analytics Plan"
        status="Planning"
        note="오프닝 캠페인 전체 성과를 한 화면에서 보고하는 통계 뷰. Google Sheets 실시간 연동."
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.0"
      />
      <PageContainer>

        {/* ① 목적 */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Analytics View</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          오프닝 종료 후 본사 보고용 캠페인 성과 대시보드.
          Google Sheets 데이터가 자동 반영되며, 별도 엑셀 작업 없이 앱에서 바로 보고 가능.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          운영 화면(현재 탭)과 분리된 별도 탭으로 제공. 운영 중에는 현재 탭, 보고 시에는 Analytics 탭.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ② 화면 구조 */}
        <SectionTitle title="화면 구조" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 1, lineHeight: 2, overflow: 'auto' }}>
{`BeautymasterDashboard
├── Tab: Operations (현재)          ← 실시간 운영 화면 (변경 없음)
└── Tab: Analytics (신규)           ← 보고용 통계 화면
    │
    ├── [1] Campaign Summary         ← KPI 카드 그리드 (캠페인 전체 수치)
    │       Total / 참석률 / 업로드율 / 크레딧 사용률
    │       Tier 1 vs Tier 2 분리
    │
    ├── [2] Performance              ← 인플루언서 성과
    │       Views 기준 Top 인플루언서 테이블
    │       Opinion 분포 (USE / MAYBE / DON'T)
    │
    ├── [3] Platform Breakdown       ← Instagram vs TikTok 비교
    │       평균 조회수 / 참석률 / 업로드율
    │
    └── [4] Store Breakdown          ← 스토어별 비교 (GA / FL 등)
            스토어별 인플루언서 수 / 참석률 / 성과`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          필터 없음 — Analytics 탭은 전체 데이터를 집계. 스토어 분리는 섹션 내부에서 처리.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ③ 섹션별 상세 */}
        <SectionTitle title="섹션별 표시 항목" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>섹션</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>표시 항목</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>데이터 소스</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                [
                  '[1] Campaign Summary',
                  '총 인플루언서 · 참석률(attend/total) · 콘텐츠 업로드율(collaboShared/attend) · 크레딧 사용률(creditUsed/creditShared) · Tier1/Tier2 각 수치',
                  'deriveAnalyticsSummary() — 신규',
                ],
                [
                  '[2] Performance',
                  'Views 기준 Top 인플루언서 (이름·플랫폼·views·likes·opinion) · Opinion 분포 비율 (USE N명 / MAYBE N명 / DON\'T N명)',
                  'influencers 배열 정렬 + 집계',
                ],
                [
                  '[3] Platform Breakdown',
                  'Instagram vs TikTok: 인원수 · 평균 Views · 참석률 · 업로드율',
                  'deriveAnalyticsSummary() 내부 platform 그룹핑',
                ],
                [
                  '[4] Store Breakdown',
                  '스토어별: 인원수 · 참석률 · 업로드율 · 평균 Views',
                  'deriveAnalyticsSummary() 내부 store 그룹핑',
                ],
              ].map(([section, items, source]) => (
                <TableRow key={section}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{section}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{items}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ④ 신규 데이터 함수 */}
        <SectionTitle title="신규 데이터 함수 — schema.js 추가" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          기존 <Box component="code" sx={mono}>deriveKpiSummary()</Box>와 동일한 패턴으로 순수 함수 추가.
          컴포넌트는 이 함수의 결과만 props로 받는다.
        </Typography>
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 2, lineHeight: 1.8, overflow: 'auto' }}>
{`// schema.js에 추가
export function deriveAnalyticsSummary(influencers) {
  return {
    total: number,
    tier1Count: number,
    tier2Count: number,
    attendRate: number,          // 0~1
    uploadRate: number,          // 0~1
    creditUsedRate: number,      // 0~1

    opinionCounts: {             // opinion이 입력된 인플루언서만 집계
      use:   number,
      maybe: number,
      dont:  number,
    },

    byPlatform: {                // 'Instagram' | 'TikTok' 등 동적 키
      [platform]: {
        count: number,
        attendRate: number,
        uploadRate: number,
        avgViews: number | null,
      }
    },

    byStore: {                   // 'G10' | 'F01' 등 동적 키
      [store]: {
        count: number,
        attendRate: number,
        uploadRate: number,
        avgViews: number | null,
      }
    },

    topByViews: Influencer[],    // views 내림차순, null 제외, 상위 10명
  };
}`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          순수 함수 — 사이드 이펙트 없음. BeautymasterDashboard에서 <Box component="code" sx={{ ...mono, fontSize: 10 }}>useMemo(() =&gt; deriveAnalyticsSummary(influencers), [influencers])</Box>로 호출.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ⑤ 컴포넌트 목록 */}
        <SectionTitle title="컴포넌트 목록" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '10%' }}>상태</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '35%' }}>컴포넌트</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>역할</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['신규', 'src/pages/beautymaster/AnalyticsDashboard.jsx', '4개 섹션 조립 페이지. deriveAnalyticsSummary 결과를 각 컴포넌트로 분배.'],
                ['신규', 'src/components/data-display/CampaignSummaryGrid.jsx', '[1] KPI 카드 그리드 — 참석률/업로드율/크레딧사용률 + Tier 분리.'],
                ['신규', 'src/components/data-display/TopInfluencersTable.jsx', '[2] Views 기준 순위 테이블 — 이름·플랫폼·Views·Likes·Opinion 표시.'],
                ['신규', 'src/components/data-display/OpinionBreakdown.jsx', '[2] Opinion 분포 — USE/MAYBE/DON\'T 카운트 + 비율 바.'],
                ['신규', 'src/components/data-display/PlatformBreakdown.jsx', '[3] Instagram vs TikTok 비교 카드.'],
                ['신규', 'src/components/data-display/StoreBreakdown.jsx', '[4] 스토어별 비교 테이블.'],
                ['재활용', 'BeautymasterDashboard.jsx', 'Operations / Analytics 탭 전환 추가만. 기존 코드 변경 최소화.'],
              ].map(([status, component, role]) => (
                <TableRow key={component}>
                  <TableCell><StatusTag label={status} /></TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{component}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑥ 빌드 순서 */}
        <SectionTitle title="빌드 순서" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>순서</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '42%' }}>작업</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>완료 기준</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Step 1', 'schema.js — deriveAnalyticsSummary() 추가', '모든 필드 정확히 집계됨 (mock 데이터로 검증)'],
                ['Step 2', 'CampaignSummaryGrid.jsx + stories', 'KPI 카드 4종 + Tier 분리 렌더링 확인'],
                ['Step 3', 'TopInfluencersTable.jsx + stories', 'Views 정렬 · null 처리 · Opinion 색상 확인'],
                ['Step 4', 'OpinionBreakdown.jsx + stories', 'USE/MAYBE/DON\'T 카운트 + 비율 표시 확인'],
                ['Step 5', 'PlatformBreakdown.jsx + stories', 'Instagram/TikTok 비교 수치 확인'],
                ['Step 6', 'StoreBreakdown.jsx + stories', '스토어별 집계 확인'],
                ['Step 7', 'AnalyticsDashboard.jsx', '6개 컴포넌트 조립 + deriveAnalyticsSummary 연결'],
                ['Step 8', 'BeautymasterDashboard.jsx 탭 추가', 'Operations ↔ Analytics 탭 전환 동작 확인'],
              ].map(([step, task, condition]) => (
                <TableRow key={step}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{step}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{task}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{condition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑦ 데이터 전달 흐름 */}
        <SectionTitle title="데이터 전달 흐름" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 2, lineHeight: 2, overflow: 'auto' }}>
{`useSheetData()
  → influencers[]  (실시간 Google Sheets 데이터)

BeautymasterDashboard
  analyticsSummary = useMemo(() => deriveAnalyticsSummary(influencers), [influencers])

  Tab: Analytics
  └── AnalyticsDashboard
        analyticsSummary={analyticsSummary}
        influencers={influencers}         ← TopInfluencersTable용 (클릭 → Drawer 연결 가능)
        │
        ├── CampaignSummaryGrid     summary={analyticsSummary}
        ├── TopInfluencersTable     influencers={analyticsSummary.topByViews}
        ├── OpinionBreakdown        counts={analyticsSummary.opinionCounts}
        ├── PlatformBreakdown       byPlatform={analyticsSummary.byPlatform}
        └── StoreBreakdown          byStore={analyticsSummary.byStore}`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          Analytics 화면도 운영 화면과 동일한 데이터 소스 사용 — 별도 fetch 없음. Google Sheets 업데이트 시 자동 반영.
        </Typography>

      </PageContainer>
    </>
  ),
};
