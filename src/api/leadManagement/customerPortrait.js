import request from "@/config/requestConfig";

export function getSelectOpt(data) {
  return request({
    url: "/company/portrait-manage/config",
    method: "post",
    data
  });
}
export function getTags(data) {
  return request({
    url: "/company/portrait-manage/tag-list",
    method: "post",
    data
  });
}
export function addTag(data) {
  return request({
    url: "/company/portrait-manage/save-tag",
    method: "post",
    data
  });
}

export function delTag(data) {
  return request({
    url: "/company/portrait-manage/del-tag",
    method: "post",
    data
  });
}

export function tagDailyLog(data) {
  return request({
    url: "/company/portrait-manage/tag-log-list",
    method: "post",
    data
  });
}

export function searchCompany(data){
  return request({
    url: "/company/portrait-manage/search",
    method: "post",
    data
  });
}

export function exportExcel(data){
  return request({
    url: "/company/portrait-manage/export",
    method: "post",
    data
  });
}