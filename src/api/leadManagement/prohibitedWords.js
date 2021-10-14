import request from '@/config/requestConfig'

// 获取违禁词列表数据
export function getForbiddenWords(data) {
    return request({
        url: "/product/forbidden-words/list",
        method: "post",
        data
    });
}

// 新增违禁词
export function newAddForbiddenWords(data) {
    return request({
        url: "/product/forbidden-words/add",
        method: "post",
        data
    });
}
// 批量新增违禁词
export function newBatchAddForbiddenWords(data) {
    return request({
        url: "/product/forbidden-words/batch-add",
        method: "post",
        data
    });
}
// 添加至违禁词白名单
export function addAllowWords(data) {
    return request({
        url: "/product/forbidden-words/add-allow-words",
        method: "post",
        data
    });
}

// 添加至违禁词
export function addForbiddenWords(data) {
    return request({
        url: "/product/forbidden-words/add-forbidden-words",
        method: "post",
        data
    });
}

// 日志
export function operatingLog(data) {
    return request({
        url: "/product/forbidden-words/log-list",
        method: "post",
        data
    });
}

// 导出违禁词
export function exportForbiddenWords(data) {
    return request({
        url: "/product/forbidden-words/export",
        method: "post",
        data
    });
}