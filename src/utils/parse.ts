export function tryParseJson<TData>(
  json: string | null,
  defaultData: TData
): TData {
  if (!json) return defaultData;
  try {
    return JSON.parse(json);
  } catch (e) {
    return defaultData;
  }
}
