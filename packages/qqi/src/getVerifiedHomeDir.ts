import { homedir } from 'node:os';
import { pathJoin, writeJsonFile } from 'a-node-tools';
import { unlinkSync } from 'node:fs';
import { dog } from './dog';

/**
 *
 * 获取真实的跟路径
 *
 */
export function getVerifiedHomeDir() {
  /**  跟文件  */
  const home = homedir();

  dog('当前获取用户主目录为', home);

  if (!home || home === '/' || home.includes('Default')) {
    throw new Error('未能获取到主目录路径 <' + home + '>');
  }

  try {
    /**  测试文件  */
    const testFile = pathJoin(home, 'test_write' + Date.now());
    writeJsonFile(testFile, {});
    unlinkSync(testFile);
    return home;
  } catch (error) {
    dog.error(error);
    return undefined;
  }
}
