import request from "@/config/requestConfig";

export function serviceApplyList(data) {
  return request({
    url: "/company/company-manage/apply-business-list",
    method: "post",
    data
  });
}
export function serviceItemInfo(data) {
  return request({
    url: "/company/company-manage/company-apply-business",
    method: "post",
    data
  });
}
