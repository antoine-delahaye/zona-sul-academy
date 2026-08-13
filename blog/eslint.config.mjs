import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default defineConfig([
  globalIgnores(['dist/**', '.angular/**', 'worker-configuration.d.ts']),

  // Config files: plain JS linting, no type information available.
  {
    files: ['*.mjs'],
    extends: [eslint.configs.recommended],
  },

  {
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],

      // Angular v22 idioms.
      '@angular-eslint/prefer-service-decorator': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-host-metadata-property': 'error',
      '@angular-eslint/consistent-component-styles': 'error',
      '@angular-eslint/inject-at-top': 'error',
      '@angular-eslint/use-component-selector': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'error',

      // Signal footguns that fail silently at runtime.
      '@angular-eslint/no-uncalled-signals': 'error',
      '@angular-eslint/computed-must-return': 'error',
      '@angular-eslint/no-implicit-take-until-destroyed': 'error',

      // Surface unstable Angular APIs instead of depending on them by accident.
      '@angular-eslint/no-developer-preview': 'warn',
      '@angular-eslint/no-experimental': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      // For strings `||` and `??` genuinely differ: Sanity returns empty strings
      // for cleared fields, and those must fall through to the next fallback.
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { string: true } },
      ],
    },
  },

  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // Native control flow and modern template syntax only.
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-at-else': 'error',
      '@angular-eslint/template/prefer-at-empty': 'error',
      '@angular-eslint/template/prefer-contextual-for-variables': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-class-binding': 'error',
      '@angular-eslint/template/prefer-built-in-pipes': 'error',
      '@angular-eslint/template/prefer-template-literal': 'error',
      '@angular-eslint/template/no-empty-control-flow': 'error',
      '@angular-eslint/template/require-switch-default': 'error',

      // Images must go through NgOptimizedImage.
      '@angular-eslint/template/prefer-ngsrc': 'error',

      // `$any()` hides model bugs; fix the type instead.
      '@angular-eslint/template/no-any': 'error',

      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/no-inline-styles': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/attributes-order': 'error',
    },
  },

  // Tests may lean on non-null assertions and loose typing for fixtures.
  {
    files: ['src/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
]);
