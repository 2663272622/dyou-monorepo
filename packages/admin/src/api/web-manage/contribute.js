import request from '@/utils/request'


// 查询投稿
export function listContribute(query) {
    return request({
        url: '/manage/submission/list',
        method: 'get',
        params: query
    })
}

// 删除投稿
export function delContribute(ContributeIds) {
    return request({
        url: '/manage/submission/' +  ContributeIds,
        method: 'delete',
    })
}
