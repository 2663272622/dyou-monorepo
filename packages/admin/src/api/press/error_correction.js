import request from '@/utils/request.js'


// 查询纠错列表
export function listCorrection(query) {
    return request({
        url: '/manage/correction/list',
        method: 'get',
        params: query
    })
}

//查询纠错详情信息
export function listCorrectionDetail(correctionId) {
    return request({
        url: '/manage/correction/' +  correctionId,
        method: 'get',
    })
}

// 修改纠错列表
export function updateCorrection(data) {
    return request({
        url: '/manage/correction/correct',
        method: 'put',
        data: data
    })
}


// 删除纠错列表
export function delCorrection(correctionIds) {
    return request({
        url: '/manage/correction/' +  correctionIds,
        method: 'delete',
    })
}
