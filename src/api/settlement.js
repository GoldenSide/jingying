import request from '@/config/requestConfig'

export default {
    billOverview(data) {
        return request({
            url: '/common/bill-overview/list',
            method: 'post',
            data
        })
    },
    billList(data){
        return request({
            url: '/common/bill/list',
            method: 'post',
            data
        })
    },
    
    billItemInfo(data){
        return request({
            url: '/common/bill/one',
            method: 'post',
            data
        })
    }
}