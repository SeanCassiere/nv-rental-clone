// https://usehooks-ts.com/react-hook/use-document-title
import * as React from "react";

import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useUnmount } from "@/lib/hooks/useUnmount";

type Options = {
  preserveTitleOnUnmount?: boolean;
};

/**
 * A hook to set the document title.
 * @param {string} title - The title to set.
 * @param {?Options} [options] - The options.
 * @param {?boolean} [options.preserveTitleOnUnmount] - Whether to keep the title after unmounting the component (default is `true`).
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-document-title)
 * @example
 * useDocumentTitle('My new title');
 */
export function useDocumentTitle(title: string, options: Options = {}): void {
  const { preserveTitleOnUnmount = true } = options;
  const defaultTitle = React.useRef<string | null>(null);
  const windowRef = React.useRef(window);

  // eslint-disable-next-line react-compiler/react-compiler
  useIsomorphicLayoutEffect(() => {
    defaultTitle.current = window.document.title;
  }, []);

  // eslint-disable-next-line react-compiler/react-compiler
  useIsomorphicLayoutEffect(() => {
    windowRef.current.document.title = title;
  }, [title]);

  // eslint-disable-next-line react-compiler/react-compiler
  useUnmount(() => {
    if (!preserveTitleOnUnmount && defaultTitle.current) {
      windowRef.current.document.title = defaultTitle.current;
    }
  });
}
