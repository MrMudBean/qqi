# @qqi/babel-plugin-remove-dog-calls

[![version](<https://img.shields.io/npm/v/@qqi/babel-plugin-remove-dog-calls.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/@qqi/babel-plugin-remove-dog-calls) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/MrMudBean/qqi/issues)

因为 [@qqi/dev-log](https://www.npmjs.com/package/@qqi/dev-log) 的工作原理，导致其在使用时，我们想通过一个环境变量来限制是否打印消息。但是，在 'browser' 环境中不同于 'node' 环境。即便是通过变量阻止了信息的打印。但是，为打印的消息存在于打包码中本身就是一个非安全行为。

## 安装

```bash
npm install --save-dev @qqi/babel-plugin-remove-dog-calls
```

## 使用

该项会在运行时拦截 `dog`（通过 `const dog = new Dog()` 创建的）的正式环境的执行。可能会牵连其他非 `@qqi/dev-log` 创建的项

之前的示例使用的为 '.babelrc' 文件。但是， _其不支持使用动态_，所以需要使用 'babel.config.js' 文件来定义 babel 设置。

```js
export default function (api) {
  api.cache(true);
  // 根据当前的设定的变量来设定是否使用该插件
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      process.env.NODE_ENV === 'production' &&
        '@qqi/babel-plugin-remove-dog-calls',
    ].filter(Boolean),
  };
}
```

## 文档地址

参看 [https://earthnut.dev/npm/qqi/remove-dog](https://earthnut.dev/npm/qqi/remove-dog)
