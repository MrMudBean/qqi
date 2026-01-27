/**
 * @packageDocumentation
 * @module @qqi/log/class-data
 * @file class-data.ts
 * @description 数据中心
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-28 02:59
 * @version 1.0.1
 * @lastModified 2026-01-28 03:51
 */

import { getRandomString } from 'a-js-tools';
import { pen } from 'color-pen';
import { DevLogType, DogOptions } from './type';
import { getEnv, parseOption, platform, setType } from './util';

/**
 * ## 数据
 */
export class Data {
  name: string;

  type: DevLogType;

  fold: boolean;

  private mark: string = '';

  /**
   *
   * @param options
   */
  constructor(options?: DogOptions) {
    const _p = parseOption(options);
    this.name = _p.name || getRandomString(12);
    this.fold = Boolean(_p.fold);
    const env = getEnv(this.name);
    let type = _p.type || false;
    /**  默认 node 环境以获取到的环境值为准，而非 node 环境默认开启，并通过自定义的 @qqi/babel-plugin-remove-dog-calls 来进行过滤正式环境（环境值需要自定义） */
    this.type = platform === 'node' ? setType(env ?? type) : true;
  }

  /**
   *
   * @param msg
   */
  info(msg: unknown[]) {
    if (this.type === 'all' || this.type === 'info' || this.type === true) {
      const prefix = this.prefix('info');
      console.log(prefix, ...msg);
    }
  }

  /**
   * @param msg
   */
  warn(msg: unknown[]) {
    if (this.type === 'all' || this.type === 'warn' || this.type === true) {
      const prefix = this.prefix('warn');
      console.warn(prefix, ...msg);
    }
  }

  /**
   *
   * @param msg
   */
  error(msg: unknown[]) {
    if (this.type === 'all' || this.type === 'error' || this.type === true) {
      const prefix = this.prefix('error');
      console.error(prefix, ...msg);
    }
  }

  /**
   * ## 解析 error
   * @param type
   */
  prefix(type: DevLogType) {
    try {
      throw new Error();
    } catch (error) {
      const parseErrorResult = ((error as Error).stack?.split('\n') || []).map(
        item => {
          const reg = /at\s(.*)\s\((.*):(\d*):(\d*)\)/;
          const res = reg.exec(item);
          if (res) {
            return {
              name: res[1],
              path: res[2],
              line: res[3],
              column: res[4],
            };
          }
          return {
            name: '',
          };
        },
      );

      const result = parseErrorResult.filter(
        e => e.name !== '' && e.path !== undefined,
      );

      const res = result[3] ?? result[2] ?? result[1] ?? result[0];

      const startStr = ` ${type === 'info' ? '💡' : type === 'error' ? '❌' : '⚠️ '} ${new Date().toLocaleString()} `;

      const printStartPenStr = (
        type === 'info'
          ? pen.bgCyan.brightWhite
          : type === 'error'
            ? pen.bgBlack.red
            : pen.bgBrightYellow.brightGreen
      )(startStr);

      const mark = res?.name ?? '';

      if (this.fold && mark) {
        if (mark === this.mark) {
          // 不处理
        } else {
          if (this.mark) {
            console.groupEnd();
          }
          console.groupCollapsed(mark);
        }
      }

      this.mark = mark;
      return `${printStartPenStr} ${mark}  ${res?.line?.concat(' 行')} ${res?.column?.concat(' 列')}`;
    }
  }
}
