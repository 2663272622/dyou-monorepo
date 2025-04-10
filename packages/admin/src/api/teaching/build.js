import request from '@/utils/request'

// 查询测评班级列表
export function listCatalog(query) {
    return request({
        url: '/manage/catalog/getAllList',
        method: 'get',
        params: query
    })
}


export function selectCatalogId(data) {
    return request({
        url: '/manage/bank/selectBankByCatalogId',
        method: 'post',
        data: data
    })
}

// 新增测评
export function addEvaluate(data) {
    return request({
        url: '/manage/assessment/',
        method: 'post',
        data: data
    })
}

// 查询测评详细
export function getEvaluate(evaluateId) {
    return request({
        url: '/manage/assessment/getAssessmentInfo/' + evaluateId,
        method: 'get'
    })
}

// 修改测评
export function updateEvaluate(data) {
    return request({
        url: '/manage/assessment/',
        method: 'put',
        data: data
    })
}
