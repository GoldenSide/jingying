// 客户级别管理数据
import request from '@/config/requestConfig'

export function levelListAll(data) {
    return request({
        url: "/company/company-level/list",
        method: "post",
        data
    });
}
export function addGrade(data) {
    return request({
        url: "/company/company-level/create",
        method: "post",
        data
    });
}
export function editGrade(data) {
    return request({
        url: "/company/company-level/edit",
        method: "post",
        data
    });
}
// 操作日志
export function operatingLog(data) {
    return request({
        url: "/company/company-level/log-list",
        method: "post",
        data
    });
}