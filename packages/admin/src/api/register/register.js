import request from '@/utils/request'


// 注册方法
export function inviteRegister(data) {
    return request({
        url: '/auth/inviteRegister',
        headers: {
            isToken: false
        },
        method: 'post',
        data: data
    })
}

// 刷新方法
export function refreshToken() {
    return request({
        url: '/auth/refresh',
        method: 'post'
    })
}

// 获取验证码
export function getCode(data) {
    return request({
        url: '/auth/sendCode',
        headers: {
            isToken: false
        },
        method: 'post',
        data:data,
        timeout: 20000
    })
}