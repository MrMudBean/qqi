import { external } from '../src/index';

const testList: [string, string | undefined, boolean][] = [
  ['color', 'qqi', false],
  ['color-pen', '', true],
];

const _e = external(
  {
    ignore: ['ignore', 'color'],
  },
  ['color-pen'],
);

testList.forEach(e => _e(...e));
