import request from '@/utils/request'

//添加类目列表
export function addCategory(query) {
    return request({
        url: '/manage/category',
        method: 'post',
        data: query
    })
}

// 查询类目列表
export function listCategory(query) {
    return request({
        url: '/manage/category/selectBookCategoryTree',
        method: 'get',
        params: query
    })
}

//查询类目详情信息
export function listCategoryDetail(categoryId) {
    return request({
        url: '/manage/category/' +  categoryId,
        method: 'get',
    })
}

// 修改类目列表
export function updateCategory(query) {
    return request({
        url: '/manage/category',
        method: 'put',
        data: query
    })
}

// 删除类目列表
export function delCategory(categoryIds) {
    return request({
        url: '/manage/category/' +  categoryIds,
        method: 'delete',
    })
}
