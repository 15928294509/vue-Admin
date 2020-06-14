import request from '@/utils/request'

export function getuserList(params) {
  return request({
    url: '/admin/user/getuserlist',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: "/admin/user/adduser",
    method: "post",
    data
  })
}
export function delUser(params) {
  return request({
    url: "/admin/user/deluser",
    method: "get",
    params
  })
}

export function updateUser(data){
  return request({
    url: "/admin/user/updateuser",
    method: "post",
    data
  })
}

export function getUser(params){
  return request({
    url: '/admin/user/getuser',
    method: 'get',
    params
  })
}