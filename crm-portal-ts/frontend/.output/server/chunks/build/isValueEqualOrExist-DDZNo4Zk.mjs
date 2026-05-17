import { B as isNullish } from './server.mjs';
import { w as isEqual } from '../_/nitro.mjs';

function isValueEqualOrExist(base, current) {
  if (isNullish(base)) return false;
  if (Array.isArray(base)) return base.some((val) => isEqual(val, current));
  else return isEqual(base, current);
}

export { isValueEqualOrExist as i };
//# sourceMappingURL=isValueEqualOrExist-DDZNo4Zk.mjs.map
