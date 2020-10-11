import axios from '@/api';

export default class ShiJuan {
    static queryByUserId(params = {}) {
        let request = {
            url: '/api/Kssj/QueryByUserId',
            method: 'get',
            params
        }
        return axios(request)
    }
}
