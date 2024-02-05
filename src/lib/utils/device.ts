export const IsMacLike = window.navigator.userAgent.match(
  /(Mac|iPhone|iPod|iPad)/i
)
  ? true
  : false;
