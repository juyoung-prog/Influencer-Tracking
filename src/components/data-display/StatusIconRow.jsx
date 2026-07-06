import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import PaidIcon from '@mui/icons-material/Paid';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const STATUS_CONFIG = [
  { prop: 'agreement', Icon: TaskAltIcon, label: 'Agreement' },
  { prop: 'attend', Icon: CheckCircleIcon, label: 'Visit' },
  { prop: 'collaboShared', Icon: CloudDoneIcon, label: 'Content Upload' },
  { prop: 'creditShared', Icon: PaidIcon, label: 'Credit Sent' },
];

/**
 * StatusIconRow component
 *
 * Displays the 4 influencer operation stages (Agreement → Visit → Upload → Credit)
 * as a single row of icons. No schema dependency — accepts 4 booleans only.
 *
 * Props:
 * @param {boolean} agreement - Agreement submitted [Optional, default: false]
 * @param {boolean} attend - Store visit complete [Optional, default: false]
 * @param {boolean} collaboShared - Content uploaded [Optional, default: false]
 * @param {boolean} creditShared - Credit sent [Optional, default: false]
 * @param {number} size - Icon size in px [Optional, default: 18]
 *
 * Example usage:
 * <StatusIconRow agreement attend collaboShared={false} creditShared={false} />
 */
function StatusIconRow({
  agreement = false,
  attend = false,
  collaboShared = false,
  creditShared = false,
  size = 18,
}) {
  const values = { agreement, attend, collaboShared, creditShared };

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {STATUS_CONFIG.map(({ prop, Icon, label }) => {
        const done = values[prop];
        return (
          <Tooltip key={prop} title={`${label}: ${done ? 'Complete' : 'Incomplete'}`} arrow>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              {done
                ? <Icon sx={{ fontSize: size, color: 'success.main' }} />
                : <RadioButtonUncheckedIcon sx={{ fontSize: size, color: 'action.disabled' }} />
              }
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

export default StatusIconRow;
