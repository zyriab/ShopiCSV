import { searchStrArray } from '../tools/searchStrArray.utils';

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;
let result: number[] = [];

ctx.addEventListener('message', (event) => {
  result = searchStrArray(
    event.data.searchValue,
    event.data.data,
    event.data.searchIndex
  );
  ctx.postMessage(result);
});
