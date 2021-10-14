import request from "@/config/requestConfig";

export function overdueList(data) {
  return request({
    url: "/finance/overdue-bill/get-list",
    method: "post",
    data
  });
}

export function overdueTotal(data) {
  return request({
    url: "/finance/overdue-bill/get-stat",
    method: "post",
    data
  });
}

export function getExportUrl(data) {
  return request({
    url: "/finance/overdue-bill/export",
    method: "post",
    data
  });
}

export function dailyLogList(data) {
  return request({
    url: "/finance/overdue-bill/get-log-list",
    method: "post",
    data
  });
}

export function remarkList(data) {
  return request({
    url: "/finance/overdue-bill/get-remark-list",
    method: "post",
    data
  });
}

export function addRemark(data) {
  return request({
    url: "/finance/overdue-bill/add-remark",
    method: "post",
    data
  });
}

export function checkCanUse(data) {
  return request({
    url: "/finance/overdue-bill/check-work-order",
    method: "post",
    data
  });
}

export function createBillOrder(data) {
  return request({
    url: "/finance/overdue-bill/add-work-order",
    method: "post",
    data
  });
}
// 拉取逾期账单
export function pullOverdueBill(data) {
  return request({
    url: "/finance/overdue-bill/pull-overdue-bill",
    method: "post",
    data
  });
}
