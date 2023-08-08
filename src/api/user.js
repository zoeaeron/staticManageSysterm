import http from '../utils/http'

export function listUsers(params){
    return http.post("/user/queryUserList", params)
}

export function getUserInfo(){
    return http.post("user/queryUserInfo")
}

export function addUser(params){
    return http.post("user/addUser",params)
}

export function delUser(params){
    return http.post("user/delUser",params)
}

export function login(params){
    return http.post("/user/login",params)
}

export function logout(params){
    return http.post("/user/logout",params)
}

export function updPwd(params){
    return http.post("/user/updPwd",params)
}