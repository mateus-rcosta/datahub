import { useEffect, useState } from "react";

export function useLimiteResponsivo() {
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const calculaLimit = () => {
      const width = window.innerWidth;

      let cardWidth = 360;
      let rows = 3;

      if (width < 640) {
        cardWidth = 220;
        rows = 4;
      } else if (width < 1024) {
        cardWidth = 280;
        rows = 6;
      } else if (width < 1536) {
        cardWidth = 360;
        rows = 2;
      } else {
        cardWidth = 360;
        rows = 3;
      }

      const columns = Math.max(1, Math.floor(width / cardWidth));
      setLimit(columns * rows);
    };

    calculaLimit();
    window.addEventListener("resize", calculaLimit);

    return () => window.removeEventListener("resize", calculaLimit);
  }, []);

  return limit;
}