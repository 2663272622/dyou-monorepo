import request from '@/utils/request'


// 新增学院列表
export function addCollege(query) {
    return request({
        url: '/manage/college',
        method: 'post',
        data: query
    })
}
// 查询学院列表
export function listCollege(query) {
    return request({
        url: '/manage/college/list',
        method: 'get',
        params: query
    })
}

//查询学院详情信息
export function listCollegeDetail(collegeId) {
    return request({
        url: '/manage/college/' +  collegeId,
        method: 'get',
    })
}

// 修改学院列表
export function updateCollege(query) {
    return request({
        url: '/manage/college',
        method: 'put',
        data: query
    })
}

// 删除学院列表
export function delCollege(collegeIds) {
    return request({
        url: '/manage/college/' +  collegeIds,
        method: 'delete',
    })
}
