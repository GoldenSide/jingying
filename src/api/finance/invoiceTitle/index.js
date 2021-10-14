import request from "@/config/requestConfig";

export function invoiceTitleList(data) {
  return request({
    url: "/finance/invoice/title-list",
    method: "post",
    data
  });
}
