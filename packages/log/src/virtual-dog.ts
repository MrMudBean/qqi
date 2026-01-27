/**
 * @packageDocumentation
 * @module @qqi/log/virtual-dog
 * @file virtual-dog.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-28 04:52
 * @version 1.1.0
 * @lastModified 2026-01-28 04:53
 */

import { createConstructor } from 'a-js-tools';
import { DevLog } from './type';

/**
 *
 */
function DogVirtualImt(this: DevLog): DevLog {
  /**
   *  模拟类的构建
   * @param _arg
   */
  const _dev = (..._arg: any[]) => {};

  Object.setPrototypeOf(_dev, this);

  Object.defineProperties(this, {
    info: {
      value: (..._: unknown[]) => {},
      configurable: false,
      writable: false,
    },
    warn: {
      value: (..._: unknown[]) => {},
      configurable: false,
      writable: false,
    },
    error: {
      value: (..._: unknown[]) => {},
      configurable: false,
      writable: false,
    },
    type: {
      get() {
        return false;
      },
      set(_: any) {},
    },
  });

  return _dev as DevLog;
}

DogVirtualImt.prototype.clear = console.clear;

/** 虚拟狗，没有实现不打印 */
const DogVirtualConstructor = createConstructor(DogVirtualImt);

export { DogVirtualConstructor as DogVirtual };
