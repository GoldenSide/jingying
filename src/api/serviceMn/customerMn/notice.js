import request from "@/config/requestConfig";

export function noticeList(data) {
  return request({
    url: "/common/message/list",
    method: "post",
    data
  });
}

export function noticeItemInfo(data) {
  return request({
    url: "/common/message/one",
    method: "post",
    data
  });
}

export function recallNotice(data) {
  return request({
    url: "/common/message/recall",
    method: "post",
    data
  });
}

export function publishNotice(data) {
  return request({
    url: "/common/message/create",
    method: "post",
    data
  });
}
export function editNotice(data) {
  return request({
    url: "/common/message/edit",
    method: "post",
    data
  });
}

export function msgHistory(data) {
  return request({
    url: "/common/message/history-xshoppy-list",
    method: "post",
    data
  });
}
export function msgHistoryInfo(data) {
  return request({
    url: "/common/message/history-xshoppy-one",
    method: "post",
    data
  });
}
