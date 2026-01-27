/**
 * @packageDocumentation
 * @module @qqi/log/util
 * @file util.ts
 * @description 工具
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-28 03:11
 * @version 1.0.1
 * @lastModified 2026-01-28 03:16
 */

import { DevLogType } from '@qqi/log';
import { getRandomString, isNode } from 'a-js-tools';
import { isBoolean, isString, isUndefined } from 'a-type-of-js';
import { DogOptions } from './type';

export const typeList: DevLogType[] = [
  false,
  true,
  'all',
  'info',
  'error',
  'warn',
];

/**
 * ## 解析参数
 * @param options
 */
export function parseOption(options?: DogOptions): {
  name?: string;
  type?: DevLogType;
  fold?: boolean;
} {
  const result = {
    name: getRandomString(10),
    type: false,
    fold: false,
  };
  if (isUndefined(options)) return result;
  if (isBoolean(options)) {
    result.type = options;
    return result;
  }
  if (isString(options)) {
    // 处理 name
    result.name = options.trim().replace(/\s+/g, '_');
    return result;
  }
  if (isString(options.name)) {
    return {
      ...result,
      name: options.name.trim().replace(/\s+/g, '_'),
    };
  }
  return options;
}

/**
 * 获取当前的环境变量
 * @param name
 */
export function getEnv(name: string = getRandomString(10)): DevLogType {
  /**  当前获取环境值  */
  let _env: boolean | string = false;

  if (platform === 'node' && globalThis?.process?.env) {
    const processEnv = process.env;
    _env =
      processEnv[name.toUpperCase().concat('_DEV')] ||
      processEnv[name.toLowerCase().concat('_dev')] ||
      false;
  }

  const env =
    _env === 'false' ? false : _env === 'true' ? true : (_env as DevLogType);
  return env;
}

export const platform = isNode() ? 'node' : ('browser' as const);

/**
 * 设置 type 的类型
 * @param type 新的类型
 */
export function setType(type: DevLogType) {
  if (typeList.includes(type)) return type;
  return false;
}
