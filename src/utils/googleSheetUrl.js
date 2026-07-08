/**
 * Extracts the real Google Sheets document ID from a "plain" copy-link CSV
 * export URL (spreadsheets/d/{ID}/export?format=csv&gid=...). "Publish to
 * web" URLs (spreadsheets/d/e/{PUBLISHED_ID}/pub?output=csv) use a published
 * ID that is not the real document ID, so those return null.
 *
 * @param {string|null|undefined} csvUrl
 * @returns {string|null}
 */
function extractDocId(csvUrl) {
  if (!csvUrl) return null;
  const match = csvUrl.match(/spreadsheets\/d\/([^/?#]+)\/export/);
  return match ? match[1] : null;
}

/**
 * Extracts the gid (tab id) query param from a CSV export or pubhtml URL.
 *
 * @param {string|null|undefined} url
 * @returns {string|null}
 */
function extractGid(url) {
  if (!url) return null;
  const match = url.match(/[?&#]gid=(\d+)/);
  return match ? match[1] : null;
}

/**
 * Builds a human-viewable Google Sheets URL for the dashboard's sheet link
 * icon, pointed at the primary (first source's Processing tab) tab.
 *
 * The primary source's own URL may be a "Publish to web" link, which embeds
 * a published ID that can't be turned back into a real document ID. Since
 * configs commonly save a plain copy-link URL for another field (e.g.
 * inviteCountsUrl) pointing at the same spreadsheet, this borrows the real
 * document ID from anywhere in the config while always using the primary
 * source's own gid — so the link lands on the tab the user actually expects
 * instead of whichever tab happened to supply a usable document ID.
 *
 * @param {object|null|undefined} config - Saved sheet config (config.sources[], config.inviteCountsUrl)
 * @returns {string|null}
 */
export function findSheetViewUrl(config) {
  if (!config) return null;

  const primaryUrl = config.sources?.[0]?.processingCsvUrl || config.sources?.[0]?.doneCsvUrl;
  if (!primaryUrl) return null;

  const gid = extractGid(primaryUrl) || '0';

  const allUrls = [
    ...(config.sources || []).flatMap(s => [s.processingCsvUrl, s.doneCsvUrl]),
    config.inviteCountsUrl,
  ].filter(Boolean);
  const docId = allUrls.map(extractDocId).find(Boolean);

  if (docId) {
    return `https://docs.google.com/spreadsheets/d/${docId}/edit#gid=${gid}`;
  }

  // No real document ID available anywhere in the config — fall back to the
  // published read-only view of the primary source, if it has one.
  const publishedMatch = primaryUrl.match(/spreadsheets\/d\/e\/([^/?#]+)\/pub/);
  if (publishedMatch) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/pubhtml?gid=${gid}&single=true`;
  }

  return null;
}
