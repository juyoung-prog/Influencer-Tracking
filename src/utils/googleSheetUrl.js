/**
 * Reconstructs a human-viewable Google Sheets URL from a CSV export URL.
 *
 * Only handles the "plain" export URL shape produced by SheetSettingsModal's
 * toCsvUrl() (spreadsheets/d/{ID}/export?format=csv&gid=...), since the sheet
 * ID embedded there matches the real document ID. Published pubhtml URLs
 * (spreadsheets/d/e/{PUBLISHED_ID}/pub?output=csv) use a published ID that
 * does not map back to an /edit URL, so those return null.
 *
 * @param {string|null|undefined} csvUrl
 * @returns {string|null}
 */
export function toSheetViewUrl(csvUrl) {
  if (!csvUrl) return null;

  const plainMatch = csvUrl.match(/spreadsheets\/d\/([^/?#]+)\/export/);
  if (!plainMatch) return null;

  const gidMatch = csvUrl.match(/[?&]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  return `https://docs.google.com/spreadsheets/d/${plainMatch[1]}/edit#gid=${gid}`;
}
