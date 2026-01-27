import { esc } from '@color-pen/static';
import { createConstructor } from 'a-js-tools';
import { Data } from './class-data';
import { DevLog, DevLogType, DogOptions } from './type';
import { platform } from './util';

/**
 *
 * @param options 配置项
 * @returns 函数对象
 *
 */
const DogConstructor = createConstructor(Dog);

export { DogConstructor as Dog };

export type { DevLogType, DevLog } from './type';

/**
 * ## 创建 dev log 工厂函数
 * @param options - 配置项
 * @returns - dev log 工厂函数
 */
function Dog(this: DevLog, options?: DogOptions): DevLog {
  const data = new Data(options);
  /// 原始的调用方法，在 type 值变化时会触发该值的更替

  /**
   *  本体方法
   * @param str
   */
  const dog = (...str: unknown[]) => {
    data.info(str);
  };

  // 设置 prototype
  Object.setPrototypeOf(dog, this);

  // 设置属性和方法
  Object.defineProperties(this, {
    type: {
      get() {
        return data.type;
      },
      set(value: DevLogType) {
        data.type = value;
      },
    },
    fold: {
      get() {
        return data.fold;
      },
      set(value: boolean | undefined) {
        data.fold = Boolean(value);
      },
    },
    error: {
      value: (...str: unknown[]) => data.error(str),
      configurable: false,
      enumerable: false,
      writable: false,
    },
    warn: {
      value: (...str: unknown[]) => data.warn(str),
      configurable: false,
      enumerable: false,
      writable: false,
    },
  });

  return dog as unknown as DevLog;
}
/** 原型上添加 clear 方法 */
Dog.prototype.clear = () => {
  if (platform === 'browser') {
    console.clear();
  } else {
    console.log(esc.concat('c'));
  }
};

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
