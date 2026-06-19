/**
 * Vibe Dictionary: Visual Asset Taxonomy v0.1 데이터
 *
 * 3 Parts (기법 / 구조 / 표면) · 20 Categories · 284 Keywords
 *
 * 출처: 검증된 하이브리드 SSOT (.claude/skills/visual-asset-prompt/ssot/dictionary.json).
 * 자동 생성: .claude/skills/visual-asset-prompt/scripts/build.mjs. 직접 수정하지 말고 SSOT 에서 재생성.
 *
 * item type 'visual-asset' 필드:
 * - name / koName / role(Core·Support·Niche·Scaffold) / description
 * - visual: 결과 시각 특징 (깊이-완성 45개만, 나머지는 빈 값 = 준비 중)
 * - build: 바이브 코딩 구현 경로 (SVG·Canvas·Image 등)
 * - goodWith / avoidWith: 조합 가이드 (잘 어울림 / 충돌)
 * - promptFragment: 복사용 영문 프롬프트 조각 (깊이-완성 45개만)
 * - pending: 깊이 필드 미완성 여부
 *
 * VISUAL_ASSET_RECIPES: 활용법 워크드 예제. prompt/negative 는 derive.mjs 도출.
 */

export const VISUAL_ASSET_TAXONOMY_STATS = {
  parts: 3,
  categories: 20,
  keywords: 284
};

