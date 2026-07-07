/**
 * BeautyMaster — Funnel Step Definitions
 *
 * Shared between InfluencerFunnel (bar chart) and FunnelSummaryTable (table view)
 * so both presentations of the same funnel data stay in sync.
 */

export const STEPS_BASE = [
  { key: 'invited',    label: 'Invited',     note: null,             color: 'primary.main' },
  { key: 'agreement',  label: 'Agreement',   note: '% of invited',   color: 'primary.main' },
  { key: 'attended',   label: 'Visited',     note: '% of agreement', color: 'info.main' },
  { key: 'uploaded',   label: 'Uploaded',    note: '% of visited',   color: 'info.main' },
  { key: 'creditSent', label: 'Credit Sent', note: '% of uploaded',  color: 'success.main' },
  { key: 'creditUsed', label: 'Credit Used', note: '% of sent',      color: 'success.main' },
];

// With real invite-count data (funnel.responded present), an extra step sits
// between Invited and Agreement — how many of the invited actually entered tracking.
export const STEPS_WITH_RESPONDED = [
  { key: 'invited',    label: 'Invited',     note: null,              color: 'primary.main' },
  { key: 'responded',  label: 'Responded',   note: '% of invited',    color: 'primary.main' },
  { key: 'agreement',  label: 'Agreement',   note: '% of responded',  color: 'primary.main' },
  { key: 'attended',   label: 'Visited',     note: '% of agreement',  color: 'info.main' },
  { key: 'uploaded',   label: 'Uploaded',    note: '% of visited',    color: 'info.main' },
  { key: 'creditSent', label: 'Credit Sent', note: '% of uploaded',   color: 'success.main' },
  { key: 'creditUsed', label: 'Credit Used', note: '% of sent',       color: 'success.main' },
];
