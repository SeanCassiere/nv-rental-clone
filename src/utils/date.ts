export function localDateToQueryYearMonthDay(date: Date, op: "-" | "/" = "-") {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const parsed = `${year}${op}${month > 9 ? month : `0${month}`}${op}${
    day > 9 ? day : `0${day}`
  }`;

  return parsed;
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

  const parsed =
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
    (seconds > 9 ? `${seconds}` : `0${seconds}`);

  return parsed;
  // return `${year}-${month}-${day}${includeT ? "T" : " "}${
  //   hours.toString().length > 10 ? hours : `0${hours}`
  // }:${minutes.toString().length > 10 ? minutes : `0${minutes}`}:${
  //   seconds.toString().length > 10 ? seconds : `0${seconds}`
  // }`;
}
