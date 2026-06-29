# qqi

[![version](<https://img.shields.io/npm/v/qqi.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/qqi) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MrMudBean/qqi/issues)

## 安装

```bash
npm install  --save qqi
```

## 使用

### 读

```ts
import { QQI } from 'qqi';

/**
 * 创建用户目录下的 `~/.earthnut.dev.data/test/`  的读写机
 *
 * 若没有找到用户目录或是没有写入的权限，则不可用。 `qqi.available` 值将为 `false`
 *
 * 在不可用时，直接拦截读写。读将直接返回 `null`,写直接返回 `false`
 */
const qqi = new QQI('test');

/**
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

## 状态

此软件包是 `MrMudBean` 生态系统的一部分。
它使用严格的 TypeScript 编写，并通过 Rollup 构建进行验证。
虽然单元测试较少，但 API 稳定，并在生产环境中大量使用。
