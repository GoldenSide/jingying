import CryptoJS from "crypto-js";
export function sign_md5(model, token = "") {
  if (
    model == "" ||
    model == undefined ||
    model == null ||
    Object.keys(model).length == 0
  ) {
    return CryptoJS.MD5(token)
      .toString()
      .toUpperCase();
  }
  let obj = {},
    str = "";
  for (const [key, value] of Object.entries(model)) {
    if (value === undefined || value == null || Object.is(NaN, value)) {
      continue;
    }
    obj[key] = value;
  }
  Object.keys(obj)
    .sort()
    .forEach(v => {
      str += v + "=" + JSON.stringify(obj[v]) + "&";
    });
  let comBineStr = str + "token=" + token;

  return CryptoJS.MD5(comBineStr)
    .toString()
    .toUpperCase();
}
