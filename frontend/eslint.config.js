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
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // shadcn/ui primitives are generated, copy-paste components. They import
    // React for typing and co-export CVA variants alongside the component —
    // both are intentional, so relax the two rules that flag them here.
    files: ['src/components/ui/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // Context modules intentionally export a provider component plus a hook.
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': ['warn', { allowExportNames: ['useBoards', 'useTheme'] }],
    },
  },
])
