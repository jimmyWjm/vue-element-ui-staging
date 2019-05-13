import axios from '../axios'
import qs from 'qs'
/* 
 * 系统登录模块
 */

// 登录
export const login = data => {
    return axios({
        url: '/user/session',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            
        },
        data
    })
}

// 登出
export const logout = () => {
    return axios({
        url: '/logout',
        method: 'get'
    })
}

export const logCheck = () => {
    return axios({
        url: '/security1',
        method: 'get'
    })
}

// 注册
export const register = data => {
    return axios({
        url: '/user/',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            
        },
        data
    })
}