/**
 * G10_Grand Opening Influencer — 시트 내장 보고서 생성 스크립트 (Google Apps Script)
 *
 * 설치 (최초 1회):
 *   1. 구글시트에서 확장 프로그램 → Apps Script 열기
 *   2. 기본 Code.gs 내용을 지우고 이 파일 전체를 붙여넣기 → 저장
 *   3. 시트로 돌아와 새로고침 → 상단에 "Report" 메뉴가 생김
 *   4. Report → "Refresh G10 Grand Opening" 클릭 (첫 실행 때 권한 허용 1회)
 *
 * 실행하면 같은 스프레드시트 안에 "G10_Grand Opening Influencer" 탭을 만들거나
 * 갱신한다. GA·FL 탭(Purpose = grand opening 행)과 Number 탭만 읽으며,
 * 데이터는 이 스프레드시트 밖으로 나가지 않는다.
 *
 * 산정 규칙은 대시보드(src/data/beautymaster/schema.js deriveProgramReport)와
 * 동일하게 맞춰져 있다 — 두 화면의 숫자가 어긋나면 보고가 깨진다:
 *   - 행 소속: store=G10 이고 Purpose 열이 grand opening(대소문자 무시)인 행
 *   - No show: 방문 예정일이 지났는데 attend 체크가 없는 행만 (미래 방문은 Scheduled)
 *   - 크레딧 금액: 각 행 type 열의 액면가($100/$20) 합. 사용액은 사용이 확인된 행만
 *   - 기프트백: 방문당 1개, 단가 T1 $8.58 / T2 $2.65. 매장 착오 5건은 실제 나간 백으로
 *   - 성과 우수: 시트 Opinion이 USE, 또는 Opinion 빈 행 중 반응(engagements) 상위 1/4
 *
 * ⚠ 아래 CONFIG 상수(기간·목표·단가·착오 명단)는 대시보드 schema.js와 수동 동기화다.
 *   값이 바뀌면 두 곳 모두 고칠 것.
 */

/* ─── CONFIG — schema.js의 GRAND_OPENING/INFLUENCER_PROGRAMS와 동기화 ───────── */

