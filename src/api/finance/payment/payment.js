import request from "@/config/requestConfig";

// 列表数据
export function getPaymentRecordData(data) {
  return request({
    url: "/finance/overdue-bill/work-bill-payment-record",
    method: "post",
    data
  });
}

// 导出
export function exportPaymentRecordData(data) {
  return request({
    url: "/finance/overdue-bill/work-bill-payment-record-export",
    method: "post",
    data
  });
}
