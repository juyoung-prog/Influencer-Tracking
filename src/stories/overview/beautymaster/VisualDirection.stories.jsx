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
  { label: 'secondary.main', value: '#263238', usage: '헤더 배경 · 좌측 패널 구분선 · Workflow Handoff 배지(역할 라벨, 상태 아님)', change: '유지' },
  { label: 'background.default', value: '#FFFFFF', usage: '우측 메인 배경', change: '유지' },
  { label: 'grey.50', value: '#FAFAFA', usage: '좌측 패널 배경', change: '유지' },
  { label: 'grey.100', value: '#F5F5F5', usage: 'Workflow Tracked file 태그 배경 — 심각도 없는 중립 카테고리 표시', change: '추가' },
  { label: 'success.main', value: '#167C3D', usage: '4단계 상태 완료 아이콘', change: '교체(MUI 기본값→브랜드 전용)' },
  { label: 'warning.main', value: '#8A5A00', usage: 'Alert 배너 — 방문 미확인 · 업로드 대기', change: '교체(MUI 기본값→브랜드 전용)' },
  { label: 'error.main', value: '#B3261E', usage: 'Alert 배너 — 크레딧 미발송', change: '교체(MUI 기본값→브랜드 전용)' },
  { label: 'info.main', value: '#0E6B7A', usage: '현재 미사용 — primary(#0000FF)와 색상군이 겹치지 않도록 청록 계열로 사전 정의', change: '교체(MUI 기본값→브랜드 전용)' },
];