var CONFIG = {
  store: 'G10',
  purpose: 'grand opening',
  title: 'G10_Grand Opening Influencer',
  startDate: { y: 2026, m: 7, d: 8 },   // 2026-07-08 (사장님 확정)
  endDate: { y: 2026, m: 9, d: 7 },     // 2026-09-07
  goalByTier: { tier1: 30, tier2: 70 }, // 사장님 확정
  giftValueUsd: { tier1: 8.58, tier2: 2.65 },
  /* 매장이 실수로 T2 방문자에게 T1 기프트백을 건넨 방문 — 실제 나간 백으로 센다.
     키는 소문자·trim 전체 이름 (동명이인 주의: Justice Lee/Cross, Dominique Doyle/Austin) */
  giftBagTierOverrides: {
    'zadie franklin': 'tier1',
    'jakerra': 'tier1',
    'justice cross': 'tier1',
    'jayla brewster': 'tier1',
    'dominique austin': 'tier1',
  },
  /* 시트 social account 칸이 표시명이라 링크를 못 만드는 행의 실제 계정
     (src/utils/parseInfluencerCsv.js SOCIAL_URL_OVERRIDES와 동기화) */
  socialUrlOverrides: {
    'jakkah kebbay': 'https://www.tiktok.com/@oyastormm',
    'toni ellis': 'https://www.tiktok.com/@itstimewithtoni',
    'eden mbunwe': 'https://www.tiktok.com/@its_yourgurrl_eden',
    'karima muhammadpoe': 'https://www.tiktok.com/@itskarimarima',
    'maría josé galindez': 'https://www.tiktok.com/@soymarijolife',
    'breana waynick': 'https://www.tiktok.com/@knotslater',
    'chondra styles': 'https://www.tiktok.com/@chonieb_',
    'zadie franklin': 'https://www.tiktok.com/@wellness.traveler?lang=en',
    'shamiyah harris': 'https://www.tiktok.com/@millionswithmiyah',
    'jadeen verme': 'https://www.tiktok.com/@jadeenvermee',
    'yuleidys': 'https://www.instagram.com/yuleidyspalacio',
    'rosalia serrano': 'https://www.instagram.com/rosaliaserranodina',
    'jaziah reid': 'https://www.tiktok.com/@jaziahvictor',
    'karol medina': 'https://www.instagram.com/karolmedinag',
    'wannie nshobole': 'https://www.tiktok.com/@wannienshobole',
    'kalee thompson': 'https://www.tiktok.com/@kaleeirl',
    'ty coleman': 'https://www.tiktok.com/@tyistyping',
    'anna harris': 'https://www.tiktok.com/@annaasimonee',
    'idol barbie': 'https://www.tiktok.com/@idoldabarbie',
    'francheska monge': 'https://www.tiktok.com/@franncheska',
    'jasmaine sumpter': 'https://www.tiktok.com/@jazz.k9',
    'denise aiyedatiwa': 'https://www.tiktok.com/@longlegzk',
    'amyah fountain': 'https://www.tiktok.com/@youngsweetmya',
    'jasmine wilson': 'https://www.tiktok.com/@aikosinterludee',
    'ashley clark': 'https://www.tiktok.com/@prettycashbeauty?lang=en',
    'myah turner': 'https://www.tiktok.com/@thegoddessbrand.co',
    'victoria simmone': 'https://www.tiktok.com/@victoriasimmone',
    'shannon redwine': 'https://www.tiktok.com/@shannonshanaye',
  },
  /* 탭은 이름이 아니라 gid로 찾는다 — 탭 이름이 바뀌어도 안 깨진다 */
  gids: { influencerTabs: [0, 1776175069], numberTab: 778920622 },
  reportSheetName: 'G10_Grand Opening Influencer',
  /* 보고서 탭을 이 이름의 탭 바로 오른쪽에 둔다(사장님 지정, 대소문자 무시).
     못 찾으면 맨 앞에 둔다. */
  anchorTabName: 'wrong sent',
};

/* ─── 메뉴 & 실행 ────────────────────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Report')
    .addItem('Refresh G10 Grand Opening', 'refreshGrandOpeningReport')
    .addToUi();
}

function refreshGrandOpeningReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var influencerValues = CONFIG.gids.influencerTabs
    .map(function (gid) { return sheetByGid_(ss, gid); })
    .filter(Boolean)
    .map(function (sh) { return sh.getDataRange().getValues(); });
  var numberSheet = sheetByGid_(ss, CONFIG.gids.numberTab);
  var numberValues = numberSheet ? numberSheet.getDataRange().getValues() : [];

  var model = buildReportModel(influencerValues, numberValues, new Date());
  renderReport_(ss, model);
  SpreadsheetApp.getActiveSpreadsheet().toast('Report refreshed — ' + model.performers.length + ' strong performers, spend ' + fmtUsd_(model.spend.total), 'G10 Grand Opening', 6);
}

function sheetByGid_(ss, gid) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) return sheets[i];
  }
  return null;
}

/* ─── 순수 계산부 (Apps Script API 없음 — node로 검증 가능) ─────────────────── */

/**
 * 시트 원시 그리드들 → 보고서 모델.
 * @param {Array<Array<Array>>} influencerValues - GA·FL 탭의 getValues() 결과 목록
 * @param {Array<Array>} numberValues - Number 탭 그리드
 * @param {Date} today
 */
