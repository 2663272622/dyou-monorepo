import request from '@/utils/request'

// 查询链接列表
export function listInvite(query) {
    return request({
        url: '/system/link/list',
        method: 'get',
        params: query
    })
}

// 查询链接详细
export function getInvite(linkId) {
    return request({
        url: '/system/link/' + linkId,
        method: 'get'
    })
}

// 新增链接
export function addInvite(data) {
    return request({
        url: '/system/link',
        method: 'post',
        data: data
    })
}

// 修改链接
export function updateInvite(data) {
    return request({
        url: '/system/link',
        method: 'put',
        data: data
    })
}

// 删除链接
export function delInvite(linkId) {
    return request({
        url: '/system/link/' + linkId,
        method: 'delete'
    })
}



// 查询注册审核列表
export function listExamine(query) {
    return request({
        url: '/system/examine/list',
        method: 'get',
        params: query
    })
}

// 查询注册审核详细
export function getExamine(examineId) {
    return request({
        url: '/system/examine/' + examineId,
        method: 'get'
    })
}

// 审核注册审核状态
export function updateExamine(data) {
    return request({
        url: '/system/examine/examine',
        method: 'put',
        data: data
    })
}



