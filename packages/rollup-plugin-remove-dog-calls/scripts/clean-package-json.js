import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  getDirectoryBy,
  fileExist,
} from 'a-node-tools';
import { readdirSync } from 'node:fs';
import { basename, extname } from 'node:path';

// 原始 package.json 内容
let packageJson = readFileToJsonSync('./package.json');
const dependencies = packageJson.dependencies;
// 移除冗余的键
[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
].forEach(key => delete packageJson[key]);
const esPrefix = 'es'; // es 前缀
const cjsPrefix = 'cjs'; // cjs 前缀
const dtsPrefix = 'es/src'; // 类型文件的前缀
// 查看当前打包 dist 文件路径
const distParentPath = getDirectoryBy('dist', 'directory');
// <--  !!! -->
// <--  !!! -->
// <--  !!! -->
// 查看当前的源码文件路径（原则上与上面值一致）
const srcParentDirectory = getDirectoryBy('src', 'directory');

packageJson = {
  ...packageJson,
  main: `${cjsPrefix}/index.js`,
  module: `${esPrefix}/index.mjs`,
  types: 'index.d.ts',
  author: {
    name: 'Mr.MudBean',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://lmssee.com',
  },
  sideEffects: false, // 如果是 react 等库包，可能需要使用 ['*.css' ,'*.scss' ,'*.sass', '*.less'] 或其他
  description: '',
  license: 'MIT',
  files: [cjsPrefix, esPrefix, 'LICENSE', 'README.md'],
  exports: {
    '.': {
      import: {
        default: './index.mjs',
        types: './index.d.ts',
      },
      require: {
        default: './index.cjs',
        types: './index.d.ts',
      },
    },
  },
  keywords: ['qqi', 'qqi'],
  homepage: 'https://lmssee.com',
  dependencies,
  bugs: {
    url: 'https://github.com/Mr.MudBean/qqi/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/Mr.MudBean/qqi.git',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  browserslist: ['> 1%', 'last 2 versions'], // 浏览器兼容
  engines: {
    node: '>=18.0.0',
  },
};

{
  // 整理打包后 package.json 文件路径
  const distPackagePath = pathJoin(distParentPath, './dist/package.json');
  // 写入新的 packages.json 文件
  writeJsonFileSync(distPackagePath, packageJson);
}
