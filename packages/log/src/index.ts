import { createConstructor, getRandomString } from 'a-js-tools';
import { DevLog, DevLogType, DogOptions, PrivateFunc } from './type';
import { setType } from './setType';
import { blankCall } from './blankCall';
import { managePrint } from './managePrint';
import { isBoolean, isString, isUndefined } from 'a-type-of-js';
import { platform } from './platform';
import { esc } from '@color-pen/static';

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
  const _option = parseOption(options);
  const name = _option.name || '';
  let type = _option.type || false;
  const env = getEnv(name);
  /**  默认 node 环境以获取到的环境值为准，而非 node 环境默认开启，并通过自定义的 @qqi/babel-plugin-remove-dog-calls 来进行过滤正式环境（环境值需要自定义） */
  type = platform === 'node' ? setType(env ?? type) : true;

  /// 原始的调用方法，在 type 值变化时会触发该值的更替
  // 私有方法 error
  const _privateFunc: PrivateFunc = {
    error: blankCall,
    warn: blankCall,
    info: blankCall,
  };

  managePrint(type, _privateFunc, name);

  /**  本体方法  */
  const dog = (...str: unknown[]) => {
    Reflect.apply(_privateFunc.info, this, str);
  };

  // 设置 prototype
  Object.setPrototypeOf(dog, this);

  // 设置属性和方法
  Object.defineProperties(this, {
    type: {
      get() {
        return type || false;
      },
      set(value: DevLogType) {
        const new_type = setType(value);
        if (new_type !== type) {
          type = new_type;
          managePrint(type, _privateFunc, name);
        }
      },
    },
    error: {
      value: (...str: unknown[]) =>
        Reflect.apply(_privateFunc.error, this, str),
      configurable: false,
      enumerable: false,
      writable: false,
    },
    warn: {
      value: (...str: unknown[]) => Reflect.apply(_privateFunc.warn, this, str),
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
 * ## 解析参数
 */
function parseOption(options?: DogOptions): {
  name?: string;
  type?: DevLogType;
} {
  const result = {
    name: getRandomString(10),
    type: false,
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
 */
function getEnv(name: string = getRandomString(10)): DevLogType {
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