export const Doc = {
  render: () => (
    <>
      <DocumentTitle
        title="BeautyMaster — Visual Direction"
        status="Available"
        note="Operations · Analytics · Workflow 모두 구현 완료. 색상/폰트 토큰은 MUI 기본값에서 브랜드 전용 값으로 교체 완료 (src/styles/themes/default.js)"
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.3"
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

        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Operations 탭 vs Workflow 탭</Typography>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>축</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Operations 탭</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Workflow 탭</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['우선순위', '상태 판독 속도', '내용 이해 정확도'],
                ['열람 빈도', '하루 수십 번', '가끔 (온보딩·팔로업·회의 시)'],
                ['정보 밀도', '높음 (한 화면에 최대치)', '낮음 (한 번에 하나씩 펼침)'],
                ['색의 역할', '상태 신호(완료/경고/위험)', '역할 구분(누가 관여하는가)뿐, 심각도 없음'],
              ].map(([axis, ops, workflow]) => (
                <TableRow key={axis}>
                  <TableCell sx={{ fontWeight: 600 }}>{axis}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{ops}</TableCell>
                  <TableCell>{workflow}</TableCell>
                </TableRow>
              ))}
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

        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Workflow 탭 레이아웃</Typography>
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
                ['탭 바', '100%', 'sticky', 'Operations · Analytics · Workflow — 기존과 동일한 위치'],
                ['콘텐츠 컬럼', 'max-width 840px, 중앙 정렬', '단일 세로 스크롤', 'Phase 아코디언 + Files 그리드 + 구현 노트'],
                ['좌측 패널', '없음', '—', 'Operations의 고정 264px 패널은 Workflow에 불필요 — 참조 문서에 스케줄 뷰가 필요 없음'],
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
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          콘텐츠 컬럼의 중앙 정렬은 "히어로 중앙정렬" 클리셰가 아니라 읽기용 문서의 표준 패턴이다 — 넓은 화면에서도 한 줄이 너무 길어지지 않도록 폭을 제한하는 목적.
        </Typography>

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
                <TableCell>방문·업로드 미완료 → warning amber (#8A5A00) / 크레딧 미발송 → error red (#B3261E)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>노쇼 · 일정변경 무응답 배지</TableCell>
                <TableCell>새 색 도입하지 않음 — warning amber (#8A5A00) 재사용. 크레딧 미발송처럼 확정적 실패가 아니라 협의 중 상태이므로 방문·업로드 미완료와 같은 심각도로 취급</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Workflow 탭엔 success · warning · error 금지</TableCell>
                <TableCell>이 세 색은 Operations 탭의 운영 상태(완료/경고/위험) 전용이다. Workflow는 상태 화면이 아니라 참조 콘텐츠이므로 등장시키지 않는다 — 등장하면 "여기 문제 있다"는 오독을 유발함</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Workflow Handoff는 secondary, 상태색 아님</TableCell>
                <TableCell>Store Manager 같은 외부 이해관계자 개입은 "누가 관여하는가"를 나타낼 뿐 진행 상태가 아니다. success green을 쓰면 "완료됨"으로 오독되므로 secondary.main(중립 강조)을 쓴다</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <SectionTitle
          title="발견 사항 — Workflow 프로토타입 색상 수정"
          description="Workflow 탭 콘텐츠를 처음 작성할 때는 위 원칙이 정리되기 전이라 아래처럼 규칙을 어기고 있었다. 발견 즉시 수정함."
        />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>위치</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>기존</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>문제</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>수정</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Workflow 파일 태그', "primary 컬러 (파란색)", '클릭 안 되는 정적 태그에 인터랙티브 전용색 사용 — 위 "primary.main 사용 제한" 위반', 'grey.100 배경 (중립)'],
                ['Workflow Handoff 배지', 'success 컬러 (녹색)', '역할 라벨에 완료 상태색 사용 → "이미 끝난 일"로 오독 가능', 'secondary.main'],
              ].map(([loc, before, problem, after], i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontSize: 12 }}>{loc}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 11, color: 'error.main' }}>{before}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{problem}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 11, color: 'success.main' }}>{after}</TableCell>
                </TableRow>
              ))}
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
                ['Workflow: Phase 기본 펼침 상태', '01 Prepare만 open, 나머지 6개 collapsed', '7단계를 한 번에 다 보여주면 스캔 난이도가 Operations 그리드보다 높아짐'],
                ['Workflow: Phase 헤더 패딩', 'py: 1.5 (12px)', '접힌 상태에서 리스트처럼 훑어볼 수 있도록 낮게'],
                ['Workflow: Phase 본문 패딩', 'p: 2 (16px)', '펼친 뒤에는 체크리스트가 여유 있게 읽히도록'],
                ['Workflow: 체크리스트 항목 간격', 'gap: 0.5 (4px)', '짧은 bullet 나열이라 촘촘해도 판독 저하 없음'],
                ['Workflow: Files 그리드', 'auto-fit minmax(220px, 1fr), gap: 1 (8px)', '5개 카드가 화면 폭에 따라 자연스럽게 줄바꿈'],
                ['Workflow: 본문 리딩 폭', '약 65자', '체크리스트·설명 모두 이 범위 유지 — 프로젝트 타이포 기준과 동일'],
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
                ['Workflow: 페이지 타이틀', 'h4', '28px', '700', 'Operations 헤더(h6, 18px)보다 큼 — 문서형 콘텐츠라 진입 시 타이틀이 주인공'],
                ['Workflow: Phase 번호', 'caption + monospace', '12px', '600', 'text.disabled — 순서 정보일 뿐 강조 아님'],
                ['Workflow: Phase 타이틀', 'body1', '16px', '700', ''],
                ['Workflow: Phase 요약 (collapsed)', 'body2', '13px', '400', 'text.secondary — collapsed 상태에서도 항상 노출'],
                ['Workflow: 체크리스트 항목', 'body2', '14px', '400', 'line-height 1.55 — 문장형 항목이 많아 여유 있게'],
                ['Workflow: 파일 카드 설명', 'body2', '13px', '400', ''],
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
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Workflow: tabular-nums 불필요</TableCell>
                <TableCell>Operations와 달리 Workflow에는 정렬이 필요한 숫자 컬럼(성과 지표 등)이 없다 — 적용 대상 자체가 없음</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Workflow: 이모지로 단계 대체 금지</TableCell>
                <TableCell>7단계는 번호(01~07)만으로 순서를 표현한다. 단계마다 다른 이모지를 붙이면 장식으로 읽혀 순서 인지를 방해함</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Workflow: collapsed 요약은 동사로 시작</TableCell>
                <TableCell>"Get tier-based assets ready"처럼 행동을 명시. 명사형 제목만으로는 collapsed 상태에서 무엇을 해야 하는지 알 수 없음</TableCell>
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
                ['Agreement (동의)', 'TaskAlt filled — #167C3D', 'RadioButtonUnchecked — #E0E0E0', '18px'],
                ['Attend (방문)', 'CheckCircle filled — #167C3D', 'RadioButtonUnchecked — #E0E0E0', '18px'],
                ['Collabo (업로드)', 'CloudDone filled — #167C3D', 'RadioButtonUnchecked — #E0E0E0', '18px'],
                ['Credit (크레딧)', 'Paid filled — #167C3D', 'RadioButtonUnchecked — #E0E0E0', '18px'],
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
          아래 항목은 <code>src/styles/themes/default.js</code>에 실제 반영 완료. primary · secondary · borderRadius · shadows는 모두 유지.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>토큰 경로</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>이전값</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>현재값</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>적용 대상</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['palette.error.main', 'MUI 기본 #D32F2F (byte-identical)', '#B3261E', 'Alert 배너 — 크레딧 미발송'],
                ['palette.warning.main', 'MUI 기본 #ED6C02 (byte-identical)', '#8A5A00', 'Alert 배너 — 방문·업로드 미완료'],
                ['palette.success.main', 'MUI 기본 #2E7D32 (byte-identical)', '#167C3D', '4단계 상태 완료 아이콘'],
                ['palette.info.main', 'MUI 기본 #0288D1 (byte-identical, 미사용)', '#0E6B7A', 'primary(#0000FF)와 색상군 분리 — 사용처 생기면 대비'],
                ['typography.fontFamily', "'Roboto' 포함 (MUI 보일러플레이트 잔재)", "'Roboto' 제거", '본문 전체'],
                ['typography.headingFontFamily / h1-h6', "'Outfit' (로드되는 폰트 이름과 불일치)", "'Outfit Variable' (실제 파일명과 일치)", '헤딩 전체'],
                ['폰트 실제 로드', '로드 안 됨 — 프로덕션 0곳, Storybook은 Outfit만 CDN', 'pretendard · @fontsource-variable/outfit self-host, main.jsx + preview.jsx 양쪽 로드', '전체 타이포그래피'],
              ].map(([token, current, next, target]) => (
                <TableRow key={token}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{token}</TableCell>
                  <TableCell sx={{ color: 'error.main', fontSize: 11.5 }}>{current}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'success.main' }}>{next}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          핵심 발견: success/warning/error/info의 이전 hex 값은 <code>createTheme()</code>이 인자 없이 생성하는 MUI 순정 기본값과 완전히 동일했다 — "브랜드 색"으로 문서화되어 있었지만 실제로는 아무도 고르지 않은 값이었다. 폰트도 마찬가지로 이름만 지정되어 있었을 뿐, 실제 파일이 어디에도 로드되지 않아 프로덕션에서는 100% 시스템 폰트로 대체되고 있었다.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Workflow 탭: 신규 토큰 없음 — 기존 secondary · grey.100 · divider만 재구성. success/warning/error는 의도적으로 미사용.
        </Typography>
      </PageContainer>
    </>
  ),
};
