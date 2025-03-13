import request from '@/utils/request'

// 查询图书目录列表
export function listCatalog(query) {
  return request({
    url: '/system/catalog/list',
    method: 'get',
    params: query
  })
}

// 查询图书目录详细
export function getCatalog(catalogId) {
  return request({
    url: '/system/catalog/' + catalogId,
    method: 'get'
  })
}

// 新增图书目录
export function addCatalog(data) {
  return request({
    url: '/system/catalog',
    method: 'post',
    data: data
  })
}

// 修改图书目录
export function updateCatalog(data) {
  return request({
    url: '/system/catalog',
    method: 'put',
    data: data
  })
}

// 删除图书目录
export function delCatalog(catalogId) {
  return request({
    url: '/system/catalog/' + catalogId,
    method: 'delete'
  })
}
