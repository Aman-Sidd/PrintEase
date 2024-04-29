import {
  COLOR_CYAN_BLUE,
  COLOR_DARK_GREEN,
  COLOR_ORANGE_YELLOW,
} from "./COLORS";

export const ORDER_STATUS_PENDING = "Pending";
export const ORDER_STATUS_PICKED = "Picked";
export const ORDER_STATUS_READY = "Printed";
export const ORDER_STATUS_PAYMENT_FAILED = "Payment Failed";

// ORDER STATUS VALUES
export const ORDER_STATUS_PENDING_VALUE = 0;
export const ORDER_STATUS_READY_VALUE = 1;
export const ORDER_STATUS_PICKED_VALUE = 2;
export const ORDER_STATUS_PAYMENT_FAILED_VALUE = -1;

// COLOURS ORDER STATUS
export const COLOR_ORDER_STATUS_PENDING = COLOR_ORANGE_YELLOW;
export const COLOR_ORDER_STATUS_PICKED = COLOR_DARK_GREEN;
export const COLOR_ORDER_STATUS_READY = COLOR_CYAN_BLUE;
export const COLOR_PAYMENT_FAILED = "#FF4136";
