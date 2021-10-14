import request from "@/config/requestConfig";

export function orderHistory(data) {
  return request({
    url: "/finance/overdue-bill/get-work-order-list",
    method: "post",
    data
  });
}
