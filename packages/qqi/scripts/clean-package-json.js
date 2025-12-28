import {
  pathJoin,
  readFileToJsonSync,
  getDirectoryBy,
  writeJsonFile,
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
  main: cjsPrefix + '/index.js', // 旧版本 CommonJs 入口
  module: esPrefix + '/index.js', // 旧版本 ESM 入口
  types: dtsPrefix + '/index.d.ts', // 旧版本类型入口
  author: {
    name: '泥豆君',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://earthnut.dev',
  },
  description: '简单的文件读写',
  sideEffects: false, // 核心：开启 Tree Shaking
  license: 'MIT',
  files: [cjsPrefix, esPrefix, 'LICENSE', 'README.md'],
  exports: {
    '.': {
      import: `./${esPrefix}/index.js`,
      default: `./${esPrefix}/index.js`,
      require: `./${cjsPrefix}/index.js`,
      types: `./${dtsPrefix}/index.d.ts`,
    },
  },
  keywords: ['qqi', '文件读写', '数据储存'],
  homepage: 'https://earthnut.dev/npm/qqi/core',
  dependencies,
  bugs: {
    url: 'https://github.com/MrMudBean/qqi/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/MrMudBean/qqi.git',
    directory: 'packages/qqi',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  engines: {
    // 新增：声明 Node.js 兼容版本
    node: '>=18.0.0',
  },
};

{
  // 整理打包后 package.json 文件路径
  const distPackagePath = pathJoin(distParentPath, './dist/package.json');
  // 写入新的 packages.json 文件
  writeJsonFile(distPackagePath, packageJson);
}
