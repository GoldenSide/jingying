import request from "@/config/requestConfig";

export function goodsLists(data) {
  return request({
    url: "/product/risk-control/list",
    method: "post",
    data
  });
}

export function getExportUrl(data) {
  return request({
    url: "/product/risk-control/list-export",
    method: "post",
    data
  });
}

export function goodsDailyLogs(data) {
  return request({
    url: "/product/risk-control/log-list",
    method: "post",
    data
  });
}

export function checkGoods(data) {
  return request({
    url: "/product/risk-control/audit",
    method: "post",
    data,
    isValid: true
  });
}

export function deleteGood(data) {
  return request({
    url: "/product/risk-control/delete",
    method: "post",
    data
  });
}

export function getCount(data) {
  return request({
    url: "/product/risk-control/count",
    method: "post",
    data
  });
}

// 店铺风控列表
export function getShopList(data) {
  return request({
    url: "/product/risk-control/shop-list",
    method: "post",
    data
  });
}
// 店铺风控列表违规等汇总
export function getShopStatistics(data) {
  return request({
    url: "/product/risk-control/shop-statistics",
    method: "post",
    data
  });
}

export function getListCount(data) {
  return request({
    url: "/product/risk-control/shop-list-count",
    method: "post",
    data
  });
}
