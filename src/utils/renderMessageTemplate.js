/**
 * BeautyMaster — Message Template Renderer
 *
 * Substitutes {{placeholder}} tokens in a template body with the matching
 * Influencer field, formatted for a message to send. Unknown placeholders
 * are left as-is so a typo in the sheet is visible rather than silently
 * swallowed.
 */

/** @param {Date|null} date */
function formatDate(date) {
  if (!date) return 'TBD';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    + ' at '
    + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const CATEGORY_LABEL = { general: 'General', kbeauty: 'K-Beauty', specific: 'Specific' };
const TIER_LABEL = { tier1: 'Tier 1', tier2: 'Tier 2' };

function fieldValues(influencer) {
  return {
    fullName: influencer.fullName || '',
    store: influencer.store || '',
    email: influencer.email || '',
    scheduledTime: formatDate(influencer.scheduledTime),
    requestedDate: formatDate(influencer.requestedDate),
    month: influencer.month != null ? String(influencer.month) : '',
    tier: TIER_LABEL[influencer.tier] || influencer.tier || '',
    platform: influencer.platform || '',
    category: CATEGORY_LABEL[influencer.category] || influencer.category || '',
  };
}

/**
 * @param {string} body
 * @param {Influencer} influencer
 * @returns {string}
 */
export function renderMessageTemplate(body, influencer) {
  const values = fieldValues(influencer);
  return body.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
  ));
}
