import { useEffect, useRef, useState } from "react";

export const useClickOutside = () => {
  const [show, setShow] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutDropdown(e: MouseEvent) {
      if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    }
    document.addEventListener("click", handleClickOutDropdown);
    return () => {
      document.removeEventListener("click", handleClickOutDropdown);
    };
  }, []);
  return { show, setShow, elementRef };
};