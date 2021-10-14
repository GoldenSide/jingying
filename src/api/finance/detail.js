import request from "@/config/requestConfig";

export function billDetail(data) {
  return request({
    url: "/finance/commission/one",
    method: "post",
    data
  });
}

export function getListCount(data) {
  return request({
    url: "/finance/commission/one-nums",
    method: "post",
    data
  });
}
