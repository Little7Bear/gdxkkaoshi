import axios from '@/api';
import router from '@/router'

export default class User {
    static login(data = {}) {
        let request = {
            url: '/api/Authentication/Login',
            method: 'post',
            data
        }
        return axios(request)
    }

    static queryByName(params = {}) {
        let request = {
            url: '/api/User/QueryByName',
            method: 'get',
            params
        }
        return axios(request)
    }

    static logout() {
        localStorage.clear()
        router.replace('/login')
    }
}
