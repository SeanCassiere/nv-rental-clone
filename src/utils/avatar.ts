export function getAvatarUrl(userName: string | undefined) {
  return `https://avatars.dicebear.com/api/miniavs/${userName}.svg?mood[]=happy`;
}
