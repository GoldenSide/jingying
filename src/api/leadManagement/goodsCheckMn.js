import request from "@/config/requestConfig";

// 待审核
export function notCheck(data) {
  return request({
    url: "/product/verify/wait-verify-list",
    method: "post",
    data
  });
}
// 违规待处理
export function violator(data) {
  return request({
    url: "/product/verify/wait-offshelf-list",
    method: "post",
    data
  });
}
// 违规已处理
export function afterViolation(data) {
  return request({
    url: "/product/verify/offshelf-list",
    method: "post",
    data
  });
}
// 合规商品
export function compliance(data) {
  return request({
    url: "/product/verify/normal-list",
    method: "post",
    data
  });
}

// 待审核-违规/合规
export function checkGoods(data) {
  return request({
    url: "/product/verify/check-foul",
    method: "post",
    data
  });
}
// 违规待处理-合规
export function complianceGoods(data) {
  return request({
    url: "/product/verify/change-normal",
    method: "post",
    data
  });
}
// 删除
export function deleteGoods(data) {
  return request({
    url: "/product/verify/offshelf",
    method: "post",
    data
  });
}
// 日志
export function dailyLogs(data) {
  return request({
    url: "/product/verify/log-list",
    method: "post",
    data
  });
}
