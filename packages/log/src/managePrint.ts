import { isUndefined } from 'a-type-of-js';
import { notSupport } from './notSupport';
import { platform } from './platform';
import { DevLogType, PrivateFunc } from './type';
import { blankCall } from './blankCall';

import { printError } from './printError';
import { printWarn } from './printWarn';
import { printInfo } from './printInfo';
import { typeList } from './setType';

/**  管理是否打印  */
export function managePrint(
  type: DevLogType,
  privateFunc: PrivateFunc,
  name: string,
) {
  if (platform === 'node') {
    const dev =
      globalThis?.process.env[name.toUpperCase().concat('_DEV')] ||
      globalThis?.process.env[name.toLowerCase().concat('_dev')];
    /// 当前禁止使用打印
    /// node 环境未配置 NAME_DEV 环境变量
    /// 显式配置 NAME_DEV 环境变量为 false
    if (type === false || isUndefined(dev) || dev === 'false') {
      return Reflect.apply(notSupport, privateFunc, []);
    }
    /// 将显示配置环境变量的值给 type
    if ([...typeList, 'true', 'false'].includes(dev)) {
      type = dev === 'true' ? 'all' : (dev as DevLogType);
    }

    privateFunc.info = ['all', 'info', true].includes(type)
      ? printInfo
      : blankCall;
    privateFunc.error = ['all', 'error', true].includes(type)
      ? printError
      : blankCall;
    privateFunc.warn = ['all', 'warn', true].includes(type)
      ? printWarn
      : blankCall;
  }
  // 在 非 node 环境始终执行，搭配 @qqi/babel-plugin-remove-dog-calls 使用
  else {
    if (type === false) return Reflect.apply(notSupport, privateFunc, []);

    privateFunc.info = ['all', 'info', true].includes(type)
      ? printInfo
      : blankCall;
    privateFunc.error = ['all', 'error', true].includes(type)
      ? printError
      : blankCall;
    privateFunc.warn = ['all', 'warn', true].includes(type)
      ? printWarn
      : blankCall;
  }
}
