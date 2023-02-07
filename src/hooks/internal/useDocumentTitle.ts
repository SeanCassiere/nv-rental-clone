// https://usehooks-ts.com/react-hook/use-document-title
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export function useDocumentTitle(title: string): void {
  useIsomorphicLayoutEffect(() => {
    window.document.title = title;
  }, [title]);
}
