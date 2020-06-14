import request from '@/utils/request'

export function getproductList(params) {
  return request({
    url: '/admin/product/getproductlist',
    method: 'get',
    params
  })
}

export function addProduct(data) {
  return request({
    url: "/admin/product/addproduct",
    method: "post",
    data
  })
}
export function updateProduct(data) {
  return request({
    url: "/admin/product/updateproduct",
    method: "post",
    data
  })
}

export function delProduct(params) {

  return request({
    url: "/admin/product/delproduct",
    method: "get",
    params
  })
}
export function removeImg(data) {

  return request({
    url: "/assets/upload/removeImg",
    method: "post",
    data
  })
}
