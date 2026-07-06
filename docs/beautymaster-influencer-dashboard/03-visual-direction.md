# BeautyMaster Influencer Dashboard — Visual Direction

> 내부 운영 전문가 툴. 뷰티 브랜드 감성이 아니라 판독성과 밀도가 우선이다.

---

## 톤앤매너

- **키워드**: Operational · Clean · Status-first · Low friction
- **설명**: 운영자는 하루에 수십 번 이 화면을 본다. 아름다움보다 빠른 판독이 목적이다. 브랜드 감성은 헤더 타이틀 한 줄에서만 쓰고 나머지는 철저하게 기능적으로 간다.
- **참조 레퍼런스 유형**: Linear, Notion 대시보드, Vercel Dashboard — 화이트 베이스, 높은 정보 밀도, 명확한 상태 컬러

---

## 레이아웃 방향

### 2컬럼 구조

| 영역 | 너비 | 스크롤 | 역할 |
|------|------|--------|------|
| 좌측 패널 | 264px 고정 | 독립 스크롤 | Schedule View — 항상 화면에 고정 |
| 우측 메인 | 나머지 전체 | 독립 스크롤 | Alert 배너 + 인플루언서 그리드 |
| 헤더 | 100% | sticky | KPI 한 줄 + 동기화 상태 |

### 공간 원칙

