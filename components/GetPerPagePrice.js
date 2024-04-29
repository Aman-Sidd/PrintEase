import { RATE16_25, RATE1_15, RATE26Above } from "../constants/PRICING";

export function getPerPagePrice(totalPages) {
  return totalPages <= 15
    ? RATE1_15
    : totalPages <= 25
    ? RATE16_25
    : RATE26Above;
}
