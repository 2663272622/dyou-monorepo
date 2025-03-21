import request from '@/utils/request'

// 新增作者
export function authorAddApi(data) {
    return request({
      url: '/manage/author',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
// 删除作者
export function authorDelApi(id) {
    return request({
        url: '/manage/author/'+ id,
        method: 'delete',
        headers:{
        }
    })
} 
//  编辑作者
export function authorEditApi(data) {
    return request({
        url: '/manage/author',
        method: 'put',
        data , 
        headers:{
        }
    })
} 
//  作者详情
export function authorInfoApi(id) {
    return request({
        url: '/manage/author/' + id,
        method: 'get',
        headers:{
        }
    })
} 
// 作者列表
export function authorListApi(params) {
    return request({
        url: '/manage/author/list',
        method: 'get',
        params , 
        headers:{
        }
    })
} 
// 作者所有列表
export function authorAllListApi(params) {
    return request({
        url: '/manage/author/getAllList',
        method: 'get',
        params , 
        headers:{
        }
    })
} 