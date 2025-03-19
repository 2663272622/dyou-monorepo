import request from '@/utils/request'

//添加学校列表
export function addBooks(query) {
    return request({
        url: '/manage/books',
        method: 'post',
        data: query
    })
}

// 查询学校列表
export function listBooks(query) {
    return request({
        url: '/manage/books/list',
        method: 'get',
        params: query
    })
}

//查询学校详情信息
export function listBooksDetail(booksId) {
    return request({
        url: '/manage/books/' +  booksId,
        method: 'get',
    })
}

// 修改学校列表
export function updateBooks(query) {
    return request({
        url: '/manage/books',
        method: 'put',
        data: query
    })
}

// 删除学校列表
export function delBooks(booksIds) {
    return request({
        url: '/manage/books/' +  booksIds,
        method: 'delete',
    })
}
