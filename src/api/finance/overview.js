import request from "@/config/requestConfig";
export function financeOverview(data) {
  return request({
    url: "/finance/commission/overview",
    method: "post",
    data
  });
}
