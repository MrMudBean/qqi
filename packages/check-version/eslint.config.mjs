import globals from 'globals';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import tsParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: { globals: globals.browser },
    parser: tsParser,
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
  },
  eslint.configs.recommended, // 推荐的 eslint
  {
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      // 基础规则
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': [
        'error',
        {
          // 配置允许的标签
          definedTags: ['packageDocumentation'],
        },
      ],
      'jsdoc/check-types': 'error',

      // TypeScript 适配规则
      'jsdoc/no-types': 'error',
      'jsdoc/require-param-type': 'off', // 使用 TS 类型
      'jsdoc/require-returns-type': 'off', // 使用 TS 类型

      // 文档质量规则
      'jsdoc/require-description': [
        'error',
        {
          contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
        },
      ],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
    },
  },
  eslintConfigPrettier,
];
