import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfluencerFilterBar from './InfluencerFilterBar';

export default {
  title: 'BeautyMaster/List/InfluencerFilterBar',
  component: InfluencerFilterBar,
  tags: ['autodocs'],
  argTypes: {
    stores: { control: 'object', description: 'Available store options' },
    filters: { control: 'object', description: 'Current filter state { store, platform, tier, category }' },
    onFiltersChange: { action: 'filters changed', description: 'Filter change handler' },
    sx: { control: false },
  },
};

export const Default = {
  render: () => {
    const [filters, setFilters] = useState({ store: 'all', platform: null, tier: null, category: null });
    return (
      <Box sx={{ p: 2 }}>
        <InfluencerFilterBar
          stores={['G10', 'G11', 'G12']}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Active filters: {JSON.stringify(filters)}
        </Typography>
      </Box>
    );
  },
};

export const WithActiveFilters = {
  name: 'With active filters',
  render: () => {
    const [filters, setFilters] = useState({ store: 'G10', platform: 'Instagram', tier: null, category: 'kbeauty' });
    return (
      <Box sx={{ p: 2 }}>
        <InfluencerFilterBar
          stores={['G10', 'G11']}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Active filters: {JSON.stringify(filters)}
        </Typography>
      </Box>
    );
  },
};

export const NoStores = {
  name: 'No stores (store dropdown hidden)',
  render: () => {
    const [filters, setFilters] = useState({ store: 'all', platform: null, tier: null, category: null });
    return (
      <Box sx={{ p: 2 }}>
        <InfluencerFilterBar
          stores={[]}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Box>
    );
  },
};
