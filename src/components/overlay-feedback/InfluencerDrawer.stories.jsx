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
    sheetUrl: { control: 'text', description: 'Google Sheet 원본 링크 — 성과 기록이 밀렸을 때 "Record in sheet" 링크로 노출' },
  },
};

/** 오늘 기준 n일 전 — 성과 D-day 상태는 시간 파생이라 고정 날짜로는 스토리가 썩는다 */
const daysAgo = n => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(13, 0, 0, 0);
  return d;
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
 * 성과 기록이 밀린 상태(D+14 경과, 지표 없음) — 패널이 다음 행동까지 안내한다.
 *
 * 목록 행의 "Record Performance"를 보고 열었을 때 패널이 같은 말을 해야 하고
 * (판정은 둘 다 derivePerformanceStatus), "적으세요"로 끝나지 않고 시트로 가는
 * 링크를 바로 준다 — 기록은 시트에만 한다(진실은 시트 하나).
 */
export const PerformanceCheckDue = {
  render: () => (
    <InfluencerDrawer
      influencer={ {
        ...fullInfluencer,
        uploadDate: daysAgo(16),
        recordDate: null,
        views: null, likes: null, shares: null, saves: null, comments: null, reposts: null,
      } }
      open
      onClose={ () => {} }
      templates={ DEFAULT_MESSAGE_TEMPLATES }
      sheetUrl="https://docs.google.com/spreadsheets/d/example/edit"
    />
  ),
  play: async () => {
    const paper = await waitFor(() => {
      const el = document.querySelector('.MuiDrawer-paper');
      if (!el) throw new Error('drawer not mounted');
      return el;
    });

    // 미측정은 0%가 아니다 — ER은 비워 둔다
    await expect(paper.textContent).toContain('Engagement rate');
    await expect(paper.textContent).toContain('Performance check due · 2d past');

    const link = [...paper.querySelectorAll('a')].find(a => a.textContent.includes('Record in sheet'));
    await expect(link).toBeTruthy();
    await expect(link.getAttribute('href')).toContain('docs.google.com');
  },
};

/**
 * 기록이 끝난 상태 — 숫자 6개의 해석(ER)과 기록 시점을 화면이 대신 말한다.
 *
 * 실제 기록일을 그대로 보여준다(D+16이면 D+16) — 늦은 기록도 받되,
 * D+14 값이 아니라는 사실이 보여야 다른 사람과 비교할 때 걸러 읽을 수 있다.
 */
export const PerformanceRecordedShowsEngagement = {
  render: () => (
    <InfluencerDrawer
      influencer={ {
        ...fullInfluencer,
        uploadDate: daysAgo(20),
        recordDate: daysAgo(6),
      } }
      open
      onClose={ () => {} }
      templates={ DEFAULT_MESSAGE_TEMPLATES }
    />
  ),
  play: async () => {
    const paper = await waitFor(() => {
      const el = document.querySelector('.MuiDrawer-paper');
      if (!el) throw new Error('drawer not mounted');
      return el;
    });

    // (3201+142+891+234+45) / 12450 = 36.2%
    await expect(paper.textContent).toContain('36.2%');
    await expect(paper.textContent).toContain('Recorded');
    await expect(paper.textContent).toContain('D+14');
    // 기록이 끝났으니 시트 재촉은 없다
    await expect([...paper.querySelectorAll('a')].some(a => a.textContent.includes('Record in sheet'))).toBe(false);
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

/**
 * 드로어 폭은 내용이 아니라 계약이 정한다.
 *
 * 폭 지정이 없으면 긴 이메일이나 프로필 URL 하나가 패널을 늘려서 사람마다
 * 드로어 폭이 달라진다. 끊을 곳 없는 긴 토큰은 링크 쪽에서 줄바꿈시킨다.
 */
export const WidthIsFixedRegardlessOfContent = {
  render: () => (
    <InfluencerDrawer
      influencer={ {
        ...fullInfluencer,
        fullName: 'Very Long Name Person',
        email: 'a.very.long.email.address.that.never.breaks@an-extremely-long-domain-name.example.com',
        socialAccountUrl: 'https://www.instagram.com/an_extremely_long_handle_that_will_not_wrap_on_its_own/',
      } }
      open
      onClose={ () => {} }
      templates={ DEFAULT_MESSAGE_TEMPLATES }
    />
  ),
  play: async () => {
    const paper = await waitFor(() => {
      const el = document.querySelector('.MuiDrawer-paper');
      if (!el) throw new Error('drawer not mounted');
      return el;
    });

    await expect(Math.round(paper.getBoundingClientRect().width)).toBe(420);

    // 긴 토큰이 패널을 밀지 않는지 — 링크가 자기 폭 안에서 끊겨야 한다
    for (const link of paper.querySelectorAll('a')) {
      await expect(link.getBoundingClientRect().right).toBeLessThanOrEqual(paper.getBoundingClientRect().right + 1);
    }
  },
};

/**
 * 패널 표기가 목록 행과 같은 규칙을 쓰는지.
 *
 * 세 화면(목록·레일·패널)이 같은 사람을 다르게 불렀다 — 목록은 "Aurora Garcia"인데
 * 패널은 시트 원본 그대로 "Aurora garcia", 아바타는 목록이 두 글자 + 색인데
 * 패널은 한 글자 + 회색, 플랫폼은 목록이 "TikTok"인데 패널은 "Tiktok"이었다.
 * 행을 눌러 패널을 열면 방금 본 것과 다른 것이 나오는 셈이라 같은 출처로 묶었다.
 */
export const DisplayMatchesTheListRow = {
  render: () => (
    <InfluencerDrawer
      influencer={ {
        ...fullInfluencer,
        fullName: 'aurora garcia',
        platform: 'Tiktok',
      } }
      open
      onClose={ () => {} }
      templates={ DEFAULT_MESSAGE_TEMPLATES }
    />
  ),
  play: async () => {
    const paper = await waitFor(() => {
      const el = document.querySelector('.MuiDrawer-paper');
      if (!el) throw new Error('drawer not mounted');
      return el;
    });

    // 이름 — 각 단어 첫 글자만 올린다
    await expect(paper.querySelector('.MuiTypography-subtitle1').textContent).toBe('Aurora Garcia');

    // 아바타 — 두 글자에 이름에서 뽑은 색. 회색 기본값이 아니어야 한다
    const avatar = paper.querySelector('.MuiAvatar-root');
    await expect(avatar.textContent).toBe('AG');
    const st = getComputedStyle(avatar);
    await expect(st.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    // 목록과 같은 대비 기준(AA 4.5:1)을 여기서도 지킨다
    const lum = rgb => {
      const [r, g, b] = rgb.match(/\d+/g).map(Number).map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [lum(st.backgroundColor), lum(st.color)].sort((a, b) => b - a);
    await expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(4.5);

    // 플랫폼 — 시트가 "Tiktok"으로 적어도 공식 표기로 통일한다
    const chips = [...paper.querySelectorAll('.MuiChip-label')].map(c => c.textContent);
    await expect(chips).toContain('TikTok');
    await expect(chips).not.toContain('Tiktok');
  },
};
