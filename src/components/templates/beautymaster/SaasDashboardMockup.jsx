import { useState } from 'react';
import SaasShell from './SaasShell';
import SaasOperationsView from './SaasOperationsView';
import SaasAnalyticsView from './SaasAnalyticsView';
import SaasWorkflowView from './SaasWorkflowView';

/**
 * SaasDashboardMockup component
 *
 * 전형적 모던 SaaS 문법(modern_saas_design_core_features.md) 대시보드 시안 (비교·검토용 mockup, 대시보드 미연결).
 * 기존 대시보드와 같은 구성 — Operations / Analytics / Workflow 3개 뷰이며, 탭 대신 사이드바로 전환한다.
 * 표면 문법만 다르다: White 배경, thin 1px border, 8px radius, 섀도 없음, Inter, accent는 theme primary 1색.
 * 카드를 쓰지 않고 border + spacing + typography로 구획하고, 본문은 중앙 정렬 없이 프레임을 가득 채운다.
 * 기존 라운드 카드 + 소프트 섀도 시안(MentionsPanelSaas / OperationsPanelSaas)과 대비되는 flat-SaaS 시안.
 *
 * Props:
 * @param {Influencer[]} influencers - 전체 인플루언서 목록 (data/beautymaster/schema.js typedef) [Required]
 * @param {object} inviteCounts - "Number" 탭 초대 인원 데이터 (store→tier→count) [Optional, 기본값: {}]
 * @param {Date|null} lastSyncedAt - 마지막 시트 동기화 시각 [Optional, 기본값: null]
 * @param {string|null} selectedStore - Workflow 뷰 캡션에 표시할 스토어 [Optional, 기본값: null]
 * @param {string} defaultView - 최초 활성 뷰 (operations|analytics|workflow) [Optional, 기본값: 'operations']
 * @param {function} onSelect - 인플루언서 행 클릭 핸들러 (influencer) => void [Optional]
 * @param {function} onOpenSettings - 사이드바 설정 아이콘 클릭 핸들러 [Optional]
 * @param {string|null} selectedId - 현재 선택된 인플루언서 ID [Optional, 기본값: null]
 * @param {object} sx - 루트 Box에 적용할 MUI sx 오버라이드 [Optional]
 *
 * Example usage:
 * <SaasDashboardMockup influencers={influencers} lastSyncedAt={lastSyncedAt} onSelect={handleSelect} />
 */
function SaasDashboardMockup({
  influencers,
  inviteCounts = {},
  lastSyncedAt = null,
  defaultView = 'operations',
  onSelect,
  onOpenSettings,
  selectedId = null,
  sx,
}) {
  const [activeView, setActiveView] = useState(defaultView);

  return (
    <SaasShell
      activeNav={activeView}
      influencerCount={influencers.length}
      lastSyncedAt={lastSyncedAt}
      onNavigate={setActiveView}
      onRefresh={onOpenSettings}
      onOpenSettings={onOpenSettings}
      sx={sx}
    >
      {activeView === 'operations' && (
        <SaasOperationsView
          influencers={influencers}
          onSelect={onSelect}
          selectedId={selectedId}
        />
      )}
      {activeView === 'analytics' && (
        <SaasAnalyticsView
          influencers={influencers}
          inviteCounts={inviteCounts}
        />
      )}
      {activeView === 'workflow' && <SaasWorkflowView />}
    </SaasShell>
  );
}

export default SaasDashboardMockup;
