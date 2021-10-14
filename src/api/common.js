import request from "@/config/requestConfig";

// 公司类型
export function companyTypeList(data) {
  return request({
    url: "/company/company/type-list",
    method: "post",
    data
  });
}

//  图片上传配置
export function getOssConfig(data) {
  return request({
    url: "/common/upload/config",
    method: "post",
    data
  });
}
// 获取省份/城市(无参数获取省份，有参数(省)则获取参数下的城市)
export function getDistrict(data) {
  return request({
    url: "/company/company/district",
    method: "post",
    data
  });
}
// 注册来源
export function sourceSelectList(data) {
  return request({
    url: "company/company/source",
    method: "post",
    data
  });
}

// 服务供应商
export function servicesProvides(data) {
  return request({
    url: "/company/company-manage/business-type-list",
    method: "post",
    data
  });
}

// 搜索下拉-店铺列表
export function shopListSelect(data) {
  return request({
    url: "/shop/shop/list-select",
    method: "post",
    data
  });
}

// 搜索下拉-企业列表
export function companyListSelect(data) {
  return request({
    url: "/company/company/list-select",
    method: "post",
    data
  });
}

// 搜索下拉-供应商列表
export function supplierListSelect(data) {
  return request({
    url: "/company/company/supplier-list-select",
    method: "post",
    data
  });
}
// 批量搜索验证字段
export function listMultiSearch(data) {
  return request({
    url: "/common/common/list-multi-search",
    method: "post",
    data
  });
}
