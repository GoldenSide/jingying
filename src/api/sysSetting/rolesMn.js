import request from "@/config/requestConfig";

export function rolesList(data) {
  return request({
    url: "/common/role-group/list",
    method: "post",
    data
  });
}

export function simpleRoleList(data) {
  return request({
    url: "/common/user/edit-select-role-list",
    method: "post",
    data
  });
}

export function addRole(data) {
  return request({
    url: "/common/role-group/add",
    method: "post",
    data
  });
}

export function editRole(data) {
  return request({
    url: "/common/role-group/edit",
    method: "post",
    data
  });
}

export function deleRole(data) {
  return request({
    url: "/common/role-group/del",
    method: "post",
    data
  });
}

export function featureTable(data) {
  return request({
    url: "/common/role-group/info",
    method: "post",
    data
  });
}
