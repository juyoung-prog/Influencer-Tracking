import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Typography from '@mui/material/Typography';

/**
 * 인플루언서 업무 7단계 — WorkflowGuide의 PHASES와 같은 내용.
 * flat-SaaS 문법: white bg + thin border, no shadow, accordion은 기존과 같음.
 */
const PHASES = [
  {
    num: '01',
    title: 'Prepare',
    summary: 'Get tier-based assets and paperwork ready before outreach starts.',
    steps: [
      'Design tier-based emails and coupons',
      'Obtain tier coupon numbers and set coupon expiration dates',
      'Prepare consent forms for each tier',
    ],
    files: ['Tier 1 Consent Form', 'Tier 2 Consent Form'],
    tools: [],
    handoff: null,
  },
  {
    num: '02',
    title: 'Find',
    summary: 'Source candidates and get them into Wix.',
    steps: ['Find influencers (AI-assisted or manual)', 'Add found influencers to Wix'],
    files: [],
    tools: ['Wix'],
    handoff: null,
  },
  {
    num: '03',
    title: 'Send',
    summary: 'Invite influencers through Wix and flag it to the team.',
    steps: ['Send invitations to influencers via Wix', 'Once sent, notify the team by DM'],
    files: [],
    tools: ['Wix', 'DM'],
    handoff: null,
  },
  {
    num: '04',
    title: 'Record',
    summary: 'Verify signed consent and add the influencer to both lists.',
    steps: [
      'When an influencer submits their consent form, review it',
      'Add the influencer to the Influencer Tracking List and the Influencer List',
    ],
    files: ['Influencer Tracking List', 'Tier 1 Influencer Tracking List (manager)', 'Tier 2 Influencer Tracking List (manager)'],
    tools: [],
    handoff: null,
  },
  {
    num: '05',
    title: 'Follow Up',
    summary: 'Remind them before their visit, chase no-shows, handle reschedules, and gate coupons on delivered content.',
    stepGroups: [
      {
        heading: 'Before the visit',
        items: [
          "The day before their scheduled visit, message the influencer — mention the collaboration to the manager or staff when you arrive, and they'll guide you from there",
          'If they want to change their visit date, reschedule it and write the change down in both lists',
        ],
      },
      {
        heading: 'After the visit',
        items: [
          'If they miss the scheduled date, ask when they can come; once confirmed, write it down in the Influencer Tracking List — Contact Reason, Contact Status, Last Contact Date, Requested Date',
          'Once they share the content collab, send the coupon',
          'Download the content (Instagram/TikTok)',
          'When you write down the collab, also add the collab video link and upload date to the Influencer Tracking List',
          "If they haven't shared yet, ask when they plan to",
        ],
      },
    ],
    files: ['Influencer Tracking List', 'Tier 1 Influencer Tracking List (manager)', 'Tier 2 Influencer Tracking List (manager)'],
    tools: [],
    handoff: null,
  },
  {
    num: '06',
    title: 'Share',
    summary: 'Exchange visit records with the Store Manager each day.',
    steps: [
      "Right after arriving in the morning, or before leaving for the day, share the latest influencer list (PDF) with the Store Manager and let them know it's ready",
      'Also in the morning, receive the actual-visit list back from the Store Manager and write it down',
    ],
    files: ['Tier 1 Influencer Tracking List (manager)', 'Tier 2 Influencer Tracking List (manager)'],
    tools: [],
    handoff: 'Store Manager',
  },
  {
    num: '07',
    title: 'Report',
    summary: 'Close the loop with usage and performance numbers.',
    steps: [
      'Write down credit usage',
      'Write down content views, likes, shares, and other performance metrics',
      'Report the results',
    ],
    files: ['Influencer Tracking List'],
    tools: [],
    handoff: null,
  },
];

const FILE_DEFS = [
  { linkKind: 'store', field: 'tier1ConsentFormUrl', kind: 'Google Form', name: 'Tier 1 Consent Form', desc: 'Consent capture for Tier 1 influencers' },
  { linkKind: 'store', field: 'tier2ConsentFormUrl', kind: 'Google Form', name: 'Tier 2 Consent Form', desc: 'Consent capture for Tier 2 influencers' },
  { linkKind: 'common', kind: 'Internal sheet', name: 'Influencer Tracking List', desc: 'Our working record — every contact, status, and follow-up we write down ourselves' },
  { linkKind: 'store', field: 'tier1InfluencerListUrl', kind: 'Shared sheet', name: 'Tier 1 Influencer Tracking List (manager)', desc: 'The version we hand off — what the Store Manager sees and returns' },
  { linkKind: 'store', field: 'tier2InfluencerListUrl', kind: 'Shared sheet', name: 'Tier 2 Influencer Tracking List (manager)', desc: 'The version we hand off — what the Store Manager sees and returns' },
  { linkKind: 'app', kind: 'This app', name: 'Influencer Tracking Dashboard', desc: 'Overall schedule, pipeline visualization, and reminders — where this tab lives' },
];

/**
 * FileCard — FILES & SYSTEMS 항목 카드 (flat-SaaS: border only, no shadow)
 *
 * Props:
 * @param {string} kind - 카테고리 라벨 [Required]
 * @param {string} name - 문서/시스템 이름 [Required]
 * @param {string} desc - 한 줄 설명 [Required]
 * @param {string|null} href - 링크 URL, 없으면 null [Optional]
 * @param {string} note - 캡션(링크 없는 이유, "모든 스토어 공통") [Optional]
 */
