import request from '@/utils/request'

export function getroleList(params) {
  return request({
    url: '/admin/role/getrolelist',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: "/admin/role/addrole",
    method: "post",
    data
  })
}

export function delRole(params) {

  return request({
    url: "/admin/role/delrole",
    method: "get",
    params
  })
}
export function getRole(params){  
  return request({
      url: "/admin/role/roleinfo",
      method: "get",
      params
  })
}

export function updateRole(data){
  return request({
      url: "/admin/role/updaterole",
      method: "post",
      data
  })
}