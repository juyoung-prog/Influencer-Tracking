import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
    steps: [
      'Find influencers (AI-assisted or manual)',
      'Log found influencers in Wix',
    ],
    files: [],
    tools: ['Wix'],
    handoff: null,
  },
  {
    num: '03',
    title: 'Send',
    summary: 'Invite influencers through Wix and flag it to the team.',
    steps: [
      'Send invitations to influencers via Wix',
      'Once sent, notify the team by DM',
    ],
    files: [],
    tools: ['Wix', 'DM'],
    handoff: null,
  },
  {
    num: '04',
    title: 'Record',
    summary: 'Verify signed consent and log the influencer into both lists.',
    steps: [
      'When an influencer submits their consent form, review it',
      'Log the influencer in the Influencer Tracking List and the Influencer List',
    ],
    files: ['Influencer Tracking List', 'Tier 1 Influencer Tracking List (manager)', 'Tier 2 Influencer Tracking List (manager)'],
    tools: [],
    handoff: null,
  },
  {
    num: '05',
    title: 'Follow Up',
    summary: 'Chase no-shows, handle reschedules, and gate coupons on delivered content.',
    steps: [
      'If they miss the scheduled date, ask when they can come; once confirmed, log it in both lists — record Contact Reason, Contact Status, Last Contact Date, Requested Date',
      'If they want to change their visit date, reschedule it and log the change in both lists',
      'Once they share the content collab, send the coupon',
      "If they haven't shared yet, ask when they plan to",
    ],
    files: ['Influencer Tracking List', 'Tier 1 Influencer Tracking List (manager)', 'Tier 2 Influencer Tracking List (manager)'],
    tools: [],
    handoff: null,
  },
  {
    num: '06',
    title: 'Share',
    summary: 'Exchange visit records with the Store Manager.',
    steps: [
      'Share the latest influencer list (PDF) with the Store Manager',
      'Receive the actual-visit list back from the Store Manager and log it',
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
      'Log credit usage',
      'Log content views, likes, shares, and other performance metrics',
      'Report the results',
    ],
    files: ['Influencer Tracking List'],
    tools: [],
    handoff: null,
  },
];

// linkKind: 'store' (resolved per selectedStore via storeDocs), 'common' (one
// fixed URL regardless of store), or 'app' (this page itself — never linked).
const FILE_DEFS = [
  { linkKind: 'store', field: 'tier1ConsentFormUrl', kind: 'Google Form', name: 'Tier 1 Consent Form', desc: 'Consent capture for Tier 1 influencers' },
  { linkKind: 'store', field: 'tier2ConsentFormUrl', kind: 'Google Form', name: 'Tier 2 Consent Form', desc: 'Consent capture for Tier 2 influencers' },
  { linkKind: 'common', kind: 'Internal sheet', name: 'Influencer Tracking List', desc: 'Our working record — every contact, status, and follow-up we log ourselves' },
  { linkKind: 'store', field: 'tier1InfluencerListUrl', kind: 'Shared sheet', name: 'Tier 1 Influencer Tracking List (manager)', desc: 'The version we hand off — what the Store Manager sees and returns' },
  { linkKind: 'store', field: 'tier2InfluencerListUrl', kind: 'Shared sheet', name: 'Tier 2 Influencer Tracking List (manager)', desc: 'The version we hand off — what the Store Manager sees and returns' },
  { linkKind: 'app', kind: 'This app', name: 'Influencer Tracking Dashboard', desc: 'Overall schedule, pipeline visualization, and reminders — where this tab lives' },
];

/**
 * Resolves a phase's file tag label to the same URL the Files & Systems
 * card below would show, so the tag becomes clickable wherever a link
 * exists (and stays plain text when it doesn't — no store selected yet,
 * or that store has no link on file).
 */
function resolveFileHref(label, selectedStore, storeDocs, influencerTrackingListUrl) {
  const def = FILE_DEFS.find(f => f.name === label);
  if (!def) return null;
  if (def.linkKind === 'common') return influencerTrackingListUrl || null;
  if (def.linkKind === 'store') {
    if (selectedStore === 'all') return null;
    return storeDocs?.[selectedStore]?.[def.field] || null;
  }
  return null;
}

const FileTag = ({ label, href = null }) => (
  <Box
    component={href ? 'a' : 'span'}
    href={href || undefined}
    target={href ? '_blank' : undefined}
    rel={href ? 'noreferrer' : undefined}
    sx={{
      display: 'inline-block',
      px: 0.75,
      py: 0.25,
      fontSize: 11,
      fontWeight: 600,
      color: 'text.primary',
      backgroundColor: 'grey.100',
      lineHeight: 1.4,
      textDecoration: 'none',
      cursor: href ? 'pointer' : 'default',
      '&:hover': href ? { textDecoration: 'underline' } : undefined,
    }}
  >
    {label}
  </Box>
);

const ToolTag = ({ label }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      px: 0.75,
      py: 0.25,
      fontSize: 11,
      fontWeight: 600,
      color: 'text.secondary',
      border: '1px solid',
      borderColor: 'divider',
      lineHeight: 1.4,
    }}
  >
    {label}
  </Box>
);

const HandoffTag = ({ label }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-block',
      px: 0.75,
      py: 0.25,
      fontSize: 11,
      fontWeight: 600,
      color: 'secondary.main',
      border: '1px solid',
      borderColor: 'secondary.main',
      lineHeight: 1.4,
    }}
  >
    {label}
  </Box>
);

