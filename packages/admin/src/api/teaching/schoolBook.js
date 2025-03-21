import request from '@/utils/request'

// 查询学院列表
export function listShoolBook(query) {
    return request({
        url: '/manage/bookshelf/listBySchool',
        method: 'get',
        params: query
    })
}
