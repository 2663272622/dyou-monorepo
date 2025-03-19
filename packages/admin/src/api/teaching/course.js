import request from '@/utils/request'

//添加课程列表
export function addCourse(query) {
    return request({
        url: '/manage/course',
        method: 'post',
        data: query
    })
}

// 查询课程列表
export function listCourse(query) {
    return request({
        url: '/manage/course/list',
        method: 'get',
        params: query
    })
}

//查询课程详情信息
export function listCourseDetail(courseId) {
    return request({
        url: '/manage/course/' +  courseId,
        method: 'get',
    })
}

// 修改课程列表
export function updateCourse(query) {
    return request({
        url: '/manage/course',
        method: 'put',
        data: query
    })
}

// 删除课程列表
export function delCourse(courseIds) {
    return request({
        url: '/manage/course/' +  courseIds,
        method: 'delete',
    })
}
