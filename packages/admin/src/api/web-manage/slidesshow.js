import request from '@/utils/request'

//添加学校列表
export function addImg(query) {
    return request({
        url: '/manage/resource',
        method: 'post',
        data: query
    })
}

// 查询学校列表
export function listImg(query) {
    return request({
        url: '/manage/resource/list',
        method: 'get',
        params: query
    })
}

//查询学校详情信息
export function listImgDetail(ImgId) {
    return request({
        url: '/manage/resource/' +  ImgId,
        method: 'get',
    })
}

// 修改学校列表
export function updateImg(query) {
    return request({
        url: '/manage/resource',
        method: 'put',
        data: query
    })
}

// 删除学校列表
export function delImg(ImgIds) {
    return request({
        url: '/manage/resource/' +  ImgIds,
        method: 'delete',
    })
}
