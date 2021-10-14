import request from "@/config/requestConfig";

export function loginByQrcode(data) {
  return request({
    url: "/common/login/dingtalk-qcode-login",
    method: "post",
    data
  });
}

export function getUserInfo() {
  return request({
    url: "/common/user/login-info",
    method: "post"
  });
}

export function logOut() {
  return request({
    url: "/common/login/loginout",
    method: "post"
  });
}

export function getOwnMenuList(data) {
  return request({
    url: "/common/user/menu-list",
    method: "post",
    data
  });
}
