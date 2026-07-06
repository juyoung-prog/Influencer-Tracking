import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ScheduleTimeline from '../../data-display/ScheduleTimeline';

/**
 * SchedulePanel component
 *
 * Left panel of the BeautyMaster dashboard.
 * Wraps ScheduleTimeline with the "VISIT SCHEDULE" label header.
 * Forwards ref to the root scrollable Box for parent-controlled scroll sync.
 *
 * Props:
 * @param {Influencer[]} influencers - Full influencer list [Required]
 * @param {function} onSelect - Called with an influencer object when a row is clicked [Required]
 * @param {string|null} selectedId - ID of the currently selected influencer [Optional, default: null]
 * @param {object} sx - MUI sx overrides applied to the root Box [Optional]
 *
 * Example usage:
 * <SchedulePanel ref={timelinePanelRef} influencers={influencers} onSelect={handleSelect} selectedId={selectedId} />
 */
const SchedulePanel = forwardRef(function SchedulePanel({ influencers, onSelect, selectedId, sx }, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        width: 264,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
          Visit Schedule
        </Typography>
      </Box>
      <ScheduleTimeline
        influencers={influencers}
        onSelect={onSelect}
        selectedId={selectedId}
        sx={{ flex: 1 }}
      />
    </Box>
  );
});

export default SchedulePanel;
