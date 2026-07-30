/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  /* Codespaces 포워딩 도메인(*.app.github.dev)에서 dev 서버를 열려면 호스트를 허용해야 한다.
     Vite는 모르는 Host 헤더를 403 "Blocked request"로 막는데, GitHub 터널이 그 403을
     404로 바꿔 내보내서 "페이지를 찾을 수 없음"으로만 보인다 — 원인이 가려지는 조합이다.
     dev 서버에만 적용되며 빌드 산출물과는 무관하다. */
  server: { allowedHosts: ['.app.github.dev'] },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.js']
      }
    }]
  }
});