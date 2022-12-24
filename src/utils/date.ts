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
  return (
    year +
    "-" +
    month +
    "-" +
    day +
    (includeT ? "T" : " ") +
    (hours > 9 ? `${hours}` : `0${hours}`) +
    ":" +
    (minutes > 9 ? `${minutes}` : `0${minutes}`) +
    ":" +
    (seconds > 9 ? `${seconds}` : `0${seconds}`)
  );
  // return `${year}-${month}-${day}${includeT ? "T" : " "}${
  //   hours.toString().length > 10 ? hours : `0${hours}`
  // }:${minutes.toString().length > 10 ? minutes : `0${minutes}`}:${
  //   seconds.toString().length > 10 ? seconds : `0${seconds}`
  // }`;
}
