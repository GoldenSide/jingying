import request from "@/config/requestConfig";

//  优惠申请单列表数据
export function discountList(data) {
    return request({
        url: "/company/company-manage/apply-discount-list",
        method: "post",
        data
    });
}
// 审核通过
export function discountPass(data) {
    return request({
        url: "/company/company-manage/apply-discount-pass",
        method: "post",
        data
    });
}
// 审核驳回
export function discountReject(data) {
    return request({
        url: "/company/company-manage/apply-discount-reject",
        method: "post",
        data
    });
}
// 模糊匹配查询公司
export function companySearchByWords(data) {
    return request({
        url: "/company/company/company-search-by-words",
        method: "post",
        data
    });
}
// 新增优惠申请单
export function applyDiscountAdd(data) {
    return request({
        url: "/company/company-manage/apply-discount-add",
        method: "post",
        data
    });
}