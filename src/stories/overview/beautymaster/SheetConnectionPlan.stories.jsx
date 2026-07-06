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
  title: 'Overview/BeautyMaster/Sheet Connection Plan',
  parameters: { layout: 'padded' },
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

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster — Google Sheets Connection Plan"
        status="Planned"
        note="localStorage 기반 URL 설정. Supabase 불필요. 폴링 60s."
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.1"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Google Sheets Connection Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          구글 시트를 단일 데이터 입력 도구로 유지하면서, 대시보드가 실시간으로 반영되도록 연동한다.
          DB나 백엔드 없이 <Box component="code" sx={mono}>localStorage</Box> + CSV 폴링만으로 구현한다.
        </Typography>

        {/* ① 목표 */}
        <SectionTitle title="목표 & 범위" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['데이터 입력 도구', '기존 그대로 구글 시트 유지 — 워크플로우 변경 없음'],
                ['대시보드 역할', '읽기 전용. 구글 시트 CSV를 60초마다 fetch해 화면 갱신'],
                ['설정 저장 위치', 'localStorage (브라우저). 서버/DB 불필요'],
                ['최초 진입 처리', 'URL 미설정 → 설정 화면 표시. URL 설정 → 대시보드 즉시 진입'],
                ['범위 밖', '대시보드에서 시트로 쓰기(write-back), Supabase, 인증/로그인'],
              ].map(([label, value]) => (
                <TableRow key={label}>
                  <TableCell sx={{ fontWeight: 600, width: '22%', color: 'text.secondary', fontSize: 12 }}>{label}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ② 전체 데이터 흐름 */}
        <SectionTitle title="데이터 흐름" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 1, lineHeight: 2, overflow: 'auto' }}>
{`매니저가 구글 시트 체크박스 업데이트
        │
        ▼
구글 시트 (pubhtml URL 공개 게시)
        │
        │  pub?output=csv&gid={GID}  ← URL 변환
        ▼
useSheetData hook   (60s interval + manual refresh)
  ├── Processing 탭 CSV  fetch + parse → Influencer[]
  └── Done 탭 CSV        fetch + parse → Influencer[]
        │
        ▼  merge + deriveAlertFlags + deriveScheduleGroup
      influencers[]  (실시간 갱신)
        │
        ▼
BeautymasterDashboard  (props로 전달)
  ├── DashboardHeader  ← kpi, isSyncing, lastSyncedAt
  ├── SchedulePanel    ← influencers
  └── InfluencerPanel  ← influencers`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          parse 함수는 기존 parseInfluencerCsv.js 재사용. hook만 신규 작성.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ③ URL 변환 규칙 */}
        <SectionTitle title="URL 변환 규칙" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          사용자가 붙여넣는 pubhtml URL을 CSV export URL로 자동 변환한다.
        </Typography>
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 1, lineHeight: 1.8, overflow: 'auto' }}>
{`// 사용자 입력 (pubhtml)
https://docs.google.com/spreadsheets/d/e/{SHEET_ID}/pubhtml

// 변환 결과 (CSV export)
https://docs.google.com/spreadsheets/d/e/{SHEET_ID}/pub?output=csv&gid={GID}

// Processing 탭: gid 파라미터 생략 시 첫 번째 탭(기본)
// Done 탭: gid는 사용자가 직접 입력 or 자동 감지`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          GID는 구글 시트 URL의 <Box component="code" sx={{ ...mono, fontSize: 11 }}>#gid=숫자</Box> 부분.
          탭을 우클릭 → "링크 복사"로 확인 가능. Processing 탭이 첫 번째 탭이면 gid=0.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ④ localStorage 스키마 */}
        <SectionTitle title="localStorage 스키마" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 1, lineHeight: 1.8, overflow: 'auto' }}>
{`// key: 'beautymaster:sheetConfig'
{
  "processingCsvUrl": "https://docs.google.com/spreadsheets/d/e/{ID}/pub?output=csv&gid=0",
  "doneCsvUrl":       "https://docs.google.com/spreadsheets/d/e/{ID}/pub?output=csv&gid=12345",
  "pollingIntervalMs": 60000
}`}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          미설정(null) 상태면 SheetSetupScreen 표시. 저장 즉시 폴링 시작.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ⑤ 신규 컴포넌트 목록 */}
        <SectionTitle title="신규 컴포넌트 & 훅" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>Phase</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '36%' }}>파일</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>유형</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>역할</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Phase 1', 'src/hooks/useSheetData.js', 'Custom Hook',
                  'localStorage에서 config 로드 → CSV fetch → parse → 60s 폴링. { influencers, isSyncing, lastSyncedAt, error, refresh, config, saveConfig } 반환'],
                ['Phase 2', 'src/components/overlay-feedback/SheetSettingsModal.jsx', 'Modal',
                  'URL 입력 + 연결 테스트 + 저장. DashboardHeader의 설정 아이콘 클릭 시 오픈'],
                ['Phase 3', 'src/components/templates/beautymaster/SheetSetupScreen.jsx', 'Page Section',
                  '최초 진입 빈 상태 화면. URL 미설정 시 표시. SheetSettingsModal을 바로 오픈하는 CTA 포함'],
              ].map(([phase, file, type, role]) => (
                <TableRow key={file}>
                  <TableCell><Tag label={phase} color={phase === 'Phase 1' ? 'primary' : phase === 'Phase 2' ? 'success' : 'warning'} /></TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{file}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{type}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑥ Props Interface */}
        <SectionTitle title="Props Interface" />

        {/* useSheetData */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Tag label="Phase 1" color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>useSheetData</Typography>
            <Typography variant="caption" sx={{ ...mono, color: 'text.disabled' }}>src/hooks/useSheetData.js</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            URL 설정을 localStorage에서 읽고, CSV를 주기적으로 fetch해 파싱된 influencer 배열을 반환한다.
          </Typography>
          <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, lineHeight: 1.8, overflow: 'auto' }}>
{`// 반환값
const {
  influencers,    // Influencer[]      — 파싱된 전체 인플루언서 목록
  isSyncing,      // boolean           — fetch 진행 중 여부
  lastSyncedAt,   // Date | null       — 마지막 성공 시각
  error,          // Error | null      — fetch/parse 오류
  refresh,        // () => void        — 수동 새로고침
  config,         // SheetConfig | null — 현재 저장된 설정
  saveConfig,     // (config) => void  — 설정 저장 + 즉시 폴링 시작
} = useSheetData();`}
          </Box>
        </Box>

        {/* SheetSettingsModal */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Tag label="Phase 2" color="success" />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>SheetSettingsModal</Typography>
            <Typography variant="caption" sx={{ ...mono, color: 'text.disabled' }}>
              src/components/overlay-feedback/SheetSettingsModal.jsx
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            구글 시트 URL 2개(Processing / Done)를 입력받아 저장한다. 저장 전 연결 테스트를 실행한다.
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: '22%' }}>Prop</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '22%' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '12%' }}>Default</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ['open', 'boolean', 'false', 'Modal 열림 여부 [Required]'],
                  ['onClose', 'function', '—', 'Modal 닫기 핸들러 [Required]'],
                  ['config', 'SheetConfig | null', 'null', '현재 저장된 URL 설정 (입력값 초기화에 사용)'],
                  ['onSave', '(config) => void', '—', '저장 버튼 클릭 핸들러. 연결 테스트 통과 후 호출 [Required]'],
                ].map(([prop, type, def, desc]) => (
                  <TableRow key={prop}>
                    <TableCell sx={{ ...mono }}>{prop}</TableCell>
                    <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{type}</TableCell>
                    <TableCell sx={{ ...mono, fontSize: 11, color: 'text.disabled' }}>{def}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* SheetSetupScreen */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Tag label="Phase 3" color="warning" />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>SheetSetupScreen</Typography>
            <Typography variant="caption" sx={{ ...mono, color: 'text.disabled' }}>
              src/components/templates/beautymaster/SheetSetupScreen.jsx
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            최초 진입 or URL 미설정 시 표시되는 전체 화면. 단일 CTA 버튼으로 SheetSettingsModal을 오픈한다.
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {[
                  ['onSetup', 'function', '—', '"Connect Google Sheets" 버튼 클릭 핸들러 [Required]'],
                ].map(([prop, type, def, desc]) => (
                  <TableRow key={prop}>
                    <TableCell sx={{ ...mono, width: '22%' }}>{prop}</TableCell>
                    <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary', width: '22%' }}>{type}</TableCell>
                    <TableCell sx={{ ...mono, fontSize: 11, color: 'text.disabled', width: '12%' }}>{def}</TableCell>
                    <TableCell sx={{ fontSize: 12 }}>{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* ⑦ 기존 컴포넌트 수정 사항 */}
        <SectionTitle title="기존 컴포넌트 수정 사항" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '38%' }}>파일</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>변경 내용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['DashboardHeader.jsx', '설정(⚙) 아이콘 버튼 추가. 클릭 → SheetSettingsModal 오픈. onSettingsClick prop 추가.'],
                ['pages/beautymaster/BeautymasterDashboard.jsx',
                  'MOCK_INFLUENCERS 제거. useSheetData() 훅으로 대체. config 없을 때 SheetSetupScreen 렌더링. settingsModalOpen 상태 추가.'],
                ['DashboardHeader.stories.jsx', 'onSettingsClick argType 추가'],
              ].map(([file, change]) => (
                <TableRow key={file}>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{file}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{change}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑧ 페이지 조합 흐름 */}
        <SectionTitle title="페이지 조합 흐름 (완성 후)" />
        <Box component="pre" sx={{ ...mono, backgroundColor: 'grey.100', p: 2, mb: 4, lineHeight: 2, overflow: 'auto' }}>
{`useSheetData()
  ├── config === null
  │     └── <SheetSetupScreen onSetup={() => setSettingsOpen(true)} />
  │
  └── config 있음
        └── <BeautymasterDashboard>
              ├── <DashboardHeader onSettingsClick={() => setSettingsOpen(true)} />
              ├── <SchedulePanel influencers={influencers} />
              └── <InfluencerPanel influencers={influencers} />

<SheetSettingsModal
  open={settingsOpen}
  config={config}
  onSave={saveConfig}
  onClose={() => setSettingsOpen(false)}
/>`}
        </Box>

        {/* ⑨ 구현 순서 체크리스트 */}
        <SectionTitle title="구현 순서 체크리스트" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>Phase</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '42%' }}>파일</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>완료 기준</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Phase 1', 'src/hooks/useSheetData.js',
                  'localStorage read/write + CSV fetch + 60s polling + error 상태 정상 반환'],
                ['Phase 2', 'src/components/overlay-feedback/SheetSettingsModal.jsx + .stories.jsx',
                  'URL 입력 → 연결 테스트(fetch 1회) → 성공/실패 피드백 → 저장 가능'],
                ['Phase 3', 'src/components/templates/beautymaster/SheetSetupScreen.jsx + .stories.jsx',
                  '"Connect Google Sheets" CTA 버튼 렌더링 → onSetup 호출 확인'],
                ['Phase 4', 'DashboardHeader.jsx 수정',
                  '설정 아이콘 표시 → onSettingsClick 호출 확인'],
                ['Phase 5', 'BeautymasterDashboard.jsx 수정',
                  'MOCK 제거. config 없을 때 SetupScreen, 있을 때 대시보드 + 실데이터 표시'],
              ].map(([phase, file, condition], i) => (
                <TableRow key={file}>
                  <TableCell>
                    <Tag
                      label={phase}
                      color={['primary', 'success', 'warning', 'info', 'error'][i]}
                    />
                  </TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{file}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{condition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </PageContainer>
    </>
  ),
};
