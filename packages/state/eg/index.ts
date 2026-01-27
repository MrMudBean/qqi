/**
 * @packageDocumentation
 * @module @qqi/state/index
 * @file index.ts
 * @description _
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-27 08:04
 * @version 0.0.0
 * @lastModified 2026-01-27 11:42
 */

import { StateManager } from '../src/';
import { loggerMiddleware } from '../src/middle-ware-log';

interface DataType {
  counting: number;
  age: number;
  name: string;
}

const store = new StateManager<DataType>(
  (data, action) => {
    switch (action.type) {
      case 'counting':
        return { ...data, counting: data.counting + 1 };
      case 'age':
        return { ...data, age: data.age + 1 };
      case 'name':
        return { ...data, name: data.name.concat(' - ') };
      default:
        return data;
    }
  },
  {
    counting: 0,
    age: 10,
    name: 'tom',
  },
  {
    middleware: [loggerMiddleware],
  },
);

const unsubscribe = store.subscribe({
  counting: newValue => {
    console.log('新的计数值', newValue);
  },
});

store.subscribeAll(state => console.log('当前状态', state));

store.dispatch({
  type: 'age',
});

unsubscribe();
