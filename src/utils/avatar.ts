/**
 * Get the URL to the avatar image for the given username.
 * @param username User's unique username.
 * @returns URL to the avatar image.
 * @link https://www.dicebear.com/styles/miniavs/
 * @example "https://api.dicebear.com/7.x/miniavs/svg?seed=none&eyes=happy"
 */
export function getAvatarUrl(username: string | undefined) {
  const url = new URL("https://api.dicebear.com/7.x/miniavs/svg");
  url.searchParams.append("seed", username ?? "none");
  url.searchParams.append("eyes", "happy");
  return url.toString();
}

export function getAvatarFallbackText(name: string) {
  const nameParts = name.split(" ");
  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].charAt(0);
  }
  return `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`;
}
