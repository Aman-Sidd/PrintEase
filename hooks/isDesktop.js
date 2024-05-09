import { useMediaQuery } from "react-responsive";

export function isDesktop() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  return isDesktopOrLaptop;
}
