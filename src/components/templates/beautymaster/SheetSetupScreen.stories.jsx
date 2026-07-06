import Box from '@mui/material/Box';
import SheetSetupScreen from './SheetSetupScreen';

export default {
  title: 'BeautyMaster/Setup/SheetSetupScreen',
  component: SheetSetupScreen,
  tags: ['autodocs'],
  argTypes: {
    onSetup: { action: 'setup clicked' },
  },
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <SheetSetupScreen onSetup={() => {}} />
    </Box>
  ),
};
