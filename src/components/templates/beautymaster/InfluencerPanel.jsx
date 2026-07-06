import { forwardRef, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import InfluencerFilterBar from '../../data-display/InfluencerFilterBar';
import InfluencerListRow from '../../data-display/InfluencerListRow';
import { CategoryTab } from '../../in-page-navigation/CategoryTab';
import { SearchBar } from '../../input/SearchBar';
import { ALERT_FLAGS } from '../../../data/beautymaster/schema.js';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'Processing', label: 'Processing' },
  { id: 'Done', label: 'Done' },
];

const SCHEDULE_PRIORITY = { today: 0, upcoming: 1, 'no-time': 2, past: 3 };
const SEVERITY_RANK = { error: 0, warning: 1, passive: 2 };
const ALERT_FLAG_SEVERITY = {
  [ALERT_FLAGS.COLLABO_NO_CREDIT]: 'error',
  [ALERT_FLAGS.AGREEMENT_NO_ATTEND]: 'warning',
  [ALERT_FLAGS.CREDIT_SHARED_NO_USED]: 'warning',
  [ALERT_FLAGS.ATTEND_NO_COLLABO]: 'passive',
};

function maxAlertSeverity(alertFlags) {
  return alertFlags.reduce((min, flag) => {
    const rank = SEVERITY_RANK[ALERT_FLAG_SEVERITY[flag]] ?? 3;
    return Math.min(min, rank);
  }, 3);
}

/**
 * InfluencerPanel component
 *
 * Right panel of the BeautyMaster dashboard.
 * Smart component: owns tab, filter, and search state.
 * Applies 3-tier sorting (alert → active → completed) and section labels.
 * Forwards ref to the root scrollable Box for parent-controlled scroll sync.
 *
 * Props:
 * @param {Influencer[]} influencers - Full influencer list [Required]
 * @param {string[]} stores - Available store values for the filter dropdown [Required]
 * @param {number[]} months - Available month values for the filter dropdown [Required]
 * @param {function} onSelect - Called with an influencer object when a row is clicked [Required]
 * @param {string|null} selectedId - ID of the currently selected influencer [Optional, default: null]
 * @param {boolean} isLoading - Whether initial data is loading [Optional, default: false]
 * @param {Error|null} error - Fetch error to show in the error banner [Optional, default: null]
 * @param {function} onRetry - Retry handler shown alongside the error banner [Optional]
 * @param {object} sx - MUI sx overrides applied to the root Box [Optional]
 *
 * Example usage:
 * <InfluencerPanel ref={listPanelRef} influencers={influencers} stores={stores} months={months} onSelect={handleSelect} selectedId={selectedId} />
 */
const InfluencerPanel = forwardRef(function InfluencerPanel(
  { influencers, stores, months, filters, onFiltersChange, onSelect, selectedId, isLoading = false, error = null, onRetry, sx },
  ref
) {
  const [tab, setTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return influencers.filter(inf => {
      if (tab !== 'all' && inf.sheetStatus !== tab) return false;
      if (q && !inf.fullName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [influencers, tab, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aAlert = a.alertFlags.length > 0 ? 0 : 1;
      const bAlert = b.alertFlags.length > 0 ? 0 : 1;
      if (aAlert !== bAlert) return aAlert - bAlert;

      if (aAlert === 0) {
        const aSev = maxAlertSeverity(a.alertFlags);
        const bSev = maxAlertSeverity(b.alertFlags);
        if (aSev !== bSev) return aSev - bSev;
      }

      const aDone = a.creditShared ? 1 : 0;
      const bDone = b.creditShared ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;

      const aP = SCHEDULE_PRIORITY[a.scheduleGroup] ?? 4;
      const bP = SCHEDULE_PRIORITY[b.scheduleGroup] ?? 4;
      if (aP !== bP) return aP - bP;
      if (a.scheduledTime && b.scheduledTime) return a.scheduledTime - b.scheduledTime;
      return 0;
    });
  }, [filtered]);

  const showSkeleton = isLoading && influencers.length === 0;

  return (
    <Box ref={ref} sx={{ flex: 1, overflow: 'auto', minWidth: 0, ...sx }}>
      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: 0 }}
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          Failed to load data — {error.message}
        </Alert>
      )}

      <Box sx={{ p: 2 }}>
        <SearchBar
          value={searchQuery}
          placeholder="Search by name..."
          onChange={setSearchQuery}
          isFullWidth
          size="sm"
          sx={{ mb: 1.5 }}
        />
        <InfluencerFilterBar
          stores={stores}
          months={months}
          filters={filters}
          onFiltersChange={onFiltersChange}
          sx={{ mb: 2 }}
        />
        <CategoryTab categories={TABS} selected={tab} onChange={setTab} />

        {showSkeleton ? (
          <Box sx={{ mt: 1 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width={140} />
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  {[0, 1, 2, 3].map(j => <Skeleton key={j} variant="circular" width={15} height={15} />)}
                </Box>
              </Box>
            ))}
          </Box>
        ) : sorted.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" color="text.disabled">
              No influencers found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1, border: '1px solid', borderColor: 'divider', borderBottom: 'none' }}>
            {(() => {
              const sections = [
                {
                  key: 'action',
                  label: 'ACTION REQUIRED',
                  labelColor: 'error.main',
                  items: sorted.filter(i => i.alertFlags.length > 0),
                },
                {
                  key: 'scheduled',
                  label: 'UPCOMING',
                  labelColor: 'text.disabled',
                  items: sorted.filter(i => i.alertFlags.length === 0 && !i.creditShared),
                },
                {
                  key: 'completed',
                  label: 'COMPLETED',
                  labelColor: 'text.disabled',
                  items: sorted.filter(i => i.alertFlags.length === 0 && i.creditShared),
                },
              ].filter(s => s.items.length > 0);

              return sections.map((section, sIdx) => (
                <Box key={section.key}>
                  {sIdx > 0 && <Divider />}
                  <Box sx={{ px: 2, py: 0.625, backgroundColor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: section.labelColor, lineHeight: 1 }}>
                      {section.label}
                    </Typography>
                  </Box>
                  {section.items.map(inf => (
                    <InfluencerListRow
                      key={inf.id}
                      influencer={inf}
                      onClick={() => onSelect(inf)}
                      isSelected={selectedId === inf.id}
                    />
                  ))}
                </Box>
              ));
            })()}
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default InfluencerPanel;
