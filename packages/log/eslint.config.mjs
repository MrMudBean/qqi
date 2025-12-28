import globals from 'globals';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

export default [
  // 基础 JS 规则（仅应用于 JS/JSX）
  {
    files: ['src/**/*.{js,jsx}', 'scripts/**/*.{js,jsx}'],
    // 基础的 eslint 推荐规则（适用于所有文件）
    ...eslint.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // TS/JS 专属配置
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ...config.languageOptions,
      globals: globals.browser,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: './tsconfig.rollup.json', // 类型感知规则
        tsconfigRootDir: import.meta.dirname,
      },
    },
  })),
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
