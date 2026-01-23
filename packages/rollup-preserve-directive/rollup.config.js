import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';

export default {
  input: ['./src/index.ts'],
  output: ['es', 'cjs'].map(e => ({
    format: e, // 打包模式
    entryFileNames: '[name].js', // 打包文件名
    preserveModules: true, // 保留独立模块结构（关键）
    preserveModulesRoot: 'src', // 保持 src 目录结构
    sourcemap: false, // 正式环境：关闭 source map
    exports: 'named', // 导出模式
    dir: `dist/${e}/`,
  })),
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.rollup.json',
      exclude: ['node_modules', 'test'],
    }),
    // 去除无用代码
    cleanup(),
    copy({
      targets: [
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
      ],
    }),
  ],
};
