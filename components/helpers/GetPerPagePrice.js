import {
  RATE11Above,
  RATE16_25,
  RATE1_10,
  RATE1_15,
  RATE26Above,
  RATE_Color_Page,
} from "../../constants/PRICING";

export function getPerPagePrice(totalPages, color = "Black & White") {
  if (color === "Coloured") return RATE_Color_Page;
  return totalPages <= 10 ? RATE1_10 : RATE11Above;
}
