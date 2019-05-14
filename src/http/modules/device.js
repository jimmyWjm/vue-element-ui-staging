import axios from '../axios'


export const Data = () => {
    return axios({
        url: '/device/data',
        method: 'get'
    })
}

export const Power = () => {
    return axios({
        url: '/device/power',
        method: 'get'
    })
}

export const mainControl = () => {
    return axios({
        url: '/device/mainControl',
        method: 'get'
    })
}

export const markers = () => {
    return axios({
        url: '/device/marker',
        method: 'get'
    })
}