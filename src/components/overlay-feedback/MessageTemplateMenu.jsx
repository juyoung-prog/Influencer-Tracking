import { useState } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { matchSuggestedTemplates } from '../../data/beautymaster/messageTemplates.js';
import { renderMessageTemplate } from '../../utils/renderMessageTemplate.js';
import { useSnackbar } from '../../hooks/useSnackbar.jsx';

/**
 * MessageTemplateMenu component
 *
 * Button + Menu for picking one of the outreach message templates for an
 * influencer. Templates whose trigger condition matches the influencer's
 * current alert state are listed under "Suggested"; all others are listed
 * under "All Messages". Selecting a template copies the rendered text
 * (placeholders filled in from the influencer) to the clipboard.
 *
 * Props:
 * @param {Influencer} influencer - Influencer to fill template placeholders from [Required]
 * @param {MessageTemplate[]} templates - Available message templates [Required]
 *
 * Example usage:
 * <MessageTemplateMenu influencer={influencer} templates={messageTemplates} />
 */
function MessageTemplateMenu({ influencer, templates }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notify, SnackbarComponent } = useSnackbar();

  if (!templates || templates.length === 0) return null;

  const suggested = matchSuggestedTemplates(templates, influencer);
  const suggestedIds = new Set(suggested.map(t => t.id));
  const others = templates.filter(t => !suggestedIds.has(t.id));

  const handleOpen = e => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = async template => {
    const text = renderMessageTemplate(template.body, influencer);
    try {
      await navigator.clipboard.writeText(text);
      notify('Copied to clipboard!', 'success');
    } catch {
      notify('Could not copy — please copy manually', 'error');
    }
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />}
        onClick={handleOpen}
      >
        Message
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {suggested.length > 0 && [
          <Typography key="suggested-label" variant="overline" color="text.secondary" sx={{ display: 'block', px: 2, pt: 0.5 }}>
            Suggested
          </Typography>,
          ...suggested.map(t => (
            <MenuItem key={t.id} onClick={() => handleSelect(t)}>{t.label}</MenuItem>
          )),
          <Divider key="suggested-divider" />,
        ]}
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', px: 2, pt: 0.5 }}>
          All Messages
        </Typography>
        {others.map(t => (
          <MenuItem key={t.id} onClick={() => handleSelect(t)}>{t.label}</MenuItem>
        ))}
      </Menu>
      <SnackbarComponent />
    </>
  );
}

export default MessageTemplateMenu;
