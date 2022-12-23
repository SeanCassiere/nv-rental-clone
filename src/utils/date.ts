export function localDateToQueryYearMonthDay(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

export function localDateTimeToQueryYearMonthDay(
  date: Date,
  includeT?: boolean
) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day}${
    includeT ? "T" : " "
  }${hours}:${minutes}:${seconds}`;
}
