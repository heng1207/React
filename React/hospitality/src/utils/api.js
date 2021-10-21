import axios from 'axios'
import {BASE_URL} from './url'
import {getToken,removeToken} from './auth.js'
const Api = axios.create({
    baseURL:BASE_URL
})
Api.interceptors.request.use(config=>{
    const {url} = config
 if(url.startsWith('/user')&&!url.startsWith('/user/login')&&!url.startsWith('/user/registered')){
     //添加请求头
     config.headers.Authorization = getToken()
 }
 return config
})
Api.interceptors.response.use(response=>{
    // console.log(response)
    const {status} = response.data
    if(status===400){
        removeToken()
    }
    return response
})
export {Api}