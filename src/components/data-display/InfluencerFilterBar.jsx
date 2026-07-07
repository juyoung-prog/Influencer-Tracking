import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

const FILTER_DROPDOWNS = [
  {
    key: 'platform',
    placeholder: 'Platform',
    options: [
      { value: 'Instagram', label: 'Instagram' },
      { value: 'TikTok',    label: 'TikTok' },
    ],
  },
  {
    key: 'tier',
    placeholder: 'Tier',
    options: [
      { value: 'tier1', label: 'Tier 1' },
      { value: 'tier2', label: 'Tier 2' },
    ],
  },
  {
    key: 'category',
    placeholder: 'Category',
    options: [
      { value: 'general',  label: 'General' },
      { value: 'kbeauty',  label: 'K-Beauty' },
      { value: 'specific', label: 'Specific' },
    ],
  },
];

const SELECT_SX = {
  fontSize: 12,
  height: 28,
  minWidth: 100,
  '& .MuiSelect-select': { py: 0.5, fontSize: 12 },
};

/**
 * InfluencerFilterBar component
 *
 * Store dropdown + Platform / Tier / Category dropdowns.
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
    onFiltersChange?.({ ...filters, [key]: value || null });
  };

  const handleReset = () => {
    onFiltersChange?.({ store: 'all', platform: null, tier: null, category: null });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', ...sx }}>
      {/* Store dropdown */}
      {stores.length > 0 && (
        <>
          <FormControl size="small">
            <Select
              value={filters.store ?? 'all'}
              onChange={e => handleChange('store', e.target.value === 'all' ? 'all' : e.target.value)}
              displayEmpty
              sx={SELECT_SX}
            >
              <MenuItem value="all"><Typography variant="caption">All Stores</Typography></MenuItem>
              {stores.map(s => (
                <MenuItem key={s} value={s}><Typography variant="caption">{s}</Typography></MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ width: '1px', height: 20, backgroundColor: 'divider', flexShrink: 0 }} />
        </>
      )}

      {/* Platform / Tier / Category dropdowns */}
      {FILTER_DROPDOWNS.map(({ key, placeholder, options }) => {
        const active = filters[key] != null;
        return (
          <FormControl key={key} size="small">
            <Select
              value={filters[key] ?? ''}
              onChange={e => handleChange(key, e.target.value)}
              displayEmpty
              sx={{
                ...SELECT_SX,
                ...(active && {
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                  color: 'primary.main',
                }),
              }}
              renderValue={val => (
                <Typography variant="caption" sx={{ color: val ? 'primary.main' : 'text.secondary' }}>
                  {val ? options.find(o => o.value === val)?.label : placeholder}
                </Typography>
              )}
            >
              <MenuItem value="">
                <Typography variant="caption" color="text.secondary">All {placeholder}s</Typography>
              </MenuItem>
              {options.map(o => (
                <MenuItem key={o.value} value={o.value}>
                  <Typography variant="caption">{o.label}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}

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