function buildReportModel(influencerValues, numberValues, today) {
  var rows = [];
  influencerValues.forEach(function (grid) {
    rows = rows.concat(parseInfluencerGrid_(grid));
  });
  var cohort = rows.filter(function (r) {
    return r.store === CONFIG.store && r.purpose === CONFIG.purpose;
  });

  var todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var from = new Date(CONFIG.startDate.y, CONFIG.startDate.m - 1, CONFIG.startDate.d);
  var to = new Date(CONFIG.endDate.y, CONFIG.endDate.m - 1, CONFIG.endDate.d);
  var days = Math.round((to - from) / 86400000) + 1;
  var isOngoing = todayStart <= to;

  var invited = parseInvitedByTier_(numberValues);

  function tierStats(tier) {
    var list = cohort.filter(function (r) { return r.tier === tier; });
    var attended = list.filter(function (r) { return r.attend; });
    var notAttended = list.filter(function (r) { return !r.attend; });
    var noShow = notAttended.filter(function (r) {
      if (r.visitDate) return dayStart_(r.visitDate) < todayStart;
      return !isOngoing; // 날짜 없는 미방문은 프로그램이 끝난 뒤에만 노쇼
    });
    var sent = list.filter(function (r) { return r.creditShared; });
    var used = list.filter(function (r) { return r.creditUsed; });
    var sumCredit = function (l) {
      return cents_(l.reduce(function (s, r) { return s + (r.creditValueUsd || 0); }, 0));
    };
    var giftUsd = cents_(attended.reduce(function (s, r) {
      var bagTier = CONFIG.giftBagTierOverrides[r.nameKey] || r.tier;
      return s + CONFIG.giftValueUsd[bagTier];
    }, 0));
    return {
      goal: CONFIG.goalByTier[tier],
      invited: invited[tier],
      visited: attended.length,
      goalRate: CONFIG.goalByTier[tier] > 0 ? attended.length / CONFIG.goalByTier[tier] : 0,
      uploaded: list.filter(function (r) { return r.collaboShared; }).length,
      noShow: noShow.length,
      scheduled: notAttended.length - noShow.length,
      creditSentCount: sent.length,
      creditSentUsd: sumCredit(sent),
      creditUsedCount: used.length,
      creditUsedUsd: sumCredit(used),
      giftCount: attended.length,
      giftUsd: giftUsd,
    };
  }

  var tier1 = tierStats('tier1');
  var tier2 = tierStats('tier2');
  var totals = {};
  Object.keys(tier1).forEach(function (k) {
    totals[k] = cents_(tier1[k] + tier2[k]);
  });
  totals.goalRate = totals.goal > 0 ? totals.visited / totals.goal : 0;

  var spend = {
    gift: totals.giftUsd,
    creditUsed: totals.creditUsedUsd,
    total: cents_(totals.giftUsd + totals.creditUsedUsd),
  };

  return {
    title: CONFIG.title,
    period: { from: from, to: to, days: days },
    isOngoing: isOngoing,
    scheduledTotal: totals.scheduled,
    tiers: { tier1: tier1, tier2: tier2, totals: totals },
    spend: spend,
    performers: buildPerformers_(cohort),
    refreshedAt: today,
  };
}

/** 헤더 정규화 — "Agree-\nment" → "agreement", "Upload  Date" → "upload date" */
function normalizeHeader_(h) {
  return String(h).toLowerCase().replace(/-\s+/g, '').replace(/\s+/g, ' ').trim();
}

