import request from "@/config/requestConfig";
// 列表&导出 is_export参数控制
export function financeList(data) {
  return request({
    url: "/finance/commission/list",
    method: "post",
    data
  });
}
// 导出
// export function exportListOne(data) {
//   return request({
//     url: "/finance/commission/export-list-one",
//     method: "post",
//     data
//   });
// }

// 佣金账单开票

export function createInvoice(data) {
  return request({
    url: "/finance/invoice/commission-multi-add",
    method: "post",
    data,
    isValid: true
  });
}

// 开票-电子普票-校验
export function checkInvoiceSKU(data) {
  return request({
    url: "/finance/invoice/get-invoice-repertory-info",
    method: "post",
    data
  });
}
