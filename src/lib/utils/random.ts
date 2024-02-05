/**
 * Creates a promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to wait before the promise resolves.
 * @returns {Promise<void>} A promise that resolves after the specified number of milliseconds.
 */
export function wait(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * Removes the trailing slash from a given path, if present.
 * Also handles the case where the trailing slash is followed by a query string.
 *
 * @param {string} path - The path from which to remove the trailing slash.
 * @returns {string} The path without a trailing slash.
 */
export function removeTrailingSlash(path: string): string {
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

/**
 * Determines if the user's device is a Mac or an iOS device.
 * @type {boolean}
 */
export const IsMacLike: boolean = window.navigator.userAgent.match(
  /(Mac|iPhone|iPod|iPad)/i
)
  ? true
  : false;