function parseInfluencerGrid_(grid) {
  // 헤더 행 탐지: store와 barcode가 함께 있는 첫 행 (탭 위에 제목 행이 있다)
  var headerIdx = -1, headers = [];
  for (var i = 0; i < Math.min(grid.length, 10); i++) {
    var normalized = grid[i].map(normalizeHeader_);
    if (normalized.indexOf('store') !== -1 && normalized.indexOf('barcode') !== -1) {
      headerIdx = i; headers = normalized; break;
    }
  }
  if (headerIdx === -1) return [];

  var col = {};
  headers.forEach(function (h, idx) { if (h && col[h] === undefined) col[h] = idx; });
  var get = function (row, key) { return col[key] === undefined ? '' : row[col[key]]; };

  var rows = [];
  for (var r = headerIdx + 1; r < grid.length; r++) {
    var row = grid[r];
    var store = String(get(row, 'store') || '').trim();
    var fullName = String(get(row, 'full name') || '').trim();
    if (!store && !fullName) continue;
    var barcode = String(get(row, 'barcode') || '').trim();
    var creditUsedCell = get(row, 'credit used');
    rows.push({
      store: store,
      purpose: String(get(row, 'purpose') || '').trim().toLowerCase(),
      fullName: fullName,
      nameKey: fullName.toLowerCase(),
      tier: barcode.length === 12 ? 'tier2' : 'tier1',
      platform: String(get(row, 'platform') || '').trim(),
      email: String(get(row, 'email') || '').trim(),
      socialAccount: String(get(row, 'social account') || '').trim(),
      collaboLink: String(get(row, 'collabo link') || get(row, 'link') || '').trim(),
      visitDate: parseVisitDate_(get(row, 'time')),
      attend: isChecked_(get(row, 'attend')),
      collaboShared: isChecked_(get(row, 'collabo shared')),
      creditShared: isChecked_(get(row, 'credit shared')),
      creditUsed: parseCreditUsedCell_(creditUsedCell),
      creditValueUsd: parseCreditUsd_(get(row, 'type')),
      isDropped: String(get(row, 'contact status') || '').trim().toLowerCase() === 'dropped',
      opinion: String(get(row, 'opinion') || '').trim().toUpperCase(),
      views: toNum_(get(row, 'views')),
      likes: toNum_(get(row, 'likes')),
      shares: toNum_(get(row, 'shares')),
      saves: toNum_(get(row, 'saves')),
      comments: toNum_(get(row, 'comments')),
      reposts: toNum_(get(row, 'reposts')),
    });
  }
  return rows;
}

/** Number 탭: Tier1/Tier2 행 다음 행의 숫자들이 카테고리별 초대 수 (G10 블록만) */
function parseInvitedByTier_(grid) {
  var invited = { tier1: 0, tier2: 0 };
  var currentStore = '';
  for (var i = 0; i < grid.length; i++) {
    var a = String(grid[i][0] || '').trim();
    if (a) currentStore = a;
    var b = String(grid[i][1] || '').trim().toLowerCase().replace(/\s+/g, '');
    if ((b === 'tier1' || b === 'tier2') && currentStore === CONFIG.store && grid[i + 1]) {
      for (var c = 2; c < grid[i + 1].length; c++) {
        var n = toNum_(grid[i + 1][c]);
        if (n !== null) invited[b] += n;
      }
    }
  }
  return invited;
}

/**
 * 성과 우수 명단 — 대시보드 판정과 동일:
 * 반응 지표가 하나라도 기록된 업로드 행을 engagements 내림차순으로 세우고,
 * Opinion=USE이거나 (Opinion 없고 dropped 아니고 상위 1/4, 표본 4 이상) 행만 담는다.
 */
function buildPerformers_(cohort) {
  var ranked = cohort
    .filter(function (r) { return r.collaboShared; })
    .map(function (r) {
      var vals = [r.likes, r.shares, r.saves, r.comments, r.reposts].filter(function (v) { return v !== null; });
      return {
        row: r,
        engagements: vals.length ? vals.reduce(function (s, v) { return s + v; }, 0) : null,
      };
    })
    .filter(function (x) { return x.engagements !== null; })
    .sort(function (a, b) { return b.engagements - a.engagements; });

  var quartileSize = ranked.length >= 4 ? Math.max(1, Math.floor(ranked.length / 4)) : 0;

  var out = [];
  ranked.forEach(function (x, idx) {
    var r = x.row;
    var isTop = r.opinion === 'USE'
      || (!r.opinion && !r.isDropped && quartileSize > 0 && idx < quartileSize);
    if (!isTop) return;
    out.push({
      name: toDisplayName_(r.fullName),
      tier: r.tier === 'tier2' ? 'Tier 2' : 'Tier 1',
      platform: normalizePlatform_(r.platform),
      profileUrl: resolveProfileUrl_(r),
      handle: '',
      email: r.email,
      postUrl: /^https?:\/\//.test(r.collaboLink) ? r.collaboLink : '',
      views: r.views,
      likes: r.likes, shares: r.shares, saves: r.saves,
      comments: r.comments, reposts: r.reposts,
      engagements: x.engagements,
      er: r.views ? x.engagements / r.views : null,
    });
  });
  out.forEach(function (p) { p.handle = handleFromUrl_(p.profileUrl); });
  return out;
}

