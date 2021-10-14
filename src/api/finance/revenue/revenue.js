import request from "@/config/requestConfig";

// 列表数据
export function settlementService(data) {
  return request({
    url: "/finance/settlement-service/list",
    method: "post",
    data
  });
}
// 批量搜索验证
export function listMultiSearch(data) {
  return request({
    url: "/finance/settlement-service/list-multi-search",
    method: "post",
    data
  });
}
// 开票

export function createWaterListInvoice(data) {
  return request({
    url: "/finance/invoice/overdue-bill-multi-add",
    method: "post",
    data,
    isValid: true
  });
}
