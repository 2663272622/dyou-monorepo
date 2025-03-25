import request from '@/utils/request'

// 查询课程列表
export function listEvaluate(query) {
    return request({
        url: '/manage/assessment/list',
        method: 'get',
        params: query
    })
}

// 查询课程详细
export function getEvaluate(evaluateId) {
    return request({
        url: '/manage/assessment/' + evaluateId,
        method: 'get'
    })
}

// 新增课程
export function addEvaluate(data) {
    return request({
        url: '/manage/assessment/',
        method: 'post',
        data: data
    })
}

// 修改课程
export function updateEvaluate(data) {
    return request({
        url: '/manage/assessment/',
        method: 'put',
        data: data
    })
}

// 删除课程
export function delEvaluate(evaluateId) {
    return request({
        url: '/manage/assessment/' + evaluateId,
        method: 'delete'
    })
}