/** 프로필 URL — 대시보드 파서의 단순화판: URL 그대로 > 이름 오버라이드 > 핸들 문법 셀 */
function resolveProfileUrl_(r) {
  var override = CONFIG.socialUrlOverrides[r.nameKey];
  if (override) return override;
  var cell = r.socialAccount;
  if (/^https?:\/\//.test(cell)) return cell;
  var handle = cell.replace(/^@/, '');
  if (/^[A-Za-z0-9._]{1,30}$/.test(handle)) {
    var base = /tiktok/i.test(r.platform) ? 'https://www.tiktok.com/@' : 'https://www.instagram.com/';
    return base + handle;
  }
  return '';
}

function handleFromUrl_(url) {
  if (!url) return '';
  var path = url.split('?')[0].split('#')[0].replace(/\/+$/, '');
  var last = path.split('/').pop() || '';
  return last.replace(/^@/, '');
}

function toDisplayName_(raw) {
  return String(raw || '').split(/(\s+)/).map(function (part) {
    return /^[a-zA-ZÀ-ɏ]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part;
  }).join('');
}

function normalizePlatform_(raw) {
  var first = String(raw || '').split(',')[0].trim().toLowerCase();
  if (first.indexOf('tiktok') !== -1) return 'TikTok';
  if (first.indexOf('instagram') !== -1) return 'Instagram';
  return String(raw || '').split(',')[0].trim();
}

function parseVisitDate_(v) {
  if (v instanceof Date && !isNaN(v)) return v;
  var m = String(v || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
}

function parseCreditUsd_(type) {
  var m = String(type || '').match(/\$\s*([\d,]+(?:\.\d+)?)/);
  return m ? Number(m[1].replace(/,/g, '')) : null;
}

/** credit used 칸 — 시트는 여기에 사용 날짜를 적는다(체크가 아니다).
    날짜든 TRUE든 값이 있으면 사용, FALSE/NO/N·빈 칸만 아니다 (대시보드 parseCreditUsed와 동일) */
function parseCreditUsedCell_(v) {
  if (v === true) return true;
  if (v === false || v === '' || v === null || v === undefined) return false;
  var s = String(v).trim();
  if (!s) return false;
  return !/^(false|no|n)$/i.test(s);
}

function isChecked_(v) {
  return v === true || String(v).trim().toUpperCase() === 'TRUE';
}

/** 지표 숫자 파싱 — 대시보드 parseNum과 동일. 시트에 "20.6k"처럼 k/m 축약 표기가
    실재한다(Ashleigh Summers 조회수, issue21). 숫자로 못 읽는 값("-" 등)은 null. */
function toNum_(v) {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v === 'number') return isNaN(v) ? null : v;
  var raw = String(v).replace(/[,\s]/g, '');
  if (!raw) return null;
  var m = raw.match(/^(\d+(?:\.\d+)?)([kKmM])?$/);
  if (!m) return null;
  var multiplier = !m[2] ? 1 : m[2].toLowerCase() === 'k' ? 1000 : 1000000;
  return Math.round(parseFloat(m[1]) * multiplier);
}

function dayStart_(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function cents_(n) { return Math.round(n * 100) / 100; }
function fmtUsd_(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

/* ─── 렌더링 (Apps Script 전용) ─────────────────────────────────────────────── */

/** 보고서 탭을 anchorTabName 탭 바로 오른쪽으로 옮긴다 — 이미 있던 탭도 매 실행마다
    제자리로 온다. 앵커 인덱스는 보고서 탭 자신을 뺀 목록에서 세야 이동 후 위치가 맞다. */
function positionReportSheet_(ss, sh) {
  var others = ss.getSheets().filter(function (x) { return x.getSheetId() !== sh.getSheetId(); });
  var anchorIdx = -1;
  for (var i = 0; i < others.length; i++) {
    if (others[i].getName().trim().toLowerCase().indexOf(CONFIG.anchorTabName) !== -1) { anchorIdx = i; break; }
  }
  ss.setActiveSheet(sh);
  ss.moveActiveSheet(anchorIdx === -1 ? 1 : anchorIdx + 2);
}

var STYLE = {
  header: '#F4F4F5',      // 표 헤더 배경 (대시보드 surface.sunken 톤)
  border: '#D4D4D8',
  gray: '#71717A',
  accent: '#1A46E5',      // 링크 톤
};

function renderReport_(ss, model) {
  var sh = ss.getSheetByName(CONFIG.reportSheetName);
  if (!sh) sh = ss.insertSheet(CONFIG.reportSheetName);
  positionReportSheet_(ss, sh);
  sh.clear();
  sh.setHiddenGridlines(true);

  var tz = ss.getSpreadsheetTimeZone();
  var fmtDate = function (d, pattern) { return Utilities.formatDate(d, tz, pattern); };

  // ── 제목 + 기간 ──
  sh.getRange('B2').setValue(model.title).setFontSize(16).setFontWeight('bold');
  var periodText = fmtDate(model.period.from, 'MMM d') + ' – ' + fmtDate(model.period.to, 'MMM d, yyyy')
    + ' · ' + model.period.days + ' days'
    + (model.isOngoing ? ' · in progress' : ' · completed')
    + '   (refreshed ' + fmtDate(model.refreshedAt, 'MMM d, yyyy HH:mm') + ')';
  sh.getRange('B3').setValue(periodText).setFontColor(STYLE.gray).setFontSize(10);

  // ── KPI 4칸 (라벨 위, 큰 숫자 아래) ──
  var t = model.tiers.totals;
  var kpiLabels = ['Visited (of goal)', 'Uploaded', 'No show', 'Total spent', 'Strong performers'];
  var kpiValues = [
    t.visited + ' / ' + t.goal,
    t.uploaded + ' / ' + t.visited,
    t.noShow,
    model.spend.total,
    model.performers.length,
  ];
  /* 디자인은 사장님이 잡은 모양(issue20, 2026-09-01)을 그대로 스크립트가 재현한다 —
     Refresh가 손 수정을 지우므로, 유지할 디자인은 코드에 있어야 한다:
     KPI는 테두리 표(라벨 = 헤더 배경 + 굵게), 모든 표 가운데 정렬 + 넉넉한 행 높이. */
  sh.getRange(5, 2, 1, 5).setValues([kpiLabels]).setFontSize(10).setFontWeight('bold')
    .setBackground(STYLE.header).setHorizontalAlignment('center');
  sh.getRange(6, 2, 1, 5).setValues([kpiValues]).setFontSize(12).setHorizontalAlignment('center');
  sh.getRange(5, 2, 2, 5).setBorder(true, true, true, true, true, true, STYLE.border, SpreadsheetApp.BorderStyle.SOLID);
  sh.setRowHeight(5, 30);
  sh.setRowHeight(6, 34);
  /* KPI 셀 서식을 명시한다 — 문자열 "$1,639.68"을 쓰면 구글이 통화로 파싱하면서
     이웃 셀까지 서식이 물들어 No show가 "$28.00"으로 나왔다(issue19). 값은 숫자로
     쓰고 서식은 칸마다 직접 지정한다. */
  sh.getRange(6, 2, 1, 2).setNumberFormat('@');         // "70 / 100" — 텍스트
  sh.getRange(6, 4).setNumberFormat('0');               // No show
  sh.getRange(6, 5).setNumberFormat('$#,##0.00');       // Total spent
  sh.getRange(6, 6).setNumberFormat('0');               // Strong performers

  // ── 티어 표 ──
  var tierHeaderRow = 8;
  var tierHeaders = ['Tier', 'Goal', 'Invited', 'Visited', 'Vs goal', 'Uploaded', 'No show', 'Scheduled',
    'Credit sent', 'Credit sent $', 'Credit used', 'Credit used $', 'Gift bags', 'Gift cost $'];
  var tierRow = function (label, s) {
    return [label, s.goal, s.invited, s.visited, s.goalRate, s.uploaded, s.noShow, s.scheduled,
      s.creditSentCount, s.creditSentUsd, s.creditUsedCount, s.creditUsedUsd, s.giftCount, s.giftUsd];
  };
  var tierData = [
    tierHeaders,
    tierRow('Tier 1', model.tiers.tier1),
    tierRow('Tier 2', model.tiers.tier2),
    tierRow('Total', model.tiers.totals),
  ];
  var tierRange = sh.getRange(tierHeaderRow, 2, tierData.length, tierHeaders.length);
  tierRange.setValues(tierData);
  sh.getRange(tierHeaderRow, 2, 1, tierHeaders.length)
    .setBackground(STYLE.header).setFontWeight('bold').setFontSize(10);
  sh.getRange(tierHeaderRow + 3, 2, 1, tierHeaders.length).setFontWeight('bold');
  tierRange.setBorder(true, true, true, true, true, true, STYLE.border, SpreadsheetApp.BorderStyle.SOLID);
  tierRange.setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.setRowHeights(tierHeaderRow, tierData.length, 32);
  sh.getRange(tierHeaderRow + 1, 6, 3, 1).setNumberFormat('0%');              // Vs goal
  sh.getRange(tierHeaderRow + 1, 11, 3, 1).setNumberFormat('$#,##0.00');      // Credit sent $
  sh.getRange(tierHeaderRow + 1, 13, 3, 1).setNumberFormat('$#,##0.00');      // Credit used $
  sh.getRange(tierHeaderRow + 1, 15, 3, 1).setNumberFormat('$#,##0.00');      // Gift cost $

  // ── 성과 우수 명단 ──
  var perfTitleRow = tierHeaderRow + 6;
  sh.getRange(perfTitleRow, 2).setFontWeight('bold').setFontSize(12).setValue(
    model.performers.length + ' Strong performers — Tier 1 '
    + model.performers.filter(function (p) { return p.tier === 'Tier 1'; }).length
    + ' · Tier 2 '
    + model.performers.filter(function (p) { return p.tier === 'Tier 2'; }).length);

  var perfHeaderRow = perfTitleRow + 1;
  /* 지표 6종 전부 — "ER만 넣지 말고 좋아요·공유·저장·코멘트·리포스트 다"(2026-09-01
     사장님). 대시보드 명단·Performance 순위표와 같은 컬럼 순서. 빈 지표는 빈 칸(0 아님). */
  var perfHeaders = ['#', 'Influencer', 'Tier', 'Platform', 'Profile', 'Email', 'Content',
    'Views', 'Likes', 'Shares', 'Saves', 'Comments', 'Reposts', 'Engagements', 'Engagement rate'];
  sh.getRange(perfHeaderRow, 2, 1, perfHeaders.length).setValues([perfHeaders])
    .setBackground(STYLE.header).setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');

  model.performers.forEach(function (p, i) {
    var row = perfHeaderRow + 1 + i;
    sh.getRange(row, 2, 1, perfHeaders.length).setValues([[
      i + 1, p.name, p.tier, p.platform, '', p.email, '',
      p.views, p.likes, p.shares, p.saves, p.comments, p.reposts, p.engagements, p.er,
    ]]);
    if (p.profileUrl) {
      sh.getRange(row, 6).setFormula('=HYPERLINK("' + p.profileUrl + '","' + (p.handle ? '@' + p.handle : 'Profile') + '")');
    } else {
      sh.getRange(row, 6).setValue('—').setFontColor(STYLE.gray);
    }
    if (p.postUrl) {
      sh.getRange(row, 8).setFormula('=HYPERLINK("' + p.postUrl + '","View post")');
    } else {
      sh.getRange(row, 8).setValue('—').setFontColor(STYLE.gray);
    }
  });
  var perfRows = model.performers.length;
  if (perfRows > 0) {
    var perfRange = sh.getRange(perfHeaderRow, 2, perfRows + 1, perfHeaders.length);
    perfRange.setBorder(true, true, true, true, true, true, STYLE.border, SpreadsheetApp.BorderStyle.SOLID);
    perfRange.setHorizontalAlignment('center').setVerticalAlignment('middle');
    sh.setRowHeights(perfHeaderRow, perfRows + 1, 32);
    sh.getRange(perfHeaderRow + 1, 9, perfRows, 7).setNumberFormat('#,##0');   // Views~Engagements
    sh.getRange(perfHeaderRow + 1, 16, perfRows, 1).setNumberFormat('0.0%');   // ER
    sh.getRange(perfHeaderRow + 1, 15, perfRows, 1).setFontWeight('bold');     // Engagements 강조
  }

  // ── 산정 규칙은 화면 문단이 아니라 셀 메모로 — 회장님 보고서에 설명 텍스트를
  //    쌓지 않는다(issue22, 대시보드 issue13과 같은 지적·같은 해법). 헤더 셀에
  //    마우스를 올리면 보인다.
  sh.getRange(2, 2).setNote(
    'Rows join this report via Store = G10 and Purpose = "grand opening" in the sheet. Refresh from the Report menu rebuilds this tab from the GA tab.');
  var headerNote = function (col, text) { sh.getRange(tierHeaderRow, col).setNote(text); };
  headerNote(3, 'Fixed program target (T1 30 / T2 70) — a program value, not a sheet column.');
  headerNote(4, 'From the Number tab (DMs sent).');
  headerNote(8, 'Visit date passed with no attend check. Future visits stay in Scheduled.');
  headerNote(11, "Sum of each row's credit type face value ($100 / $20).");
  headerNote(12, 'Counts sheet-confirmed use only — a blank cell is not counted as unused.');
  headerNote(15, 'One bag per visit, T1 $8.58 / T2 $2.65 (fixed program values). '
    + '5 Tier 2 visits received the Tier 1 bag by store mistake — counted as the bag actually given.');

  // ── 컬럼 폭 ──
  sh.setColumnWidth(1, 20);
  sh.setColumnWidth(2, 95);   // KPI 첫 칸("70 / 100")과 # 컬럼 겸용 — 40으로 두면 KPI가 잘린다
  sh.setColumnWidth(3, 150);  // Influencer / Goal
  for (var c = 4; c <= 16; c++) sh.setColumnWidth(c, 105);
  sh.setColumnWidth(6, 165);  // Profile
  sh.setColumnWidth(7, 215);  // Email — 좁으면 주소가 잘린다
  sh.setColumnWidth(11, 125); // Credit sent $ / Shares
  sh.setColumnWidth(13, 125); // Credit used $ / Comments
  sh.setColumnWidth(15, 125); // Gift cost $ / Engagements
  sh.setColumnWidth(16, 125); // Engagement rate
}
