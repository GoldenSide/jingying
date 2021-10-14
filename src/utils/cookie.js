import Cookies from "js-cookie";
import context from "../main";
const routeRootKey = "routeRootKey";

export function setCurRouteRoot(root) {
  return Cookies.set(routeRootKey, root);
}

export function getCurRouteRoot() {
  return Cookies.get(routeRootKey) || 0;
}

export function setToken(token) {
  Cookies.set("token_sign", token);
}

export function haveToken() {
  return Cookies.get("token_sign") || "";
}

export function removeToken() {
  context.utils.clearAllCookie();
  Cookies.remove("token_sign");
}

export function setBaseUrl(url) {
  Cookies.set("url", url);
}
export function getBaseUrl() {
  return Cookies.get("url");
}

export function setPlatForm(platForm) {
  Cookies.set("platForm", platForm);
}

export function getPlatForm() {
  return Cookies.get("platForm") || "XShoppy";
}
