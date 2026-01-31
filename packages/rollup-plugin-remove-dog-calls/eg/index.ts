/**
 * @module @qqi/rollup-plugin-remove-dog-calls/index
 * @file index.ts
 * @description 测试
 * @author Mr.MudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ Mr.MudBean
 * @since 2026-02-01 02:32
 * @version 0.0.0
 * @lastModified 2026-02-01 02:41
 */

import { dog, dun } from './dog';

dog.type = true;
console.log('dog 测试前打印消息');
dog('测试 dog');
dog.warn('测试 dog.warn()');
dog.error('测试 dog.error()');
dog.type = false;

if (dun) {
  console.log('打印于 dun 之中');
}
console.log('dog 测试后打印消息');
