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

/**
 * Calculates the percentage of a candidate number relative to a maximum number.
 *
 * @param {number} candidateNumber - The number for which to calculate the percentage.
 * @param {number} maxNumber - The maximum number (representing 100%).
 * @returns {number} The calculated percentage.
 */
export function calculatePercentage(
  candidateNumber: number,
  maxNumber: number
): number {
  return (candidateNumber / maxNumber) * 100;
}

/**
 * Compare two arrays to see if they are the same
 * @param arr1
 * @param arr2
 * @returns boolean
 */
export function compareStringArrays<TData = string | number>(
  arr1: TData[],
  arr2: TData[]
): boolean {
  return (
    arr1.every((item) => arr2.includes(item)) &&
    arr2.every((item) => arr1.includes(item))
  );
}

/**
 * Inserts a space before each capital letter in a string.
 * @param {string} str - The string to be transformed.
 * @returns {string} The transformed string.
 * @example
 * ```
 * insertSpacesBeforeCaps("helloWorld"); // "hello World"
 * ```
 */
export function insertSpacesBeforeCaps(str: string): string {
  return str.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Generates a random short ID.
 * @returns {string} A random short ID.
 * @example
 * ```
 * generateShortId(); // "lz6ydb42wb1gl"
 * ```
 */
export function generateShortId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return timestamp + random;
}