function FileCard({ kind, name, desc, href = null, note = '' }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', p: 1.5 }}>
      <Typography sx={{ fontSize: 10, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
        {kind}
      </Typography>
      {href ? (
        <Typography
          component="a"
          href={href}
          target="_blank"
          rel="noreferrer"
          sx={{
            display: 'block',
            fontWeight: 600,
            fontSize: 13,
            mb: 0.5,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {name}
          <OpenInNewIcon sx={{ fontSize: 11, verticalAlign: 'text-top', ml: 0.4 }} />
        </Typography>
      ) : (
        <Typography sx={{ fontWeight: 600, fontSize: 13, mb: 0.5, color: 'text.disabled' }}>
          {name}
        </Typography>
      )}
      <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5, mb: 0.5 }}>
        {desc}
      </Typography>
      {note && (
        <Typography sx={{ fontSize: 11, color: 'text.disabled', fontStyle: 'italic' }}>
          {note}
        </Typography>
      )}
    </Box>
  );
}

/**
 * TagRow — 파일 / 툴 / handoff 태그 묶음
 *
 * Props:
 * @param {string[]} files - 관련 파일 이름 목록 [Required]
 * @param {string[]} tools - 외부 툴 이름 목록 [Required]
 * @param {string|null} handoff - 인수인계 대상 [Required]
 */
function TagRow({ files, tools, handoff }) {
  if (files.length === 0 && tools.length === 0 && !handoff) return null;
  const tagSx = {
    fontSize: 11,
    lineHeight: 1.6,
    px: 0.75,
    py: 0.25,
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  };
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
      {files.map(f => (
        <Typography key={f} component="span" sx={{ ...tagSx, backgroundColor: 'grey.100', color: 'text.secondary' }}>
          {f}
        </Typography>
      ))}
      {tools.map(t => (
        <Typography
          key={t}
          component="span"
          sx={{ ...tagSx, border: '1px solid', borderColor: 'divider', color: 'text.secondary' }}
        >
          {t}
        </Typography>
      ))}
      {handoff && (
        <Typography
          component="span"
          sx={{ ...tagSx, border: '1px solid', borderColor: 'secondary.main', color: 'secondary.main' }}
        >
          Handoff · {handoff}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Helper to resolve FILE_DEFS item to href, or null if not available.
 */
function resolveHref(file) {
  return null;
}

/**
 * Helper to generate note text for FILE_DEFS items when href is unavailable.
 */
function getFileNote(file) {
  if (file.linkKind === 'store') {
    return 'Select a store in dashboard';
  }
  if (file.linkKind === 'common') {
    return 'Common to all stores';
  }
  return '';
}

/**
 * SaasWorkflowView component
 *
 * flat-SaaS 시안 Workflow 뷰 — 기존 WorkflowGuide와 같은 7단계 아코디언 구조.
 * 표면 문법만 flat-SaaS (white bg + thin border, no shadow).
 *
 * Props:
 * @param {string} defaultExpanded - 최초 펼친 단계 (num, 예: '01') [Optional, 기본값: '01']
 *
 * Example usage:
 * <SaasWorkflowView />
 */
function SaasWorkflowView({ defaultExpanded = '01' }) {
  const externalHandoffCount = PHASES.filter(p => p.handoff).length;

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 3, py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography component="h1" sx={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
          Influencer workflow
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
          A shared, at-a-glance reference for how the team runs influencer outreach end to end
        </Typography>
      </Box>

      {/* Stats bar — 7 Phases / 6 Files & systems / 1 External handoff */}
      <Box sx={{ display: 'flex', gap: 3, py: 1.5, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
        {[
          ['7', 'Phases'],
          ['6', 'Files & systems'],
          ['1', 'External handoff'],
        ].map(([num, label]) => (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {num}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', lineHeight: 1.4 }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ maxWidth: 800 }}>
        {PHASES.map(phase => (
          <Accordion
            key={phase.num}
            defaultExpanded={phase.num === defaultExpanded}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              mb: 1,
              boxShadow: 'none',
              '&.Mui-expanded': { mb: 1 },
              '&:before': { display: 'none' },
              '& .MuiAccordionSummary-root': {
                backgroundColor: 'transparent',
                px: 2,
                py: 1,
                '&:hover': { backgroundColor: 'grey.50' },
              },
              '& .MuiAccordionDetails-root': { px: 2, py: 2 },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ gap: 1.5 }}>
              <Typography
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'text.primary',
                  width: 48,
                  flexShrink: 0,
                }}
              >
                {phase.num}
              </Typography>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {phase.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {phase.summary}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {phase.stepGroups ? (
                phase.stepGroups.map((group, gi) => (
                  <Box key={group.heading} sx={{ mb: gi === phase.stepGroups.length - 1 ? 1.5 : 2 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.75 }}>
                      {group.heading}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.25, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {group.items.map(item => (
                        <Typography key={item} component="li" sx={{ fontSize: 13, lineHeight: 1.55 }}>
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box component="ul" sx={{ m: 0, pl: 2.25, display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1.5 }}>
                  {phase.steps.map(step => (
                    <Typography key={step} component="li" sx={{ fontSize: 13, lineHeight: 1.55 }}>
                      {step}
                    </Typography>
                  ))}
                </Box>
              )}
              <TagRow files={phase.files} tools={phase.tools} handoff={phase.handoff} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2, display: 'block' }}>
        Reference
      </Typography>
      <Typography component="h2" sx={{ fontSize: 14, fontWeight: 600, mb: 0.75 }}>
        Files & Systems
      </Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2, display: 'block' }}>
        Reference links for the 7-step workflow process
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
        {FILE_DEFS.map(file => (
          <FileCard
            key={file.name}
            kind={file.kind}
            name={file.name}
            desc={file.desc}
            href={resolveHref(file)}
            note={getFileNote(file)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default SaasWorkflowView;
