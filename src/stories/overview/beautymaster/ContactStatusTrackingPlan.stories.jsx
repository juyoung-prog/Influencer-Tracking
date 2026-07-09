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
  title: 'Overview/BeautyMaster/Contact Status Tracking Plan',
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
        title="BeautyMaster — Contact Status Tracking Plan"
        status="Available"
        note="Phase 0-2 완료 + 버그 수정 2건 반영. Phase 3(Contact Log 탭)은 백로그."
        brandName="BeautyMaster"
        systemName="Influencer Dashboard"
        version="1.4"
      />
      <PageContainer>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Contact Status Tracking Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          방문 일정이 확정된 이후에도 인플루언서와 매니저 사이에는 노쇼 확인, 사전 일정변경 요청 같은
          별도의 협의 스레드가 생긴다. 이 협의 상태를 구글 시트 컬럼으로 담고, 대시보드가 "지금 누구에게
          후속 조치가 필요한가"를 자동으로 보여주도록 하는 계획이다.
        </Typography>

        {/* ① 배경 — 4가지 케이스 */}
        <SectionTitle title="배경 — 4가지 실사용 케이스" />
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '8%' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>트리거</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>응답</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>시나리오</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['1', '노쇼 확인', '응답 → 날짜 변경', '방문날짜 지나 오지 않은 인플루언서에게 문의 → 새 날짜로 답변 옴 → 반영'],
                ['2', '노쇼 확인', '무응답', '방문날짜 지나 오지 않은 인플루언서에게 문의 → 답변 없음'],
                ['3', '사전 변경요청', '무응답', '방문 전 일정변경 요청 받고 "언제로 할까요?" 되물음 → 답변 없음'],
                ['4', '사전 변경요청', '응답 → 날짜 변경', '방문 전 일정변경 요청 받고 되물음 → 새 날짜로 답변 옴 → 반영'],
              ].map(([n, reason, status, scenario]) => (
                <TableRow key={n}>
                  <TableCell sx={{ ...mono, color: 'text.disabled' }}>{n}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{reason}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{status}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{scenario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          4개 케이스는 컬럼 4개를 따로 만드는 대신, <Box component="code" sx={mono}>contact reason</Box> ×{' '}
          <Box component="code" sx={mono}>contact status</Box> 두 축의 조합으로 표현한다. 케이스가 늘어나도
          컬럼을 추가할 필요가 없다.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ② 시트 컬럼 정의 */}
        <SectionTitle title="구글 시트 컬럼 정의 (반영 완료)" />
        <TableContainer sx={{ mb: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>헤더</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>허용값</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>역할</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Contact Reason', 'No-show / Reschedule Request', '연락을 유발한 사유. 누가 먼저 문제를 제기했는지'],
                ['Contact Status', 'Pending Reply / Replied / No Response', '그 연락에 대한 현재 협의 단계'],
                ['Last Contact Date', '날짜', '가장 최근 연락 보낸 시점. 무응답 경과일 계산 기준'],
                ['Requested Date', '날짜 (nullable)', '인플루언서가 답장으로 제시한 새 희망일. 확정 전 임시값'],
              ].map(([header, values, role]) => (
                <TableRow key={header}>
                  <TableCell sx={{ ...mono }}>{header}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{values}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          <Box component="code" sx={mono}>Requested Date</Box>가 확정되면 원래{' '}
          <Box component="code" sx={mono}>Scheduled Time</Box> 컬럼 자체를 새 날짜로 덮어쓰고,{' '}
          <Box component="code" sx={mono}>Contact Status</Box>를 Replied로 바꾼다. 여러 차례 연락이 오간
          이력까지 남기고 싶으면 별도 "Contact Log" 탭(백로그, 아래 참고)에서 관리한다.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ③ 케이스 → 상태값 매핑 */}
        <SectionTitle title="케이스 → 상태값 매핑" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '8%' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>contactReason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>contactStatus</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>파생 alertFlag</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['1', 'no-show', 'replied', '없음 (scheduledTime 갱신 후 해제됨)'],
                ['2', 'no-show', 'no-response / pending-reply', 'no-show-unresolved'],
                ['3', 'reschedule-request', 'no-response / pending-reply', 'reschedule-pending'],
                ['4', 'reschedule-request', 'replied', '없음 (scheduledTime 갱신 후 해제됨)'],
              ].map(([n, reason, status, flag]) => (
                <TableRow key={n}>
                  <TableCell sx={{ ...mono, color: 'text.disabled' }}>{n}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{reason}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{status}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{flag}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ④ Phase 0-1: 데이터 레이어 (완료) */}
        <SectionTitle title="Phase 0-1 — 데이터 레이어 (완료)" />

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          schema.js
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableBody>
              {[
                ['CONTACT_REASONS', "{ NO_SHOW: 'no-show', RESCHEDULE_REQUEST: 'reschedule-request' }"],
                ['CONTACT_STATUSES', "{ PENDING_REPLY: 'pending-reply', REPLIED: 'replied', NO_RESPONSE: 'no-response' }"],
                ['ALERT_FLAGS (추가)', "NO_SHOW_UNRESOLVED: 'no-show-unresolved', RESCHEDULE_PENDING: 'reschedule-pending'"],
                ['Influencer 필드 (추가)', 'contactReason, contactStatus, lastContactDate, requestedDate'],
                ['deriveAlertFlags (수정)', 'contactReason이 있고 !attend && contactStatus가 replied가 아니면 해당 alertFlag push (attend 조건은 버그 수정으로 추가, 아래 ⑧ 참고)'],
              ].map(([name, val]) => (
                <TableRow key={name}>
                  <TableCell sx={{ ...mono, width: '26%' }}>{name}</TableCell>
                  <TableCell sx={{ ...mono, fontSize: 11, color: 'text.secondary' }}>{val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          parseInfluencerCsv.js
        </Typography>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['parseContactReason(val)', "대소문자·공백 표기 정규화 → CONTACT_REASONS 값 또는 null"],
                ['parseContactStatus(val)', "대소문자·공백 표기 정규화 → CONTACT_STATUSES 값 또는 null"],
                ['row mapping', "Contact Reason / Contact Status / Last Contact Date / Requested Date 4개 헤더 매핑"],
              ].map(([name, val]) => (
                <TableRow key={name}>
                  <TableCell sx={{ ...mono, width: '26%' }}>{name}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑤ Phase 2: 대시보드 UI (완료) */}
        <SectionTitle title="Phase 2 — 대시보드 UI 반영 (완료)" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <Box component="code" sx={mono}>alertFlags</Box>에 실린{' '}
          <Box component="code" sx={mono}>no-show-unresolved</Box> /{' '}
          <Box component="code" sx={mono}>reschedule-pending</Box>를 화면에 노출했다. 실데이터 기준으로
          스크린샷 검증 완료 (Jasmin Bean, Nesia Welch 등 — "Visit Unconfirmed · 1d overdue · No-show · awaiting reply" 3줄 배지).
        </Typography>
        <TableContainer sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>파일</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>변경 내용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['InfluencerPanel.jsx', 'ALERT_FLAG_SEVERITY 맵에 두 플래그를 warning으로 추가 → ACTION REQUIRED 섹션 정렬에 반영'],
                ['InfluencerListRow.jsx', 'getContactAlert() 헬퍼 추가. contactStatus가 no-response면 "Nd no reply"(굵게), pending-reply면 "awaiting reply"를 warning.main 색으로 표시. 라벨은 "No-show"/"Reschedule"로 축약 — 같은 컬럼의 다른 상태 라벨(Awaiting Upload 등)과 길이를 맞춰 줄바꿈 방지. requestedDate가 있으면 "→ Jul 14"로 끝에 덧붙임(⑧ 참고)'],
              ].map(([file, change]) => (
                <TableRow key={file}>
                  <TableCell sx={{ ...mono, fontSize: 11 }}>{file}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{change}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 4 }}>
          <Box component="code" sx={mono}>AlertBanner.jsx</Box>는 건드리지 않았다 — 조사 결과 라이브 대시보드에
          연결돼 있지 않고 <Box component="code" sx={mono}>ComponentGalleryPage.jsx</Box> 데모에서만
          mock 데이터로 쓰이고 있었다. 실제 "액션 필요" 노출은 위 두 파일이 전담한다.
        </Typography>

        <Divider sx={{ my: 4 }} />

        {/* ⑥ 발견된 버그 & 수정 */}
        <SectionTitle title="발견된 버그 & 수정" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Phase 2를 실데이터로 검증하는 과정에서 시나리오를 끝까지 추적해보니 2건의 로직 결함을 발견해 수정했고,
          코드로는 못 막는 한계 2건이 남아있다.
        </Typography>

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          수정 완료
        </Typography>
        <TableContainer sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '26%' }}>문제</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>내용 · 수정</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['유령 배지', 'Attend를 체크해도 Contact Status를 따로 안 바꾸면 no-show-unresolved/reschedule-pending이 안 꺼짐 (실제로 방문했는데 배지가 계속 남음). → deriveAlertFlags의 contactUnresolved 계산에 !attend 조건 추가. 이제 Attend 체크 하나로 자동 해제됨.'],
                ['희망일 비노출', 'requestedDate가 파싱·저장은 되는데 대시보드 어디에도 안 보여서, 배지를 보고도 "언제로 바꾸재는지" 확인하려면 시트를 다시 열어야 했음. → InfluencerListRow 배지에 "→ Jul 14" 형태로 날짜 추가 노출.'],
              ].map(([issue, detail]) => (
                <TableRow key={issue}>
                  <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>{issue}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
          알려진 한계 (미수정 — 아래 백로그 참고)
        </Typography>
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['Scheduled Time ↔ Requested Date 수동 동기화', 'Requested Date가 확정되면 Scheduled Time을 새 날짜로 덮어써야 한다는 규칙이 문서(②)에만 있고 코드가 강제하지 않음. 매니저가 Scheduled Time 갱신을 깜빡하면 Contact Status는 Replied인데 Visit Unconfirmed/overdue는 계속 남을 수 있음.'],
                ['재노쇼 재발동 안 됨', '같은 인플루언서가 옮긴 날짜에도 또 안 오면, Contact Status가 이미 Replied로 남아있어 no-show-unresolved가 다시 안 뜸. 매니저가 Contact Status를 다시 No Response로 수동 리셋해야 함 — 이력이 아니라 현재 상태 1개만 저장하는 설계의 한계.'],
              ].map(([item, note]) => (
                <TableRow key={item}>
                  <TableCell sx={{ fontWeight: 600, width: '26%', fontSize: 12 }}>{item}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑦ 백로그 */}
        <SectionTitle title="백로그 (범위 밖)" />
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableBody>
              {[
                ['Contact Log 탭', '한 인플루언서에게 여러 차례 연락이 오간 이력(1차 무응답 → 2차 리마인드 → 응답)을 이벤트 단위로 기록. barcode로 메인 시트와 연결. 재노쇼 재발동 한계도 이걸로 해결됨.'],
                ['Scheduled Time 자동 동기화', 'Requested Date 확정 시 Scheduled Time을 자동으로 승격 — 현재는 수동 규칙에 의존'],
                ['무응답 경과일 자동 계산', 'lastContactDate 기준 오늘까지의 일수를 파생해 "N일째 무응답" 배지에 사용'],
                ['리마인드 자동 알림', '무응답 N일 경과 시 매니저에게 알림 (범위 밖 — 대시보드는 읽기 전용 유지 원칙과 상충 검토 필요)'],
              ].map(([item, note]) => (
                <TableRow key={item}>
                  <TableCell sx={{ fontWeight: 600, width: '22%', fontSize: 12 }}>{item}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        {/* ⑧ Task Order Checklist */}
        <SectionTitle title="Task Order Checklist" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '12%' }}>Phase</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '38%' }}>작업</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>완료 기준</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                ['Phase 0', 'schema.js — 상수/필드/alertFlags 추가', '완료', 'success'],
                ['Phase 1', 'parseInfluencerCsv.js — 4개 컬럼 매핑', '완료', 'success'],
                ['Phase 2', 'InfluencerPanel.jsx / InfluencerListRow.jsx — 배지 노출', '완료. 실데이터 스크린샷 검증 완료', 'success'],
                ['Phase 3', 'Contact Log 탭 (백로그)', '요청 시 진행', 'default'],
              ].map(([phase, task, condition, color]) => (
                <TableRow key={phase}>
                  <TableCell><Tag label={phase} color={color === 'default' ? 'primary' : color} /></TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{task}</TableCell>
                  <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{condition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageContainer>
    </>
  ),
};
