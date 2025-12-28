import { Dog } from '@qqi/log';
import {
  isNull,
  isUndefined,
  isPlainObject,
  isString,
  isBusinessEmptyString,
  isTrue,
  isFalse,
  isEmptyArray,
} from 'a-type-of-js';
import {
  _p,
  getDirectoryBy,
  isWindows,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
  fileExist,
} from 'a-node-tools';
import { bgRedPen, hexPen } from 'color-pen';
import { copyTextToClipboard } from '@qqi/copy-text';

/**  一个展示 🖊️  */
const pen = bgRedPen.blink.bold.yellow;

const dog = new Dog({
  name: 'qqi rollup external',
  type: false,
});

/**
 *
 * 依赖配置
 *
 * - include   包含的包（想打包入结果的包）。优先级最高（譬如：src/ 这种需要 rollup 处理的）
 * - ignore  在排除的包却不需要在 dependencies 中的包，如: node:stream 等
 * - exclude  排除且在依赖项中的包（在构建发布后，不会因为依赖项缺失而导致包版本失效）
 *
 */
export function external(options?: {
  /**  排除且在依赖项中的包（在构建发布后，不会因为依赖项缺失而导致包版本失效）  */
  exclude?: string[] | string;
  /**  在排除的包却不需要在 dependencies  中的包，如： node:stream 等  */
  ignore?: string[] | string;
  /**
   * 包含的包（想打包入结果的包）。优先级最高（譬如：src/ 这种需要 rollup 处理的）。
   *
   * 但是该项不像 ignore 和 exclude 是 `startsWith` 匹配，该项是完整权等匹配  */
  include?: string[] | string;
}) {
  dog('初始化的参数', options);
  if (isUndefined(options))
    options = {
      exclude: [],
      ignore: [],
      include: [],
    };

  if (!isPlainObject(options)) {
    dog('当前处理后的参数非对象，返回函数');
    return () => true;
  }
  if (isUndefined(options.exclude)) options.exclude = [];
  if (typeof options.exclude === 'string')
    options.exclude = [options.exclude.toString()];
  options.exclude?.forEach((e, i, a) => {
    if (!isString(e)) a[i] = '';
  });
  options.exclude = options.exclude?.filter(e => !isBusinessEmptyString(e));
  dog('处理完 exclude 的参数', options);
  if (isUndefined(options.ignore)) options.ignore = [];
  if (typeof options.ignore === 'string') options.ignore = [options.ignore];
  options.ignore?.forEach((e, i, a) => {
    if (!isString(e)) a[i] = '';
  });
  options.ignore = options.ignore?.filter(e => !isBusinessEmptyString(e));
  if (isUndefined(options.include)) options.include = [];
  if (typeof options.include === 'string') options.include = [options.include];
  options.include?.forEach((e, i, a) => {
    if (!isString(e)) a[i] = '';
  });
  options.include = options.include?.filter(e => !isBusinessEmptyString(e));
  dog('处理完的参数', options);

  const { exclude, ignore, include } = options;

  dog('当前的工作路径', process.cwd());

  const packageDir = getDirectoryBy('package.json', 'file');

  if (isUndefined(packageDir)) throw new RangeError('package.json 文件不存在');

  const packagePath = pathJoin(packageDir, 'package.json');
  /**  读取当前文件  */
  const packInfo = readFileToJsonSync<PackageJson>(packagePath);

  if (isNull(packInfo)) throw new RangeError('package.json 文件不存在');

  /**  已配置的依赖  */
  const dependencies = Object.keys({
    ...(packInfo.dependencies || {}),
    ...(packInfo.preDependencies || {}),
  });

  const ignorePkg = isEmptyArray(ignore)
    ? dependencies
    : [...ignore, ...dependencies];
  /** 配置需要不打包进生产包的包名配置 （这就保证了 excludedRegExp 非空 ） */
  const excludedPkg = isEmptyArray(exclude) ? ['node:'] : exclude;

  const excludedRegExp = new RegExp(
    '^'.concat([...ignorePkg, ...excludedPkg].join('|^')),
  );
  // 由于参数的强校验，这里被省略了
  // const includedPkg = isUndefined(include) || !isArray(include) ? [] : include;

  return (id: string) => {
    dog('本次检测的 id', id);
    const cwd = process.cwd();
    dog('当前执行的路径', cwd);
    dog('当前提供的 id 是否为文件', fileExist(pathJoin(cwd, id)));
    if (id.startsWith(cwd) || fileExist(pathJoin(cwd, id))) {
      dog('由于是本地文件本次跳过');
      return false;
    }

    if (include.includes(id))
      // 包存在于 included 中，直接交给 rollup 处理
      return false;
    // 重制识别位置
    excludedRegExp.lastIndex = 0;
    /**  是否在设定排除之外（包含要忽略的包）  */
    const result = excludedRegExp.test(id);
    /// 保证排除的包纯在于
    if (isTrue(result)) {
      if (
        // 检测到了包名存在于配置中
        isFalse(dependencies.includes(id)) &&
        ignorePkg.every(e => !id.startsWith(e))
      ) {
        _p(`${pen(id)} ${copy(id)} 依赖被排除打包却未在 package.json 中配置`);
        process.exit(1);
      }
    }
    // 包不存在于配置中，但是却是非本地包
    else if (/^[^./]/g.test(id)) {
      _p(`${pen(id)}  ${copy(id)}  依赖未被排除，打包关闭`);
      process.exit(1);
    }
    return result;
  };
}

/**  复制  */
function copy(str: string) {
  str = isWindows ? str.replace(/[\\]/gm, '\\\\') : str;
  return copyTextToClipboard(str) === str ? hexPen('#666')`已复制` : '';
}
