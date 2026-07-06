import { useState } from 'react';
import AlertBanner from './AlertBanner';

export default {
  title: 'BeautyMaster/Overlay/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  argTypes: {
    alerts: {
      control: 'object',
      description: 'Alert list. Empty array renders nothing.',
    },
    activeFlag: { control: 'text', description: 'Currently selected flag (null = none)' },
    onFlagSelect: { action: 'flag selected', description: '(flag | null) => void' },
    sx: { control: false },
  },
};

export const Default = {
  args: {
    alerts: [
      { flag: 'collabo-no-credit', label: 'Credit Not Sent', count: 1, severity: 'error' },
      { flag: 'agreement-no-attend', label: 'Visit Unconfirmed', count: 2, severity: 'warning' },
      { flag: 'attend-no-collabo', label: 'Upload Pending', count: 3, severity: 'passive' },
    ],
  },
};

export const Interactive = {
  name: 'Interactive (click to filter)',
  render: () => {
    const [activeFlag, setActiveFlag] = useState(null);
    return (
      <AlertBanner
        alerts={[
          { flag: 'collabo-no-credit', label: 'Credit Not Sent', count: 1, severity: 'error' },
          { flag: 'agreement-no-attend', label: 'Visit Unconfirmed', count: 2, severity: 'warning' },
          { flag: 'attend-no-collabo', label: 'Upload Pending', count: 3, severity: 'passive' },
        ]}
        activeFlag={activeFlag}
        onFlagSelect={setActiveFlag}
      />
    );
  },
};

export const Empty = {
  name: 'No alerts (renders nothing)',
  args: {
    alerts: [],
  },
};
