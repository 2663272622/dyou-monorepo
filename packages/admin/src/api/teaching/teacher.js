import request from '@/utils/request'

// 查询教师信息列表
export function listTeacher(query) {
    return request({
        url: '/manage/teacher/list',
        method: 'get',
        params: query
    })
}

// 查询教师信息详细
export function getTeacher(id) {
    return request({
        url: '/manage/teacher/' + id,
        method: 'get'
    })
}

// 新增教师信息
export function addTeacher(data) {
    return request({
        url: '/manage/teacher',
        method: 'post',
        data: data
    })
}

// 修改教师信息
export function updateTeacher(data) {
    return request({
        url: '/manage/teacher',
        method: 'put',
        data: data
    })
}

// 删除教师信息
export function delTeacher(id) {
    return request({
        url: '/manage/teacher/' + id,
        method: 'delete'
    })
}
