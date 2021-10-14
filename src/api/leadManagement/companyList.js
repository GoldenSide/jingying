import request from "@/config/requestConfig";
// 列表数据
export function companyListAll(data) {
  return request({
    url: "/company/company/list",
    method: "post",
    data
  });
}
// 公司详情
export function companyInfo(data) {
  return request({
    url: "/company/company/info",
    method: "post",
    data
  });
}
// 全部标签
export function getAssignTypeData(data) {
  return request({
    url: "/company/company-manage/tag-list",
    method: "post",
    data
  });
}
// 级别
export function levelListAll(data) {
  return request({
    url: "/company/company-level/list",
    method: "post",
    data
  });
}
// 修改公司类型
export function changeType(data) {
  return request({
    url: "/company/company-manage/change-type",
    method: "post",
    data
  });
}
// 设置客户级别
export function levelRelation(data) {
  return request({
    url: "/company/company-manage/level-relation",
    method: "post",
    data
  });
}
// 编辑客户级别
export function levelRelationEdit(data) {
  return request({
    url: "/company/company-manage/level-relation-edit",
    method: "post",
    data
  });
}
// 重置密码
export function resetCompanyPassword(data) {
  return request({
    url: "/company/company-manage/reset-company-password",
    method: "post",
    data
  });
}
// 停用企业
export function changeCompanyStatus(data) {
  return request({
    url: "/company/company-manage/change-company-status",
    method: "post",
    data
  });
}
// 从关联中解除关联
export function tagRemoveSomeRelation(data) {
  return request({
    url: "/company/company-manage/tag-remove-some-relation",
    method: "post",
    data
  });
}
// 操作日志
export function operatingLog(data) {
  return request({
    url: "/company/company/log-list",
    method: "post",
    data
  });
}
// 编辑页面
export function editModify(data) {
  return request({
    url: "/company/company/modify",
    method: "post",
    data
  });
}
// 获取未关联的用户
export function getTagCompanyList(data) {
  return request({
    url: "/company/company-manage/tag-company-list",
    method: "post",
    data
  });
}
// 关联用户
export function tagConfirm(data) {
  return request({
    url: "/company/company-manage/tag-confirm",
    method: "post",
    data
  });
}
// 判断公司是否已经分配过售前或者售后
export function checkAssignFollow(data) {
  return request({
    url: "/company/company-manage/check-assign-follow",
    method: "post",
    data
  });
}
// 获取组织架构
export function getGroupStruct(data) {
  return request({
    url: "/company/company-manage/get-group-struct",
    method: "post",
    data
  });
}
// 搜索用户
export function getGroupUser(data) {
  return request({
    url: "/company/company-manage/get-group-user",
    method: "post",
    data
  });
}
// 确认关联
export function submitAssign(data) {
  return request({
    url: "/company/company-manage/submit-assign",
    method: "post",
    data
  });
}

export function listCount(data) {
  return request({
    url: "/company/company/count",
    method: "post",
    data
  });
}
export function quitAssign(data) {
  return request({
    url: "/company/company-manage/cancel-assign",
    method: "post",
    data
  });
}
