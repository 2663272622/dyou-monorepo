import request from '@/utils/request'


// 新增班级列表
export function addClass(query) {
    return request({
        url: '/manage/class',
        method: 'post',
        data: query
    })
}
// 查询班级列表
export function listClass(query) {
    return request({
        url: '/manage/class/list',
        method: 'get',
        params: query
    })
}

//查询班级详情信息
export function listClassDetail(classId) {
    return request({
        url: '/manage/class/' +  classId,
        method: 'get',
    })
}

// 修改班级列表
export function updateClass(query) {
    return request({
        url: '/manage/class',
        method: 'put',
        data: query
    })
}

// 删除班级列表
export function delClass(classIds) {
    return request({
        url: '/manage/class/' +  classIds,
        method: 'delete',
    })
}
