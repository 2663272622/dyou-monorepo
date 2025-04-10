import request from '@/utils/request'

// 查询老师书籍列表
export function listTextbook(query) {
    return request({
        url: 'manage/bookshelf/list',
        method: 'get',
        params: query
    })
}
