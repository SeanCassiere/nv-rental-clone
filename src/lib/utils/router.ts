import { parseSearchWith, stringifySearchWith } from "@tanstack/react-router";
import * as JSURL from "jsurl2";

export function decodeFromBinary(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

export function encodeToBinary(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

export const parseSearchFn = parseSearchWith((value) => JSURL.parse(value));
// export const parseSearchFn = parseSearchWith((value) => JSON.parse(decodeFromBinary(value)));

export const stringifySearchFn = stringifySearchWith((value) =>
  JSURL.stringify(value)
);
// export const stringifySearchFn = stringifySearchWith((value) =>
//   encodeToBinary(JSON.stringify(value))
// );
