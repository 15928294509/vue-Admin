import request from '@/utils/request'

export function getruleList() {
    return request({
        url: '/admin/rule/getrulelist',
        method: 'get',
    })
}
export function delRule(params) {
    return request({
        url: "/admin/rule/delrule",
        method: "get",
        params
    })
}

export function addRule(data) {
    return request({
        url: "/admin/rule/addrule",
        method: "post",
        data
    })
}

export function getRule(params){
    return request({
        url: "/admin/rule/ruleinfo",
        method: "get",
        params
    })
}

export function updateRule(data){
    return request({
        url: "/admin/rule/updaterule",
        method: "post",
        data
    })
}