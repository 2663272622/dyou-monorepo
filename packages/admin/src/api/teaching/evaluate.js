import request from '@/utils/request'

// 查询测评列表
export function listEvaluate(query) {
    return request({
        url: '/manage/assessment/list',
        method: 'get',
        params: query
    })
}

// 删除测评
export function delEvaluate(evaluateId) {
    return request({
        url: '/manage/assessment/' + evaluateId,
        method: 'delete'
    })
}
// 查询老师书籍列表
export function listTextbook(query) {
    return request({
        url: 'manage/bookshelf/getAllList',
        method: 'get',
        params: query
    })
}