import request from '@/utils/request'

export function getcategoryList(params) {
  return request({
    url: '/admin/category/getcategorylist',
    method: 'get',
    params
  })
}

export function addCategory(data) {
  return request({
    url: "/admin/category/addcategory",
    method: "post",
    data
  })
}
export function updateCategory(data) {
  return request({
    url: "/admin/category/updatecategory",
    method: "post",
    data
  })
}

export function delCategory(params) {

  return request({
    url: "/admin/category/delcategory",
    method: "get",
    params
  })
}