export const VISUAL_ASSET_TAXONOMY = [
  {
    id: "va-part-1",
    number: 1,
    label: "기법",
    description: "어떻게 만들어진 것처럼 보이는가",
    type: "visual-asset",
    count: 110,
    categories: [
      {
        id: "va-cat-1",
        number: 1,
        name: "Printmaking & Drawing",
        subtitle: "판화·드로잉",
        definition: "판화나 손 드로잉처럼 찍고 그린 듯한 아날로그 제작 기법입니다. 잉크와 종이의 물성이 그대로 드러납니다.",
        count: 19,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Etching",
                koName: "에칭",
                role: "Core",
                description: "금속판 부식 판화풍. 세밀한 선과 고전적 음영",
                visual: "",
                build: ["SVG", "Image(gen)", "Hybrid"],
                goodWith: ["Archival Paper Texture", "Cross-hatching", "Engraved Line", "Monochrome", "Ornamental Border"],
                avoidWith: ["Clay Render", "Glass Material", "Glitch", "Holographic Material", "Mesh Gradient", "Neon", "Particle Field", "Vaporwave", "Y2K Futurism"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Engraving",
                koName: "인그레이빙",
                role: "Core",
                description: "뷰린 각인선. 정밀한 평행선 음영, 고전적 서적 삽화 느낌",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: ["Archival Paper Texture", "Cross-hatching", "Hairline", "Monochrome"],
                avoidWith: ["Blur", "Clay Render", "Glow"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Woodcut",
                koName: "목판화풍",
                role: "Core",
                description: "거칠고 강한 면, 굵은 선, 높은 대비의 수공예적 판화",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: ["High Contrast", "Limited Palette", "Paper Grain"],
                avoidWith: ["Blur", "Glass Material", "Glossy Surface", "Holographic Material", "Iridescent Material", "Mesh Gradient"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Linocut",
                koName: "리노컷",
                role: "Niche",
                description: "단순화된 형태, 굵은 면 분할, 거친 수공예적 가장자리",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: ["Flat Fill", "Limited Palette", "Paper Grain"],
                avoidWith: ["Chrome Material", "Glow"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Lithograph",
                koName: "석판화풍",
                role: "Support",
                description: "부드러운 톤, 손으로 그린 듯한 질감, 회화적 표면감",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Muted", "Paper Grain", "Soft Shading"],
                avoidWith: ["Glitch", "Neon"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Screenprint",
                koName: "실크스크린풍",
                role: "Core",
                description: "선명한 색면, 제한된 팔레트, 포스터 같은 인쇄감",
                visual: "",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Flat Fill", "Halftone Pattern", "Limited Palette", "Screenprint Texture"],
                avoidWith: ["Blur", "Gradient Shading"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Risograph",
                koName: "리소그래프풍",
                role: "Core",
                description: "제한된 별색, 인쇄 어긋남, 거친 그레인, 독립 출판물 감성",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Flat Fill", "Limited Palette", "Misregistration", "Risograph Grain"],
                avoidWith: ["Chrome Material", "Glossy Surface", "Refraction"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ink Drawing",
                koName: "잉크 드로잉",
                role: "Core",
                description: "펜이나 붓 잉크의 선명한 선과 강한 대비",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: ["Cross-hatching", "Ink Bleed", "Monochrome", "Paper Grain"],
                avoidWith: ["Glass Material", "Glow"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ink Wash",
                koName: "수묵/잉크 워시",
                role: "Core",
                description: "물에 희석된 잉크의 번짐, 농담, 흐릿한 음영. 동양화 감성",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Ink Wash Shading", "Monochrome", "Negative Space", "Paper Grain"],
                avoidWith: ["Blueprint Line", "Chrome Material", "Neon"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Pencil Sketch",
                koName: "연필 스케치",
                role: "Support",
                description: "연필 선, 밑그림, 필압이 드러나는 드로잉",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Contour Shading", "Hand-drawn Line", "Monochrome", "Paper Grain"],
                avoidWith: ["Glossy Surface", "Neon"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Charcoal Drawing",
                koName: "목탄 드로잉",
                role: "Niche",
                description: "부드럽고 어두운 명암, 거친 번짐, 강한 질감",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["High Contrast", "Monochrome", "Paper Grain"],
                avoidWith: ["Chrome Material", "Clean Vector Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Watercolor",
                koName: "수채화풍",
                role: "Support",
                description: "물감의 투명도, 번짐, 물자국, 부드러운 색 겹침",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Ink Bleed", "Paper Grain", "Pastel", "Soft Shading"],
                avoidWith: ["Blueprint", "Blueprint Line", "Chrome Material", "Glitch", "Metallic Material", "Pixel Art", "Synthwave", "Technical Illustration", "Voxel", "Wireframe Render"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Gouache",
                koName: "과슈풍",
                role: "Support",
                description: "불투명하고 매트한 색면, 부드러운 브러시 자국",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Flat Fill", "Matte Paper", "Pastel"],
                avoidWith: ["Glitch", "Glossy Surface", "Neon"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Collage Illustration",
                koName: "콜라주 일러스트",
                role: "Core",
                description: "종이, 사진, 질감, 도형을 오려 붙인 듯한 이질적 레이어 조합",
                visual: "",
                build: ["Image(gen)", "Hybrid"],
                goodWith: ["Asymmetric", "Layered/Overlap", "Paper Grain"],
                avoidWith: ["Clean Vector Line", "Monoline"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cut-paper Illustration",
                koName: "컷페이퍼 일러스트",
                role: "Core",
                description: "종이를 잘라 겹친 듯한 단순한 형태, 레이어, 그림자",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: ["Flat Fill", "Layered/Overlap", "Pastel"],
                avoidWith: ["Cross-hatching", "Engraved Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Flat Vector Illustration",
                koName: "플랫 벡터 일러스트",
                role: "Core",
                description: "단순한 도형, 평면 색상, 명확한 윤곽의 벡터 기반 일러스트",
                visual: "",
                build: ["SVG"],
                goodWith: ["Clean Vector Line", "Flat Fill", "Limited Palette", "Monoline"],
                avoidWith: ["Cross-hatching", "Film Grain", "Ink Bleed"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cyanotype",
                koName: "시아노타입",
                role: "Niche",
                description: "프러시안 블루 실루엣. 감광지 + 자외선 노출",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Monochrome", "Paper Grain", "Silhouette"],
                avoidWith: ["Chrome Material", "Neon"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ukiyo-e",
                koName: "우키요에",
                role: "Support",
                description: "일본 목판 다색 인쇄. 평탄한 색면, 굵은 외곽선, 보카시 기법",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Flat Fill", "Limited Palette", "Outline Drawing"],
                avoidWith: ["Chrome Material", "Glitch"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Letterpress",
                koName: "레터프레스",
                role: "Niche",
                description: "활자/판 눌러찍기. deboss 자국, 잉크 농도 변화",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Debossed Surface", "Limited Palette", "Paper Grain"],
                avoidWith: ["Glass Material", "Glow"],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-2",
        number: 2,
        name: "Specialized Illustration",
        subtitle: "전문 도해",
        definition: "대상의 구조와 작동 원리를 정확하게 설명하는 전문 도해형 일러스트입니다. 기술·과학 문서의 명료함을 목표로 합니다.",
        count: 6,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Technical Illustration",
                koName: "테크니컬 일러스트",
                role: "Scaffold",
                description: "대상의 구조, 부품, 작동 원리를 명확하게 설명하는 정밀한 설명형 일러스트",
                visual: "정밀한 선 · 콜아웃/라벨 · 구조 설명 · 기술 문서 같은 명료함",
                build: ["SVG", "Hybrid"],
                goodWith: ["Annotation Diagram", "Blueprint Line", "Isometric", "Monoline", "Technical Line"],
                avoidWith: ["Ink Bleed", "Watercolor"],
                promptFragment: "precise technical illustration with clean structural lines, callouts, and diagrammatic clarity",
                pending: false
              },
              {
                name: "Scientific Illustration",
                koName: "과학 일러스트",
                role: "Scaffold",
                description: "생물, 물질, 자연현상을 정확하고 분석적으로 묘사하는 재현 스타일",
                visual: "분석적 묘사 · 정확한 구조 · 관찰 기록 느낌",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Annotation Diagram", "Cross-section View", "Hairline", "Limited Palette"],
                avoidWith: ["Glitch", "Neon"],
                promptFragment: "analytical scientific illustration with accurate structure and restrained detail",
                pending: false
              },
              {
                name: "Botanical Illustration",
                koName: "식물 세밀화",
                role: "Scaffold",
                description: "식물의 잎, 줄기, 꽃, 뿌리를 정확하고 세밀하게 표현",
                visual: "식물 표본 느낌 · 섬세한 선 · 자연주의적 정밀함",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Detailed", "Earth Tone", "Hairline", "Paper Grain"],
                avoidWith: ["Chrome Material", "Glitch", "Neon"],
                promptFragment: "refined botanical illustration with delicate specimen-like detail",
                pending: false
              },
              {
                name: "Anatomical Illustration",
                koName: "해부학 일러스트",
                role: "Scaffold",
                description: "인체나 생물의 내부 구조, 기관, 근육, 뼈를 분석적으로 표현",
                visual: "",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Annotation Diagram", "Cross-section View", "Cutaway View"],
                avoidWith: ["Glitch", "Pixel Pattern"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Medical Illustration",
                koName: "의학 일러스트",
                role: "Niche",
                description: "질병, 수술, 생리 작용을 교육적으로 설명하는 전문 일러스트",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Annotation Diagram", "Cross-section View", "Limited Palette"],
                avoidWith: ["Neon", "Vaporwave"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cartographic Illustration",
                koName: "지도학적 일러스트",
                role: "Scaffold",
                description: "지도, 지형, 경로, 위치 관계를 시각적으로 표현하는 지도 기반 스타일",
                visual: "",
                build: ["SVG"],
                goodWith: ["Limited Palette", "Topographic Lines", "Topographic View"],
                avoidWith: ["Clay Render", "Glitch"],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-3",
        number: 3,
        name: "Digital Illustration",
        subtitle: "디지털 일러스트",
        definition: "벡터와 플랫처럼 디지털 도구로 그린 현대 일러스트 양식입니다. 화면과 인쇄 모두에 깔끔하게 적용됩니다.",
        count: 13,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Vector Illustration",
                koName: "벡터 일러스트",
                role: "Core",
                description: "수학적 곡선 기반. 선명한 외곽, 솔리드 채움, 무한 확대",
                visual: "",
                build: ["SVG"],
                goodWith: ["Clean Vector Line", "Flat Fill", "Limited Palette"],
                avoidWith: ["Film Grain", "Ink Bleed"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Flat Design",
                koName: "플랫 디자인",
                role: "Core",
                description: "그라데이션/그림자 없이 순수 평면 색면과 기하 형태",
                visual: "",
                build: ["SVG", "CSS"],
                goodWith: ["Flat Fill", "Grid-Based", "Limited Palette", "Monoline"],
                avoidWith: ["Cross-hatching", "Embossed Surface", "Film Grain"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Isometric Illustration",
                koName: "아이소메트릭 일러스트",
                role: "Core",
                description: "30° 축측 투영. 원근 왜곡 없이 세 면 동일 비율",
                visual: "",
                build: ["SVG", "CSS", "Three.js"],
                goodWith: ["Clean Vector Line", "Flat Fill", "Isometric", "Limited Palette"],
                avoidWith: ["Film Grain", "Ink Bleed"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Pixel Art",
                koName: "픽셀 아트",
                role: "Core",
                description: "픽셀 단위 수작업. 8bit/16bit 제약, 디더링. 레트로 게임 미학",
                visual: "",
                build: ["SVG", "Canvas"],
                goodWith: ["Dithered Shading", "Grid-Based", "Limited Palette", "Pixel Pattern"],
                avoidWith: ["Blur", "Gradient Shading", "Watercolor"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Concept Art",
                koName: "컨셉 아트",
                role: "Core",
                description: "영화/게임 디지털 페인팅. 시네마틱 분위기",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Full Bleed", "High Contrast", "Stylized"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Editorial Illustration",
                koName: "에디토리얼 일러스트",
                role: "Core",
                description: "아티클 삽화. 은유적, 중간 디테일 회화 터치",
                visual: "",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Asymmetric", "Duotone", "Grainy Gradient", "Stylized"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Children's Book Illustration",
                koName: "동화 일러스트",
                role: "Core",
                description: "부드러운 형태, 따뜻한 팔레트, 둥근 캐릭터",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Pastel", "Soft Shading", "Stylized"],
                avoidWith: ["Blueprint Line", "Glitch", "High Contrast"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Sticker Art",
                koName: "스티커 아트",
                role: "Support",
                description: "다이컷 흰색 테두리, 광택 채움. 스티커팩 미학",
                visual: "",
                build: ["SVG"],
                goodWith: ["Clean Vector Line", "Flat Fill", "Stylized"],
                avoidWith: ["Cross-hatching", "Film Grain"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Fashion Illustration",
                koName: "패션 일러스트",
                role: "Niche",
                description: "늘씬한 비례, 제스처 중심, 의상 디테일 강조",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Desaturated", "Hand-drawn Line", "Stylized"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Geometric Illustration",
                koName: "기하학적 일러스트",
                role: "Support",
                description: "기본 도형 조합. 모듈러, 추상적",
                visual: "",
                build: ["SVG", "CSS"],
                goodWith: ["Flat Fill", "Grid-Based", "Limited Palette", "Simplified"],
                avoidWith: ["Hand-drawn Line", "Ink Bleed"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Infographic",
                koName: "인포그래픽",
                role: "Core",
                description: "아이콘 + 화살표 + 타이포 + 차트. 데이터/프로세스 시각 요약",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Flat Fill", "Grid-Based", "Limited Palette", "Simplified"],
                avoidWith: ["Film Grain", "Ink Bleed"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Blueprint",
                koName: "블루프린트",
                role: "Support",
                description: "흰색 선 + 청색 배경. 기술 도면 양식, 치수선과 주석",
                visual: "",
                build: ["SVG"],
                goodWith: ["Blueprint Grid Pattern", "Blueprint Line", "Monoline", "Technical Line"],
                avoidWith: ["Pastel", "Warm", "Watercolor"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Iconography",
                koName: "아이콘/픽토그램",
                role: "Core",
                description: "단일 개념 단순화 기호. 유니버설 심볼, 최소 디테일 즉시 인지",
                visual: "",
                build: ["SVG"],
                goodWith: ["Clean Vector Line", "Flat Fill", "Monoline", "Simplified"],
                avoidWith: ["Cross-hatching", "Film Grain"],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-4",
        number: 4,
        name: "Anime & Cartoon",
        subtitle: "애니·카툰",
        definition: "애니메이션과 만화 특유의 셀 음영, 캐릭터 비례, 컷 양식입니다.",
        count: 8,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Anime",
                koName: "애니메이션",
                role: "Core",
                description: "일본 애니메이션 양식. 큰 눈, 셀 셰이딩, 표현적 라인워크",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Cel Shading", "Neon/Vivid", "Outline Drawing"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Manga",
                koName: "만화",
                role: "Core",
                description: "흑백 일본 만화. 스크린톤 중간톤, 패널 그리드",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Hatching", "Monochrome", "Outline Drawing", "Screentone"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cel Shading",
                koName: "셀 셰이딩",
                role: "Core",
                description: "경계 뚜렷한 2~3단계 평면 그림자. 3D에도 2D 느낌",
                visual: "",
                build: ["Image(gen)", "Three.js"],
                goodWith: ["Flat Fill", "Limited Palette", "Outline Drawing"],
                avoidWith: ["Film Grain", "Gradient Shading"],
                promptFragment: "",
                pending: true
              },
              {
                name: "90s Anime",
                koName: "90년대 애니메이션",
                role: "Support",
                description: "VHS 시대 색감, 필름 그레인. 아키라/공각기동대 무드",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Desaturated", "Film Grain", "Scanline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Pixar-style 3D",
                koName: "픽사 스타일 3D",
                role: "Core",
                description: "양식화 CGI. 서브서피스 스킨, 과장 비율",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Pastel", "Soft Shading", "Stylized"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Classic 2D Animation",
                koName: "클래식 2D 애니",
                role: "Support",
                description: "유려한 선, 수채화 배경, 클래식 캐릭터 비율",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Outline Drawing", "Pastel", "Watercolor"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Western Cartoon",
                koName: "서양 카툰",
                role: "Support",
                description: "굵은 외곽선, 과장된 표정, 원색 팔레트",
                visual: "",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Flat Fill", "Neon/Vivid", "Outline Drawing"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Comic Book Art",
                koName: "코믹북 아트",
                role: "Core",
                description: "굵은 잉크 외곽선 + 하프톤 음영 + 다이나믹 패널",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Halftone Shading", "High Contrast", "Outline Drawing"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-5",
        number: 5,
        name: "3D Render Style",
        subtitle: "3D 렌더",
        definition: "입체로 렌더링한 듯한 3D 형상 표현 방식입니다. 점토, 와이어프레임, 로우폴리 등 렌더 룩으로 나뉩니다.",
        count: 12,
        groups: [
          {
            label: null,
            items: [
              {
                name: "3D Render",
                koName: "3D 렌더",
                role: "Core",
                description: "범용 레이트레이싱 룩. 일반적 3D 광택/GI/그림자",
                visual: "",
                build: ["Three.js", "3D", "Image(gen)"],
                goodWith: ["Glossy Finish", "Matte Finish"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Clay Render",
                koName: "클레이 렌더",
                role: "Core",
                description: "점토처럼 부드럽고 매트한 표면, 둥근 형태, 친근한 입체감",
                visual: "부드러운 3D · 무광 표면 · 친근한 오브젝트",
                build: ["Three.js", "3D", "Image(gen)"],
                goodWith: ["Matte Finish", "Pastel", "Soft Shading"],
                avoidWith: ["Blueprint Line", "Cartographic Illustration", "Cross-hatching", "Engraved Line", "Engraving", "Etching"],
                promptFragment: "soft clay render with matte surfaces and friendly rounded forms",
                pending: false
              },
              {
                name: "Wireframe Render",
                koName: "와이어프레임 렌더",
                role: "Core",
                description: "3D 객체의 면과 꼭짓점 구조를 선으로만 표현",
                visual: "3D 골격 · 메시 구조 · 기술적 미래감",
                build: ["Three.js", "SVG", "CSS"],
                goodWith: ["Monochrome", "Monoline", "Wireframe Line"],
                avoidWith: ["Film Grain", "Watercolor"],
                promptFragment: "wireframe render showing mesh edges, vertices, and spatial structure",
                pending: false
              },
              {
                name: "Low-poly",
                koName: "로우폴리",
                role: "Core",
                description: "적은 폴리곤으로 구성된 각진 면과 단순화된 형태",
                visual: "각진 면 · 단순화된 입체 · 레트로/게임 감성",
                build: ["Three.js", "3D", "Image(gen)"],
                goodWith: ["Flat Fill", "Limited Palette"],
                avoidWith: ["Engraved Line", "Ink Bleed"],
                promptFragment: "low-poly 3D form with simplified angular facets and flat shading",
                pending: false
              },
              {
                name: "Isometric Render",
                koName: "아이소메트릭 렌더",
                role: "Support",
                description: "3D 등각 투영 렌더링. 게임, 인포그래픽에 활용",
                visual: "",
                build: ["Three.js", "SVG"],
                goodWith: ["Flat Fill", "Isometric", "Limited Palette"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Voxel",
                koName: "복셀",
                role: "Core",
                description: "작은 정육면체 블록 단위로 형태를 구성하는 3D 픽셀 아트",
                visual: "",
                build: ["Three.js", "Image(gen)"],
                goodWith: ["Grid-Based", "Limited Palette"],
                avoidWith: ["Ink Bleed", "Watercolor"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Toon Render",
                koName: "툰 렌더",
                role: "Core",
                description: "만화처럼 단순화된 명암, 강한 윤곽, 비현실적 색감의 3D",
                visual: "",
                build: ["Three.js", "Image(gen)"],
                goodWith: ["Cel Shading", "Limited Palette", "Outline Drawing"],
                avoidWith: ["Film Grain"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ambient Occlusion Render",
                koName: "앰비언트 오클루전 렌더",
                role: "Support",
                description: "접촉부와 구석의 그림자를 강조해 구조와 깊이를 드러냄",
                visual: "",
                build: ["Three.js", "3D"],
                goodWith: ["Matte Finish", "Monochrome"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ray-traced Render",
                koName: "레이트레이스 렌더",
                role: "Support",
                description: "빛의 반사, 굴절, 그림자를 물리적으로 계산한 사실적 렌더링",
                visual: "",
                build: ["Three.js", "3D"],
                goodWith: ["Glass Material", "Glossy Finish", "Metallic Material"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Photoreal Render",
                koName: "포토리얼 렌더",
                role: "Scaffold",
                description: "실제 사진처럼 보이는 재질, 빛, 카메라 표현",
                visual: "",
                build: ["3D", "Image(gen)"],
                goodWith: ["Glossy Finish", "Metallic Material"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Claymation",
                koName: "클레이메이션",
                role: "Support",
                description: "점토 인형 질감. 손가락 자국, 스톱모션 느낌",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Matte Finish", "Soft Light", "Stylized"],
                avoidWith: ["Blueprint Line", "Chrome Material"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Origami / Papercraft",
                koName: "오리가미/페이퍼크래프트",
                role: "Support",
                description: "접힌 종이 기하. 주름 그림자, 레이어 간격",
                visual: "",
                build: ["Image(gen)", "Three.js"],
                goodWith: ["Layered/Overlap", "Matte Finish", "Pastel"],
                avoidWith: ["Chrome Material", "Neon"],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-6",
        number: 6,
        name: "3D Material Finish",
        subtitle: "3D 재질",
        definition: "유리, 금속, 세라믹처럼 3D 표면이 빛에 반응하는 재질 마감입니다.",
        count: 11,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Matte Finish",
                koName: "매트 마감",
                role: "Support",
                description: "빛 반사가 적고 부드러운 표면의 차분한 재질",
                visual: "",
                build: ["Three.js", "CSS", "3D"],
                goodWith: ["Clay Render", "Soft Shading"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Glossy Finish",
                koName: "글로시 마감",
                role: "Support",
                description: "반짝이는 표면 반사와 매끄러운 재질감",
                visual: "",
                build: ["Three.js", "CSS", "3D"],
                goodWith: ["Ray-traced Render", "Soft Light"],
                avoidWith: ["Matte Paper", "Paper Grain"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Glass Material",
                koName: "유리 재질",
                role: "Core",
                description: "투명도, 굴절, 반사, 두께감을 가진 유리 재질",
                visual: "투명도 · 굴절 · 프리미엄 테크 느낌",
                build: ["Three.js", "WebGL", "CSS"],
                goodWith: ["Blur", "Glow", "Refraction"],
                avoidWith: ["Cross-hatching", "Etching", "Ink Drawing", "Letterpress", "Paper Grain", "Woodcut"],
                promptFragment: "transparent glass material with subtle refraction, thickness, and clean reflections",
                pending: false
              },
              {
                name: "Frosted Glass Material",
                koName: "프로스티드 글래스",
                role: "Core",
                description: "반투명하고 흐릿한 유리 표면, 부드러운 내부 확산감",
                visual: "",
                build: ["Three.js", "CSS", "WebGL"],
                goodWith: ["Blur", "Glow", "Soft Light"],
                avoidWith: ["Cross-hatching", "Engraved Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Chrome Material",
                koName: "크롬 재질",
                role: "Core",
                description: "거울 같은 금속 반사와 차갑고 미래적인 표면감",
                visual: "거울 반사 · 미래적 금속감 · 차가운 고급감",
                build: ["Three.js", "WebGL"],
                goodWith: ["High Contrast", "Ray-traced Render"],
                avoidWith: ["Botanical Illustration", "Charcoal Drawing", "Claymation", "Cyanotype", "Grainy Gradient", "Ink Bleed", "Ink Wash", "Linocut", "Origami / Papercraft", "Paper Grain", "Risograph", "Ukiyo-e", "Watercolor"],
                promptFragment: "polished chrome material with mirror-like reflection and futuristic finish",
                pending: false
              },
              {
                name: "Metallic Material",
                koName: "금속 재질",
                role: "Core",
                description: "금속의 반사, 거칠기, 무게감을 표현하는 재질",
                visual: "",
                build: ["Three.js", "WebGL", "CSS"],
                goodWith: ["Hard Light", "Ray-traced Render"],
                avoidWith: ["Paper Grain", "Watercolor"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ceramic Material",
                koName: "세라믹 재질",
                role: "Core",
                description: "도자기처럼 매끄럽거나 은은한 광택이 있는 단단한 표면",
                visual: "",
                build: ["Three.js", "3D"],
                goodWith: ["Matte Finish", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Plastic Material",
                koName: "플라스틱 재질",
                role: "Support",
                description: "합성수지 같은 가벼운 반사, 부드러운 색면",
                visual: "",
                build: ["Three.js", "CSS"],
                goodWith: ["Pastel", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Translucent Material",
                koName: "반투명 재질",
                role: "Core",
                description: "빛이 내부를 통과하는 듯한 깊이감과 반투명성",
                visual: "",
                build: ["Three.js", "WebGL", "CSS"],
                goodWith: ["Blur", "Glow", "Soft Light"],
                avoidWith: ["Cross-hatching", "Engraved Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Holographic Material",
                koName: "홀로그래픽 재질",
                role: "Core",
                description: "무지갯빛 반사와 각도에 따른 색 변화가 나타나는 미래적 표면",
                visual: "",
                build: ["Three.js", "WebGL", "CSS"],
                goodWith: ["Chromatic Aberration", "Glow", "Neon/Vivid"],
                avoidWith: ["Etching", "Paper Grain", "Woodcut"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Iridescent Material",
                koName: "이리데슨트 재질",
                role: "Core",
                description: "조개껍질이나 오일막처럼 각도에 따라 색이 달라지는 표면",
                visual: "",
                build: ["Three.js", "WebGL"],
                goodWith: ["Glow", "Pastel"],
                avoidWith: ["Engraved Line", "Woodcut"],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-7",
        number: 7,
        name: "Photography",
        subtitle: "사진",
        definition: "실제로 촬영한 사진처럼 보이는 카메라 기반 양식입니다. 스튜디오, 필름, 매크로 등 촬영 방식으로 나뉩니다.",
        count: 14,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Studio Photography",
                koName: "스튜디오 포토",
                role: "Core",
                description: "통제된 인공 조명, 심리스 배경, 선명. 제품 촬영",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Centered", "Matte", "Realistic", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Editorial Photography",
                koName: "에디토리얼 포토",
                role: "Support",
                description: "매거진 스타일. 연출된 인물/라이프스타일",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Desaturated", "Rule of Thirds", "Shallow Depth of Field"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Documentary Photography",
                koName: "다큐멘터리 포토",
                role: "Niche",
                description: "연출 없는 저널리즘. 현장광, 솔직한 포착",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Deep Focus", "Full Color", "Realistic"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Street Photography",
                koName: "스트릿 포토",
                role: "Support",
                description: "도시 캔디드. 가용광, 움직임, 일상 순간",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Full Color", "High Contrast", "Tight Crop"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Fashion Photography",
                koName: "패션 포토",
                role: "Niche",
                description: "하이키, 모델 중심, 의상 강조",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Desaturated", "Shallow Depth of Field", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Food Photography",
                koName: "푸드 포토",
                role: "Support",
                description: "탑다운/45°, 스타일링, 식욕 자극 조명",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Bird's Eye View", "Shallow Depth of Field", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Macro Photography",
                koName: "매크로 포토",
                role: "Support",
                description: "극접사. 매우 얕은 심도, 미세 디테일 확대",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Macro View", "Shallow Depth of Field", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Landscape Photography",
                koName: "풍경 포토",
                role: "Core",
                description: "넓은 풍경. 골든아워, 전경 앵커, 깊은 심도",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Deep Focus", "Full Bleed", "Full Color", "Golden Hour"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Analog Film",
                koName: "아날로그 필름",
                role: "Core",
                description: "필름 그레인, 따뜻한 색 캐스트, 바랜 색감. 35mm",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Desaturated", "Film Grain", "Sepia/Warm Cast"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cinestill",
                koName: "시네스틸",
                role: "Support",
                description: "시네마틱 그레인, 보케, 할레이션. 야간 필름 느낌",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Bokeh", "Film Grain", "Neon Glow"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Polaroid",
                koName: "폴라로이드",
                role: "Support",
                description: "흰색 테두리, 바랜 색조, 정사각 크롭, 소프트 포커스",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Desaturated", "Sepia/Warm Cast", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "B&W Photography",
                koName: "흑백 사진",
                role: "Core",
                description: "흑백 톤. 명암과 질감만으로 구성",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Film Grain", "High Contrast", "Monochrome"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Double Exposure",
                koName: "이중노출",
                role: "Support",
                description: "두 이미지 겹쳐 투과. 실루엣 안 풍경 등 초현실",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Layered/Overlap", "Silhouette"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Long Exposure",
                koName: "장노출",
                role: "Niche",
                description: "장노출. 빛 궤적, 물 실크 표면, 움직임 흔적",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Full Bleed", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-8",
        number: 8,
        name: "Retro-Digital",
        subtitle: "레트로 디지털",
        definition: "신스웨이브, Y2K처럼 특정 시대의 디지털 미감을 재현하는 양식입니다.",
        count: 6,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Synthwave",
                koName: "신스웨이브",
                role: "Core",
                description: "80년대 레트로퓨처리즘. 네온 그리드, 크롬 태양, 보라-핑크-시안",
                visual: "",
                build: ["Image(gen)", "CSS", "WebGL"],
                goodWith: ["Chrome Material", "Neon Glow", "Neon/Vivid", "One-Point Perspective"],
                avoidWith: ["Paper Grain", "Watercolor"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Vaporwave",
                koName: "베이퍼웨이브",
                role: "Core",
                description: "90년대 인터넷. 파스텔 핑크/틸, 글리치, Win95 UI",
                visual: "",
                build: ["Image(gen)", "CSS"],
                goodWith: ["Chrome Material", "Glitch", "Pastel", "Scanline"],
                avoidWith: ["Etching", "Medical Illustration", "Paper Grain"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cyberpunk",
                koName: "사이버펑크",
                role: "Core",
                description: "네온 디스토피아. 비, 홀로그램, 고밀도 도시",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["High Contrast", "Neon Glow", "Neon/Vivid", "One-Point Perspective"],
                avoidWith: ["Paper Grain", "Pastel"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Y2K Futurism",
                koName: "Y2K 퓨처리즘",
                role: "Support",
                description: "반투명 크롬 블롭, 라임/실버, iMac G3 플라스틱",
                visual: "",
                build: ["Image(gen)", "CSS"],
                goodWith: ["Chrome Material", "Glossy Finish", "Pastel"],
                avoidWith: ["Etching", "Paper Grain"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Frutiger Aero",
                koName: "프루티거 아에로",
                role: "Support",
                description: "Vista/iOS6 스큐어모피즘. 광택 UI, 보케, 자연+기술",
                visual: "",
                build: ["Image(gen)", "CSS"],
                goodWith: ["Bokeh", "Glossy Finish", "Soft Light"],
                avoidWith: ["Blueprint Line", "Monochrome"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Digital Brutalism",
                koName: "디지털 브루탈리즘",
                role: "Niche",
                description: "콘크리트 텍스처, 로 타이포, 로파이 웹",
                visual: "",
                build: ["CSS", "Image(gen)"],
                goodWith: ["Concrete Texture", "High Contrast", "Monochrome"],
                avoidWith: ["Pastel", "Soft Light", "Soft Shading"],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-9",
        number: 9,
        name: "Abstract & Generative",
        subtitle: "추상·제너러티브",
        definition: "코드로 생성하는 추상 형상과 제너러티브 패턴입니다. 그라디언트, 파티클, 필드 계열이 대표적입니다.",
        count: 21,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Mesh Gradient",
                koName: "메시 그라디언트",
                role: "Core",
                description: "여러 색상 포인트가 유기적으로 섞이며 부드러운 색면 흐름",
                visual: "부드러운 색 흐름 · 현대적 배경 · 추상적 깊이",
                build: ["CSS", "Canvas", "WebGL", "Image(gen)"],
                goodWith: ["Aurora Gradient", "Glass Material", "Glow", "Grainy Gradient"],
                avoidWith: ["Blueprint Line", "Etching", "Woodcut"],
                promptFragment: "soft mesh gradient with organic color blending and subtle atmospheric depth",
                pending: false
              },
              {
                name: "Aurora Gradient",
                koName: "오로라 그라디언트",
                role: "Core",
                description: "오로라처럼 흐릿하고 빛나는 색 띠가 겹치는 추상 그래픽",
                visual: "",
                build: ["CSS", "Canvas", "WebGL"],
                goodWith: ["Blur", "Glow", "Mesh Gradient"],
                avoidWith: ["Cross-hatching", "Engraved Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Liquid Gradient",
                koName: "리퀴드 그라디언트",
                role: "Core",
                description: "액체처럼 흐르는 색상 경계와 유동적인 색 변화",
                visual: "",
                build: ["CSS", "Canvas", "WebGL"],
                goodWith: ["Blob Shape", "Glow"],
                avoidWith: ["Blueprint Line", "Technical Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Grainy Gradient",
                koName: "그레이니 그라디언트",
                role: "Core",
                description: "그라디언트 위에 노이즈나 입자를 더해 질감과 깊이를 만듦",
                visual: "노이즈 입자 · 부드러운 색면 · 디지털 질감",
                build: ["CSS", "SVG Filter", "Canvas"],
                goodWith: ["Limited Palette", "Mesh Gradient", "Noise Texture"],
                avoidWith: ["Chrome Material", "Glossy Surface"],
                promptFragment: "grainy gradient with subtle noise texture over smooth color transitions",
                pending: false
              },
              {
                name: "Blob Shape",
                koName: "블롭 형태",
                role: "Core",
                description: "둥글고 불규칙한 유기적 덩어리 형태",
                visual: "",
                build: ["CSS", "SVG", "Canvas"],
                goodWith: ["Gradient Shading", "Pastel", "Soft Shading"],
                avoidWith: ["Blueprint Line", "Technical Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Metaball",
                koName: "메타볼",
                role: "Core",
                description: "여러 유기적 덩어리가 서로 합쳐지는 듯한 액체형 추상 구조",
                visual: "",
                build: ["Canvas", "WebGL", "Three.js"],
                goodWith: ["Blob Shape", "Glow"],
                avoidWith: ["Cross-hatching", "Engraved Line"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Membrane Form",
                koName: "멤브레인 형태",
                role: "Support",
                description: "얇은 막이나 표면이 늘어나고 휘어진 듯한 유기적 구조",
                visual: "",
                build: ["WebGL", "Three.js"],
                goodWith: ["Glow", "Translucent Material"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Particle Field",
                koName: "파티클 필드",
                role: "Core",
                description: "많은 입자가 공간에 분포해 흐름, 에너지, 데이터를 표현",
                visual: "입자 분포 · 데이터/에너지 느낌 · 동적 배경",
                build: ["Canvas", "WebGL", "Three.js"],
                goodWith: ["Glow", "Neon/Vivid", "Point Cloud"],
                avoidWith: ["Etching", "Paper Grain"],
                promptFragment: "subtle particle field suggesting data, energy, and distributed intelligence",
                pending: false
              },
              {
                name: "Point Cloud",
                koName: "포인트 클라우드",
                role: "Core",
                description: "점들의 집합으로 형태, 공간, 데이터 구조를 표현",
                visual: "",
                build: ["Canvas", "WebGL", "Three.js"],
                goodWith: ["Monochrome", "Particle Field"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Vector Field",
                koName: "벡터 필드",
                role: "Core",
                description: "방향과 힘을 가진 선이나 화살표 흐름으로 보이지 않는 장을 표현",
                visual: "",
                build: ["Canvas", "SVG"],
                goodWith: ["Flow Field", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Flow Field",
                koName: "플로우 필드",
                role: "Core",
                description: "알고리즘적 흐름을 따라 선이나 입자가 이동하는 생성형 그래픽",
                visual: "유동적 선 흐름 · 알고리즘 감각 · 동적 패턴",
                build: ["Canvas", "WebGL"],
                goodWith: ["Monoline", "Procedural Lines", "Vector Field"],
                avoidWith: [],
                promptFragment: "algorithmic flow field with lines or particles following invisible vector forces",
                pending: false
              },
              {
                name: "Waveform",
                koName: "웨이브폼",
                role: "Core",
                description: "파동, 소리, 신호, 에너지의 흐름을 선형 또는 추상 곡선으로 표현",
                visual: "",
                build: ["SVG", "Canvas", "CSS"],
                goodWith: ["Glow", "Limited Palette", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Orbital System",
                koName: "궤도 시스템",
                role: "Core",
                description: "중심과 주변 궤도, 회전 관계를 이용해 시스템을 표현",
                visual: "",
                build: ["SVG", "Canvas", "CSS"],
                goodWith: ["Glow", "Monoline", "Radial"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Radial System",
                koName: "방사형 시스템",
                role: "Core",
                description: "중심에서 바깥으로 퍼지는 원형 또는 방사형 구조",
                visual: "",
                build: ["SVG", "Canvas"],
                goodWith: ["Monoline", "Radial"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Spiral System",
                koName: "나선형 시스템",
                role: "Core",
                description: "성장, 반복, 순환, 복잡성을 나선 형태로 표현",
                visual: "",
                build: ["SVG", "Canvas"],
                goodWith: ["Limited Palette", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Topographic Lines",
                koName: "지형 등고선",
                role: "Core",
                description: "선의 간격과 형태로 높낮이, 흐름, 표면 구조를 표현",
                visual: "등고선 · 지형적 흐름 · 데이터 표면",
                build: ["SVG", "Canvas"],
                goodWith: ["Limited Palette", "Monoline", "Topographic Pattern"],
                avoidWith: [],
                promptFragment: "topographic contour lines forming an abstract data landscape",
                pending: false
              },
              {
                name: "Voronoi Cells",
                koName: "보로노이 셀",
                role: "Core",
                description: "점 사이의 거리 관계로 분할된 세포형 패턴",
                visual: "",
                build: ["Canvas", "SVG", "WebGL"],
                goodWith: ["Limited Palette", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Crystalline Structure",
                koName: "결정 구조",
                role: "Core",
                description: "결정처럼 각진 면, 반복적 격자, 기하학적 성장 패턴",
                visual: "",
                build: ["Three.js", "SVG"],
                goodWith: ["Glass Material", "Metallic Material"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Fractal Form",
                koName: "프랙탈 형태",
                role: "Core",
                description: "작은 구조가 반복되어 큰 구조를 이루는 자기유사적 패턴",
                visual: "",
                build: ["Canvas", "WebGL"],
                goodWith: ["Limited Palette", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Parametric Surface",
                koName: "파라메트릭 표면",
                role: "Core",
                description: "수학적 파라미터로 생성된 곡면, 격자, 유동적 표면",
                visual: "",
                build: ["Three.js", "WebGL"],
                goodWith: ["Glass Material", "Glow", "Metallic Material"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Procedural Lines",
                koName: "절차적 선",
                role: "Support",
                description: "알고리즘 규칙에 따라 생성된 반복적이거나 유기적인 선",
                visual: "",
                build: ["Canvas", "SVG"],
                goodWith: ["Flow Field", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "va-part-2",
    number: 2,
    label: "구조",
    description: "어떤 시점과 배치로 보여주는가",
    type: "visual-asset",
    count: 56,
    categories: [
      {
        id: "va-cat-10",
        number: 10,
        name: "Projection & Structural View",
        subtitle: "시점·투영",
        definition: "대상을 어떤 시점과 투영으로 보여줄지 정하는 공간 표현입니다. 아이소메트릭, 정투영, 단면 등이 포함됩니다.",
        count: 25,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Isometric",
                koName: "아이소메트릭",
                role: "Core",
                description: "세 축이 동일한 비율로 보이는 등각 투영",
                visual: "입체 구조 · 원근 왜곡 적음 · 시스템 설명에 적합",
                build: ["SVG", "Three.js", "CSS"],
                goodWith: ["Flat Fill", "Isometric Illustration", "Technical Line"],
                avoidWith: [],
                promptFragment: "isometric projection showing structured layers without dramatic perspective distortion",
                pending: false
              },
              {
                name: "Axonometric",
                koName: "축측 투영",
                role: "Scaffold",
                description: "원근감 없이 여러 축을 기준으로 입체를 보여주는 투영 상위 범주",
                visual: "",
                build: ["SVG"],
                goodWith: ["Isometric", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Orthographic",
                koName: "정투영",
                role: "Core",
                description: "대상의 한 면을 왜곡 없이 평면적으로 보여주는 기술 제도식 투영",
                visual: "도면식 정면 · 치수 정확성 · 차분한 구조",
                build: ["SVG"],
                goodWith: ["Blueprint Line", "Measurement Diagram", "Technical Line"],
                avoidWith: [],
                promptFragment: "orthographic technical view with no perspective distortion",
                pending: false
              },
              {
                name: "Oblique Projection",
                koName: "사투영",
                role: "Support",
                description: "정면 비율을 유지하고 깊이 축을 비스듬히 표현하는 투영",
                visual: "",
                build: ["SVG"],
                goodWith: ["Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Eye Level",
                koName: "아이 레벨",
                role: "Core",
                description: "시선 높이 정면 앵글. 친근하고 자연스러운 기본값",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Centered", "Realistic", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Bird's Eye View",
                koName: "조감/탑다운",
                role: "Core",
                description: "직하방/고각 시점. 전체 구조/패턴. 음식 촬영 포함",
                visual: "",
                build: ["Image(gen)", "SVG"],
                goodWith: ["Centered", "Grid-Based"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Worm's Eye View",
                koName: "극저각",
                role: "Support",
                description: "극저각 올려보기. 위압감, 장대함, 건축 스케일",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Full Bleed", "Hard Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Aerial/Drone",
                koName: "항공/드론",
                role: "Support",
                description: "항공 촬영 시점. 도시/자연 패턴, 넓은 스케일",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Deep Focus", "Full Bleed"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Over-the-Shoulder",
                koName: "어깨 너머",
                role: "Support",
                description: "어깨 너머 시점. 맥락 속 피사체, 앱 사용 장면",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Shallow Depth of Field"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "One-Point Perspective",
                koName: "1점 투시",
                role: "Support",
                description: "단일 소실점. 터널, 복도의 깊이감과 집중 유도",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Full Bleed", "High Contrast"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Flat (2D)",
                koName: "2D 평면",
                role: "Core",
                description: "깊이감 없는 완전 평면. 아이콘, 패턴, UI 요소 기본",
                visual: "",
                build: ["SVG", "CSS"],
                goodWith: ["Flat Fill", "Grid-Based", "Monoline"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Plan View",
                koName: "평면도",
                role: "Core",
                description: "대상을 위에서 내려다본 도면식 시점",
                visual: "",
                build: ["SVG"],
                goodWith: ["Blueprint Line", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Elevation View",
                koName: "입면도",
                role: "Support",
                description: "대상의 정면이나 측면을 수직 투영으로 보여주는 도면식 표현",
                visual: "",
                build: ["SVG"],
                goodWith: ["Orthographic", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Top-down View",
                koName: "탑다운 뷰",
                role: "Core",
                description: "대상을 수직으로 내려다보는 시점. 지도, 데이터 맵에 적합",
                visual: "",
                build: ["SVG", "Canvas"],
                goodWith: ["Bird's Eye View", "Grid-Based"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cutaway View",
                koName: "컷어웨이 뷰",
                role: "Core",
                description: "대상의 일부를 잘라내 내부 구조를 동시에 보여주는 설명형 시각화",
                visual: "내부 구조 노출 · 설명형 절단면 · 교육적 명료함",
                build: ["SVG", "Hybrid"],
                goodWith: ["Annotation Diagram", "Cross-section View", "Technical Illustration"],
                avoidWith: [],
                promptFragment: "cutaway view revealing internal layers and hidden structure",
                pending: false
              },
              {
                name: "Cross-section View",
                koName: "단면도",
                role: "Core",
                description: "대상을 특정 평면으로 절단해 내부 단면 구조를 보여주는 표현",
                visual: "",
                build: ["SVG"],
                goodWith: ["Cutaway View", "Hatching", "Technical Illustration"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Exploded View",
                koName: "분해도",
                role: "Core",
                description: "부품을 분리해 띄워놓음으로써 조립 구조와 관계를 보여줌",
                visual: "분리된 부품 · 조립 구조 · 제품 내부 로직",
                build: ["SVG", "Three.js"],
                goodWith: ["Annotation Diagram", "Isometric", "Technical Illustration"],
                avoidWith: [],
                promptFragment: "exploded view with separated components and clear assembly relationships",
                pending: false
              },
              {
                name: "X-ray View",
                koName: "엑스레이 뷰",
                role: "Core",
                description: "외부를 투과해 내부 구조가 보이는 것처럼 표현",
                visual: "",
                build: ["SVG"],
                goodWith: ["Monochrome", "Transparent View", "Wireframe Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Transparent View",
                koName: "투명 뷰",
                role: "Core",
                description: "외피나 표면을 반투명하게 처리해 내부 레이어를 드러냄",
                visual: "겹쳐 보이는 내부 · 반투명 레이어 · 시스템 투시",
                build: ["SVG", "CSS", "Three.js"],
                goodWith: ["Frosted Glass Material", "X-ray View"],
                avoidWith: [],
                promptFragment: "transparent layered view revealing internal systems through translucent surfaces",
                pending: false
              },
              {
                name: "Macro View",
                koName: "매크로 뷰",
                role: "Support",
                description: "대상을 매우 가까이 확대해 질감, 구조, 세부 형태를 강조",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Detailed", "Shallow Depth of Field"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Microscopic View",
                koName: "현미경 뷰",
                role: "Support",
                description: "미세 구조, 세포, 입자, 재료 패턴을 현미경처럼 확대",
                visual: "",
                build: ["Image(gen)", "Canvas"],
                goodWith: ["Point Cloud", "Voronoi Cells"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Topographic View",
                koName: "지형도식 뷰",
                role: "Core",
                description: "등고선과 고도 정보를 중심으로 지형이나 표면 구조를 표현",
                visual: "",
                build: ["SVG", "Canvas"],
                goodWith: ["Monoline", "Topographic Lines", "Topographic Pattern"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Shallow Depth of Field",
                koName: "얕은 심도",
                role: "Core",
                description: "피사체 선명 + 배경 블러(보케). 주제 분리",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Bokeh", "Soft Light"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Deep Focus",
                koName: "딥 포커스",
                role: "Support",
                description: "전경~배경 모두 선명. 정보 전달 목적",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Crisp/Clean", "Landscape Photography"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Tilt-Shift",
                koName: "틸트시프트",
                role: "Niche",
                description: "선택적 블러 미니어처 효과",
                visual: "",
                build: ["Image(gen)"],
                goodWith: ["Bird's Eye View", "Blur"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-11",
        number: 11,
        name: "Diagrammatic Representation",
        subtitle: "다이어그램",
        definition: "구조와 관계를 설명하기 위한 도식·다이어그램 형식입니다. 시스템, 플로우, 네트워크 등을 시각화합니다.",
        count: 19,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Schematic Diagram",
                koName: "스키매틱 다이어그램",
                role: "Core",
                description: "구성 요소와 관계를 단순화해 보여주는 구조 중심 다이어그램",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Technical Diagram",
                koName: "테크니컬 다이어그램",
                role: "Scaffold",
                description: "기술적 대상의 구조와 원리를 설명하는 넓은 범주의 다이어그램",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Blueprint Diagram",
                koName: "블루프린트 다이어그램",
                role: "Core",
                description: "청사진처럼 치수선, 보조선, 설계선으로 구성된 설계도형 다이어그램",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "System Diagram",
                koName: "시스템 다이어그램",
                role: "Scaffold",
                description: "여러 구성 요소와 상호작용을 하나의 시스템으로 보여주는 관계 그래픽",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Process Diagram",
                koName: "프로세스 다이어그램",
                role: "Core",
                description: "단계, 순서, 절차를 시각적으로 정리한 다이어그램",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Flow Diagram",
                koName: "플로우 다이어그램",
                role: "Core",
                description: "입력, 처리, 출력, 분기 등 흐름의 방향성을 표현",
                visual: "방향성 · 절차 · 입출력 흐름",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "clear flow diagram showing input, process, output, and directional movement",
                pending: false
              },
              {
                name: "Network Diagram",
                koName: "네트워크 다이어그램",
                role: "Core",
                description: "노드와 연결선으로 관계망, 연결 구조를 표현",
                visual: "노드와 선 · 관계망 · 연결 구조",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "network diagram with sparse nodes, clean connection lines, and readable clusters",
                pending: false
              },
              {
                name: "Node-link Diagram",
                koName: "노드-링크 다이어그램",
                role: "Core",
                description: "점과 선을 이용해 개체와 관계를 추상적으로 표현",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Circuit Diagram",
                koName: "회로 다이어그램",
                role: "Core",
                description: "전기 회로나 논리 구조를 기호와 연결선으로 표현",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Architecture Diagram",
                koName: "아키텍처 다이어그램",
                role: "Core",
                description: "소프트웨어, 서비스, 인프라 구성 요소의 구조를 보여줌",
                visual: "시스템 구성 · 모듈 관계 · 기술 제품 설명",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "clean software architecture diagram with modular blocks and clear connection logic",
                pending: false
              },
              {
                name: "Pipeline Diagram",
                koName: "파이프라인 다이어그램",
                role: "Core",
                description: "데이터, 작업, 생산 과정이 단계적으로 이동하는 구조",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Stack Diagram",
                koName: "스택 다이어그램",
                role: "Core",
                description: "여러 계층이나 레이어가 쌓인 구조를 표현",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Layer Diagram",
                koName: "레이어 다이어그램",
                role: "Core",
                description: "시스템, 정보, 시각 요소의 층위를 분리해 보여줌",
                visual: "층위 구조 · 스택 · 시스템 분해",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "layer diagram separating system levels into clear stacked visual hierarchy",
                pending: false
              },
              {
                name: "Component Diagram",
                koName: "컴포넌트 다이어그램",
                role: "Core",
                description: "부품, 모듈, 구성 요소의 관계와 역할을 보여줌",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Annotation Diagram",
                koName: "주석 다이어그램",
                role: "Core",
                description: "대상 주변에 라벨, 선, 설명을 붙여 세부 정보를 설명",
                visual: "콜아웃 · 라벨 · 설명선",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "annotation diagram with precise callout lines and minimal explanatory labels",
                pending: false
              },
              {
                name: "Measurement Diagram",
                koName: "측정 다이어그램",
                role: "Core",
                description: "치수선, 각도, 스케일, 비율을 강조해 구조를 설명",
                visual: "치수선 · 각도 표시 · 스펙시트 느낌",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "measurement diagram with dimension lines, angle marks, and scale indicators",
                pending: false
              },
              {
                name: "Spec Sheet Illustration",
                koName: "스펙시트 일러스트",
                role: "Core",
                description: "제품이나 시스템의 사양을 도면과 라벨로 정리한 설명형 그래픽",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Taxonomy Map",
                koName: "택소노미 맵",
                role: "Support",
                description: "개념, 카테고리, 키워드의 분류 구조를 시각적으로 보여줌",
                visual: "분류 구조 · 계층 · 개념 지도",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "taxonomy map showing hierarchical categories with clean branches and readable structure",
                pending: false
              },
              {
                name: "Constellation Diagram",
                koName: "별자리형 다이어그램",
                role: "Core",
                description: "분산된 노드가 별자리처럼 연결되어 관계와 군집을 표현",
                visual: "",
                build: ["SVG", "Hybrid"],
                goodWith: ["Limited Palette", "Monoline", "Technical Line"],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-12",
        number: 12,
        name: "Composition & Framing",
        subtitle: "구도·프레이밍",
        definition: "화면 안에서 요소를 배치하고 잘라내는 구도 규칙입니다.",
        count: 12,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Centered",
                koName: "중앙 배치",
                role: "Core",
                description: "피사체 프레임 정중앙. 안정감, 대칭, 포멀",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Rule of Thirds",
                koName: "3분할 법칙",
                role: "Core",
                description: "3분할 교차점 배치. 자연스러운 시선 흐름",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Asymmetric",
                koName: "비대칭",
                role: "Support",
                description: "의도적 비대칭. 긴장감, 동적, 현대적",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Diagonal",
                koName: "대각선 배치",
                role: "Support",
                description: "대각선 축 배치. 움직임, 에너지, 역동성",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Radial",
                koName: "방사형 배치",
                role: "Niche",
                description: "중심에서 방사형. 집중, 폭발, 만다라",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Negative Space",
                koName: "여백",
                role: "Core",
                description: "의도적 빈 공간. 여백이 메시지",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Tight Crop",
                koName: "타이트 크롭",
                role: "Support",
                description: "프레임까지 꽉 참. 밀도감, 임팩트",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Full Bleed",
                koName: "풀 블리드",
                role: "Core",
                description: "여백 없이 가장자리까지 확장. 몰입감",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Frame-in-Frame",
                koName: "프레임 인 프레임",
                role: "Support",
                description: "프레임 안의 프레임. 창문, 아치로 깊이와 맥락 부여",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Seamless Pattern",
                koName: "심리스 패턴",
                role: "Core",
                description: "이음새 없이 반복 타일. 배경, 텍스타일, 브랜드 패턴",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Grid-Based",
                koName: "그리드 기반",
                role: "Core",
                description: "균등 격자 안에 요소 배치. 질서, 체계",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Layered/Overlap",
                koName: "레이어드/겹침",
                role: "Support",
                description: "요소 겹쳐 쌓인 구성. 깊이감, 콜라주적 풍부함",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "va-part-3",
    number: 3,
    label: "표면",
    description: "선·음영·색·질감·효과를 어떻게 처리하는가",
    type: "visual-asset",
    count: 118,
    categories: [
      {
        id: "va-cat-13",
        number: 13,
        name: "Linework & Stroke",
        subtitle: "선 처리",
        definition: "선의 굵기, 질감, 성격을 정하는 선 처리 방식입니다.",
        count: 14,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Monoline",
                koName: "모노라인",
                role: "Core",
                description: "모든 선이 동일한 굵기로 유지되는 균일하고 정돈된 선",
                visual: "균일한 선 굵기 · 정돈된 구조 · 미니멀한 인상",
                build: ["SVG", "CSS"],
                goodWith: [],
                avoidWith: ["Collage Illustration"],
                promptFragment: "clean monoline strokes with consistent stroke width and refined spacing",
                pending: false
              },
              {
                name: "Hairline",
                koName: "헤어라인",
                role: "Core",
                description: "매우 가늘고 섬세한 선으로 정밀하고 고급스러운 인상",
                visual: "아주 얇은 선 · 섬세한 고급감 · 정밀한 구조",
                build: ["SVG"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "ultra-fine hairline strokes, refined precision, generous negative space",
                pending: false
              },
              {
                name: "Outline Drawing",
                koName: "아웃라인 드로잉",
                role: "Core",
                description: "대상의 외곽선을 중심으로 형태를 정의하는 선 기반 표현",
                visual: "",
                build: ["SVG"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Contour Line",
                koName: "컨투어 라인",
                role: "Core",
                description: "대상의 외곽이나 형태 흐름을 따라 구조와 부피를 암시하는 선",
                visual: "",
                build: ["SVG"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Continuous Line",
                koName: "연속선 드로잉",
                role: "Support",
                description: "선을 거의 끊지 않고 하나의 흐름으로 대상을 그림",
                visual: "",
                build: ["SVG"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Clean Vector Line",
                koName: "클린 벡터 라인",
                role: "Core",
                description: "벡터 기반의 매끄럽고 정제된 선. 디지털 그래픽에 적합",
                visual: "매끄러운 곡선 · 정제된 디지털 인상 · 확장 가능한 벡터 느낌",
                build: ["SVG"],
                goodWith: [],
                avoidWith: ["Charcoal Drawing", "Collage Illustration"],
                promptFragment: "smooth clean vector linework with polished digital edges",
                pending: false
              },
              {
                name: "Hand-drawn Line",
                koName: "핸드드로잉 라인",
                role: "Support",
                description: "손으로 그린 듯한 불균일한 흔들림과 자연스러운 필압",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: [],
                avoidWith: ["Geometric Illustration"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Rough Ink Line",
                koName: "거친 잉크 라인",
                role: "Support",
                description: "잉크의 번짐, 끊김, 거친 가장자리가 드러나는 질감 있는 선",
                visual: "",
                build: ["SVG", "Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Technical Line",
                koName: "테크니컬 라인",
                role: "Core",
                description: "제도, 설계, 측정에 적합한 정밀하고 기능적인 선",
                visual: "제도선 · 측정선 · 설계도 느낌",
                build: ["SVG"],
                goodWith: [],
                avoidWith: ["Blob Shape", "Liquid Gradient"],
                promptFragment: "functional technical linework with precise guides and measurement logic",
                pending: false
              },
              {
                name: "Blueprint Line",
                koName: "블루프린트 라인",
                role: "Core",
                description: "청사진이나 설계도처럼 얇고 정밀한 보조선, 치수선 느낌",
                visual: "청사진 느낌 · 보조선 · 기술적 차가움",
                build: ["SVG", "CSS"],
                goodWith: [],
                avoidWith: ["Blob Shape", "Children's Book Illustration", "Clay Render", "Claymation", "Frutiger Aero", "Ink Wash", "Liquid Gradient", "Mesh Gradient", "Watercolor"],
                promptFragment: "blueprint-like thin guide lines, dimension marks, and precise construction details",
                pending: false
              },
              {
                name: "Engraved Line",
                koName: "인그레이빙 라인",
                role: "Core",
                description: "판에 새긴 듯한 날카롭고 반복적인 선으로 음영과 장식성을 만듦",
                visual: "",
                build: ["SVG"],
                goodWith: [],
                avoidWith: ["Aurora Gradient", "Clay Render", "Cut-paper Illustration", "Frosted Glass Material", "Iridescent Material", "Low-poly", "Metaball", "Translucent Material"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Wireframe Line",
                koName: "와이어프레임 라인",
                role: "Core",
                description: "3D 구조의 골격이나 면의 경계를 선만으로 표현",
                visual: "",
                build: ["SVG", "Three.js"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Dashed Line",
                koName: "파선",
                role: "Support",
                description: "끊어진 선을 사용해 경로, 숨은 구조, 보조 관계를 표현",
                visual: "",
                build: ["SVG", "CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Dotted Line",
                koName: "도트 라인",
                role: "Support",
                description: "작은 점들의 연속으로 선을 구성해 연결감이나 보조 정보를 표현",
                visual: "",
                build: ["SVG", "CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-14",
        number: 14,
        name: "Tone & Shading",
        subtitle: "톤·음영",
        definition: "명암과 음영을 만드는 톤 처리 방식입니다. 해칭, 하프톤, 그라디언트 등이 있습니다.",
        count: 12,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Hatching",
                koName: "해칭",
                role: "Core",
                description: "평행선을 반복해 명암과 밀도를 표현하는 음영 기법",
                visual: "선 밀도 명암 · 고전적 음영 · 세밀한 깊이",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "subtle hatching lines to build tone and engraved depth",
                pending: false
              },
              {
                name: "Cross-hatching",
                koName: "크로스해칭",
                role: "Core",
                description: "서로 교차하는 선을 겹쳐 깊은 음영과 질감을 만듦",
                visual: "깊은 음영 · 판화적 밀도 · 고전적 텍스처",
                build: [],
                goodWith: [],
                avoidWith: ["Aurora Gradient", "Clay Render", "Cut-paper Illustration", "Flat Design", "Flat Vector Illustration", "Frosted Glass Material", "Glass Material", "Iconography", "Metaball", "Sticker Art", "Translucent Material"],
                promptFragment: "dense cross-hatching with refined engraved tonal depth",
                pending: false
              },
              {
                name: "Stippling",
                koName: "스티플링",
                role: "Core",
                description: "작은 점들의 밀도 차이로 명암과 질감을 만드는 점묘 기반 음영",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Halftone Shading",
                koName: "하프톤 음영",
                role: "Core",
                description: "인쇄 망점처럼 점의 크기나 간격으로 톤을 분해해 표현",
                visual: "망점 톤 · 인쇄물 감성 · 레트로 팝",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "halftone dot shading with print-inspired tonal breakdown",
                pending: false
              },
              {
                name: "Screentone",
                koName: "스크린톤",
                role: "Support",
                description: "만화나 인쇄물에서 쓰이는 반복 점, 선, 패턴 톤",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Dithered Shading",
                koName: "디더링 음영",
                role: "Core",
                description: "제한된 색상이나 픽셀 패턴으로 중간 톤을 만듦",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ink Wash Shading",
                koName: "잉크 워시 음영",
                role: "Support",
                description: "묽은 잉크의 농담, 번짐, 층을 이용해 부드러운 명암",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Gradient Shading",
                koName: "그라디언트 음영",
                role: "Support",
                description: "색상이나 명도가 부드럽게 변하는 그라디언트로 입체감 표현",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: ["Cel Shading", "Pixel Art", "Screenprint"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Flat Fill",
                koName: "플랫 필",
                role: "Core",
                description: "음영 없이 단일 색면으로 형태를 채우는 간결한 표현",
                visual: "단순 색면 · 명확한 형태 · 가벼운 UI 친화성",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "flat color fills with simple geometric clarity and no complex shading",
                pending: false
              },
              {
                name: "Soft Shading",
                koName: "소프트 셰이딩",
                role: "Support",
                description: "부드러운 명암 변화와 낮은 경계감으로 입체감을 만듦",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: ["Digital Brutalism"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Contour Shading",
                koName: "컨투어 음영",
                role: "Support",
                description: "형태의 굴곡을 따라가는 선이나 톤으로 구조를 표현",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Chiaroscuro",
                koName: "키아로스쿠로",
                role: "Niche",
                description: "강한 명암 대비로 극적인 깊이와 입체감을 만드는 고전적 음영",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-15",
        number: 15,
        name: "Color Treatment",
        subtitle: "색 운용",
        definition: "색을 제한하고 조정하는 색 운용 규칙입니다. 모노크롬, 듀오톤, 제한 팔레트 등으로 결과의 톤을 좌우합니다.",
        count: 17,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Monochrome",
                koName: "모노크롬",
                role: "Core",
                description: "단일 색상 명도 변화만으로 구성. 흑백 포함",
                visual: "절제된 색 · 고급감 · 형태 중심",
                build: [],
                goodWith: [],
                avoidWith: ["Frutiger Aero"],
                promptFragment: "monochrome palette using one ink color and tonal variation only",
                pending: false
              },
              {
                name: "Duotone",
                koName: "듀오톤",
                role: "Core",
                description: "2색으로 하이라이트/섀도우 분리. 모던하고 강렬",
                visual: "두 색 대비 · 모던한 임팩트 · 브랜드 컬러 통일",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "controlled duotone color treatment with strong yet minimal contrast",
                pending: false
              },
              {
                name: "Tritone",
                koName: "트리톤",
                role: "Support",
                description: "3색 톤 구성. Duotone보다 풍부하면서 제한적",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Limited Palette",
                koName: "제한 팔레트",
                role: "Core",
                description: "의도적 3~5색. 절제, 브랜드 일관성",
                visual: "브랜드 일관성 · 절제된 조합 · 시스템화된 색",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "limited palette with restrained brand colors and clear hierarchy",
                pending: false
              },
              {
                name: "Full Color",
                koName: "풀 컬러",
                role: "Core",
                description: "제한 없는 자연 풀컬러. 사진/리얼리스틱 기본값",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Halftone",
                koName: "하프톤 처리",
                role: "Core",
                description: "인쇄 도트 패턴으로 톤 시뮬레이션. 코믹/레트로/팝아트",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Gradient Map",
                koName: "그라디언트 맵",
                role: "Support",
                description: "명도값에 색상 매핑. 브랜드 컬러 통일 기법",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Desaturated",
                koName: "디새추레이티드",
                role: "Support",
                description: "채도 낮춘 처리. 차분하고 절제된 인상",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Inverted/Negative",
                koName: "반전/네거티브",
                role: "Niche",
                description: "색상 반전. 어두운 배경 + 밝은 피사체. 실험적",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Spot Color",
                koName: "별색 강조",
                role: "Support",
                description: "모노 위에 한 색만 강조. 시선 유도, 드라마틱",
                visual: "시선 유도 · 강조점 · 단정한 임팩트",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "mostly monochrome composition with a single restrained spot color accent",
                pending: false
              },
              {
                name: "Color Grading",
                koName: "컬러 그레이딩",
                role: "Core",
                description: "영화적 색보정. 틸/오렌지, 쿨/웜 시프트 톤 통일",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Pastel",
                koName: "파스텔",
                role: "Core",
                description: "높은 명도 + 낮은 채도. 부드럽고 친근",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: ["Blueprint", "Cyberpunk", "Digital Brutalism"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Neon/Vivid",
                koName: "네온/비비드",
                role: "Core",
                description: "극도로 높은 채도. 에너지, 나이트라이프, 게이밍",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Earth Tone",
                koName: "어스 톤",
                role: "Support",
                description: "갈색, 올리브, 테라코타. 자연, 오가닉, 크래프트",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Muted",
                koName: "뮤티드",
                role: "Support",
                description: "중간 채도. 탁하지만 세련. 스칸디나비안, 미니멀",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "High Contrast",
                koName: "고대비",
                role: "Support",
                description: "밝은/어두운 영역 극단 대비. 강렬, 드라마틱",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: ["Children's Book Illustration"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Sepia/Warm Cast",
                koName: "세피아/웜 캐스트",
                role: "Support",
                description: "갈색-황금 색조. 빈티지, 노스탤지어",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-16",
        number: 16,
        name: "Texture & Surface",
        subtitle: "질감·표면",
        definition: "종이결, 필름 그레인, 노이즈처럼 표면에 얹는 질감 오버레이입니다.",
        count: 26,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Paper Grain",
                koName: "종이 그레인",
                role: "Core",
                description: "종이 섬유와 미세한 표면 입자가 보이는 자연스러운 종이 질감",
                visual: "종이 섬유 · 아날로그 감성 · 따뜻한 표면",
                build: ["SVG Filter", "CSS", "Image(gen)"],
                goodWith: [],
                avoidWith: ["Chrome Material", "Cyberpunk", "Glass Material", "Glossy Finish", "Holographic Material", "Metallic Material", "Particle Field", "Synthwave", "Vaporwave", "Y2K Futurism"],
                promptFragment: "subtle paper grain texture with tactile editorial warmth",
                pending: false
              },
              {
                name: "Archival Paper Texture",
                koName: "아카이브 종이 질감",
                role: "Core",
                description: "오래된 문서, 박물관 자료처럼 고전적인 종이 표면감",
                visual: "",
                build: ["Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Blueprint Paper Texture",
                koName: "블루프린트 종이 질감",
                role: "Core",
                description: "청사진 종이처럼 기술적이고 차가운 표면 질감",
                visual: "",
                build: ["CSS", "Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Newsprint Texture",
                koName: "신문지 질감",
                role: "Support",
                description: "얇은 종이, 잉크 번짐, 낮은 인쇄 품질의 신문 인쇄 질감",
                visual: "",
                build: ["Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Risograph Grain",
                koName: "리소그래프 그레인",
                role: "Core",
                description: "리소 인쇄 특유의 거친 입자, 색 번짐, 어긋난 인쇄 질감",
                visual: "",
                build: ["Image(gen)", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Screenprint Texture",
                koName: "실크스크린 질감",
                role: "Core",
                description: "색면이 층으로 찍힌 듯한 가장자리, 잉크 두께, 수작업 인쇄감",
                visual: "",
                build: ["Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Halftone Texture",
                koName: "하프톤 질감",
                role: "Core",
                description: "인쇄 망점이 표면 전체에 드러나는 점 기반 텍스처",
                visual: "",
                build: ["SVG Filter", "CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Noise Texture",
                koName: "노이즈 텍스처",
                role: "Core",
                description: "무작위 입자나 픽셀을 더해 디지털 표면의 밋밋함을 줄이는 질감",
                visual: "",
                build: ["SVG Filter", "CSS", "Canvas"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Film Grain",
                koName: "필름 그레인",
                role: "Core",
                description: "아날로그 필름처럼 미세한 입자와 불균일한 표면감",
                visual: "",
                build: ["CSS", "SVG Filter", "Image(gen)"],
                goodWith: [],
                avoidWith: ["Cel Shading", "Flat Design", "Flat Vector Illustration", "Iconography", "Infographic", "Isometric Illustration", "Sticker Art", "Toon Render", "Vector Illustration", "Wireframe Render"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Digital Noise",
                koName: "디지털 노이즈",
                role: "Support",
                description: "디지털 랜덤 픽셀 노이즈. 균일하고 차가움",
                visual: "",
                build: ["CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Grain Gradient",
                koName: "그레인 그라디언트",
                role: "Core",
                description: "그라데이션에 미세 입자. 플랫에 깊이감 추가",
                visual: "",
                build: ["CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Distressed/Grunge",
                koName: "디스트레스드/그런지",
                role: "Support",
                description: "긁힘, 얼룩, 마모 흔적. 거칠고 날것",
                visual: "",
                build: ["Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ink Bleed",
                koName: "잉크 번짐",
                role: "Core",
                description: "잉크가 종이에 스며들며 가장자리가 퍼지는 듯한 표현",
                visual: "",
                build: ["Image(gen)", "SVG Filter"],
                goodWith: [],
                avoidWith: ["Chrome Material", "Flat Vector Illustration", "Geometric Illustration", "Infographic", "Isometric Illustration", "Low-poly", "Technical Illustration", "Vector Illustration", "Voxel"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ink Smudge",
                koName: "잉크 얼룩",
                role: "Support",
                description: "손이나 도구에 의해 잉크가 문질러진 듯한 얼룩",
                visual: "",
                build: ["Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Embossed Surface",
                koName: "엠보싱 표면",
                role: "Support",
                description: "표면이 위로 돌출된 듯한 입체적 압각 질감",
                visual: "",
                build: ["CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: ["Flat Design"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Debossed Surface",
                koName: "디보싱 표면",
                role: "Support",
                description: "표면이 안쪽으로 눌린 듯한 음각 질감",
                visual: "",
                build: ["CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Matte Paper",
                koName: "매트 종이",
                role: "Core",
                description: "빛 반사가 적고 부드러운 촉감의 무광 종이 표면",
                visual: "",
                build: ["CSS"],
                goodWith: [],
                avoidWith: ["Glossy Finish"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Glossy Surface",
                koName: "글로시 표면",
                role: "Support",
                description: "빛을 강하게 반사하는 매끄럽고 광택 있는 표면",
                visual: "",
                build: ["CSS"],
                goodWith: [],
                avoidWith: ["Gouache", "Grainy Gradient", "Pencil Sketch", "Risograph", "Woodcut"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Misregistration",
                koName: "미스레지스트레이션",
                role: "Support",
                description: "색판 어긋남. 리소/스크린프린트 불완전 정합",
                visual: "",
                build: ["Image(gen)", "CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Brushed Metal",
                koName: "브러시드 메탈",
                role: "Support",
                description: "금속 표면을 한 방향으로 문지른 듯한 미세한 선형 질감",
                visual: "",
                build: ["CSS", "Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Acrylic Surface",
                koName: "아크릴 표면",
                role: "Support",
                description: "투명하거나 반투명한 플라스틱 계열의 매끄럽고 가벼운 표면",
                visual: "",
                build: ["CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Marble Texture",
                koName: "대리석 질감",
                role: "Support",
                description: "자연석의 불규칙한 결, 고급스러운 색 흐름, 단단한 표면감",
                visual: "",
                build: ["Image(gen)", "CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Concrete Texture",
                koName: "콘크리트 질감",
                role: "Support",
                description: "거칠고 미세한 입자, 무채색의 산업적 표면감",
                visual: "",
                build: ["Image(gen)", "CSS"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Fabric Texture",
                koName: "패브릭 질감",
                role: "Support",
                description: "직물의 짜임, 섬유, 부드러운 표면",
                visual: "",
                build: ["Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Holographic Foil",
                koName: "홀로그래픽 포일",
                role: "Core",
                description: "각도에 따라 무지갯빛이 변하는 얇은 금속박 같은 표면 효과",
                visual: "",
                build: ["CSS", "WebGL"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Pearlescent Surface",
                koName: "진주광 표면",
                role: "Core",
                description: "진주처럼 부드럽고 다층적인 색 반사가 나타나는 표면",
                visual: "",
                build: ["CSS", "WebGL"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-17",
        number: 17,
        name: "Pattern & Ornament",
        subtitle: "패턴·장식",
        definition: "반복 패턴과 장식 요소입니다. 배경이나 테두리에 리듬을 부여합니다.",
        count: 16,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Halftone Pattern",
                koName: "하프톤 패턴",
                role: "Core",
                description: "인쇄 망점처럼 점의 크기와 간격을 반복해 톤과 장식성을 만듦",
                visual: "반복 망점 · 인쇄감 · 레트로 질감",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "halftone pattern with controlled dot scale and print-like texture",
                pending: false
              },
              {
                name: "Dot Pattern",
                koName: "도트 패턴",
                role: "Core",
                description: "점을 반복적으로 배열해 리듬, 질감, 배경 장식을 만듦",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Line Pattern",
                koName: "라인 패턴",
                role: "Core",
                description: "선을 반복해 방향성, 밀도, 표면 질감을 만듦",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Checker Pattern",
                koName: "체커 패턴",
                role: "Support",
                description: "격자형 사각 패턴으로 대비와 리듬감을 만듦",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Grid Pattern",
                koName: "그리드 패턴",
                role: "Core",
                description: "그래픽 배경이나 표면 장식으로 쓰이는 격자 패턴",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Blueprint Grid Pattern",
                koName: "블루프린트 그리드 패턴",
                role: "Core",
                description: "설계도 배경처럼 정밀한 격자와 보조선을 가진 기술적 패턴",
                visual: "설계도 배경 · 정밀 격자 · 보조선",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "subtle blueprint grid pattern with fine construction guides",
                pending: false
              },
              {
                name: "Wave Pattern",
                koName: "웨이브 패턴",
                role: "Core",
                description: "반복되는 파형 선이나 면으로 흐름과 유동성을 표현",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Topographic Pattern",
                koName: "지형도 패턴",
                role: "Core",
                description: "등고선이 반복되어 지형, 데이터, 표면의 흐름을 암시",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Hatch Pattern",
                koName: "해치 패턴",
                role: "Core",
                description: "평행선 또는 교차선을 반복해 밀도와 음영감을 만듦",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Circuit Pattern",
                koName: "회로 패턴",
                role: "Core",
                description: "회로 기판처럼 선과 노드가 반복되는 기술적 장식 패턴",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Pixel Pattern",
                koName: "픽셀 패턴",
                role: "Core",
                description: "작은 사각 픽셀 단위가 반복되어 디지털 질감이나 레트로 감성을 만듦",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: ["Anatomical Illustration"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Guilloche Pattern",
                koName: "기요셰 패턴",
                role: "Core",
                description: "지폐나 보안 인쇄물처럼 정교한 곡선이 반복되는 장식 패턴",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Moiré Pattern",
                koName: "무아레 패턴",
                role: "Core",
                description: "두 패턴이 겹치며 생기는 간섭 무늬로 광학적 긴장감을 만듦",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Ornamental Border",
                koName: "장식 테두리",
                role: "Niche",
                description: "이미지나 영역의 가장자리를 장식하는 반복적 프레임 그래픽",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Corner Ornament",
                koName: "코너 장식",
                role: "Niche",
                description: "프레임이나 박스의 모서리에 배치되는 장식 그래픽 요소",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Divider Ornament",
                koName: "디바이더 장식",
                role: "Niche",
                description: "콘텐츠나 영역 사이를 나누는 장식적 구분선 그래픽",
                visual: "",
                build: ["SVG", "CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-18",
        number: 18,
        name: "Optical Effect",
        subtitle: "광학 효과",
        definition: "글로우, 글리치, 굴절처럼 빛과 렌즈를 흉내 내는 후처리 효과입니다.",
        count: 12,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Glow",
                koName: "글로우",
                role: "Core",
                description: "빛이 주변으로 퍼지는 듯한 발광 효과",
                visual: "발광 · 미래감 · 시선 집중",
                build: ["CSS", "SVG Filter", "Canvas"],
                goodWith: [],
                avoidWith: ["Engraving", "Ink Drawing", "Letterpress", "Linocut"],
                promptFragment: "subtle controlled glow used as a precise highlight, not excessive decoration",
                pending: false
              },
              {
                name: "Bloom",
                koName: "블룸",
                role: "Support",
                description: "강한 빛이 화면에서 번져 밝은 영역이 부드럽게 확산",
                visual: "",
                build: ["CSS", "Canvas", "WebGL"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Blur",
                koName: "블러",
                role: "Support",
                description: "형태를 흐리게 만들어 깊이감, 속도감, 비초점 효과",
                visual: "부드러운 깊이 · 비초점 · 층 분리",
                build: ["CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: ["Engraving", "Pixel Art", "Screenprint", "Woodcut"],
                promptFragment: "soft blur for atmospheric separation and subtle depth",
                pending: false
              },
              {
                name: "Lens Flare",
                koName: "렌즈 플레어",
                role: "Niche",
                description: "카메라 렌즈에 강한 빛이 들어올 때 생기는 빛 번짐",
                visual: "",
                build: ["Canvas", "Image(gen)"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Chromatic Aberration",
                koName: "색수차",
                role: "Core",
                description: "RGB 색상이 살짝 어긋나며 렌즈 왜곡이나 디지털 감각을 만듦",
                visual: "",
                build: ["CSS", "SVG Filter", "Canvas"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "RGB Split",
                koName: "RGB 분리",
                role: "Core",
                description: "빨강, 초록, 파랑 채널을 분리해 글리치나 전자적 왜곡",
                visual: "",
                build: ["CSS", "Canvas"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Scanline",
                koName: "스캔라인",
                role: "Core",
                description: "CRT나 오래된 디스플레이처럼 수평선이 반복되는 화면 질감",
                visual: "",
                build: ["CSS", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Glitch",
                koName: "글리치",
                role: "Core",
                description: "디지털 오류, 깨짐, 왜곡, 노이즈를 의도적으로 표현",
                visual: "디지털 오류 · 깨짐 · 긴장감",
                build: ["CSS", "Canvas", "SVG Filter"],
                goodWith: [],
                avoidWith: ["Anatomical Illustration", "Botanical Illustration", "Cartographic Illustration", "Children's Book Illustration", "Etching", "Gouache", "Lithograph", "Scientific Illustration", "Ukiyo-e", "Watercolor"],
                promptFragment: "controlled glitch distortion with digital artifacts, used sparingly",
                pending: false
              },
              {
                name: "Liquid Distortion",
                koName: "리퀴드 왜곡",
                role: "Core",
                description: "이미지가 액체 표면을 통과한 듯 휘어지고 흐르는 효과",
                visual: "",
                build: ["WebGL", "Canvas", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Noise Displacement",
                koName: "노이즈 디스플레이스먼트",
                role: "Core",
                description: "무작위 노이즈 값을 이용해 이미지나 선을 변형시키는 왜곡",
                visual: "",
                build: ["WebGL", "Canvas", "SVG Filter"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Refraction",
                koName: "굴절",
                role: "Core",
                description: "빛이 유리나 액체를 통과하며 뒤의 이미지가 휘어져 보이는 효과",
                visual: "빛의 휘어짐 · 프리미엄 깊이 · 유리/액체 감각",
                build: ["WebGL", "Three.js"],
                goodWith: [],
                avoidWith: ["Risograph"],
                promptFragment: "subtle refraction through glass or liquid, creating premium optical depth",
                pending: false
              },
              {
                name: "Caustics",
                koName: "카스틱스",
                role: "Niche",
                description: "물이나 유리 표면을 통과한 빛이 밝은 곡선 패턴으로 맺히는 광학 효과",
                visual: "",
                build: ["WebGL", "Three.js"],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-19",
        number: 19,
        name: "Subject Treatment",
        subtitle: "대상 처리",
        definition: "대상을 얼마나 사실적으로 또는 추상적으로 다룰지 정하는 추상화 정도입니다.",
        count: 8,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Realistic",
                koName: "사실적",
                role: "Core",
                description: "현실 그대로. 디테일, 질감, 비례 모두 실물",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Stylized",
                koName: "양식화",
                role: "Core",
                description: "현실 기반 과장/단순화. 캐릭터 일러스트, 마스코트",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Simplified",
                koName: "단순화",
                role: "Core",
                description: "핵심 형태만 남김. 아이콘, 인포그래픽 요소",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Geometric/Abstract",
                koName: "기하/추상",
                role: "Core",
                description: "기하 형태로 환원. 원, 삼각형, 사각형 조합",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Silhouette",
                koName: "실루엣",
                role: "Core",
                description: "외곽만 남긴 단색 형태. 최대 단순화",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Outline/Stroke-only",
                koName: "외곽선만",
                role: "Support",
                description: "외곽선만으로 형태. 내부 빈 상태",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Detailed",
                koName: "정교한/장식적",
                role: "Support",
                description: "장식적 디테일 풍부. 패턴, 문양",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Chibi",
                koName: "치비/SD",
                role: "Support",
                description: "과장 비율 (머리:몸 1:1~2). 극단적 귀여움",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      },
      {
        id: "va-cat-20",
        number: 20,
        name: "Mood & Atmosphere",
        subtitle: "빛·분위기",
        definition: "빛과 환경 요소로 최종 분위기를 만드는 처리입니다. 소프트 라이트, 골든 아워, 네온 글로우 등이 있습니다.",
        count: 13,
        groups: [
          {
            label: null,
            items: [
              {
                name: "Soft Light",
                koName: "소프트 라이트",
                role: "Core",
                description: "부드럽고 확산된 광원. 그림자 옅음. 편안한 인상",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: ["Digital Brutalism"],
                promptFragment: "",
                pending: true
              },
              {
                name: "Hard Light",
                koName: "하드 라이트",
                role: "Support",
                description: "강한 직사광. 선명한 그림자. 드라마틱",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Backlit/Rim Light",
                koName: "백라이트/림 라이트",
                role: "Support",
                description: "피사체 뒤 광원. 실루엣 가장자리 빛남. 극적 분리",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Golden Hour",
                koName: "골든아워",
                role: "Core",
                description: "일출/일몰 따뜻한 황금빛. 가장 따뜻한 자연광",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Blue Hour",
                koName: "블루아워",
                role: "Support",
                description: "일출 직전/일몰 직후 차가운 청색. 고요, 멜랑콜리",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Neon Glow",
                koName: "네온 글로우",
                role: "Core",
                description: "인공 네온 광원. 도시 야경, 나이트라이프",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Foggy/Hazy",
                koName: "안개/연무",
                role: "Support",
                description: "안개/연무. 원경 흐릿. 몽환적, 신비",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Crisp/Clean",
                koName: "크리스프/클린",
                role: "Core",
                description: "대기 효과 없는 선명. 깨끗하고 명료. UI 기본",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Bokeh",
                koName: "보케",
                role: "Core",
                description: "초점 밖 빛 원형 산란. 로맨틱, 축제, 나이트",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Cottagecore",
                koName: "코티지코어",
                role: "Support",
                description: "전원 로맨틱. 리넨, 들꽃, 베이킹, 자연광",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Dark Academia",
                koName: "다크 아카데미아",
                role: "Support",
                description: "트위드, 고서, 촛불, 가을 톤. 학구적 고전주의",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Liminal Space",
                koName: "리미널 스페이스",
                role: "Support",
                description: "빈 형광등 공간, 전이 공간의 언캐니 고요",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              },
              {
                name: "Solarpunk",
                koName: "솔라펑크",
                role: "Support",
                description: "녹색 유토피아. 아르누보 곡선 + 식물 건축 + 재생에너지",
                visual: "",
                build: [],
                goodWith: [],
                avoidWith: [],
                promptFragment: "",
                pending: true
              }
            ]
          }
        ]
      }
    ]
  }
];

/** 활용법 워크드 예제: 의도 -> 7축 -> 키워드 -> 출력 -> 프롬프트 -> 네거티브.
 *  prompt 는 11슬롯 도출, negative 는 충돌 합집합 + 저자 avoid. (derive.mjs) */

export const VISUAL_ASSET_RECIPES = [
  {
    id: "ai-saas-hero",
    title: "AI SaaS 히어로 그래픽",
    intent: "AI SaaS 랜딩 히어로 그래픽",
    subject: "Simplified system modules",
    facetFrame: {
      rendering: "Technical Illustration",
      perspective: "Isometric",
      color: "Limited Palette",
      texture: "Grainy Gradient or Blueprint Grid Pattern",
      composition: "Negative Space",
      subject: "Simplified system modules",
      mood: "Crisp"
    },
    keywords: ["Technical Illustration", "Monoline", "Architecture Diagram", "Blueprint Line", "Layer Diagram", "Limited Palette"],
    output: ["SVG", "Image(gen)", "Hybrid"],
    slots: {
      style: ["Technical Illustration"],
      view: ["Architecture Diagram", "Layer Diagram"],
      line: ["Monoline", "Blueprint Line"],
      color: ["Limited Palette"]
    },
    prompt: "Simplified system modules, precise technical illustration with clean structural lines, callouts, and diagrammatic clarity, clean software architecture diagram with modular blocks and clear connection logic, layer diagram separating system levels into clear stacked visual hierarchy, clean monoline strokes with consistent stroke width and refined spacing, blueprint-like thin guide lines, dimension marks, and precise construction details, limited palette with restrained brand colors and clear hierarchy",
    negative: ["Blob Shape", "Children's Book Illustration", "Clay Render", "Claymation", "Collage Illustration", "Frutiger Aero", "Heavy Glow", "Ink Bleed", "Ink Wash", "Liquid Gradient", "Mesh Gradient", "Photoreal product shot", "Watercolor"]
  },
  {
    id: "developer-tool-diagram",
    title: "개발자 도구 아키텍처 다이어그램",
    intent: "개발자 도구 랜딩용 시스템 구조 그래픽",
    subject: "Detailed enough to explain modules",
    facetFrame: {
      rendering: "Technical Illustration",
      perspective: "Orthographic or Isometric",
      color: "Monochrome with Spot Color",
      texture: "Matte / Blueprint Grid Pattern",
      composition: "Grid-Based",
      subject: "Detailed enough to explain modules",
      mood: "Crisp"
    },
    keywords: ["Architecture Diagram", "Node-link Diagram", "Technical Line", "Blueprint Line", "Measurement Diagram"],
    output: ["SVG", "React SVG"],
    slots: {
      view: ["Architecture Diagram", "Node-link Diagram", "Measurement Diagram"],
      line: ["Technical Line", "Blueprint Line"]
    },
    prompt: "Detailed enough to explain modules, clean software architecture diagram with modular blocks and clear connection logic, node-link diagram, measurement diagram with dimension lines, angle marks, and scale indicators, functional technical linework with precise guides and measurement logic, blueprint-like thin guide lines, dimension marks, and precise construction details",
    negative: ["Blob Shape", "Cartoon character", "Children's Book Illustration", "Clay Render", "Claymation", "Decorative gradients", "Frutiger Aero", "Ink Wash", "Liquid Gradient", "Mesh Gradient", "Unnecessary 3D", "Watercolor"]
  },
  {
    id: "portfolio-background",
    title: "포트폴리오·에이전시 배경 그래픽",
    intent: "개인 브랜드 히어로 배경",
    subject: "Abstract",
    facetFrame: {
      rendering: "Abstract & Generative Form",
      perspective: "Flat or spatial field",
      color: "Monochrome or Limited Palette",
      texture: "Grainy Gradient",
      composition: "Negative Space",
      subject: "Abstract",
      mood: "Premium / calm"
    },
    keywords: ["Mesh Gradient", "Grainy Gradient", "Topographic Lines", "Monoline", "Blur"],
    output: ["CSS", "Canvas", "Image(gen)"],
    slots: {
      form: ["Mesh Gradient", "Grainy Gradient", "Topographic Lines"],
      line: ["Monoline"],
      effect: ["Blur"]
    },
    prompt: "Abstract, soft mesh gradient with organic color blending and subtle atmospheric depth, grainy gradient with subtle noise texture over smooth color transitions, topographic contour lines forming an abstract data landscape, clean monoline strokes with consistent stroke width and refined spacing, soft blur for atmospheric separation and subtle depth",
    negative: ["Blueprint Line", "Busy particle systems", "Chrome Material", "Collage Illustration", "Engraving", "Etching", "Glossy Surface", "Overly colorful gradients", "Pixel Art", "Screenprint", "Woodcut"]
  },
  {
    id: "creative-coding-visual",
    title: "크리에이티브 코딩 비주얼",
    intent: "캔버스로 움직이는 추상 그래픽",
    subject: "Abstract motion",
    facetFrame: {
      rendering: "Generative graphic",
      perspective: "Spatial field",
      color: "Limited Palette",
      texture: "Digital Noise",
      composition: "Full canvas with low density",
      subject: "Abstract motion",
      mood: "Technical / cinematic"
    },
    keywords: ["Particle Field", "Flow Field", "Vector Field", "Glow", "Blur"],
    output: ["Canvas", "WebGL", "Three.js"],
    slots: {
      form: ["Particle Field", "Flow Field", "Vector Field"],
      effect: ["Glow", "Blur"]
    },
    prompt: "Abstract motion, subtle particle field suggesting data, energy, and distributed intelligence, algorithmic flow field with lines or particles following invisible vector forces, vector field, subtle controlled glow used as a precise highlight, not excessive decoration, soft blur for atmospheric separation and subtle depth",
    negative: ["Engraving", "Etching", "High particle density", "Ink Drawing", "Letterpress", "Linocut", "Paper Grain", "Pixel Art", "Screenprint", "Unreadable UI overlay", "Woodcut"]
  },
  {
    id: "wellness-app-illustration",
    title: "웰니스 앱 일러스트레이션",
    intent: "명상 앱 온보딩 이미지",
    subject: "Simplified",
    facetFrame: {
      rendering: "Soft illustration",
      perspective: "Flat 2D",
      color: "Pastel or Muted",
      texture: "Paper Grain",
      composition: "Negative Space",
      subject: "Simplified",
      mood: "Soft Light"
    },
    keywords: ["Paper Grain", "Clean Vector Line", "Flat Fill", "Limited Palette", "Blur"],
    output: ["Image(gen)", "SVG"],
    slots: {
      line: ["Clean Vector Line"],
      tone: ["Flat Fill"],
      color: ["Limited Palette"],
      texture: ["Paper Grain"],
      effect: ["Blur"]
    },
    prompt: "Simplified, smooth clean vector linework with polished digital edges, flat color fills with simple geometric clarity and no complex shading, limited palette with restrained brand colors and clear hierarchy, subtle paper grain texture with tactile editorial warmth, soft blur for atmospheric separation and subtle depth",
    negative: ["Aggressive contrast", "Charcoal Drawing", "Chrome Material", "Collage Illustration", "Cyberpunk", "Engraving", "Glass Material", "Glossy Finish", "Hard technical linework", "Holographic Material", "Metallic Material", "Particle Field", "Pixel Art", "Screenprint", "Synthwave", "Vaporwave", "Woodcut", "Y2K Futurism"]
  },
  {
    id: "premium-product-tech-3d",
    title: "프리미엄 테크 3D 오브젝트",
    intent: "미래적인 AI 제품 오브젝트",
    subject: "Simplified object",
    facetFrame: {
      rendering: "3D Render",
      perspective: "Eye Level or Isometric",
      color: "Limited Palette",
      texture: "Glass / Chrome / Matte",
      composition: "Centered with negative space",
      subject: "Simplified object",
      mood: "Soft light / premium"
    },
    keywords: ["Glass Material", "Chrome Material", "Transparent View", "Blur", "Refraction"],
    output: ["Image(gen)", "Three.js"],
    slots: {
      view: ["Transparent View"],
      material: ["Glass Material", "Chrome Material"],
      effect: ["Blur", "Refraction"]
    },
    prompt: "Simplified object, transparent layered view revealing internal systems through translucent surfaces, transparent glass material with subtle refraction, thickness, and clean reflections, polished chrome material with mirror-like reflection and futuristic finish, soft blur for atmospheric separation and subtle depth, subtle refraction through glass or liquid, creating premium optical depth",
    negative: ["Botanical Illustration", "Charcoal Drawing", "Claymation", "Cross-hatching", "Cyanotype", "Engraving", "Etching", "Grainy Gradient", "Ink Bleed", "Ink Drawing", "Ink Wash", "Letterpress", "Linocut", "Origami / Papercraft", "Overly complex reflections", "Paper Grain", "Pixel Art", "Risograph", "Screenprint", "Toy-like clay render", "Ukiyo-e", "Watercolor", "Woodcut"]
  }
];
