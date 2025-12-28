# @qqi/log

[![version](<https://img.shields.io/npm/v/@qqi/log.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/@qqi/log) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MeMudBean/qqi/issues)

## 安装

```bash
npm install --save @qqi/log
```

## 使用 Dog

### 创建全局的 `dog` (dev log 的缩写，天才第一步，起名要认真) 对象

```ts
/// 这里假设以 `a node tools` 为 `name` 的值
export const dog = new Dog({ name: 'a node tools' });
```

### 在需要打印日志的地方引入 `dog` 对象

```ts
import { dog } from './dog';

dog('你好'); // 该值是否打印还依赖于环境变量中有没有配置 `dev_log_dev` 的值
```

### 启用配置

```bash
# 配置 name 为 'a node tools'，则使用 `a_node_tools_dev` 或 `A_NODE_TOOLS_DEV` 来启动
a_node_tools_dev=true npm run dev
```

## 文档地址

参看 [https://earthnut.dev/npm/qqi/log](https://earthnut.dev/npm/qqi/log)
