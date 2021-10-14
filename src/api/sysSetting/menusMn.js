import request from "@/config/requestConfig";

export function menusSelectList(data) {
  return request({
    url: "/common/menu/select-list",
    method: "post",
    data
  });
}

export function menusChildrenList(data) {
  return request({
    url: "/common/menu/list",
    method: "post",
    data
  });
}

export function deleteMenuItem(data) {
  return request({
    url: "/common/menu/del",
    method: "post",
    data
  });
}

export function menuFeature(data) {
  return request({
    url: "/common/menu/event-list",
    method: "post",
    data
  });
}

export function deleteFeature(data) {
  return request({
    url: "/common/menu/event-del",
    method: "post",
    data
  });
}

export function handlerFeature(path, data) {
  return request({
    url: path,
    method: "post",
    data
  });
}

export function parentMenuList(data) {
  return request({
    url: "/common/menu/select-list",
    method: "post",
    data
  });
}
export function handlerMenu(data, path) {
  return request({
    url: path,
    method: "post",
    data
  });
}

export function menuInfo(data) {
  return request({
    url: "/common/menu/info",
    method: "post",
    data
  });
}

export function menuSwitch(data) {
  return request({
    url: "/common/menu/switch",
    method: "post",
    data
  });
}
