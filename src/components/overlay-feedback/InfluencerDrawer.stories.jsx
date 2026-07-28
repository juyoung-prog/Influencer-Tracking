import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { expect, waitFor } from 'storybook/test';
import InfluencerDrawer from './InfluencerDrawer';
import { DEFAULT_MESSAGE_TEMPLATES } from '../../data/beautymaster/messageTemplates.js';

const fullInfluencer = {
  id: 'Processing_0',
  sheetStatus: 'Processing',
  fullName: 'Kim Minjung',
  imageUrl: '',
  platform: 'Instagram',
  tier: 'tier1',
  store: 'G10',
  month: 7,
  barcode: 'G10INF2026',
  category: 'kbeauty',
  creditType: '$100 Credit',
  socialAccountUrl: 'https://instagram.com/example',
  email: 'kim@example.com',
  scheduledTime: new Date('2026-07-01T10:30:00'),
  agreement: true,
  attend: true,
  collaboShared: true,
  creditShared: true,
  creditUsed: false,
  serialNumber: 'G10CRED001234',
  collaboLink: 'https://instagram.com/p/example',
  uploadDate: new Date('2026-07-03'),
  opinion: 'USE',
  views: 12450,
  likes: 3201,
  shares: 142,
  saves: 891,
  comments: 234,
  reposts: 45,
  note: 'Visit complete. Content quality looks great.\nPlease confirm upload link.',
  alertFlags: [],
  scheduleGroup: 'today',
};

const minimalInfluencer = {
  ...fullInfluencer,
  id: 'Processing_1',
  fullName: 'Park Soyeon',
  collaboShared: false,
  creditShared: false,
  creditUsed: false,
  serialNumber: '',
  collaboLink: '',
  uploadDate: null,
  opinion: null,
  views: null,
  likes: null,
  shares: null,
  saves: null,
  comments: null,
  reposts: null,
  note: '',
  socialAccountUrl: '',
  alertFlags: ['attend-no-collabo'],
};

export default {
  title: 'BeautyMaster/Overlay/InfluencerDrawer',
  component: InfluencerDrawer,
  tags: ['autodocs'],
  argTypes: {
    influencer: { control: 'object', description: 'Influencer data (null empties the Drawer)' },
    open: { control: 'boolean', description: 'Whether the Drawer is open' },
    onClose: { action: 'drawer closed', description: 'Close handler' },
    templates: { control: 'object', description: 'Outreach message templates for MessageTemplateMenu' },
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Open Drawer (with performance data)
        </Button>
        <InfluencerDrawer influencer={fullInfluencer} open={open} onClose={() => setOpen(false)} templates={DEFAULT_MESSAGE_TEMPLATES} />
      </Box>
    );
  },
};

export const Minimal = {
  name: 'No performance data',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Open Drawer (no metrics)
        </Button>
        <InfluencerDrawer influencer={minimalInfluencer} open={open} onClose={() => setOpen(false)} templates={DEFAULT_MESSAGE_TEMPLATES} />
      </Box>
    );
  },
};

/**
 * 드로어도 화면과 같은 규격을 쓴다.
 *
 * Drawer는 포털로 <body> 아래 렌더돼 SaasShell의 폰트 규칙이 DOM상 닿지 않는다.
 * 실제로 Pretendard와 Outfit 두 서체가 섞여 나오고, 제목이 20px, 아바타 대비가
 * 1.88:1이었다. 셸 안쪽을 지키는 SingleTypeface 테스트는 포털 밖이라 못 잡는다.
 *
 * (canvasElement가 아니라 document에서 찾는다.)
 */
export const MatchesDesignSystem = {
  // Default는 버튼을 눌러야 열린다 — 검사 대상이 처음부터 떠 있어야 하므로 열어둔 채 렌더한다
  render: () => (
    <InfluencerDrawer influencer={fullInfluencer} open onClose={() => {}} templates={DEFAULT_MESSAGE_TEMPLATES} />
  ),
  play: async () => {
    const paper = await waitFor(() => {
      const el = document.querySelector('.MuiDrawer-paper');
      if (!el) throw new Error('drawer not mounted');
      return el;
    });

    const lum = c => {
      const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const nums = str => (str.match(/[-\d.]+/g) || []).map(Number);
    const bgOf = el => {
      const stack = []; let n = el;
      while (n) {
        const v = nums(getComputedStyle(n).backgroundColor);
        if (v.length) { const a = v.length > 3 ? v[3] : 1; if (a > 0) stack.push([v.slice(0, 3), a]); if (a >= 1) break; }
        n = n.parentElement;
      }
      let out = [255, 255, 255];
      for (const [c, a] of stack.reverse()) out = out.map((o, i) => o * (1 - a) + c[i] * a);
      return out;
    };

    const fonts = new Set();
    for (const el of paper.querySelectorAll('*')) {
      if (el.children.length || !el.textContent.trim()) continue;
      const cs = getComputedStyle(el);
      fonts.add(cs.fontFamily.split(',')[0].replace(/"/g, '').trim());

      // 대비는 알파를 합성해서 잰다 — rgba를 그대로 쓰면 실제보다 높게 나온다
      const v = nums(cs.color);
      if (!v.length) continue;
      const a = v.length > 3 ? v[3] : 1;
      const bg = bgOf(el);
      const fg = bg.map((o, i) => o * (1 - a) + v[i] * a);
      const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      const ratio = (hi + 0.05) / (lo + 0.05);
      const size = parseFloat(cs.fontSize);
      const isLarge = size >= 18.66 || (size >= 14 && Number(cs.fontWeight) >= 700);
      await expect(ratio).toBeGreaterThanOrEqual(isLarge ? 3 : 4.5);
    }

    await expect([...fonts]).toEqual(['Inter Variable']);
  },
};
