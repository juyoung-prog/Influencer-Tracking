import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

/**
 * TODAY → "10:30 AM"
 * date groups → "11:00 AM" (time only, date is in the group header)
 * PAST → "Jul 5 · 10:00 AM"
 * NO TIME SET → "—"
 */
function formatTimeLabel(date, isDateGroup) {
  if (!date) return '—';
  if (isDateGroup) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}

function getStageInfo({ attend, collaboShared, creditShared, scheduleGroup }) {
  if (creditShared)  return { label: 'Completed',        color: 'success.main',   show: true };
  if (collaboShared) return { label: 'Credit Not Sent',  color: 'error.main',     show: true };
  if (attend)        return { label: 'Awaiting Upload',  color: 'text.secondary', show: true };
  const isFuture = scheduleGroup === 'upcoming' || scheduleGroup === 'today';
  if (isFuture)      return { label: 'Scheduled',        color: 'text.disabled',  show: false };
  return               { label: 'Visit Unconfirmed', color: 'warning.main',   show: true };
}

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * Group influencers:
 * - TODAY → single group
 * - UPCOMING → split by specific calendar date (Jul 8, Jul 9, ...)
 * - PAST → single group
 * - NO TIME → single group
 */
function buildGroups(influencers) {
  const todayGroup = { key: 'today', label: 'TODAY', isToday: true, items: [] };
  const pastGroup  = { key: 'past',  label: 'PAST',  isToday: false, items: [] };
  const noTimeGroup = { key: 'no-time', label: 'NO TIME SET', isToday: false, items: [] };
  const dateGroups = {};

  for (const inf of influencers) {
    const g = inf.scheduleGroup || 'no-time';
    if (g === 'today') {
      todayGroup.items.push(inf);
    } else if (g === 'upcoming' && inf.scheduledTime) {
      const k = dateKey(inf.scheduledTime);
      if (!dateGroups[k]) {
        const label = inf.scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateGroups[k] = { key: k, label, isToday: false, isDateGroup: true, _sortDate: inf.scheduledTime, items: [] };
      }
      dateGroups[k].items.push(inf);
    } else if (g === 'past') {
      pastGroup.items.push(inf);
    } else {
      noTimeGroup.items.push(inf);
    }
  }

  const sortedDateGroups = Object.values(dateGroups).sort((a, b) => a._sortDate - b._sortDate);

  const all = [];
  if (todayGroup.items.length)    all.push(todayGroup);
  all.push(...sortedDateGroups);
  if (pastGroup.items.length)     all.push(pastGroup);
  if (noTimeGroup.items.length)   all.push(noTimeGroup);

  // Sort items within each group
  for (const grp of all) {
    grp.items.sort((a, b) => {
      if (!a.scheduledTime && !b.scheduledTime) return 0;
      if (!a.scheduledTime) return 1;
      if (!b.scheduledTime) return -1;
      return grp.key === 'past'
        ? b.scheduledTime - a.scheduledTime
        : a.scheduledTime - b.scheduledTime;
    });
  }

  return all;
}

/**
 * ScheduleTimeline component
 *
 * Left-panel visit schedule. TODAY is a single group; UPCOMING is split by
 * specific calendar date so each date shows a count and acts as a mini header.
 *
 * Props:
 * @param {Influencer[]} influencers - Full influencer list [Optional, default: []]
 * @param {function} onSelect - Row click handler (influencer) => void [Required]
 * @param {string|null} selectedId - Currently selected influencer ID [Optional, default: null]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <ScheduleTimeline influencers={influencers} onSelect={handleSelect} selectedId={selectedId} />
 */
function ScheduleTimeline({ influencers = [], onSelect, selectedId = null, sx }) {
  const groups = buildGroups(influencers);

  if (groups.length === 0) {
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
      {groups.map((grp, gIdx) => (
        <Box key={grp.key}>
          {gIdx > 0 && <Divider />}

          {/* Group header */}
          <Box
            sx={{
              px: 2,
              py: 0.75,
              backgroundColor: grp.isToday ? 'grey.900' : 'grey.50',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                lineHeight: 1,
                color: grp.isToday ? 'common.white' : 'text.secondary',
              }}
            >
              {grp.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 600,
                color: grp.isToday ? 'grey.400' : 'text.disabled',
                lineHeight: 1,
              }}
            >
              {grp.items.length}
            </Typography>
          </Box>

          {/* Rows */}
          {grp.items.map(inf => {
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
                  py: 0.875,
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
                  {formatTimeLabel(inf.scheduledTime, grp.isDateGroup || grp.isToday)}
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
                      fontSize: 13,
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
