export function b64_encode(str: string) {
  const encoded = window.btoa(encodeURIComponent(str));
  return encoded;
}

export function b64_decode(str: string) {
  const decoded = decodeURIComponent(window.atob(str));
  return decoded;
}
