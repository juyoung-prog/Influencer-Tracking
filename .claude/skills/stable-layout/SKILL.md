---
name: stable-layout
description: 안정된 레이아웃을 설계하는 스킬. 페이지·섹션·대시보드·폼·컴포넌트의 레이아웃 골격을 잡을 때, 레이아웃 택소노미(src/data/layoutTaxonomyData.js)를 지식 베이스로 삼아 공간 모델(유동/고정/혼합) 결정 → 아키타입 선택 → 영역 정책 → 공간 포화 → reflow → 컴포넌트 매핑 → 안정성 체크 순서로 진행하고, 넘침(overflow)·레이아웃 시프트(CLS)·유휴 구멍·불균형 같은 불안정을 차단한다. 사용자가 "레이아웃 잡아줘", "이 화면 레이아웃 설계", "안정적인 레이아웃", "레이아웃이 깨진다/넘친다", "반응형 레이아웃 구성", "/layout" 이라고 하거나 새 화면·섹션의 골격을 짤 때 반드시 사용한다.
---

# Stable Layout

페이지·섹션·컴포넌트의 레이아웃 골격을 **안정되게**(넘침·시프트·구멍·불균형 없이) 잡는다. 패턴을 즉흥으로 고르지 않는다. **레이아웃 택소노미를 지식 베이스로** 의도에 맞는 패턴을 고르고, 안정성 원리로 검증한다.

## 지식 베이스

- 데이터(SSOT): `src/data/layoutTaxonomyData.js` (6 Parts · 23 Cat · 139 패턴).
- 에이전트가 읽기 좋은 형태: 페이지의 `.md` 다운로드(taxonomyMarkdown) 또는 데이터 직접 파싱.
- 각 패턴(item)의 핵심 필드:
  - `id` 고유 식별자 / `name`·`koName`·`aliases`(의도 매칭)
  - `sizing` 공간 모델 (fluid·fixed·hybrid) / `reflow` 좁은 화면 거동 (Stack·Reorder·Reflow-Heavy)
  - `bestFor` 적합 의도 / `avoidFor` 부적합 맥락(오선택 방지)
  - `build` 구체 CSS 토큰 / `relatedComponents` 함께 쓰는 컴포넌트(designTaxonomy)
  - `goodWith`·`avoidWith` 조합 가이드 / `previewSpec` 구조 스케치
- **안정성 원리**는 Part 1 카테고리 `Space Model & Stability`(id 들: fluid-layout, fixed-layout, hybrid-layout, space-saturation, region-sizing-policy, balanced-fill, overflow-containment, intrinsic-sizing, cls-prevention, stacking-discipline)에 모여 있다. 이게 "안정"의 기준이다.

## 결정 절차 (이 순서로)

구조(벤토·홀리그레일)를 먼저 고르지 않는다. 공간 모델을 먼저 정한다.

1. **공간 모델 결정 (fluid / fixed / hybrid).** 콘텐츠가 가변·꽉 채워야 하나(fluid), 가독성·정렬을 통제하나(fixed), 영역마다 다른가(hybrid). 실무 대부분은 hybrid. → `fluid-layout`/`fixed-layout`/`hybrid-layout` 참조.
2. **아키타입 선택.** 의도를 `bestFor`로 매칭하고 `avoidFor`로 거른다. 같은 `sizing`으로 필터하면 후보가 좁혀진다. (Part 3 페이지 / Part 4 섹션)
3. **영역 정책 배정 (region-sizing-policy).** 어떤 영역을 고정(nav·sidebar = px), 어떤 영역을 유동(본문 = 1fr)으로 둘지 콘텐츠 정책으로 정한다. 전부 fr 로 깔거나 전부 px 로 박지 않는다.
4. **공간 포화 (space-saturation + balanced-fill).** 영역이 프레임을 채우게 해 유휴 구멍·휑한 하단을 없앤다. 한쪽만 뻥 뚫린 불균형을 피한다. 단 의도된 네거티브 스페이스는 예외.
5. **reflow 거동 확정.** 좁은 화면에서 Stack(쌓기)/Reorder(순서 변경)/Reflow-Heavy(재구성) 중 무엇인지 패턴의 `reflow`를 따른다. (Part 5)
6. **컴포넌트 매핑.** 패턴의 `relatedComponents`로 실제 컴포넌트를 연결하고, `build` 토큰으로 CSS를 짠다.
7. **안정성 체크 (아래 체크리스트 통과).**

## 안정성 체크리스트 (완료 전 필수)

레이아웃을 "됐다"고 하기 전에 전부 확인한다. 이게 "안정"의 정의다.

- [ ] **넘침 차단 (overflow-containment):** flex/grid 자식에 `min-width: 0`(또는 `min-height:0`)을 줬는가. 긴 텍스트·URL·이미지가 칸을 밀어내 가로 스크롤을 만들지 않는가. 필요 시 `overflow`·`text-overflow:ellipsis`·`overflow-wrap`.
- [ ] **내재 크기 (intrinsic-sizing):** 고정 px 대신 `minmax()`·`fit-content`·`min/max-content`로 영역이 콘텐츠에 안전하게 적응하는가.
- [ ] **시프트 방지 (cls-prevention):** 이미지·임베드·동적 콘텐츠에 `aspect-ratio` 또는 width/height·min-height 로 공간을 미리 예약했는가. 늦게 로드돼도 자리가 안 밀리는가.
- [ ] **스태킹 규율 (stacking-discipline):** z-index 를 즉흥값(999999) 대신 스케일로 관리하고, 겹침엔 `isolation`을 썼는가.
- [ ] **포화·균형:** 유휴 구멍이 없고, 영역 무게가 한쪽으로 쏠리지 않는가.
- [ ] **공간 모델 일관:** fixed 영역과 fluid 영역이 기획 의도대로 배정됐고, 대화면에서 유휴 여백이 의도된 것인가.
- [ ] **reflow 검증:** 좁은 화면에서 패턴의 reflow 대로 무너지는가(DOM 순서·접근성 주의).

## 사용 메모

- 의도가 모호하면 먼저 `bestFor`/`aliases`로 후보를 찾아 사용자에게 1~2개 질문.
- 조합 시 `avoidWith`(충돌)를 확인한다(예: Bento + Brutalism 회피).
- 이 스킬은 레이아웃 **골격·정책**을 정한다. 비주얼 스타일·토큰은 design-system 룰을, 컴포넌트 생성은 component-work 스킬을 따른다.
- 택소노미 자체를 추가·보강하는 작업은 `layout-preview-build` 스킬과 `layout-preview-qa` 서브에이전트를 쓴다(이 스킬은 택소노미를 *소비*만 한다).

## 핵심 원칙

- 공간 모델을 구조보다 먼저 정한다.
- 패턴은 `bestFor`로 고르고 `avoidFor`로 거른다. 즉흥 선택 금지.
- 모든 레이아웃은 안정성 체크리스트를 통과해야 완료다. min-width:0 누락이 불안정 1순위다.
- 유휴 구멍·불균형을 남기지 않는다(의도된 여백은 예외).
