# BeautyMaster Influencer Dashboard

> 구글시트 기반 인플루언서 관리 데이터를 실시간으로 시각화하는 운영 대시보드

## 배경 및 목적

- **문제**: 구글시트의 인플루언서 기록 순서가 방문 순서가 아닌 동의서 제출 순서여서, 인원이 늘수록 스케줄 파악에 수작업 노력이 증가
- **문제**: Attend / Agreement / Collabo Shared / Credit 등 여러 상태가 시트 여러 열에 분산되어 있어 전체 현황을 한눈에 파악하기 어려움
- **기회**: 구글시트를 그대로 유지하면서 대시보드를 실시간 연동하면, 시트 업데이트만으로 운영 현황이 즉시 반영됨
- **기대 효과**: 인플루언서 방문 일정 · 상태 · 성과를 한 화면에서 파악 → 누락 대응 시간 단축, 운영 부담 감소

---

## 핵심 기능

| # | 기능 | 설명 | 우선순위 |
|---|------|------|---------|
| 1 | 스케줄 뷰 | 인플루언서를 방문 일시(Time) 기준으로 정렬하여 타임라인/리스트로 표시 | 필수 |
| 2 | 상태 현황 요약 카드 | Agreement · Attend · Collabo Shared · Credit Shared 완료/미완료 수를 KPI 카드로 표시 | 필수 |
| 3 | 퍼널 시각화 | Agreement 제출 → Attend → Collabo Shared → Credit Shared 단계별 전환 현황 | 필수 |
| 4 | 인플루언서 상세 카드 | 프로필 이미지 · 이름 · 플랫폼 · 티어 · 상태 뱃지 · 소셜 링크 한 번에 확인 | 필수 |
| 5 | 예외 케이스 알림 | Agreement O + Attend X / Attend O + Collabo Shared X 등 이상 상태 인플루언서 강조 표시 | 필수 |
| 6 | 구글시트 실시간 연동 | 시트 업데이트 시 대시보드 자동 갱신 (Google Sheets Published CSV 폴링 또는 Apps Script 웹훅) | 필수 |
| 7 | 크레딧 트래킹 | Credit Shared · Credit Used · Serial# 상태 표시 | 필수 |
| 8 | 성과 지표 표시 | Views · Likes · Shares · Saves · Comments · Reposts · Opinion(USE/MAYBE/DON'T) 표시 | 선택 |
| 9 | 필터 / 검색 | Store · Month · Platform · Tier · 상태별 필터링 | 선택 |
| 10 | Note 표시 | 인플루언서별 특이사항(Note 컬럼) 인라인 노출 | 선택 |

---

## 데이터 소스 — 구글시트 컬럼 정의

### 공통 메타

| 컬럼 | 설명 | 값 예시 |
|------|------|---------|
| Store | 방문 매장 | G10 등 |
| Month | 방문 월 | 6, 7 … |
| Barcode | 티어 식별자 | `G10INF2026` (Tier 1) / `G10INF202620` (Tier 2) |
| Platform | 소셜 플랫폼 | Instagram / TikTok |
| Category | 콘텐츠 유형 | general / kbeauty / specific |
| Type | 크레딧 유형 | $100 Credit (Tier 1) / $20 Credit_Tier2 (Tier 2) |

### 인플루언서 정보

| 컬럼 | 설명 |
|------|------|
| Image | 프로필 이미지 URL |
| Full Name | 이름 |
| Social Account | 소셜 계정 링크 |
| Email | 이메일 |
| Time | 방문 예정 일시 (스케줄 정렬 기준) |

### 상태 체크 (운영자 직접 체크)

| 컬럼 | 의미 |
|------|------|
| Attend | 매장 방문 완료 여부 |
| Agreement | 구글폼 동의서 제출 여부 |
| Collabo Shared | 소셜미디어 콘텐츠 업로드 여부 |
| Collabo Link | 업로드된 콘텐츠 URL |
| Upload Date | 콘텐츠 업로드 날짜 |
| Credit Shared | 크레딧 발송 완료 여부 |
| Credit Used | 크레딧 사용 여부 |
| Serial# | 발급된 크레딧 번호 |

### 성과 · 평가

| 컬럼 | 의미 |
|------|------|
| Opinion | USE / MAYBE / DON'T (한 달 후 성과 평가) |
| Views / Likes / Shares / Saves / Comments / Reposts | 콘텐츠 성과 수기 기록 |
| Note | 특이사항 메모 |

### 시트 탭

| 탭 | 의미 |
|----|------|
| Processing | 동의서 작성 완료 인플루언서 (진행 중) |
| Done | Attend · Agreement · Collabo Shared · Credit Shared 모두 완료 |
| Planning | 사용 안 함 (무시) |

---

## 대상 사용자

- **주요 사용자**: 뷰티마스터 그랜드 오프닝 담당 운영자 1인 (인플루언서 관리 담당)
- **보조 사용자**: 없음 (단일 운영자 툴)

---

## 기술적 범위

- **포함**:
  - 구글시트 Published CSV URL을 통한 데이터 연동 (읽기 전용)
  - 대시보드 UI: 스케줄 뷰, KPI 요약, 퍼널, 인플루언서 카드 리스트
  - 실시간 반영: 주기적 폴링 (30초~1분 간격) 또는 수동 새로고침
  - Processing 탭 + Done 탭 통합 표시
- **제외**:
  - 구글시트 직접 편집 기능 (데이터 입력은 계속 시트에서)
  - 인플루언서 초대/이메일 발송 기능
  - Planning 탭 데이터
  - 인증/로그인 (내부 운영 툴 가정)
- **제약사항**:
  - 구글시트는 "웹에 게시(Publish to web)" CSV 형태로 공개 접근 가능해야 함
  - 데이터 수정은 기존 구글시트에서 직접 수행 (대시보드는 읽기 전용 뷰)

---

## 성공 기준

- 인플루언서 방문 일정을 Time 기준으로 정렬하여 즉시 파악 가능
- Agreement O + Attend X, Attend O + Collabo X 등 이상 케이스를 별도 강조 없이도 육안으로 즉시 식별 가능
- 구글시트 업데이트 후 1분 이내 대시보드 반영
