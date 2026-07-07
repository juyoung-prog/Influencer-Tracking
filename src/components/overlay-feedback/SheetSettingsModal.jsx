import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const INTERVAL_OPTIONS = [
  { value: 30000,  label: '30 seconds' },
  { value: 60000,  label: '60 seconds' },
  { value: 120000, label: '2 minutes' },
  { value: 300000, label: '5 minutes' },
];

/**
 * Converts a Google Sheets URL to a CSV export URL.
 * Accepts pubhtml URLs (with or without ?gid=) and preserves the gid when present.
 * Also accepts plain "탭 우클릭 → 링크 복사" edit URLs (spreadsheets/d/{ID}/edit#gid=…),
 * which is the more common copy-link format and has no /d/e/ published segment.
 *
 * @param {string} url
 * @returns {string|null}
 */
function toCsvUrl(url) {
  if (!url) return null;
  const gidMatch = url.match(/[?&#]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '';

  const publishedMatch = url.match(/spreadsheets\/d\/e\/([^/?#]+)/);
  if (publishedMatch) {
    return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/pub?output=csv${gid ? `&gid=${gid}` : ''}`;
  }

  const plainMatch = url.match(/spreadsheets\/d\/([^/?#]+)/);
  if (plainMatch) {
    return `https://docs.google.com/spreadsheets/d/${plainMatch[1]}/export?format=csv${gid ? `&gid=${gid}` : ''}`;
  }

  return null;
}

function emptySource() {
  return { label: '', processingUrl: '', doneUrl: '' };
}

/**
 * SheetSettingsModal component
 *
 * Dialog for configuring one or more Google Sheets connections (multi-source).
 * Each source has a label, Processing tab URL, and optional Done tab URL.
 *
 * Props:
 * @param {boolean} open - Whether the dialog is open [Required]
 * @param {function} onClose - Close handler [Required]
 * @param {object|null} config - Current saved config to pre-fill fields [Optional]
 * @param {function} onSave - (config) => void — called after successful save [Required]
 * @param {string[]} stores - Available store options for Default store dropdown [Optional]
 *
 * Example usage:
 * <SheetSettingsModal open={open} onClose={handleClose} config={config} onSave={saveConfig} stores={stores} />
 */
function SheetSettingsModal({ open, onClose, config = null, onSave, stores = [] }) {
  const initialSources = config?.sources?.length
    ? config.sources.map(s => ({
        label: s.label || '',
        processingUrl: s.processingCsvUrl || '',
        doneUrl: s.doneCsvUrl || '',
      }))
    : [emptySource()];

  const [sources, setSources] = useState(initialSources);
  const [interval, setInterval] = useState(config?.pollingIntervalMs ?? 60000);
  const [defaultStore, setDefaultStore] = useState(config?.defaultStore ?? 'all');
  const [testStatuses, setTestStatuses] = useState({});  // { index: 'idle'|'testing'|'success'|'error' }
  const [testErrors, setTestErrors]     = useState({});  // { index: string }

  function updateSource(idx, key, value) {
    setSources(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s));
    if (key === 'processingUrl') {
      setTestStatuses(prev => ({ ...prev, [idx]: 'idle' }));
      setTestErrors(prev => ({ ...prev, [idx]: '' }));
    }
  }

  function addSource() {
    setSources(prev => [...prev, emptySource()]);
  }

  function removeSource(idx) {
    setSources(prev => prev.filter((_, i) => i !== idx));
    setTestStatuses(prev => { const n = { ...prev }; delete n[idx]; return n; });
    setTestErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
  }

  async function handleTest(idx) {
    const csvUrl = toCsvUrl(sources[idx].processingUrl);
    if (!csvUrl) return;
    setTestStatuses(prev => ({ ...prev, [idx]: 'testing' }));
    setTestErrors(prev => ({ ...prev, [idx]: '' }));
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text || text.trim().length === 0) throw new Error('Empty response — check the URL');
      setTestStatuses(prev => ({ ...prev, [idx]: 'success' }));
    } catch (err) {
      setTestStatuses(prev => ({ ...prev, [idx]: 'error' }));
      setTestErrors(prev => ({ ...prev, [idx]: err.message }));
    }
  }

  const validSources  = sources.filter(s => toCsvUrl(s.processingUrl));
  const hasTestError  = Object.values(testStatuses).some(s => s === 'error');
  const isTesting     = Object.values(testStatuses).some(s => s === 'testing');
  const canSave       = validSources.length > 0 && !hasTestError && !isTesting;

  function handleSave() {
    const processedSources = sources
      .filter(s => toCsvUrl(s.processingUrl))
      .map(s => ({
        label: s.label,
        processingCsvUrl: toCsvUrl(s.processingUrl),
        doneCsvUrl: toCsvUrl(s.doneUrl) ?? '',
      }));
    onSave?.({ sources: processedSources, pollingIntervalMs: interval, defaultStore });
    onClose?.();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
        <SettingsOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        Google Sheets Settings
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5, lineHeight: 1.6 }}>
          각 시트 탭의 <strong>Publish to web</strong> 링크 또는 탭 우클릭 → 링크 복사 URL을 붙여넣으세요.
        </Typography>

        {/* ── Source list ── */}
        {sources.map((src, idx) => {
          const csvUrl    = toCsvUrl(src.processingUrl);
          const doneCsv   = toCsvUrl(src.doneUrl);
          const status    = testStatuses[idx] ?? 'idle';
          const testError = testErrors[idx] ?? '';
          const canTest   = Boolean(csvUrl);

          return (
            <Box
              key={idx}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                mb: 1.5,
              }}
            >
              {/* Source header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <TextField
                  label="Label"
                  placeholder="GA, FL, G10…"
                  value={src.label}
                  onChange={e => updateSource(idx, 'label', e.target.value)}
                  size="small"
                  sx={{ width: 120 }}
                />
                {sources.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => removeSource(idx)}
                    sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Processing URL */}
              <TextField
                label="Processing tab URL"
                placeholder="https://docs.google.com/spreadsheets/d/e/…/pubhtml"
                value={src.processingUrl}
                onChange={e => updateSource(idx, 'processingUrl', e.target.value)}
                fullWidth
                size="small"
                required
                sx={{ mb: 0.5 }}
                helperText={csvUrl
                  ? `→ ${csvUrl}`
                  : src.processingUrl ? 'URL 형식을 확인하세요' : '탭 우클릭 → 링크 복사'}
                error={Boolean(src.processingUrl && !csvUrl)}
                FormHelperTextProps={{ sx: { fontFamily: 'monospace', fontSize: 10, wordBreak: 'break-all' } }}
              />

              {/* Done URL */}
              <TextField
                label="Done tab URL (optional)"
                placeholder="https://docs.google.com/spreadsheets/d/e/…/pubhtml?gid=…"
                value={src.doneUrl}
                onChange={e => updateSource(idx, 'doneUrl', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1.5, mt: 1 }}
                helperText={doneCsv
                  ? `→ ${doneCsv}`
                  : src.doneUrl ? 'URL 형식을 확인하세요' : '없으면 비워두세요'}
                error={Boolean(src.doneUrl && !doneCsv)}
                FormHelperTextProps={{ sx: { fontFamily: 'monospace', fontSize: 10, wordBreak: 'break-all' } }}
              />

              {/* Test row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleTest(idx)}
                  disabled={!canTest || status === 'testing'}
                  sx={{ flexShrink: 0 }}
                >
                  {status === 'testing' ? 'Testing…' : 'Test'}
                </Button>
                {status !== 'idle' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {status === 'testing' && <CircularProgress size={14} />}
                    {status === 'success' && <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                    {status === 'error'   && <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                    <Typography
                      variant="caption"
                      sx={{ color: status === 'success' ? 'success.main' : status === 'error' ? 'error.main' : 'text.secondary' }}
                    >
                      {status === 'testing' && 'Connecting…'}
                      {status === 'success' && 'Connected'}
                      {status === 'error'   && testError}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}

        {/* Add source button */}
        <Button
          startIcon={<AddIcon />}
          size="small"
          variant="text"
          onClick={addSource}
          sx={{ mb: 2.5 }}
        >
          Add another sheet
        </Button>

        <Divider sx={{ mb: 2 }} />

        {/* Global settings */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Polling interval</InputLabel>
            <Select
              value={interval}
              label="Polling interval"
              onChange={e => setInterval(e.target.value)}
            >
              {INTERVAL_OPTIONS.map(o => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
            <FormHelperText>How often to check for updates</FormHelperText>
          </FormControl>

          {stores.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Default store</InputLabel>
              <Select
                value={defaultStore}
                label="Default store"
                onChange={e => setDefaultStore(e.target.value)}
              >
                <MenuItem value="all">All Stores</MenuItem>
                {stores.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Filter on app open</FormHelperText>
            </FormControl>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button size="small" onClick={onClose} sx={{ mr: 'auto' }}>Cancel</Button>
        <Button
          variant="contained"
          size="small"
          disableElevation
          onClick={handleSave}
          disabled={!canSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SheetSettingsModal;
