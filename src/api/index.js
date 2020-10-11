import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'


let token = localStorage.getItem("token")

const instance = axios.create({
    timeout: 1 * 60 * 1000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': token || '',
    }
});

// 封装响应拦截，判断token是否过期
instance.interceptors.response.use(
    response => {
        // token过期或者token无效
        const { code } = response.data
        switch (code) {
            case '403':
                localStorage.clear()
                sessionStorage.clear()
                router._Router.replace('/login')
                break;
        }
        return Promise.resolve(response.data)
    },
    err => {
        if (err.config) {
            if (String(err).indexOf(err.config.timeout) != -1) {
                Message.error('请求超时')
            }
        }
        return Promise.reject(err)
    }
)

export default instance