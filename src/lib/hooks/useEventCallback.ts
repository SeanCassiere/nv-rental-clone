import * as React from "react";

import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";

/**
 * A hook for creating a memoized event callback.
 * @template Args - An array of argument types for the event callback.
 * @template R - The return type of the event callback.
 * @param {(...args: Args) => R} fn - The callback function.
 * @returns {(...args: Args) => R} A memoized event callback function.
 * @example
 * const handleClick = useEventCallback((event) => {
 *   // Handle the event here
 * });
 */
export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const ref = React.useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  // eslint-disable-next-line react-compiler/react-compiler
  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return React.useCallback((...args: Args) => ref.current(...args), [ref]);
}
