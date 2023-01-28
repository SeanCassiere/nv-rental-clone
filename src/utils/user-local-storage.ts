export const userLocalStorageKeys = {
  dateFormat: "date-format",
  timeFormat: "time-format",
  dismissedNotices: "dismissed-notices",
};

export function removeAllLocalStorageKeysForUser(
  clientId: string,
  userId: string
) {
  const localStorageKeyPrefix = `${clientId}:${userId}:`;
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(localStorageKeyPrefix))
    .forEach((key) => window.localStorage.removeItem(key));
}

export function getLocalStorageForUser(
  clientId: string,
  userId: string,
  key: string
) {
  const localStorageKey = `${clientId}:${userId}:${key}`;
  return window.localStorage.getItem(localStorageKey);
}

// set local storage for user
export function setLocalStorageForUser(
  clientId: string,
  userId: string,
  key: string,
  value: string
) {
  const localStorageKey = `${clientId}:${userId}:${key}`;
  return window.localStorage.setItem(localStorageKey, value);
}
