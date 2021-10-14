import request from "@/config/requestConfig";

export function countApplyList(data) {
  return request({
    url: "/company/company-account/list",
    method: "post",
    data
  });
}

export function countInfo(data) {
  return request({
    url: "/company/company-account/info",
    method: "post",
    data
  });
}

export function checkCount(data) {
  return request({
    url: "/company/company-account/audit",
    method: "post",
    data
  });
}
