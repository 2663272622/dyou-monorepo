import request from '@/utils/request'

// 新增出版社
export function pressAddApi(data) {
    return request({
      url: '/manage/publisher',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
// 删除出版社
export function pressDelApi(id) {
    return request({
        url: '/manage/publisher/'+ id,
        method: 'delete',
        headers:{
        }
    })
} 
//  编辑出版社
export function pressEditApi(data) {
    return request({
        url: '/manage/publisher',
        method: 'put',
        data , 
        headers:{
        }
    })
} 
//  出版社详情
export function pressInfoApi(id) {
    return request({
        url: '/manage/publisher/' + id,
        method: 'get',
        headers:{
        }
    })
} 
// 出版社列表
export function pressListApi(params) {
    return request({
        url: '/manage/publisher/list',
        method: 'get',
        params , 
        headers:{
        }
    })
} 