import request from "@/config/requestConfig";

export function userList(data) {
  return request({
    url: "/common/user/list",
    method: "post",
    data
  });
}

// export function searchUser(data) {
//   return request({
//     url: "/common/user/select",
//     method: "post",
//     data
//   });
// }

export function setRole(data) {
  return request({
    url: "/common/user/edit",
    method: "post",
    data
  });
}

export function switchUser(data) {
  return request({
    url: "/common/user/disable",
    method: "post",
    data
  });
}

export function deleUser(data) {
  return request({
    url: "/common/user/del",
    method: "post",
    data
  });
}
