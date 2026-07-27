import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import BeautymasterDashboard from '../../pages/beautymaster/BeautymasterDashboard';

const STORAGE_KEY = 'beautymaster:sheetConfig';

const MOCK_CONFIG = {
  processingCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-MOCK/pub?output=csv',
  doneCsvUrl: '',
  pollingIntervalMs: 60000,
};

/**
 * 페이지가 useSearchParams로 ?ui 플래그를 읽으므로 라우터 컨텍스트가 필요하다.
 *
 * @param {string} route - 초기 경로 (쿼리 포함)
 * @returns {function} Storybook 데코레이터
 */
const withRoute = route => Story => (
  <MemoryRouter initialEntries={[route]}>
    <Story />
  </MemoryRouter>
);

/**
 * @param {object|null} config - localStorage에 심을 시트 설정. null이면 제거(최초 진입 상태)
 * @returns {function} Storybook 데코레이터
 */
const withConfig = config => Story => {
  useEffect(() => {
    if (config) localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    else localStorage.removeItem(STORAGE_KEY);
    return () => localStorage.removeItem(STORAGE_KEY);
  }, []);
  return <Story />;
};

export default {
  title: 'BeautyMaster/Page/Dashboard',
  parameters: {
    layout: 'fullscreen',
  },
};

/** First-time experience — no config in localStorage */
export const SetupScreen = {
  name: 'Setup screen (no config)',
  decorators: [withConfig(null), withRoute('/beautymaster')],
  render: () => <BeautymasterDashboard />,
};

/** Dashboard connected — data comes from useSheetData / useCsvPolling */
export const Connected = {
  name: 'Connected (real polling)',
  decorators: [withConfig(MOCK_CONFIG), withRoute('/beautymaster')],
  render: () => <BeautymasterDashboard />,
};

/** 리뉴얼 후보 UI — ?ui=saas면 같은 데이터를 flat-SaaS 셸로 렌더한다 */
export const SaasUi = {
  name: 'flat-SaaS UI (?ui=saas)',
  decorators: [withConfig(MOCK_CONFIG), withRoute('/beautymaster?ui=saas')],
  render: () => <BeautymasterDashboard />,
};
