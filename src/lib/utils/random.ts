export function b64_encode(str: string) {
  const encoded = window.btoa(encodeURIComponent(str));
  return encoded;
}

export function b64_decode(str: string) {
  const decoded = decodeURIComponent(window.atob(str));
  return decoded;
}

export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/\?/, "?").replace(/\/$/, "");
}

/**
 * Recursively sorts the keys of an object in alphabetical order.
 * If the input is an array, it maps over the array and recursively sorts each item.
 * If the input is an object, it sorts the keys, then reduces over the keys to create a new object with sorted keys.
 *
 * @param {T} obj - The object to be sorted.
 * @returns {T} - A new object with the same shape as the input, but with sorted keys.
 * @template T - The type of the input object. The output object will have the same type.
 */
export function sortObjectKeys<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return (obj as any[]).map(sortObjectKeys) as any;
  }

  return Object.keys(obj as object)
    .sort()
    .reduce((result: any, key: string) => {
      result[key] = sortObjectKeys((obj as any)[key]);
      return result;
    }, {}) as T;
}
