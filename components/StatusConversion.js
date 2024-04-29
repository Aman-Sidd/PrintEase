import {
  COLOR_ORDER_STATUS_PENDING,
  COLOR_ORDER_STATUS_PICKED,
  COLOR_ORDER_STATUS_READY,
  COLOR_PAYMENT_FAILED,
  ORDER_STATUS_PAYMENT_FAILED,
  ORDER_STATUS_PAYMENT_FAILED_VALUE,
  ORDER_STATUS_PENDING,
  ORDER_STATUS_PENDING_VALUE,
  ORDER_STATUS_PICKED,
  ORDER_STATUS_PICKED_VALUE,
  ORDER_STATUS_READY,
  ORDER_STATUS_READY_VALUE,
} from "../constants/ORDER_STATUS";

const StatusToValueConvertor = (status) => {
  return status === ORDER_STATUS_PENDING
    ? ORDER_STATUS_PENDING_VALUE
    : status === ORDER_STATUS_READY
    ? ORDER_STATUS_READY_VALUE
    : status === ORDER_STATUS_PICKED
    ? ORDER_STATUS_PICKED_VALUE
    : status === ORDER_STATUS_PAYMENT_FAILED
    ? ORDER_STATUS_PAYMENT_FAILED_VALUE
    : null;
};

const StatusToColorConvertor = (status) => {
  return status === ORDER_STATUS_PENDING
    ? COLOR_ORDER_STATUS_PENDING
    : status === ORDER_STATUS_READY
    ? COLOR_ORDER_STATUS_READY
    : status === ORDER_STATUS_PICKED
    ? COLOR_ORDER_STATUS_PICKED
    : status === ORDER_STATUS_PAYMENT_FAILED
    ? COLOR_PAYMENT_FAILED
    : null;
};

const ValueToStatusConvertor = (value) => {
  return value === ORDER_STATUS_PENDING_VALUE
    ? ORDER_STATUS_PENDING
    : value === ORDER_STATUS_READY_VALUE
    ? ORDER_STATUS_READY
    : value === ORDER_STATUS_PICKED_VALUE
    ? ORDER_STATUS_PICKED
    : value === ORDER_STATUS_PAYMENT_FAILED_VALUE
    ? ORDER_STATUS_PAYMENT_FAILED
    : null;
};

const ValueToStatusColorConvertor = (value) => {
  return value === ORDER_STATUS_PENDING_VALUE
    ? COLOR_ORDER_STATUS_PENDING
    : value === ORDER_STATUS_READY_VALUE
    ? COLOR_ORDER_STATUS_READY
    : value === ORDER_STATUS_PICKED_VALUE
    ? COLOR_ORDER_STATUS_PICKED
    : value === ORDER_STATUS_PAYMENT_FAILED_VALUE
    ? COLOR_PAYMENT_FAILED
    : null;
};

export {
  ValueToStatusConvertor,
  StatusToValueConvertor,
  ValueToStatusColorConvertor,
  StatusToColorConvertor,
};
