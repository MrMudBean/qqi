import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import { external } from '@qqi/rollup-external';

/** 生成  npm 文件的打包配置文件 */
export default {
  input: './eg/index.ts',
  output: {
    format: 'es',
    entryFileNames: '[name].js',
    preserveModules: false,
    sourcemap: false,
    exports: 'named',
    dir: '.eg/',
  },
  // 配置需要排除的包
  external: external({ ignore: ['node:', '@qqi/log'] }),
  plugins: [
    resolve(),
    commonjs(),
    // 可打包 json 内容
    json(),
    typescript({
      tsconfig: './tsconfig.rollup.json',
    }),
    // 去除无用代码
    cleanup(),
  ],
};
