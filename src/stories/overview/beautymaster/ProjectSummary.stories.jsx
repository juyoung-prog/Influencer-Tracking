import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DocumentTitle, PageContainer, SectionTitle } from '../../../components/storybookDocumentation';

export default {
  title: 'Overview/BeautyMaster/Project Summary',
  parameters: {
    layout: 'padded',
  },
};

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster Influencer Dashboard"
        status="Planning"
        note="Project Summary — Phase 1 approved"
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          프로젝트 서머리
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          구글시트 기반 인플루언서 관리 데이터를 실시간으로 시각화하는 운영 대시보드
        </Typography>

        <SectionTitle title="배경 및 목적" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '20%', verticalAlign: 'top' }}>문제 1</TableCell>
                <TableCell>구글시트의 인플루언서 기록 순서가 방문 순서가 아닌 동의서 제출 순서여서, 인원이 늘수록 스케줄 파악에 수작업 노력이 증가</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>문제 2</TableCell>
                <TableCell>Attend / Agreement / Collabo Shared / Credit 등 여러 상태가 시트 여러 열에 분산되어 전체 현황을 한눈에 파악하기 어려움</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>기회</TableCell>
                <TableCell>구글시트를 그대로 유지하면서 대시보드를 실시간 연동하면, 시트 업데이트만으로 운영 현황이 즉시 반영됨</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>기대 효과</TableCell>
                <TableCell>인플루언서 방문 일정 · 상태 · 성과를 한 화면에서 파악 → 누락 대응 시간 단축, 운영 부담 감소</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="핵심 기능" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '4%' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>기능</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>설명</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>우선순위</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['1', '스케줄 뷰', '인플루언서를 방문 일시(Time) 기준으로 정렬하여 타임라인/리스트로 표시', '필수'],
                ['2', '상태 현황 요약', 'Agreement · Attend · Collabo Shared · Credit Shared 완료/미완료 수를 KPI 한 줄로 표시', '필수'],
                ['3', '예외 케이스 알림', 'Agreement O + Attend X / Attend O + Collabo Shared X 등 이상 상태 강조 표시', '필수'],
                ['4', '인플루언서 상태 카드', '프로필 이미지 · 이름 · 플랫폼 · 티어 · 상태 뱃지 · 소셜 링크 한 번에 확인', '필수'],
                ['5', '구글시트 실시간 연동', '시트 업데이트 시 대시보드 자동 갱신 (Published CSV 폴링, 60초 인터벌)', '필수'],
                ['6', '크레딧 트래킹', 'Credit Shared · Credit Used · Serial# 상태 표시', '필수'],
                ['7', '성과 지표 표시', 'Views · Likes · Shares · Saves · Comments · Reposts · Opinion 표시 (Drawer)', '선택'],
                ['8', '필터 / 검색', 'Store · Month · Platform · Tier · 상태별 필터링', '선택'],
              ].map(([num, name, desc, priority]) => (
                <TableRow key={num}>
                  <TableCell sx={{ color: 'text.secondary' }}>{num}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{name}</TableCell>
                  <TableCell>{desc}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                        fontSize: 11,
                        fontWeight: 600,
                        color: priority === '필수' ? 'primary.main' : 'text.secondary',
                        border: '1px solid',
                        borderColor: priority === '필수' ? 'primary.main' : 'divider',
                      }}
                    >
                      {priority}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="구글시트 컬럼 정의" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          데이터 소스: Processing 탭(진행 중) + Done 탭(완료) 통합. Planning 탭은 사용 안 함.
        </Typography>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>컬럼</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>설명</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>값 예시</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Store', '방문 매장', 'G10'],
                ['Month', '방문 월', '6, 7 …'],
                ['Barcode', '티어 식별자', 'G10INF2026 (T1) / G10INF202620 (T2)'],
                ['Platform', '소셜 플랫폼', 'Instagram / TikTok'],
                ['Category', '콘텐츠 유형', 'general / kbeauty / specific'],
                ['Type', '크레딧 유형', '$100 Credit / $20 Credit_Tier2'],
                ['Image', '프로필 이미지 URL', '—'],
                ['Full name', '인플루언서 이름', '—'],
                ['Social Account', '소셜 계정 링크', '—'],
                ['Email', '이메일', '—'],
                ['Time', '방문 예정 일시 (스케줄 정렬 기준)', '—'],
                ['Attend', '매장 방문 완료 여부 (운영자 체크)', 'TRUE / FALSE'],
                ['Agreement', '동의서 제출 여부 (운영자 체크)', 'TRUE / FALSE'],
                ['Collabo Shared', '소셜 콘텐츠 업로드 여부 (운영자 체크)', 'TRUE / FALSE'],
                ['Collabo Link', '업로드된 콘텐츠 URL', '—'],
                ['Upload Date', '콘텐츠 업로드 날짜', '—'],
                ['Credit Shared', '크레딧 발송 완료 여부 (운영자 체크)', 'TRUE / FALSE'],
                ['Credit Used', '크레딧 사용 여부 (운영자 체크)', 'TRUE / FALSE'],
                ['serial#', '발급된 크레딧 번호', '—'],
                ['Opinion', '한 달 후 성과 평가', 'USE / MAYBE / DON\'T'],
                ['Views / Likes / Shares / Saves / Comments / Reposts', '콘텐츠 성과 (수기 기록)', '—'],
                ['Note', '특이사항 메모', '—'],
              ].map(([col, desc, val]) => (
                <TableRow key={col}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' }}>{col}</TableCell>
                  <TableCell>{desc}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="대상 사용자 및 기술적 범위" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '20%', verticalAlign: 'top' }}>주요 사용자</TableCell>
                <TableCell>뷰티마스터 그랜드 오프닝 담당 운영자 1인 (데스크탑 오피스 환경)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>포함</TableCell>
                <TableCell>구글시트 Published CSV 연동 (읽기 전용) · 대시보드 UI · 60초 자동 폴링 · Processing + Done 탭 통합</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>제외</TableCell>
                <TableCell>구글시트 직접 편집 · 인플루언서 초대/이메일 발송 · Planning 탭 · 인증/로그인</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, verticalAlign: 'top' }}>제약사항</TableCell>
                <TableCell>구글시트는 "웹에 게시(Publish to web)" CSV 형태로 공개 접근 가능해야 함</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="성공 기준" />
        <TableContainer>
          <Table size="small">
            <TableBody>
              {[
                '인플루언서 방문 일정을 Time 기준으로 정렬하여 즉시 파악 가능',
                'Agreement O + Attend X, Attend O + Collabo X 등 이상 케이스를 육안으로 즉시 식별 가능',
                '구글시트 업데이트 후 1분 이내 대시보드 반영',
              ].map((criterion, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ color: 'text.secondary', width: '4%' }}>{i + 1}</TableCell>
                  <TableCell>{criterion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
