import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SheetSettingsModal from './SheetSettingsModal';

export default {
  title: 'BeautyMaster/Setup/SheetSettingsModal',
  component: SheetSettingsModal,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    config: { control: 'object' },
    onClose: { action: 'modal closed' },
    onSave: { action: 'config saved' },
  },
  parameters: { layout: 'centered' },
};

export const Empty = {
  name: 'Empty (first time)',
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Open Settings</Button>
        <SheetSettingsModal open={open} onClose={() => setOpen(false)} onSave={() => setOpen(false)} />
      </>
    );
  },
};

export const SingleSource = {
  name: 'Single source (GA)',
  render: () => {
    const [open, setOpen] = useState(true);
    const config = {
      sources: [{
        label: 'GA',
        processingCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSMqj2N_FR2RsX9_KMl9ZQzaSjL1HI9GwdDu4GoIh3_t2LGsBEs3JjPidf4hyVQMPdPEYO4HanQRjt/pub?output=csv',
        doneCsvUrl: '',
      }],
      pollingIntervalMs: 60000,
      defaultStore: 'all',
    };
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Open Settings</Button>
        <SheetSettingsModal
          open={open}
          onClose={() => setOpen(false)}
          config={config}
          onSave={() => setOpen(false)}
        />
      </>
    );
  },
};

export const MultiSource = {
  name: 'Multi source (GA + FL)',
  render: () => {
    const [open, setOpen] = useState(true);
    const config = {
      sources: [
        {
          label: 'GA',
          processingCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSMqj2N_FR2RsX9_KMl9ZQzaSjL1HI9GwdDu4GoIh3_t2LGsBEs3JjPidf4hyVQMPdPEYO4HanQRjt/pub?output=csv',
          doneCsvUrl: '',
        },
        {
          label: 'FL',
          processingCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-example-fl/pub?output=csv',
          doneCsvUrl: '',
        },
      ],
      pollingIntervalMs: 60000,
      defaultStore: 'all',
    };
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Open Settings</Button>
        <SheetSettingsModal
          open={open}
          onClose={() => setOpen(false)}
          config={config}
          onSave={() => setOpen(false)}
          stores={['G10', 'G11', 'F01', 'F02']}
        />
      </>
    );
  },
};

export const Trigger = {
  name: 'With trigger button',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 4 }}>
        <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
          ⚙ Google Sheets Settings
        </Button>
        <SheetSettingsModal
          open={open}
          onClose={() => setOpen(false)}
          onSave={(cfg) => { console.log('saved', cfg); setOpen(false); }}
        />
      </Box>
    );
  },
};
