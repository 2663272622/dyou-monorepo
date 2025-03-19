import request from '@/utils/request'


// 查询类目列表
export function listCorrection(query) {
    return request({
        url: '/manage/correction/list',
        method: 'get',
        params: query
    })
}
//查询类目详情信息
export function listCorrectionDetail(correctionId) {
    return request({
        url: '/manage/correction/' +  correctionId,
        method: 'get',
    })
}

// 修改类目列表
export function updateCorrection(query) {
    return request({
        url: '/manage/correction',
        method: 'put',
        data: query
    })
}

// 删除类目列表
export function delCorrection(correctionIds) {
    return request({
        url: '/manage/correction/' +  correctionIds,
        method: 'delete',
    })
}
