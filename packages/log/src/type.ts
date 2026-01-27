export type DevLogType = boolean | 'info' | 'error' | 'all' | 'warn';

export type DevLog = {
  /**  打印信息本当作为 info 信息，在 type 为 `false`、`error`、`warn` 时不打印   */
  (...str: unknown[]): void;
  /**  当打印的版本为错误信息，在 type 为 `false`、`info`、`warn` 时不打印  */
  error: (...str: unknown[]) => void;
  /**  当打印的版本为警示信息，在 type 为 `false`、`info`、`error` 时不打印  */
  warn: (...str: unknown[]) => void;
  /**  node 平台执行依据  */
  name: '';
  /** 同名（方法）折叠 */
  fold: boolean;
  /**  开启打印的类型  */
  type: DevLogType;
  /**  清除控制台  */
  clear: () => void;
};

export type platform = 'node' | 'browser';

export interface PrivateFunc {
  error: (...str: unknown[]) => void;
  warn: (...str: unknown[]) => void;
  info: (...str: unknown[]) => void;
}

export type DogOptions =
  | {
      /**
       * ## 类型
       * 但是该值将被传入的系统参数覆盖
       */
      type?: DevLogType;
      /**  该值将以 name_dev 的形式配置允许打印 */
      name?: string;
      /** 同名文件打印消息是否折叠（控制台效果不明显） */
      fold?: boolean;
    }
  | string
  | boolean;
