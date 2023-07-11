import { useEffect } from "react";
import { useRouter } from "@tanstack/router";

const ScrollToTop = () => {
  const router = useRouter();
  const history = router.history;

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });

    return () => {
      unlisten();
    };
  }, [history]);

  return null;
};

export default ScrollToTop;
