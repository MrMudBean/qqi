import { isNode } from 'a-js-tools';
import { execSync } from 'node:child_process';

/**
 *
 * 赋值文本到剪切板
 *
 * windows、mac 默认支持，而 linux 需要安装第三方的插件
 *
 *
 */
export function copyTextToClipboard(str: string) {
  if (!isNode()) throw new TypeError('该函数不支持当前环境');

  const currentOs = process.platform;

  const input = str.replace(/\s+$/, '');

  if (currentOs === 'darwin') execSync('pbcopy', { input });
  else if (currentOs === 'win32')
    execSync('clip', {
      input: input,
      stdio: 'pipe',
    });
  else {
    try {
      execSync('which xclip', { stdio: 'ignore' });
      execSync('xclip -selection clipboard', { input });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      try {
        execSync('which xsel', { stdio: 'ignore' });
        execSync('xsel --clipboard --input', { input });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return '';
      }
    }
  }
  return str;
}
