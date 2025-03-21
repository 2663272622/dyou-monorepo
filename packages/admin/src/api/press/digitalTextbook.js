import request from '@/utils/request'

//  编辑书
export function bookEditApi(data) {
    return request({
        url: '/manage/book',
        method: 'put',
        data , 
        headers:{
        }
    })
} 
//  新增书
export function bookAddApi(data) {
    return request({
      url: '/manage/book',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
//  书详情
export function bookbookApi(id) {
    return request({
        url: '/manage/book/' + id,
        method: 'get',
        headers:{
        }
    })
} 
// 书列表
export function bookListApi(params) {
    return request({
        url: '/manage/book/list',
        method: 'get',
        params , 
        headers:{
        }
    })
} 
// 学科
export function selectBookCategoryTreeApi(params) {
    return request({
        url: '/manage/category/selectBookCategoryTree',
        method: 'get',
        params , 
        headers:{
        }
    })
} 

// 删除书
export function bookDelApi(id) {
    return request({
        url: '/manage/book/'+ id,
        method: 'delete',
        headers:{
        }
    })
} 
//  上下架书
export function upOrDownAddApi(data) {
    return request({
      url: '/manage/book/upOrDown',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
//  提交/取消审核
export function submitReviewApi(data) {
    return request({
      url: '/manage/book/submitReview',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
