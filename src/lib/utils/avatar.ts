/**
 * Get the URL to the avatar image for the given username.
 * @param {string | undefined} username User's unique username.
 * @returns {string} URL to the avatar image.
 * @link https://www.dicebear.com/styles/miniavs/
 * @example
 * `https://api.dicebear.com/7.x/miniavs/svg?seed=myUsername&eyes=happy`
 */
export function getAvatarUrl(username: string | undefined): string {
  const url = new URL("https://api.dicebear.com/7.x/miniavs/svg");
  url.searchParams.append("seed", username ?? "none");
  url.searchParams.append("scale", "85");
  url.searchParams.append("eyes", "happy");
  return url.toString();
}

/**
 * Generates a fallback text for an avatar by taking the first character of the first two words in a name.
 * If the name only contains one word, the first character of that word is returned.
 *
 * @param {string} name - The name to generate the fallback text from.
 * @returns {string} The generated fallback text.
 */
export function getAvatarFallbackText(name: string): string {
  const nameParts = name.split(" ");
  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].charAt(0);
  }
  return `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`;
}
