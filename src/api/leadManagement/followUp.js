import request from "@/config/requestConfig";

// 跟进列表数据
export function followListAll(data) {
  return request({
    url: "/company/company-manage/follow-list",
    method: "post",
    data
  });
}
// 获取跟进记录列表
export function followLogList(data) {
  return request({
    url: "/company/company-manage/follow-log-list",
    method: "post",
    data
  });
}

// 新增跟进记录
export function followLogAdd(data) {
  return request({
    url: "/company/company-manage/follow-log-add",
    method: "post",
    data
  });
}
// 标签关联详情
export function tagOne(data) {
  return request({
    url: "/company/company-manage/tag-one",
    method: "post",
    data
  });
}
// 解除标签关联
export function tagRemoveRelation(data) {
  return request({
    url: "/company/company-manage/tag-remove-relation",
    method: "post",
    data
  });
}

// 服务开通提交
export function serverApply(data) {
  return request({
    url: "/company/company-manage/apply-business",
    method: "post",
    data
  });
}

export function pushMark(data) {
  return request({
    url: "/company/company-manage/mark-add",
    method: "post",
    data
  });
}
export function getmarkList(data) {
  return request({
    url: "/company/company-manage/mark-list",
    method: "post",
    data
  });
}

export function removeMark(data) {
  return request({
    url: "/company/company-manage/mark-del",
    method: "post",
    data
  });
}

export function bindMark(data) {
  return request({
    url: "/company/company-manage/mark-bind",
    method: "post",
    data,
    isValid: true
  });
}

export function unbindMark(data) {
  return request({
    url: "/company/company-manage/mark-cancel",
    method: "post",
    data,
    isValid: true
  });
}

export function followListCount(data) {
  return request({
    url: "/company/company-manage/follow-list-count",
    method: "post",
    data
  });
}
