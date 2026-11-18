import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to top on navigation and shows a back-to-top button on long pages.
const ScrollManager = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="animate-pop fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
    >
      ↑
    </button>
  );
};

export default ScrollManager;
