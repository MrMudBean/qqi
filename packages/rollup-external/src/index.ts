import { copyTextToClipboard } from '@qqi/copy-text';
import { Dog } from '@qqi/log';
import {
  getPackageJsonSync,
  _p,
  isWindows,
  pathJoin,
  fileExist,
} from 'a-node-tools';
import {
  isNull,
  isString,
  isBusinessEmptyString,
  isTrue,
  isFalse,
  isEmptyArray,
  isArray,
} from 'a-type-of-js';
import { bgRedPen, cyanPen, hexPen } from 'color-pen';

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
 * - `include` 包含的包（想打包入结果的包）。优先级最高（譬如：src/ 这种需要 rollup 处理的）
 * - `ignore`  在排除的包却不需要在 dependencies 中的包，如: `node:stream` 等
 * - `exclude`  排除且在依赖项中的包（在构建发布后，不会因为依赖项缺失而导致包版本失效）
 *
 * 注： `exclude` 是使用完全
 *
 * @param options 配置项参数
 * @param options.exclude 排除项，该项将默认包含 "package.json" 文件中的 `dependencies` 及 `peerDependencies` 的依赖包（包在忽略时使用 `Object.is` 比较）
 * @param options.ignore 忽略项，该项与 `exclude` 类似，但是
 * @param options.include
 * @param logInfo
 */
export function external(
  options?: {
    /**  排除且在依赖项中的包（在构建发布后，不会因为依赖项缺失而导致包版本失效）  */
    exclude?: string[] | string;
    /**  在排除的包却不需要在 dependencies  中的包，如： node:stream 等  */
    ignore?: string[] | string;
    /**
     * 包含的包（打包入结果的包）。优先级最高（譬如：src/ 这种需要 rollup 处理的）。
     *
     * 但是该项不像 ignore 和 exclude 是 `startsWith` 匹配，该项是完整权等匹配  */
    include?: string[] | string;
  },
  /** 打印消息 */
  logInfo: boolean = false,
) {
  if (logInfo) dog.type = true;
  const { exclude, ignore, include } = parseParameter(options);
  dog('当前的工作路径', process.cwd());
  const packageContent = getPackageJsonSync();
  if (isNull(packageContent) || !packageContent?.content?.name)
    throw new RangeError('package.json 文件不存在');

  const packInfo = packageContent.content;
  /**  已配置的依赖  */
  const dependencies = Object.keys({
    ...(packInfo.dependencies || {}),
    ...(packInfo.peerDependencies || {}),
  });

  const ignorePkg = isEmptyArray(ignore)
    ? dependencies
    : [...ignore, ...dependencies];
  /** 配置需要不打包进生产包的包名配置 （这就保证了 excludedRegExp 非空 ） */
  const excludedPkg = isEmptyArray(exclude) ? ['node:'] : exclude;
  const excludedRegExp = new RegExp(
    '^'.concat([...ignorePkg, ...excludedPkg].join('|^')),
  );
  dog('排除的包', excludedPkg);
  dog('执行校验的数组', excludedRegExp);
  // 实际执行的方法
  return (id: string) => {
    dog('本次检测的 id', id);
    const cwd = process.cwd();
    dog('当前执行的路径', cwd);
    dog('当前提供的 id 是否为文件', fileExist(pathJoin(cwd, id)));
    if (id.startsWith(cwd) && fileExist(id)) {
      dog('是存在的绝对路径的文件');
      return false;
    } else if (fileExist(pathJoin(cwd, id))) {
      dog('是存在的相对路径的文件');
      return false;
    }

    if (include.includes(id)) {
      // 包存在于 included 中，直接交给 rollup 处理
      dog(`${cyanPen(id)} 被显式声明打包`);
      return false;
    }
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
        const msg = `${pen(id)} ${copy(id)} 依赖被排除打包却未在 package.json 中配置`;
        dog.error(msg);
        _p(msg);
        process.exit(1);
      }
    }
    // 包不存在于配置中，但是却是非本地包
    else if (/^[^./]/g.test(id)) {
      const msg = `${pen(id)}  ${copy(id)}  依赖未被排除，打包关闭`;
      dog.error(msg);
      _p(msg);
      process.exit(1);
    }
    return result;
  };
}

/**
 *  复制
 * @param str 待赋复制的文本
 */
function copy(str: string) {
  str = isWindows ? str.replace(/[\\]/gm, '\\\\') : str;
  return copyTextToClipboard(str) === str ? hexPen('#666')`已复制` : '';
}

/**
 * 校验是否是字符串数组并返回格式化后标准的数组
 * @param arr 待转化的数组
 */
function isStrArr(arr: undefined | string | string[]): string[] {
  if (!isArray(arr)) return [];
  if (isString(arr)) return [arr];
  return arr.filter(e => isString(e) && !isBusinessEmptyString(e));
}

/**
 * 解析参数
 * @param options 参数项
 * @param options.exclude 排除项
 * @param options.ignore 忽略项
 * @param options.include 包含项
 */
function parseParameter(options?: {
  exclude?: string | string[];
  ignore?: string | string[];
  include?: string | string[];
}) {
  return {
    exclude: isStrArr(options?.exclude),
    ignore: isStrArr(options?.ignore),
    include: isStrArr(options?.include),
  };
}
