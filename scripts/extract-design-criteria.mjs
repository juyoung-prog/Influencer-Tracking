/**
 * 설계 기준 경량 뷰 추출기 (생성 시점용)
 *
 * 단일 원천: src/data/typographyTaxonomyData.js
 * 산출물: .claude/skills/component-work/resources/typography-criteria.md
 *
 * 목적: 점검 에이전트(typography-auditor)와 동일한 SSOT 에서, 생성 시점에
 *       component-work 가 조건부로 참조할 압축 do-pattern 뷰를 파생한다.
 *       이 md 는 손으로 쓰지 않는다. 데이터가 바뀌면 이 스크립트를 다시 돌린다.
 *
 * 실행: node scripts/extract-design-criteria.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { TYPOGRAPHY_TAXONOMY } from "../src/data/typographyTaxonomyData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(
  ROOT,
  ".claude/skills/component-work/resources/typography-criteria.md"
);

// 첫 문장만 (장문 방지)
function firstSentence(s) {
  if (!s) return "";
  const cut = String(s).split(/(?<=[.。])\s/)[0];
  return cut.length > 160 ? cut.slice(0, 157) + "..." : cut;
}

function line(it) {
  const parts = [`- **${it.koName || it.name}** (${it.name}): ${firstSentence(it.description)}`];
  const meta = [];
  if (it.bestFor) meta.push(`적합: ${firstSentence(it.bestFor)}`);
  if (it.avoidFor) meta.push(`피함: ${firstSentence(it.avoidFor)}`);
  if (it.build) meta.push(`CSS: ${firstSentence(it.build)}`);
  if (meta.length) parts.push(`  - ${meta.join(" · ")}`);
  return parts.join("\n");
}

let md = `# Typography 생성 기준 (자동 생성 뷰)

> 이 파일은 \`scripts/extract-design-criteria.mjs\` 가 \`src/data/typographyTaxonomyData.js\` 에서 추출한 파생 뷰입니다.
> 손으로 수정하지 마세요. 기준을 바꾸려면 데이터 파일을 고치고 스크립트를 다시 실행하세요.
> 점검 에이전트 \`typography-auditor\` 와 동일한 단일 원천을 공유합니다.

텍스트 비중이 큰 컴포넌트(본문·아티클·히어로 카피·폼 라벨·테이블)를 만들 때 아래 양화 패턴을 따릅니다.
구체 수치는 이 프로젝트 테마 토큰·\`Typography\` variant 로 변환해 적용합니다(원천 수치를 그대로 쓰지 않음).

`;

for (const part of TYPOGRAPHY_TAXONOMY) {
  md += `\n## ${part.label}\n`;
  if (part.description) md += `${firstSentence(part.description)}\n`;
  for (const cat of part.categories || []) {
    md += `\n### ${cat.name}${cat.subtitle ? ` (${cat.subtitle})` : ""}\n`;
    for (const group of cat.groups || []) {
      for (const it of group.items || []) {
        md += line(it) + "\n";
      }
    }
  }
}

md += `\n---\n_생성: scripts/extract-design-criteria.mjs · 원천: src/data/typographyTaxonomyData.js_\n`;

writeFileSync(OUT, md, "utf8");
console.log(`wrote ${OUT}`);
console.log(`bytes: ${Buffer.byteLength(md, "utf8")}`);
