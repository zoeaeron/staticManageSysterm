import axios from 'axios'
import http from '../utils/http'

export function getFile(params){
    const param = {
        id: params
    }
    return http.get("/media/findBytId", param)
}

export function getSonFile(params){
    return http.get("/media/findByParentId", params)
}

export function listByName(params){
    return http.post("/media/listByFileName", params);
}

export function createDir(params){
    return http.post("/media/createDir", params)
}

export function uploadFile(params){
    return http.postFile("/media/upload", params)
}

export function uploadFolder(params){
    return http.postFile("/media/uploadFolder",params)
}

export function delFile(params){
    return http.post("/media/del", params)
}

export function updateFile(params){
    return http.post("/media/update",params)
}

export function moveFile(params){
    return http.post("/media/move",params)
}