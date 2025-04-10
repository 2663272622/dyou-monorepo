import request from '@/utils/request'

// 新增 
export function bookRecordAddApi(data) {
    return request({
      url: '/manage/bookRecord',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
// 删除 
export function bookRecordDelApi(id) {
    return request({
        url: '/manage/bookRecord/'+ id,
        method: 'delete',
        headers:{
        }
    })
} 
//  编辑 
export function bookRecordEditApi(data) {
    return request({
        url: '/manage/bookRecord',
        method: 'put',
        data , 
        headers:{
        }
    })
} 
//   详情
export function bookRecordInfoApi(id) {
    return request({
        url: '/manage/bookRecord/' + id,
        method: 'get',
        headers:{
        }
    })
} 
//  列表
export function bookRecordListApi(params) {
    return request({
        url: '/manage/bookRecord/list',
        method: 'get',
        params , 
        headers:{
        }
    })
} 
//  列表
export function bookRecordListAllApi(params) {
    return request({
        url: '/manage/bookRecord/getAllList',
        method: 'get',
        params , 
        headers:{
        }
    })
} 