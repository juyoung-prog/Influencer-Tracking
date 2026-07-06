import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const GROUP_ORDER = ['today', 'upcoming', 'past', 'no-time'];

const GROUP_LABEL = {
  today: 'TODAY',
  upcoming: 'UPCOMING',
  past: 'PAST',
  'no-time': 'NO TIME SET',
};

/**
 * TODAY → "10:30 AM" (time)
 * UPCOMING / PAST → "Jul 5" (date, because the day matters more than the time)
 * NO TIME SET → "—"
 */
function formatLabel(date, group) {
  if (!date) return '—';
  if (group === 'today') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Derive stage label + color from influencer fields.
 * show: false for default/expected states (Scheduled, Agreement Pending) —
 * they add noise when repeated across many upcoming rows.
 * show: true only for states that need attention or signal completion.
 */
function getStageInfo({ attend, collaboShared, creditShared, scheduleGroup }) {
  if (creditShared)  return { label: 'Completed',        color: 'success.main',   show: true };
  if (collaboShared) return { label: 'Credit Not Sent',  color: 'error.main',     show: true };
  if (attend)        return { label: 'Awaiting Upload',  color: 'text.secondary', show: true };
  const isFuture = scheduleGroup === 'upcoming' || scheduleGroup === 'today';
  if (isFuture)      return { label: 'Scheduled',        color: 'text.disabled',  show: false };
  return               { label: 'Visit Unconfirmed', color: 'warning.main',   show: true };
}

/**
 * Group influencers by scheduleGroup and sort each group by time.
 *
 * @param {Influencer[]} influencers
 * @returns {{ group: string, items: Influencer[] }[]}
 */
function groupAndSort(influencers) {
  const groups = {};
  influencers.forEach(inf => {
    const g = inf.scheduleGroup || 'no-time';
    if (!groups[g]) groups[g] = [];
    groups[g].push(inf);
  });

  return GROUP_ORDER
    .filter(g => groups[g] && groups[g].length > 0)
    .map(g => ({
      group: g,
      items: groups[g].sort((a, b) => {
        if (!a.scheduledTime && !b.scheduledTime) return 0;
        if (!a.scheduledTime) return 1;
        if (!b.scheduledTime) return -1;
        return g === 'past'
          ? b.scheduledTime - a.scheduledTime
          : a.scheduledTime - b.scheduledTime;
      }),
    }));
}

/**
 * ScheduleTimeline component
 *
 * Left-panel visit schedule sorted by time.
 * Groups: TODAY → UPCOMING → PAST → NO TIME SET.
 * Each row shows name + stage label text (same vocabulary as right-panel list).
 *
 * Props:
 * @param {Influencer[]} influencers - Full influencer list [Optional, default: []]
 * @param {function} onSelect - Row click handler (influencer) => void [Required]
 * @param {string|null} selectedId - ID of the currently selected influencer [Optional, default: null]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ScheduleTimeline influencers={influencers} onSelect={handleSelect} selectedId={selectedId} />
 */
function ScheduleTimeline({ influencers = [], onSelect, selectedId = null, sx }) {
  const grouped = groupAndSort(influencers);

  if (grouped.length === 0) {
    return (
      <Box sx={{ p: 2, ...sx }}>
        <Typography variant="caption" color="text.disabled">
          No influencers scheduled
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: 'auto', ...sx }}>
      {grouped.map(({ group, items }, gIdx) => (
        <Box key={group}>
          {gIdx > 0 && <Divider />}
          {/* Group header */}
          <Box
            sx={{
              px: 2,
              py: 0.75,
              backgroundColor: group === 'today' ? 'grey.900' : 'grey.50',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                lineHeight: 1,
                color: group === 'today' ? 'common.white' : 'text.secondary',
              }}
            >
              {GROUP_LABEL[group]}
            </Typography>
          </Box>

          {/* Rows */}
          {items.map(inf => {
            const isSelected = inf.id === selectedId;
            const stage = getStageInfo({
              attend: inf.attend,
              collaboShared: inf.collaboShared,
              creditShared: inf.creditShared,
              scheduleGroup: inf.scheduleGroup,
            });
            return (
              <ButtonBase
                key={inf.id}
                data-influencer-id={inf.id}
                onClick={() => onSelect(inf)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  px: 2,
                  py: 1,
                  textAlign: 'left',
                  borderLeft: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'transparent',
                  backgroundColor: isSelected ? 'action.selected' : 'transparent',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ width: 52, flexShrink: 0, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
                >
                  {formatLabel(inf.scheduledTime, group)}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isSelected ? 700 : 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                    }}
                  >
                    {inf.fullName || '—'}
                  </Typography>
                  {stage.show && (
                    <Typography
                      variant="caption"
                      sx={{ color: stage.color, lineHeight: 1.2, display: 'block' }}
                    >
                      {stage.label}
                    </Typography>
                  )}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

export default ScheduleTimeline;
