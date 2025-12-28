# qqi

通过 `node:os` 的 `homedir` 获取当前用户的主目录。但受到用户的环境变量和系统配置的影响，该值返回可能非预期值。

[qqi](https://www.npmjs.com/package/qqi) 与名下 [check version 校验 npm 版本是否重复且返回发布的 dist tag](https://www.npmjs.com/package/@qqi/check-version)、[copy text node 环境复制到剪切板](https://www.npmjs.com/package/@qqi/copy-text)、[dev log 在开始时打印](https://www.npmjs.com/package/@qqi/dev-log)、[rollup external 一个使用 rollup 打包为 npm 库排除依赖](https://www.npmjs.com/package/@qqi/rollup-external)、[table 一个在终端或是浏览器控制台打印彩色文本强大表格的工具](https://www.npmjs.com/package/@qqi/table) 没有直接的关系

## 安装

```bash
npm install  --save qqi
```

## 使用

### 读

```ts
import { QQI } from 'qqi';

/**
 *
 * 创建用户目录下的 `~/.earthnut.dev.data/test/`  的读写机
 *
 * 若没有找到用户目录或是没有写入的权限，则不可用。 `qqi.available` 值将为 `false`
 *
 * 在不可用时，直接拦截读写。读将直接返回 `null`,写直接返回 `false`
 *
 */
const qqi = new QQI('test');

/**
 *
 * 读取 `~/.earthnut.dev.data/test/test` 文件，返回的是 JSON 格式
 *
 * 如若数据无法被 `JSON.stringify`、`JSON.parse` 则报错
 */
const content = qqi.read<{ test: string }>('test');
```

### 写

```ts
import { QQI } from 'qqi';

// 同上
const qqi = new QQI('test');

// 将向文件 `~/.earthnut.dev.data/test/test` 写入内容 `{"a":10}`
qqi.write('test', { a: 10 });
```

### 获取某文件的完整路径

```ts
import { QQI } from 'qqi';

// 同上
const qqi = new QQI('test');

// 返回 `~/.earthnut.dev.data/test/test`
console.log(qqi.getPath('test'));
```

## 文档地址

[qqi](https://earthnut.dev/npm/qqi/qqi)
