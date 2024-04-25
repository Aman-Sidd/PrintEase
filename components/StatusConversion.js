import {
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
    : null;
};

const ValueToStatusConvertor = (value) => {
  return value === ORDER_STATUS_PENDING_VALUE
    ? ORDER_STATUS_PENDING
    : value === ORDER_STATUS_READY_VALUE
    ? ORDER_STATUS_READY
    : value === ORDER_STATUS_PICKED_VALUE
    ? ORDER_STATUS_PICKED
    : null;
};

export { ValueToStatusConvertor, StatusToValueConvertor };
