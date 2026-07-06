import { useEffect } from 'react';
import BeautymasterDashboard, { MOCK_INFLUENCERS } from '../../pages/beautymaster/BeautymasterDashboard';

const STORAGE_KEY = 'beautymaster:sheetConfig';

const MOCK_CONFIG = {
  processingCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-MOCK/pub?output=csv',
  doneCsvUrl: '',
  pollingIntervalMs: 60000,
};

export default {
  title: 'BeautyMaster/Page/Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
};

/** First-time experience — no config in localStorage */
export const SetupScreen = {
  name: 'Setup screen (no config)',
  decorators: [
    Story => {
      useEffect(() => {
        localStorage.removeItem(STORAGE_KEY);
        return () => localStorage.removeItem(STORAGE_KEY);
      }, []);
      return <Story />;
    },
  ],
  render: () => <BeautymasterDashboard />,
};

/** Dashboard connected — data comes from useSheetData / useCsvPolling */
export const Connected = {
  name: 'Connected (real polling)',
  decorators: [
    Story => {
      useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CONFIG));
        return () => localStorage.removeItem(STORAGE_KEY);
      }, []);
      return <Story />;
    },
  ],
  render: () => <BeautymasterDashboard />,
};
