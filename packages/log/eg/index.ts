import { Dog } from '../src/core';

const dog = new Dog({
  name: 'dev',
  type: 'all',
});

console.log('====================================');
console.log(dog.apply);
console.log('====================================');
dog(...[1, 2, 3]);
dog.apply(void 0, [1, 2, 3]);
