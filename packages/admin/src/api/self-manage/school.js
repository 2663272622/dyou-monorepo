import request from '@/utils/request'

//添加学校列表
export function addSchool(query) {
    return request({
        url: '/manage/school',
        method: 'post',
        data: query
    })
}

// 查询学校列表
export function listSchool(query) {
    return request({
        url: '/manage/school/list',
        method: 'get',
        params: query
    })
}
// 查询学校列表
export function listAllSchoolApi(query) {
    return request({
        url: '/manage/school/getAllList',
        method: 'get',
        params: query
    })
}

//查询学校详情信息
export function listSchoolDetail(schoolId) {
    return request({
        url: '/manage/school/' +  schoolId,
        method: 'get',
    })
}

// 修改学校列表
export function updateSchool(query) {
    return request({
        url: '/manage/school',
        method: 'put',
        data: query
    })
}

// 删除学校列表
export function delSchool(schoolIds) {
    return request({
        url: '/manage/school/' +  schoolIds,
        method: 'delete',
    })
}
