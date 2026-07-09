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
  title: 'Overview/BeautyMaster/Visual Direction',
  parameters: {
    layout: 'padded',
  },
};

const COLOR_SWATCHES = [
  { label: 'primary.main', value: '#0000FF', usage: '인터랙티브 요소 전용 (링크 · 활성 탭 · 버튼)', change: '유지' },
  { label: 'secondary.main', value: '#263238', usage: '헤더 배경 · 좌측 패널 구분선', change: '유지' },
  { label: 'background.default', value: '#FFFFFF', usage: '우측 메인 배경', change: '유지' },
  { label: 'grey.50', value: '#FAFAFA', usage: '좌측 패널 배경', change: '유지' },
  { label: 'success.main', value: '#2E7D32', usage: '4단계 상태 완료 아이콘', change: '추가' },
  { label: 'warning.main', value: '#ED6C02', usage: 'Alert 배너 — 방문 미확인 · 업로드 대기', change: '추가' },
  { label: 'error.main', value: '#D32F2F', usage: 'Alert 배너 — 크레딧 미발송', change: '추가' },
];

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster — Visual Direction"
        status="Available"
        note="Operational dashboard — readability over aesthetics. Tokens live in src/styles/themes/default.js"
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.0"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          비주얼 디렉션
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          내부 운영 전문가 툴. 뷰티 브랜드 감성이 아니라 판독성과 밀도가 우선이다.
        </Typography>

        <SectionTitle title="톤앤매너" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>키워드</TableCell>
                <TableCell>Operational · Clean · Status-first · Low friction</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>설명</TableCell>
                <TableCell>운영자는 하루에 수십 번 이 화면을 본다. 아름다움보다 빠른 판독이 목적이다. 브랜드 감성은 헤더 타이틀 한 줄에서만 쓰고 나머지는 철저하게 기능적으로 간다.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>참조 레퍼런스</TableCell>
                <TableCell>Linear · Notion 대시보드 · Vercel Dashboard — 화이트 베이스, 높은 정보 밀도, 명확한 상태 컬러</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="레이아웃 방향" />
        <TableContainer sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>영역</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>너비</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>스크롤</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>역할</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['헤더', '100%', 'sticky', 'KPI 한 줄 + 동기화 상태 (높이 56px)'],
                ['좌측 패널', '264px 고정', '독립 스크롤', 'Schedule View — 항상 화면에 고정'],
                ['우측 메인', '나머지 전체', '독립 스크롤', 'Alert 배너 + 인플루언서 그리드 (3열)'],
              ].map(([area, width, scroll, role]) => (
                <TableRow key={area}>
                  <TableCell sx={{ fontWeight: 600 }}>{area}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{width}</TableCell>
                  <TableCell>{scroll}</TableCell>
                  <TableCell>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['좌측 패널 배경', 'grey.50 (#FAFAFA) — 경계선 없이 배경색만으로 구분'],
                ['카드 그리드', '3열 고정 (1280px+) → 2열 (960px~)'],
                ['카드 간격', 'gap: 2 (16px)'],
                ['borderRadius', '기존 테마 0 유지. Avatar만 50%, Chip/뱃지만 4px 허용'],
              ].map(([key, val]) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 600, width: '24%' }}>{key}</TableCell>
                  <TableCell>{val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="컬러 팔레트" />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {COLOR_SWATCHES.map(({ label, value, usage, change }) => (
            <Box key={label} sx={{ width: 160 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 48,
                  backgroundColor: value,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', fontWeight: 600 }}>
                {label}
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block' }}>
                {value}
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 0.75,
                  py: 0.25,
                  mt: 0.5,
                  fontSize: 10,
                  fontWeight: 600,
                  color: change === '추가' ? 'primary.main' : 'text.secondary',
                  border: '1px solid',
                  borderColor: change === '추가' ? 'primary.main' : 'divider',
                }}
              >
                {change}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: 11 }}>
                {usage}
              </Typography>
            </Box>
          ))}
        </Box>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>상태 컬러 단순화 원칙</TableCell>
                <TableCell>4가지 상태(동의·방문·업로드·크레딧)에 각각 다른 색 금지. 완료(success green) vs 미완료(grey) 2단계로만 구분</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>primary.main 사용 제한</TableCell>
                <TableCell>인터랙티브 요소에만 — 링크, 활성 탭 인디케이터, 버튼. 배경·카드·텍스트에 파란색 금지</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Alert 긴급도 구분</TableCell>
                <TableCell>방문·업로드 미완료 → warning amber (#ED6C02) / 크레딧 미발송 → error red (#D32F2F)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>노쇼 · 일정변경 무응답 배지</TableCell>
                <TableCell>새 색 도입하지 않음 — warning amber (#ED6C02) 재사용. 크레딧 미발송처럼 확정적 실패가 아니라 협의 중 상태이므로 방문·업로드 미완료와 같은 심각도로 취급</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="정보 밀도" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>요소</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>값</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>근거</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['카드 패딩', 'p: 2 (16px)', '여백 넓히면 한 화면에 카드 수 감소'],
                ['스케줄 행 높이', '48px', '터치 불필요, 최소 클릭 영역'],
                ['헤더 높이', '56px', '숫자 + 라벨 2줄 들어가는 최소값'],
                ['카드 Avatar 크기', '40px', '신원 확인용, 장식 아님'],
                ['Drawer 너비', '400px', '성과 지표 6개 + Note가 들어가는 최소 너비'],
                ['카드 총 높이', '~88px (3행)', '3열 그리드에서 카드 너비 약 360px'],
              ].map(([element, value, reason]) => (
                <TableRow key={element}>
                  <TableCell sx={{ fontWeight: 600 }}>{element}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{value}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="타이포그래피" />
        <TableContainer sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>요소</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>variant</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>크기</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>weight</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['페이지 타이틀', 'h6', '18px', '700', '헤더 안에서 작게 — 콘텐츠가 주인공'],
                ['KPI 숫자', 'h4', '32px', '700', 'tabular-nums — 제일 큰 글자'],
                ['KPI 라벨', 'caption', '11px', '400', '숫자 아래'],
                ['카드 이름 (Hero)', 'body1', '16px', '600', ''],
                ['카드 방문 시각', 'body2', '14px', '400', 'secondary 컬러'],
                ['스케줄 이름', 'body2', '14px', '500', ''],
                ['스케줄 시각', 'caption', '12px', '400', 'monospace 정렬'],
                ['Alert 배너 문구', 'body2', '14px', '500', 'warning/error 컬러'],
                ['Drawer 성과 수치', 'h5', '24px', '700', 'tabular-nums'],
                ['Note 텍스트', 'body2', '14px', '400', 'grey.700'],
              ].map(([el, variant, size, weight, note]) => (
                <TableRow key={el}>
                  <TableCell sx={{ fontWeight: 600 }}>{el}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{variant}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{size}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{weight}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>숫자는 tabular-nums 필수</TableCell>
                <TableCell>KPI · 스케줄 시각 · 성과 지표 모두. 자릿수 바뀔 때 레이아웃 흔들리지 않도록.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>헤더 타이틀은 작게</TableCell>
                <TableCell>h4, h3 금지. 화면에서 제일 큰 글자는 KPI 숫자여야 함.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>상태 표시 텍스트 최소화</TableCell>
                <TableCell>카드에서는 아이콘만. 텍스트 레이블은 Drawer 안에서만.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle title="상태 아이콘 시스템 (@mui/icons-material)" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>상태</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>완료 아이콘</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>미완료 아이콘</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>크기</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Agreement (동의)', 'TaskAlt filled — #2E7D32', 'RadioButtonUnchecked — #E0E0E0', '18px'],
                ['Attend (방문)', 'CheckCircle filled — #2E7D32', 'RadioButtonUnchecked — #E0E0E0', '18px'],
                ['Collabo (업로드)', 'CloudDone filled — #2E7D32', 'RadioButtonUnchecked — #E0E0E0', '18px'],
                ['Credit (크레딧)', 'Paid filled — #2E7D32', 'RadioButtonUnchecked — #E0E0E0', '18px'],
              ].map(([status, done, undone, size]) => (
                <TableRow key={status}>
                  <TableCell sx={{ fontWeight: 600 }}>{status}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{done}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{undone}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{size}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          노쇼 · 일정변경 무응답 상태는 이 4단계 완료/미완료 아이콘 체계에 속하지 않는다 — 별도의 텍스트 배지("N일째 무응답" 등)로 표시하며 warning amber를 사용한다.
        </Typography>

        <SectionTitle title="변경 필요 토큰 요약" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          기존 테마에서 추가/변경이 필요한 항목만 명시. primary · secondary · borderRadius · shadows는 모두 유지.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>토큰 경로</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>현재값</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>변경값</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>적용 대상</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['palette.success.main', 'MUI 기본', '#2E7D32', '4단계 상태 완료 아이콘'],
                ['palette.warning.main', 'MUI 기본', '#ED6C02', 'Alert 배너 — 방문·업로드 미완료'],
                ['palette.error.main', 'MUI 기본', '#D32F2F', 'Alert 배너 — 크레딧 미발송'],
                ['palette.grey.50', 'MUI 기본', '#FAFAFA', '좌측 패널 배경'],
                ['typography.*.fontVariantNumeric', '미설정', 'tabular-nums', 'KPI · 성과 수치 · 스케줄 시각'],
              ].map(([token, current, next, target]) => (
                <TableRow key={token}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{token}</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: 12 }}>{current}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{next}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
