import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

const CHIP_SX = { borderRadius: 0, height: 28, fontSize: 12 };

const FILTER_GROUPS = [
  {
    key: 'platform',
    label: 'SNS',
    options: [
      { value: 'Instagram', label: 'Instagram' },
      { value: 'TikTok',    label: 'TikTok' },
    ],
  },
  {
    key: 'tier',
    label: 'Tier',
    options: [
      { value: 'tier1', label: 'Tier 1' },
      { value: 'tier2', label: 'Tier 2' },
    ],
  },
  {
    key: 'category',
    label: 'Category',
    options: [
      { value: 'general',  label: 'General' },
      { value: 'kbeauty',  label: 'K-Beauty' },
      { value: 'specific', label: 'Specific' },
    ],
  },
];

/**
 * InfluencerFilterBar component
 *
 * Store dropdown + grouped SNS / Tier / Category chip filters.
 * Groups are labeled to clarify filter dimensions at a glance.
 * Reset button appears only when at least one filter is active.
 *
 * Props:
 * @param {string[]} stores - Available store options [Optional, default: []]
 * @param {object} filters - Current filter state [Optional]
 *   @param {string} filters.store - Selected store ('all' = no filter)
 *   @param {string|null} filters.platform - 'Instagram' | 'TikTok' | null
 *   @param {string|null} filters.tier - 'tier1' | 'tier2' | null
 *   @param {string|null} filters.category - 'general' | 'kbeauty' | 'specific' | null
 * @param {function} onFiltersChange - Filter change handler (filters) => void [Required]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <InfluencerFilterBar stores={['G10', 'G11']} filters={filters} onFiltersChange={setFilters} />
 */
function InfluencerFilterBar({
  stores = [],
  filters = { store: 'all', platform: null, tier: null, category: null },
  onFiltersChange,
  sx,
}) {
  const hasFilter =
    filters.store !== 'all' ||
    filters.platform !== null ||
    filters.tier !== null ||
    filters.category !== null;

  const handleChange = (key, value) => {
    onFiltersChange?.({ ...filters, [key]: value });
  };

  const handleToggleChip = (key, value) => {
    handleChange(key, filters[key] === value ? null : value);
  };

  const handleReset = () => {
    onFiltersChange?.({ store: 'all', platform: null, tier: null, category: null });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', ...sx }}>
      {/* Store dropdown */}
      {stores.length > 0 && (
        <FormControl size="small">
          <Select
            value={filters.store ?? 'all'}
            onChange={e => handleChange('store', e.target.value)}
            displayEmpty
            sx={{ fontSize: 13, height: 28, '& .MuiSelect-select': { py: 0.5 } }}
          >
            <MenuItem value="all">
              <Typography variant="caption">All Stores</Typography>
            </MenuItem>
            {stores.map(s => (
              <MenuItem key={s} value={s}>
                <Typography variant="caption">{s}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Divider between store and chip groups */}
      {stores.length > 0 && (
        <Box sx={{ width: '1px', height: 20, backgroundColor: 'divider', flexShrink: 0 }} />
      )}

      {/* Labeled chip groups */}
      {FILTER_GROUPS.map((group, gIdx) => (
        <Box key={group.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {gIdx > 0 && (
            <Box sx={{ width: '1px', height: 20, backgroundColor: 'divider', flexShrink: 0, mr: 0.5 }} />
          )}
          {group.options.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              size="small"
              onClick={() => handleToggleChip(group.key, value)}
              color={filters[group.key] === value ? 'primary' : 'default'}
              variant={filters[group.key] === value ? 'filled' : 'outlined'}
              sx={CHIP_SX}
            />
          ))}
        </Box>
      ))}

      {/* Reset */}
      {hasFilter && (
        <Button
          size="small"
          variant="text"
          onClick={handleReset}
          sx={{ fontSize: 12, px: 1, py: 0.25, minWidth: 'auto' }}
        >
          Reset
        </Button>
      )}
    </Box>
  );
}

export default InfluencerFilterBar;
