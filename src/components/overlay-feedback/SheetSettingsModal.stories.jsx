import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { expect, waitFor } from 'storybook/test';
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
      messageTemplatesUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSMqj2N_FR2RsX9_KMl9ZQzaSjL1HI9GwdDu4GoIh3_t2LGsBEs3JjPidf4hyVQMPdPEYO4HanQRjt/pub?output=csv&gid=123456789',
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

export const PlainEditLink = {
  name: 'Plain edit link (탭 우클릭 → 링크 복사)',
  render: () => {
    const [open, setOpen] = useState(true);
    const config = {
      sources: [
        {
          label: 'GA',
          processingCsvUrl: 'https://docs.google.com/spreadsheets/d/1FEdoUfToSKGJ8oVyDIaj15Oo2YRLasj_kfhlsHkwFI4/edit?gid=0#gid=0',
          doneCsvUrl: '',
        },
        {
          label: 'FL',
          processingCsvUrl: 'https://docs.google.com/spreadsheets/d/1FEdoUfToSKGJ8oVyDIaj15Oo2YRLasj_kfhlsHkwFI4/edit?gid=1776175069#gid=1776175069',
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
          stores={['G10', 'BF4']}
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

/**
 * 팝업도 화면과 같은 규격을 써야 한다.
 *
 * Dialog는 포털로 <body> 아래 렌더되므로 SaasShell에 건 폰트·컨트롤 규칙이 DOM상
 * 닿지 않는다. 실제로 이 모달만 Pretendard 16px / 4px radius / floating label로
 * 리뉴얼 전 Material 스타일이 남아 있었다. 셸 안쪽을 지키는 SingleTypeface 테스트도
 * 포털 밖이라 잡지 못한다 — 그래서 여기서 따로 본다.
 *
 * (canvasElement가 아니라 document에서 찾는다. 포털이라 캔버스 밖에 있다.)
 */
export const MatchesDesignSystem = {
  render: () => <SheetSettingsModal open onClose={() => {}} onSave={() => {}} />,
  play: async () => {
    const paper = await waitFor(() => {
      const el = document.querySelector('.MuiDialog-paper');
      if (!el) throw new Error('dialog not mounted');
      return el;
    });

    const fonts = new Set();
    const sizes = new Set();
    for (const el of paper.querySelectorAll('*')) {
      if (el.children.length || !el.textContent.trim()) continue;
      const cs = getComputedStyle(el);
      fonts.add(cs.fontFamily.split(',')[0].replace(/"/g, '').trim());
      sizes.add(parseFloat(cs.fontSize));
    }

    // 서체는 하나 — 화면과 같은 Inter
    await expect([...fonts]).toEqual(['Inter Variable']);

    // 글자 크기는 화면이 쓰는 단계 안에 있어야 한다.
    // floating label이 scale(0.75)로 줄어 9.75px가 되던 것이 여기서 걸린다.
    for (const size of sizes) await expect(size).toBeGreaterThanOrEqual(11);

    // 입력 높이·radius는 Operations 툴바와 같은 36px / 6px
    for (const input of paper.querySelectorAll('.MuiInputBase-root')) {
      await expect(Math.round(input.getBoundingClientRect().height)).toBe(36);
      await expect(getComputedStyle(input).borderRadius).toBe('6px');
    }
  },
};
