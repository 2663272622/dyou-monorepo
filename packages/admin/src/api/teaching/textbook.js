import request from '@/utils/request'

// 查询学院列表
export function listTextbook(query) {
    return request({
        url: '/school/colleges/list',
        method: 'get',
        params: query
    })
}
