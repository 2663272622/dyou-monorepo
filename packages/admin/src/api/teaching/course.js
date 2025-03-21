import request from '@/utils/request'

// 查询课程列表
export function listCourse(query) {
    return request({
        url: '/manage/course/list',
        method: 'get',
        params: query
    })
}

// 查询课程详细
export function getCourse(courseId) {
    return request({
        url: '/manage/course/' + courseId,
        method: 'get'
    })
}

// 新增课程
export function addCourse(data) {
    return request({
        url: '/manage/course',
        method: 'post',
        data: data
    })
}

// 修改课程
export function updateCourse(data) {
    return request({
        url: '/manage/course',
        method: 'put',
        data: data
    })
}

// 删除课程
export function delCourse(courseId) {
    return request({
        url: '/manage/course/' + courseId,
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