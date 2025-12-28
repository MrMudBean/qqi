import { Dog } from '@qqi/log';
import { isFalse } from 'a-type-of-js';

export const dog = new Dog({
  name: 'qqi',
  type: false,
});

export const dun = isFalse(dog.type);
