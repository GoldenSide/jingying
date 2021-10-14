import request from "@/config/requestConfig";

export function invoiceList(data) {
  return request({
    url: "/finance/invoice/invoice-search-list",
    method: "post",
    data
  });
}
