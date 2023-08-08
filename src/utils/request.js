import { processExpression } from '@vue/compiler-core'
import axios from 'axios'
//引入Message做消息提醒
import { ElMessage } from 'element-plus';
import { getToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
    baseURL: '/api', // url = base url + request url
    // 超时
    timeout: 10000,
});

//request拦截器
service.interceptors.request.use(config => {
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
        let token = getToken();
        let index = token.indexOf('=');
        token = token.slice(index+1);
        config.headers['Authorization'] = token; //header携带token
    }
    if( config.url == "/media/uploadFolder" || config == "/media/upload"){
        config.timeout = 120000;
    }
    return config
}, error => {
    Promise.reject(error)
})

//response拦截器
service.interceptors.response.use(response => {
    //接受到响应数据并成功后的一些共有处理,
    return response
}, error => {
    // 接收到异常响应的处理开始
    if (error && error.response) {
        // 1.公共错误处理
        // 2.根据响应码具体处理
        switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break;
            case 401:
                error.message = '未授权，请重新登录'
                break;
            case 403:
                error.message = '拒绝访问'
                break;
            case 404:
                error.message = '请求错误,未找到该资源'
                break;
            case 405:
                error.message = '请求方法未允许'
                break;
            case 408:
                error.message = '请求超时'
                break;
            case 500:
                error.message = '服务器端出错'
                break;
            case 501:
                error.message = '网络未实现'
                break;
            case 502:
                error.message = '网络错误'
                break;
            case 503:
                error.message = '服务不可用'
                break;
            case 504:
                error.message = '网络超时'
                break;
            case 505:
                error.message = 'http版本不支持该请求'
                break;
            default:
                error.message = `连接错误${error.response.status}`
        }
    } else {
        //超时处理
        if (JSON.stringify(error).includes('timeout')) {
            ElMessage.error('服务器响应超时,请刷新当前页面')
        }
        error.message = '连接服务器失败'
    }

    ElMessage.error(error.message)

    return Promise.resolve(error.response)
})

export default service
