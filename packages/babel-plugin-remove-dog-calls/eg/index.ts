import { dog } from './dog';

console.log('====================================');
console.log(dog.type);
console.log('====================================');

dog.type = 'all';
dog(dog.type);

dog(123);
dog.error('error');
