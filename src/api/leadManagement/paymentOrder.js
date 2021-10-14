import request from "@/config/requestConfig";

export function orderList(data) {
  return request({
    url: "/finance/overdue-bill/get-work-order-manage-list",
    method: "post",
    data
  });
}

export function refuseOrder(data) {
  return request({
    url: "/finance/overdue-bill/reject-work-order",
    method: "post",
    data
  });
}

export function passPaymentOrder(data) {
  return request({
    url: "/finance/overdue-bill/receivable-pass-work-order",
    method: "post",
    data
  });
}
export function passBadbillOrder(data) {
  return request({
    url: "/finance/overdue-bill/bad-debt-pass-work-order",
    method: "post",
    data
  });
}
