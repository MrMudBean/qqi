import { Dog } from '../src/core';

const dog = new Dog({
  name: 'dev',
  type: 'all',
  fold: true,
});

console.log('====================================');
console.log(dog.apply);
console.log('====================================');
dog(...[1, 2, 3]);
dog.apply(void 0, [1, 2, 3]);

dog.warn(123);

dog.call(null, 12);

/**
 *
 */
function a() {
  dog(123, 456789, 9658);
  dog(456);
}
dog.type = false;
a();