/**
 * FileCard component
 *
 * One Files & Systems entry. Renders as a link when href resolves; otherwise
 * shows a muted note explaining why (no store selected yet, or the store has
 * no link on file) instead of a broken/dead link.
 *
 * Props:
 * @param {string} kind - Category label shown above the name [Required]
 * @param {string} name - Document/system name [Required]
 * @param {string} desc - One-line description [Required]
 * @param {string|null} href - Resolved URL, or null if not available [Optional]
 * @param {string} note - Muted caption shown below desc (missing-link reason, or "common to all stores") [Optional]
 */
function FileCard({ kind, name, desc, href = null, note = '' }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', p: 1.5 }}>
      <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 10 }}>
        {kind}
      </Typography>
      {href ? (
        <Typography
          component="a"
          href={href}
          target="_blank"
          rel="noreferrer"
          variant="body2"
          sx={{
            display: 'block',
            fontWeight: 600,
            mt: 0.25,
            mb: 0.5,
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {name}
          <OpenInNewIcon sx={{ fontSize: 12, verticalAlign: 'text-top', ml: 0.4 }} />
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25, mb: 0.5, color: 'text.disabled' }}>
          {name}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.5 }}>
        {desc}
      </Typography>
      {note && (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.75, fontStyle: 'italic' }}>
          {note}
        </Typography>
      )}
    </Box>
  );
}

/**
 * WorkflowGuide component
 *
 * Static reference content for the Workflow tab — the influencer outreach
 * process broken into 7 phases so any teammate can pick it up without asking.
 * The 7-phase process itself is fixed content; only the Files & Systems
 * section reads live data (per-store document links).
 *
 * Props:
 * @param {string} selectedStore - Currently selected store code, or 'all' [Optional, 기본값: 'all']
 * @param {Object} storeDocs - Per-store document links from the Links sheet, keyed by store code [Optional, 기본값: {}]
 * @param {string} influencerTrackingListUrl - Fixed link, same for every store [Optional, 기본값: '']
 *
 * Example usage:
 * <WorkflowGuide selectedStore="G10" storeDocs={storeDocs} influencerTrackingListUrl={url} />
 */
function WorkflowGuide({ selectedStore = 'all', storeDocs = {}, influencerTrackingListUrl = '' }) {
  return (
    <Box sx={{ maxWidth: 840, mx: 'auto', px: { xs: 2, sm: 4 }, py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Workflow
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560 }}>
        A shared, at-a-glance reference for how the team runs influencer outreach end to end —
        so the process lives on the dashboard, not in one person&apos;s head.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, py: 1.5, borderTop: 1, borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        {[
          ['7', 'Phases'],
          ['6', 'Files & systems'],
          ['1', 'External handoff'],
        ].map(([num, label]) => (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {num}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {PHASES.map((phase, i) => (
        <Box key={phase.num} sx={{ display: 'flex', gap: 1.5 }}>
          {/* Step rail — marker + connecting line, reinforces that this is an ordered sequence */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, pt: 0.5 }}>
            <Box
              sx={{
                width: 26,
                height: 26,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100',
              }}
            >
              <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.primary' }}>
                {phase.num}
              </Typography>
            </Box>
            {i < PHASES.length - 1 && (
              <Box sx={{ flex: 1, width: '2px', backgroundColor: 'divider', my: 0.5 }} />
            )}
          </Box>

          <Accordion
            disableGutters
            square
            elevation={0}
            defaultExpanded={i === 0}
            sx={{ border: 1, borderColor: 'divider', mb: 1, flex: 1, minWidth: 0, '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {phase.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    {phase.summary}
                  </Typography>
                </Box>
                {phase.handoff && (
                  <Box sx={{ ml: 'auto', flexShrink: 0 }}>
                    <HandoffTag label={`Handoff → ${phase.handoff}`} />
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
                {phase.steps.map((step, si) => (
                  <Box key={si} sx={{ display: 'flex', gap: 1.25 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'text.disabled', flexShrink: 0, mt: '0.6em' }} />
                    <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {(phase.files.length > 0 || phase.tools.length > 0) && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {phase.files.map(f => (
                    <FileTag
                      key={f}
                      label={f}
                      href={resolveFileHref(f, selectedStore, storeDocs, influencerTrackingListUrl)}
                    />
                  ))}
                  {phase.tools.map(t => <ToolTag key={t} label={t} />)}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}

      <Divider sx={{ mt: 5, mb: 3 }} />
      <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block' }}>
        Reference
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.25, mb: 0.5 }}>
        Files & Systems
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        {selectedStore === 'all'
          ? 'Select a store above to see its consent form and list links.'
          : `Showing links for ${selectedStore}`}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 1,
        }}
      >
        {FILE_DEFS.map((file) => {
          if (file.linkKind === 'app') {
            return <FileCard key={file.name} kind={file.kind} name={file.name} desc={file.desc} />;
          }
          if (file.linkKind === 'common') {
            return (
              <FileCard
                key={file.name}
                kind={file.kind}
                name={file.name}
                desc={file.desc}
                href={influencerTrackingListUrl || null}
                note="Common to all stores"
              />
            );
          }
          // linkKind === 'store'
          if (selectedStore === 'all') {
            return (
              <FileCard
                key={file.name}
                kind={file.kind}
                name={file.name}
                desc={file.desc}
                note="Select a store above to see this link"
              />
            );
          }
          const href = storeDocs?.[selectedStore]?.[file.field] || null;
          return (
            <FileCard
              key={file.name}
              kind={file.kind}
              name={file.name}
              desc={file.desc}
              href={href}
              note={href ? '' : `Not set for ${selectedStore} — add it to the Links sheet`}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default WorkflowGuide;
