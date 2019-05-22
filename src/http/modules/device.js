import axios from '../axios'


export const Data = () => {
    return axios({
        url: '/device/data',
        method: 'get'
    })
}

export const LeftFront = () => {
    return axios({
        url: '/device/LeftFront',
        method: 'get'
    })
}

export const LeftBehind = () => {
    return axios({
        url: '/device/LeftBehind',
        method: 'get'
    })
}

export const RightBehind = () => {
    return axios({
        url: '/device/RightBehind',
        method: 'get'
    })
}

export const RightFront = () => {
    return axios({
        url: '/device/RightFront',
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