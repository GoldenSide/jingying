import request from "@/config/requestConfig";

// --------------------超极密码模块 -------------------
// 搜索所有店铺
export function listSelect(data) {
  return request({
    url: "/shop/shop/list-select",
    method: "post",
    data
  });
}
// 获取店铺超极密码
export function superPwd(data) {
  return request({
    url: "/shop/shop/super-pwd",
    method: "post",
    data
  });
}

// --------------------店铺管理模块-----------------------
// 店铺列表
export function shopListData(data) {
  return request({
    url: "/shop/shop/list",
    method: "post",
    data
  });
}
// 店铺详情
export function shopInfoData(data) {
  return request({
    url: "/shop/shop/info",
    method: "post",
    data
  });
}
// 店铺套餐
export function platformProductList(data) {
  return request({
    url: "/shop/shop/platform-product-list",
    method: "post",
    data
  });
}
// 冻结店铺
export function shopFreeze(data) {
  return request({
    url: "/shop/shop/freeze",
    method: "post",
    data
  });
}
// 日志
export function operatingLog(data) {
  return request({
    url: "/shop/shop/log-list",
    method: "post",
    data
  });
}
// 换榜公司
export function changeShopCompany(data) {
  return request({
    url: "/shop/shop/change-shop-company",
    method: "post",
    data
  });
}

export function addShop(data) {
  return request({
    url: "/shop/shop/create",
    method: "post",
    data
  });
}
export function updatePwd(data) {
  return request({
    url: "/shop/shop/update-pwd",
    method: "post",
    data
  });
}

export function listCount(data) {
  return request({
    url: "/shop/shop/count",
    method: "post",
    data
  });
}
