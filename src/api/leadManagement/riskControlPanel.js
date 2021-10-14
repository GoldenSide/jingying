import request from "@/config/requestConfig";
export function nearSevenDay(data) {
  return request({
    url: "/product/risk-control/get-audit-target",
    method: "post",
    data
  });
}

export function checkMan(data) {
  return request({
    url: "/product/risk-control/search-user-list",
    method: "post",
    data
  });
}

export function dataPanel(data) {
  return request({
    url: "/product/risk-control/get-per-day-audit-target",
    method: "post",
    data
  });
}
