import request from '@/utils/request'

// 查询学生信息列表
export function listStudent(query) {
    return request({
        url: '/manage/studentCourse/list',
        method: 'get',
        params: query
    })
}

// 查询学生信息详细
export function getStudent(studentId) {
    return request({
        url: '/manage/studentCourse/' + studentId,
        method: 'get'
    })
}

// 新增学生信息
export function addStudent(data) {
    return request({
        url: '/manage/studentCourse',
        method: 'post',
        data: data
    })
}

// 修改学生信息
export function updateStudent(data) {
    return request({
        url: '/manage/studentCourse',
        method: 'put',
        data: data
    })
}

// 删除学生信息
export function delStudent(studentId) {
    return request({
        url: '/manage/studentCourse/' + studentId,
        method: 'delete'
    })
}

// 查询待审学生信息列表
export function listStudentAudit(query) {
    return request({
        url: '/manage/studentCourse/studentList',
        method: 'get',
        params: query
    })
}

// 审学生信息操作
export function updateStudentAudit(data) {
    return request({
        url: '/manage/studentCourse/toExamine',
        method: 'post',
        data: data
    })
}
