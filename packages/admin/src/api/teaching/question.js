import request from '@/utils/request'

// 查询题库列表
export function questionGetApi(query) {
    return request({
        url: '/manage//bank/list',
        method: 'get',
        params: query
    })
}

// question_bank_type   题库类型
// topic_type 问题类型


//  题库列表
export function bankGetApi(params) {
    return request({
        url: '/manage/bank',
        method: 'get',
        params , 
        headers:{}
    })
}  
//  编辑
export function bankEditApi(data) {
    return request({
        url: '/manage/bank',
        method: 'put',
        data , 
        headers:{}
    })
}  
//  新增
export function bankAddApi(data) {
    return request({
        url: '/manage/bank',
        method: 'post',
        data , 
        headers:{}
    })
}  
//  删除
export function bankDelApi(id) {
    return request({
        url: '/manage/bank/'+id,
        method: 'delete', 
    })
}  
//  获取详情
export function bankINFPApi(id) {
    return request({
        url: '/manage/bank/'+id,
        method: 'get', 
    })
}  