- **헤더 높이**: 56px — 최소한으로 얇게, 콘텐츠 영역 최대 확보
- **좌측 패널 배경**: `grey.50` (#FAFAFA) — 우측과 미묘하게 구분, 경계선 없이 배경색만으로
- **우측 메인 배경**: `background.default` (white)
- **카드 그리드**: 3열 고정 (1280px+ 기준) → 2열 (960px~) — 운영자는 데스크탑만 쓰므로 반응형 최소화
- **카드 간격**: `gap: 2` (16px)
- **섹션 간격**: `mb: 3` (24px)

### borderRadius

기존 테마 `borderRadius: 0` 유지. 단, 상태 아이콘 · Chip · Avatar는 예외:
- Avatar: 원형 (`50%`)
- Chip / 상태 뱃지: `4px` (pill 금지 — 운영 툴에서 과도한 둥근 모서리는 장난스러워 보임)
- 카드: `0` 유지

---

## 컬러 팔레트

### 기반 컬러 (기존 테마 유지)

| 토큰 | 현재값 | 용도 |
|------|--------|------|
| `primary.main` | `#0000FF` | 유지 — 단, 사용 범위를 좁힘 (활성 탭, 링크, 새로고침 버튼) |
| `secondary.main` | `#263238` (blueGrey[900]) | 유지 — 헤더 배경, 좌측 패널 구분선 |
| `background.default` | `#FFFFFF` | 유지 |
| `grey.50` | `#FAFAFA` | 좌측 패널 배경 |

### 상태 컬러 시스템 (신규 정의)

운영 대시보드의 핵심은 상태를 컬러로 즉시 판독하는 것. 4단계 상태 × 완료/미완료 = 8가지 상태를 2가지 색으로 단순화한다.

| 상태 | 완료 | 미완료 |
|------|------|--------|
| Agreement · Attend · Collabo · Credit | `success.main` `#2E7D32` — filled 아이콘 | `grey.300` `#E0E0E0` — outlined 아이콘 |

> 4가지 상태에 각각 다른 색을 쓰면 복잡해진다. 완료(green) vs 미완료(grey) 2단계로만 구분한다.

### Alert 컬러

| Alert 유형 | 컬러 | 토큰 |
|-----------|------|------|
| 방문 미확인 | Amber | `warning.main` `#ED6C02` |
| 업로드 대기 | Amber | `warning.main` `#ED6C02` |
| 크레딧 미발송 | Red | `error.main` `#D32F2F` |

> 방문·업로드 미완료는 경고(amber), 크레딧 미발송은 오류(red)로 긴급도 구분.

### 컬러 사용 제한

- `primary.main` (#0000FF)은 **인터랙티브 요소에만** — 링크, 활성 탭 인디케이터, 버튼
- 배경, 카드, 텍스트에 파란색 금지 — 시선이 분산됨
- 상태 표시는 아이콘 색으로만, 배경색 사용 금지 (카드가 과도하게 채색되면 판독 저하)

---

## 정보 밀도

### 원칙

운영 전문가가 하루 종일 보는 화면이다. **Compact 모드** 기준으로 설계한다.

| 요소 | 값 | 근거 |
|------|-----|------|
| 카드 패딩 | `p: 2` (16px) | 여백 넓히면 한 화면에 카드 수 감소 |
| 스케줄 행 높이 | 48px | 터치 불필요, 최소 클릭 영역 |
| KPI 한 줄 헤더 높이 | 56px | 숫자 + 라벨 2줄 들어가는 최소값 |
| 카드 이미지(Avatar) | 40px | 신원 확인용, 장식 아님 |
| Drawer 너비 | 400px | 성과 지표 6개 + Note가 들어가는 최소 너비 |

### 카드 밀도 설계

```
┌─────────────────────────────────┐
│ ● Kim Jiho          14:00 오늘  │  ← Hero (16px bold + 14px medium)
│ ✓ ✓ ○ ○            Instagram T1│  ← Status 아이콘 4개 + Meta chip
│ ⚠ 업로드 대기                   │  ← Alert 뱃지 (있을 때만)
└─────────────────────────────────┘
```

- 카드 총 높이: ~88px (3행)
- 3열 그리드에서 1280px 화면 기준 카드 너비 약 360px

---

## 타이포그래피 원칙

### 폰트 패밀리 (기존 테마 유지)

| 용도 | 폰트 |
|------|------|
| 헤더 타이틀 | Outfit (영문) / Pretendard Variable (한글) |
| 본문 전체 | Pretendard Variable |
| KPI 숫자 | Pretendard Variable — `font-variant-numeric: tabular-nums` |

### 타이포그래피 스케일

| 요소 | variant | 크기 | weight | 비고 |
|------|---------|------|--------|------|
| 페이지 타이틀 | `h6` | 18px | 700 | 헤더 안에서 작게 — 콘텐츠가 주인공 |
| KPI 숫자 | `h4` | 32px | 700 | tabular-nums, 숫자 변화가 즉시 눈에 들어와야 함 |
| KPI 라벨 | `caption` | 11px | 400 | 숫자 아래 |
| 카드 이름 (Hero) | `body1` | 16px | 600 | |
| 카드 방문 시각 | `body2` | 14px | 400 | `secondary` 컬러 |
| 스케줄 이름 | `body2` | 14px | 500 | |
| 스케줄 시각 | `caption` | 12px | 400 | monospace로 정렬 |
| Alert 배너 문구 | `body2` | 14px | 500 | `warning.main` 또는 `error.main` |
| Drawer 섹션 라벨 | `overline` | 11px | 600 | letter-spacing 넓게 |
| Drawer 성과 수치 | `h5` | 24px | 700 | tabular-nums |
| Note 텍스트 | `body2` | 14px | 400 | `grey.700` |

### 타이포그래피 원칙

- **숫자는 tabular-nums 필수** — KPI, 스케줄 시각, 성과 지표 모두. 숫자 자릿수 바뀔 때 레이아웃 흔들리지 않도록.
- **헤더 타이틀은 작게** — h4, h3 금지. 화면에서 제일 큰 글자는 KPI 숫자여야 함.
- **상태 표시에 텍스트 최소화** — 아이콘으로 처리, 텍스트 레이블은 Drawer 안에서만.

---

## 상태 아이콘 시스템

4단계 상태를 아이콘으로 표현. `@mui/icons-material` 사용.

| 상태 | 아이콘 (완료) | 아이콘 (미완료) | 색상 |
|------|------------|--------------|------|
| Agreement (동의) | `TaskAlt` filled | `RadioButtonUnchecked` | 완료: `#2E7D32` / 미완료: `#E0E0E0` |
| Attend (방문) | `CheckCircle` filled | `RadioButtonUnchecked` | 완료: `#2E7D32` / 미완료: `#E0E0E0` |
| Collabo (업로드) | `CloudDone` filled | `RadioButtonUnchecked` | 완료: `#2E7D32` / 미완료: `#E0E0E0` |
| Credit (크레딧) | `Paid` filled | `RadioButtonUnchecked` | 완료: `#2E7D32` / 미완료: `#E0E0E0` |

> 4개 아이콘이 한 줄로 나열될 때 크기: 18px. 작지만 4개가 한 묶음으로 읽혀야 함.

### Opinion 뱃지

| 값 | 컬러 | 스타일 |
|----|------|--------|
| USE | `success.main` | outlined Chip |
| MAYBE | `warning.main` | outlined Chip |
| DON'T | `error.main` | outlined Chip |
| 미입력 | `grey.400` | outlined Chip — "평가 대기" |

---

## 변경 필요 토큰 요약

기존 테마에서 추가/변경이 필요한 항목만 명시. 기존 토큰은 건드리지 않는다.

| 토큰 경로 | 현재값 | 변경값 | 적용 대상 |
|-----------|--------|--------|----------|
| `palette.success.main` | MUI 기본 | `#2E7D32` | 4단계 상태 완료 아이콘 |
| `palette.warning.main` | MUI 기본 | `#ED6C02` | Alert 배너 (방문·업로드) |
| `palette.error.main` | MUI 기본 | `#D32F2F` | Alert 배너 (크레딧 미발송) |
| `palette.grey.50` | MUI 기본 | `#FAFAFA` | 좌측 패널 배경 |
| `typography.*.fontVariantNumeric` | 미설정 | `tabular-nums` | KPI, 성과 수치, 스케줄 시각 |

> `primary.main`, `secondary.main`, `shape.borderRadius`, `shadows` — 모두 유지.
