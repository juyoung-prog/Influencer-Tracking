import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { AppShell } from './components/layout/AppShell';
import { NavMenu } from './components/navigation/NavMenu';
import BeautymasterDashboard from './pages/beautymaster/BeautymasterDashboard';
import ComponentGalleryPage from './pages/ComponentGalleryPage';
import { defaultTheme as theme } from './styles/themes';

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: '/beautymaster', label: 'BeautyMaster', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { id: '/components',   label: 'Components',   icon: <GridViewOutlinedIcon fontSize="small" /> },
];

// ─── AppShell layout (wraps pages that need the GNB) ─────────────────────────

function AppShellLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <AppShell
      logo={
        <Typography
          component={Link}
          to="/"
          variant="subtitle1"
          sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none', letterSpacing: '-0.02em' }}
        >
          Vibe
        </Typography>
      }
      headerCollapsible={
        <NavMenu
          items={NAV_ITEMS}
          activeId={pathname}
          onItemClick={item => navigate(item.id)}
        />
      }
      headerHeight={56}
    >
      <Outlet />
    </AppShell>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Pages with AppShell GNB */}
          <Route element={<AppShellLayout />}>
            <Route path="/components" element={<ComponentGalleryPage />} />
          </Route>

          {/* Full-screen pages — no AppShell */}
          <Route path="/beautymaster" element={<BeautymasterDashboard />} />

          {/* Default redirect */}
          <Route index element={<Navigate to="/beautymaster" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
