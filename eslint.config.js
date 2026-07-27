// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // 대문자로 시작하는 식별자는 컴포넌트로 보고 미사용 검사에서 제외한다.
      // 이 설정에는 eslint-plugin-react가 없어 JSX 안에서만 쓰이는 식별자
      // (<Story />, <Icon />)를 "사용됨"으로 인식하지 못하기 때문 —
      // args까지 같은 규칙을 적용해야 Storybook 데코레이터와 컴포넌트 prop이
      // 오탐으로 잡히지 않는다.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
