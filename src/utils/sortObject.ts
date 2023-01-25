export function sortObject(object: any) {
  //Thanks > http://whitfin.io/sorting-object-recursively-node-jsjavascript/
  if (!object) {
    return object;
  }

  const isArray = object instanceof Array;
  let sortedObj: any = {};
  if (isArray) {
    sortedObj = object.map((item) => sortObject(item));
  } else {
    const keys = Object.keys(object);
    // console.log(keys);
    keys.sort(function (key1, key2) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-sequences
      (key1 = key1.toLowerCase()), (key2 = key2.toLowerCase());
      if (key1 < key2) return -1;
      if (key1 > key2) return 1;
      return 0;
    });

    for (const index in keys) {
      const key = keys[index];
      if (typeof object[key as any] == "object") {
        sortedObj[key as any] = sortObject(object[key as any]);
      } else {
        sortedObj[key as any] = object[key as any];
      }
    }
  }

  return sortedObj;
}
