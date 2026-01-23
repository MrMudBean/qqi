/**
 * rollup 插件，保留  `'use client';` 指令
 */
export function preserveDirective() {
  const directiveMap = new Map();

  return {
    name: 'preserve-directive',
    // 扫描并暂停（暂时移除）指令
    transform(code: string, id: string) {
      // 检测文件类型
      if (!/\.(js|jsx|ts|tsx)$/.test(id)) return null;
      const directiveRegex = /^(['"]use\s+(client|server)['"])\s*;?\s*$/gm;
      let match;
      let firstDirective = null;
      while ((match = directiveRegex.exec(code)) !== null) {
        console.log(match);
        if (!firstDirective) firstDirective = match[1]; // 取首个有效指令
        break;
      }
      console.log(firstDirective);
      if (firstDirective) {
        directiveMap.set(id, firstDirective);
        return code.replace(firstDirective, ''); // 暂时移除指令
      }
      return null;
    },
    // 第二阶段：在输出前恢复指令
    renderChunk(code: string, chunk: any) {
      const moduleId = chunk.facadeModuleId;
      if (moduleId && directiveMap.has(moduleId)) {
        const directive = directiveMap.get(moduleId);
        return `${directive};\n${code}`; //恢复指令到文件顶部
      }
      return null;
    },
  };
}
