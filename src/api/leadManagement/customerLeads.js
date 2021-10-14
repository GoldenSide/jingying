// 入驻申请单数据
import request from '@/config/requestConfig'

export function customerLeadsListAll(data) {
  return request({
    url: "/company/official-customer/list",
    method: "post",
    data
  });
}

// 注册类型
export function registerTypeList(data) {
  return request({
    url: "/company/company/register-type-list",
    method: "post",
    data
  });
}
// 入驻申请单详情
export function auditDetail(data) {
  return request({
    url: "/company/official-customer/one",
    method: "post",
    data
  });
}
// 入驻申请单编辑
export function editCustomer(data) {
  return request({
    url: "/company/official-customer/edit",
    method: "post",
    data
  });
}
// 入驻申请单审核通过
export function approved(data) {
  return request({
    url: "/company/official-customer/pass",
    method: "post",
    data
  });
}
// 入驻申请单审核拒绝
export function reviewRejected(data) {
  return request({
    url: "/company/official-customer/reject",
    method: "post",
    data
  });
}
// 入驻申请单修改or添加备注
export function editRemarks(data) {
  return request({
    url: "/company/official-customer/edit-remarks",
    method: "post",
    data
  });
}
// 入驻申请单操作日志
export function operatingLog(data) {
  return request({
    url: "/company/official-customer/log-list",
    method: "post",
    data
  });
}
// 入驻申请单导入模版链接
export function getTemplate(data) {
  return request({
    url: "/company/official-customer/template",
    method: "post",
    data
  });
}
// 入驻申请单导入模版上传
export function postImport(data) {
  return request({
    url: "/company/official-customer/import",
    method: "post",
    data
  });
}
// 入驻申请单导入模版上传进度详情
export function importSqsTaskList(data) {
  return request({
    url: "/company/official-customer/import-sqs-task-list",
    method: "post",
    data
  });
}