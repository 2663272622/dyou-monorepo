import request from '@/utils/request'

// 查询课程班级列表
export function listClass(query) {
    return request({
        url: '/manage/class/list',
        method: 'get',
        params: query
    })
}
// 查询课程列表
export function listCourse(query) {
    return request({
        url: '/manage/course/getAllList',
        method: 'get',
        params: query
    })
}

// 查询课程班级详细
export function getClass(classId) {
    return request({
        url: '/manage/class/' + classId,
        method: 'get'
    })
}

// 新增课程班级
export function addClass(data) {
    return request({
        url: '/manage/class',
        method: 'post',
        data: data
    })
}

// 修改课程班级
export function updateClass(data) {
    return request({
        url: '/manage/class',
        method: 'put',
        data: data
    })
}

// 删除课程班级
export function delClass(classId) {
    return request({
        url: '/manage/class/' + classId,
        method: 'delete'
    })
}
