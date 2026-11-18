import { useEffect } from "react";

// Locks page scroll and closes on Escape while a modal is open.
const useModal = (onClose, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, enabled]);
};

export default useModal;
