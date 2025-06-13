import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/generated*.ts', // Example: ignore auto-generated API client files
    ],
  },

  // 1. Base ESLint and Prettier configuration for all files
  // This applies to .js, .ts, .vue (globally)
  {
    plugins: {
      '@typescript-eslint': tsPlugin, // Make TS plugin available globally for parserOptions
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules, // Apply prettier rules (disables conflicting ESLint rules)
      'prettier/prettier': 'error', // Report Prettier issues as ESLint errors
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        API: 'readonly', // Added API global
      },
    },
  },

  // 2. Vue specific configurations
  // Use eslint-plugin-vue's flat recommended config and customize
  ...pluginVue.configs['flat/recommended'].map((config) => ({
    ...config, // Spread the recommended Vue config
    // Ensure Vue files use the TS parser for <script lang="ts">
    // The recommended config might already set vue-eslint-parser for .vue files.
    // We need to ensure its parserOptions point to the TS parser.
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        parser: tsParser, // For <script lang="ts">
        project: ['./tsconfig.app.json', './tsconfig.node.json'], // Use specific tsconfigs
        extraFileExtensions: ['.vue'], // Allow ts-parser to process .vue files
      },
      globals: {
        // Add Vue specific globals
        ...config.languageOptions?.globals,
        'vue/setup-compiler-macros': 'readonly',
      },
    },
    plugins: {
      // Ensure all necessary plugins are registered for Vue files
      ...config.plugins,
      vue: pluginVue, // Already in pluginVue.configs['flat/recommended'] but explicit doesn't hurt
      '@typescript-eslint': tsPlugin, // Ensure TS plugin is available for Vue TS scripts
      prettier: prettierPlugin, // Ensure prettier is available
    },
    rules: {
      ...config.rules, // Start with rules from pluginVue.configs['flat/recommended']
      // Override or add Vue specific rules if needed
      // e.g. 'vue/no-v-html': 'warn',
      ...prettierConfig.rules, // IMPORTANT: Apply prettier overrides last for Vue files
      'prettier/prettier': 'error', // Ensure Prettier errors are reported
    },
  })),

  // 3. TypeScript specific configurations (for .ts files, not in .vue)
  {
    files: ['**/*.ts', '**/*.tsx'],
    // `excludedFiles` is not a valid key here.
    // Specificity of `files` patterns and `ignores` should handle this.
    plugins: {
      '@typescript-eslint': tsPlugin,
      // prettier is inherited from global if this config doesn't redefine plugins
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'], // Use specific tsconfigs
      },
    },
    rules: {
      ...tsPlugin.configs['eslint-recommended'].rules, // Overrides eslint:recommended for TS
      ...tsPlugin.configs.recommended.rules, // TS recommended rules
      // ...tsPlugin.configs['recommended-type-checked'].rules, // For type-aware rules (can be too strict initially)
      // Add any TS specific rule overrides here
      // Prettier rules are inherited from the base config
    },
  },
];
