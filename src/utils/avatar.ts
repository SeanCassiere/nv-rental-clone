export function getAvatarUrl(userName: string | undefined) {
  return `https://avatars.dicebear.com/api/miniavs/${userName}.svg?mood[]=happy`;
}

export function getAvatarFallbackText(name: string) {
  const nameParts = name.split(" ");
  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].charAt(0);
  }
  return `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`;
}
