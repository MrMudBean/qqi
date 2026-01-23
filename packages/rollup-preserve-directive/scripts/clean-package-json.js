import {
  pathJoin,
  readFileToJsonSync,
  writeJsonFileSync,
  getDirectoryBy,
} from 'a-node-tools';

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

packageJson = {
  ...packageJson,
  main: `${cjsPrefix}/index.js`,
  module: `${esPrefix}/index.js`,
  types: 'es/src/index.d.ts',
  author: {
    name: 'MrMudBean',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://lmssee.com',
  },
  description: '使用 rollup 打包时保留 `use client/server` 指令',
  license: 'MIT',
  files: [cjsPrefix, esPrefix, 'LICENSE', 'README.md'],
  exports: {
    '.': {
      import: './es/index.js',
      default: './es/index.js',
      types: './es/src/index.d.ts',
      require: './cjs/index.js',
    },
  },
  keywords: [
    'rollup',
    'preserve directive',
    'rollup preserve directive',
    'rollup 保留指令',
  ],
  homepage: 'https://www.npmjs.com/package/@qqi/rollup-preserve-directive',
  dependencies,
  bugs: {
    url: 'https://github.com/MrMudBean/qqi/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/MrMudBean/qqi.git',
    directory: 'packages/rollup-preserve-directive',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
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
