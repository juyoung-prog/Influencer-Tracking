/**
 * Reconstructs a human-viewable Google Sheets URL from a CSV export URL.
 *
 * SheetSettingsModal's toCsvUrl() accepts two input shapes and this mirrors
 * both:
 * - "plain" copy-link URLs (spreadsheets/d/{ID}/export?format=csv&gid=...) —
 *   the embedded ID is the real document ID, so this reconstructs /edit.
 * - "Publish to web" URLs (spreadsheets/d/e/{PUBLISHED_ID}/pub?output=csv) —
 *   the published ID doesn't map back to the real document ID, so this
 *   reconstructs the published /pubhtml view instead of /edit.
 *
 * @param {string|null|undefined} csvUrl
 * @returns {string|null}
 */
export function toSheetViewUrl(csvUrl) {
  if (!csvUrl) return null;

  const gidMatch = csvUrl.match(/[?&]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  const plainMatch = csvUrl.match(/spreadsheets\/d\/([^/?#]+)\/export/);
  if (plainMatch) {
    return `https://docs.google.com/spreadsheets/d/${plainMatch[1]}/edit#gid=${gid}`;
  }

  const publishedMatch = csvUrl.match(/spreadsheets\/d\/e\/([^/?#]+)\/pub/);
  if (publishedMatch) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/pubhtml?gid=${gid}&single=true`;
  }

  return null;
}
