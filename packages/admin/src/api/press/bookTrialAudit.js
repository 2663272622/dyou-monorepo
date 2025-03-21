import request from '@/utils/request'

// 查询老师试用申请列表
export function listBookshelf(query) {
    return request({
        url: '/manage/teacherBookshelf/list',
        method: 'get',
        params: query
    })
}

// 查询老师试用申请详细
export function getBookshelf(id) {
    return request({
        url: '/manage/teacherBookshelf/' + id,
        method: 'get'
    })
}

// 新增老师试用申请
export function addBookshelf(data) {
    return request({
        url: '/manage/teacherBookshelf',
        method: 'post',
        data: data
    })
}

// 修改老师试用申请
export function updateBookshelf(data) {
    return request({
        url: '/manage/teacherBookshelf',
        method: 'put',
        data: data
    })
}

// 删除老师试用申请
export function delBookshelf(id) {
    return request({
        url: '/manage/teacherBookshelf/' + id,
        method: 'delete'
    })
}
