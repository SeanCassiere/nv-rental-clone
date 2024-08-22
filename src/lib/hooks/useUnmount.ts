import * as React from "react";

/**
 * Hook that runs a cleanup function when the component is unmounted.
 * @param {() => void} func - The cleanup function to be executed on unmount.
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-unmount)
 * @example
 * // Usage in a functional component
 * useUnmount(() => {
 *   // Cleanup logic here
 * });
 */
export function useUnmount(func: () => void) {
  const funcRef = React.useRef(func);

  // eslint-disable-next-line react-compiler/react-compiler
  funcRef.current = func;

  React.useEffect(
    () => () => {
      funcRef.current();
    },
    []
  );
}
