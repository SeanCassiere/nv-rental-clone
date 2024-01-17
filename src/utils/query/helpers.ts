export type Pagination = { pagination: { page: number; pageSize: number } };
export type RefId = string | number;
export type Auth = { auth: { userId: string; clientId: string } };

export function rootKey({ auth }: Auth) {
  return `${auth.clientId}:${auth.userId}`;
}

export function isEnabled({ auth }: Auth) {
  return Boolean(auth.clientId) && Boolean(auth.userId);
}
