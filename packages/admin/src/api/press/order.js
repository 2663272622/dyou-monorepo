import request from '@/utils/request'

// 新增订单
export function orderAddApi(data) {
    return request({
      url: '/manage/order',
      method: 'post',
      data , 
      headers:{
      }
    })
} 
// 删除订单
export function orderDelApi(id) {
    return request({
        url: '/manage/order/'+ id,
        method: 'delete',
        headers:{
        }
    })
} 
//  编辑订单
export function orderEditApi(data) {
    return request({
        url: '/manage/order',
        method: 'put',
        data , 
        headers:{
        }
    })
} 
//  订单详情
export function orderInfoApi(id) {
    return request({
        url: '/manage/order/' + id,
        method: 'get',
        headers:{
        }
    })
} 
// 订单列表
export function orderListApi(params) {
    return request({
        url: '/manage/order/list',
        method: 'get',
        params , 
        headers:{
        }
    })
} 
// 订单列表
export function orderListAllApi(params) {
    return request({
        url: '/manage/order/getAllList',
        method: 'get',
        params , 
        headers:{
        }
    })
} 