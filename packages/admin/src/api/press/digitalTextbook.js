import request from '@/utils/request'

//  编辑书
export function bookEditApi(data) {
    return request({
        url: '/manage/book',
        method: 'put',
        data , 
        headers:{}
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
//  设置精选
export function bookSetJxApi(data) {
    return request({
        url: '/manage/book/isSelected',
        method: 'post',
        data
    })
} 
//  设置精选
export function bookOpenPreEditApi(data) {
    return request({
        url: '/manage/book/openPreEdit',
        method: 'post',
        data
    })
} 
//  版本回退
export function returnOnlineVersionApi(data) {
    return request({
        url: '/manage/book/returnOnlineVersion',
        method: 'post',
        data
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




export function bookshelfApi(params) {
    return request({
        url: '/manage/bookshelf/list',
        method: 'get',
        params , 
        headers:{
        }
    })
} 


export function bookcatalogTreefApi(params) {
    return request({
        url: '/manage/catalog/getAllList',
        method: 'get',
        params , 
    })
} 


export function catalogAddApi(data) {
    return request({
        url: '/manage/catalog',
        method: 'post',
        data , 
    })
} 
export function catalogEditApi(params) {
    return request({
        url: '/manage/catalog/getAllList',
        method: 'get',
        params , 
    })
} 
export function catalogDelApi(ids) {
    return request({
        url: '/manage/catalog/'+ids,
        method: 'delete',
    })
}  

export function catalogTApi(data) {
    return request({
        url: '/manage/catalog/editAllSort',
        method: 'put',
        data , 
    })
} 
export function catalogInfoApi(params) {
    return request({
        url: '/manage/catalog/getBookCatalog',
        method: 'get',
        params
    })
} 



// 获取章节书内容
export function editorGetApi(params) {
    return request({
        url: '/manage/bookPage/list',
        method: 'get', 
        params
    })
} 
// 新增呢个章节书内容
export function editorAddtApi(data) {
    return request({
        url: '/manage/bookPage',
        method: 'post', 
        data
    })
} 
 
// 修改章节书内容
export function editorEdittApi(data) {
    return request({
        url: '/manage/bookPage',
        method: 'put', 
        data
    })
} 
// 修改章节书内容
export function editorDelApi(id) {
    return request({
        url: '/manage/bookPage/'+id,
        method: 'delete', 
    })
} 
 


export function bokResourceFileApi(data) {
    return request({
        url: '/manage//bokResource',
        method: 'post',
        data , 
    })
} 

export function bokResourceFileLsApi(data) {
    return request({
        url: '/manage/bokResource/getBookResourceList',
        method: 'post',
        data , 
        params:data , 
    })
} 