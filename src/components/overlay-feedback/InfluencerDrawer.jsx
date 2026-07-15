import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StatusIconRow from '../data-display/StatusIconRow';
import MessageTemplateMenu from './MessageTemplateMenu';

const CATEGORY_LABEL = { general: 'General', kbeauty: 'K-Beauty', specific: 'Specific' };

const OPINION_COLOR = {
  'USE': 'success',
  'MAYBE': 'warning',
  "DON'T": 'error',
};

/** @param {Date|null} date */
function formatDate(date) {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** @param {number|null} val */
function formatNum(val) {
  if (val == null) return '—';
  return val.toLocaleString('en-US');
}

/**
 * InfluencerDrawer component
 *
 * Right-side slide panel showing full influencer detail.
 * Sections: Profile + Status / Performance metrics / Content / Credit & evaluation / Contact (email + social) / Note.
 * When influencer is null, the drawer body is empty.
 *
 * Props:
 * @param {Influencer|null} influencer - Influencer to display [Optional, default: null]
 * @param {boolean} open - Whether the Drawer is open [Required]
 * @param {function} onClose - Drawer close handler [Required]
 * @param {MessageTemplate[]} templates - Outreach message templates for MessageTemplateMenu [Optional, default: []]
 *
 * Example usage:
 * <InfluencerDrawer influencer={selected} open={drawerOpen} onClose={handleClose} templates={messageTemplates} />
 */
function InfluencerDrawer({ influencer = null, open = false, onClose, templates = [] }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {influencer ? (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* ── Header ── */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Avatar
              src={influencer.imageUrl}
              alt={influencer.fullName}
              sx={{ width: 48, height: 48, flexShrink: 0, fontSize: 16, fontWeight: 700 }}
            >
              {influencer.fullName?.slice(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {influencer.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip label={influencer.platform} size="small" variant="outlined" />
                <Chip label={influencer.tier === 'tier2' ? 'Tier 2' : 'Tier 1'} size="small" variant="outlined" />
                {influencer.category && (
                  <Chip label={CATEGORY_LABEL[influencer.category] || influencer.category} size="small" variant="outlined" />
                )}
                <Chip label={`${influencer.store} · Month ${influencer.month}`} size="small" variant="outlined" />
              </Box>
              <Box sx={{ mt: 1 }}>
                <StatusIconRow
                  agreement={influencer.agreement}
                  attend={influencer.attend}
                  collaboShared={influencer.collaboShared}
                  creditShared={influencer.creditShared}
                  size={18}
                />
              </Box>
            </Box>
            <IconButton size="small" onClick={onClose} aria-label="Close" sx={{ flexShrink: 0 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ── Scrollable body ── */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>

            {/* Performance metrics */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Performance
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
              {[
                { label: 'Views', value: influencer.views },
                { label: 'Likes', value: influencer.likes },
                { label: 'Shares', value: influencer.shares },
                { label: 'Saves', value: influencer.saves },
                { label: 'Comments', value: influencer.comments },
                { label: 'Reposts', value: influencer.reposts },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {label}
                  </Typography>
                  <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
                    {formatNum(value)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Content link */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Content
            </Typography>
            {influencer.collaboLink ? (
              <Link
                href={influencer.collaboLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                variant="body2"
              >
                View Content <OpenInNewIcon sx={{ fontSize: 14 }} />
              </Link>
            ) : (
              <Typography variant="body2" color="text.disabled" sx={{ mb: 0.5 }}>
                No link
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Upload: {formatDate(influencer.uploadDate)}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Credit & evaluation */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Credit / Evaluation
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {influencer.serialNumber && (
                <Chip
                  label={`serial# ${influencer.serialNumber}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontSize: 11 }}
                />
              )}
              {influencer.creditUsed && (
                <Chip label="Credit Used" size="small" color="success" />
              )}
              {influencer.opinion && (
                <Chip
                  label={influencer.opinion}
                  size="small"
                  color={OPINION_COLOR[influencer.opinion] || 'default'}
                />
              )}
              {!influencer.opinion && influencer.collaboShared && (
                <Chip label="Evaluation Pending" size="small" variant="outlined" />
              )}
            </Box>

            {/* Contact */}
            {(influencer.socialAccountUrl || influencer.email) && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Contact
                </Typography>
                <Box sx={{ mb: 1.5 }}>
                  <MessageTemplateMenu influencer={influencer} templates={templates} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                  {influencer.socialAccountUrl && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <PersonOutlineIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                      <Link
                        href={influencer.socialAccountUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                        variant="body2"
                      >
                        {influencer.platform} Profile <OpenInNewIcon sx={{ fontSize: 13 }} />
                      </Link>
                    </Box>
                  )}
                  {influencer.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <EmailOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary', flexShrink: 0 }} />
                      <Link href={`mailto:${influencer.email}`} variant="body2">
                        {influencer.email}
                      </Link>
                    </Box>
                  )}
                </Box>
              </>
            )}

            {/* Note */}
            {influencer.note && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Note
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {influencer.note}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
}

export default InfluencerDrawer;
