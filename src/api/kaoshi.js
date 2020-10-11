import axios from '@/api';

export default class KaoShi {
    static queryById(params = {}) {
        let request = {
            url: '/api/Kssj/GetXzt',
            method: 'get',
            params
        }
        return axios(request)
    }

    static submit(data = {}) {
        let request = {
            url: '/api/Kssj/JiaoJuan',
            method: 'put',
            data
        }
        return axios(request)
    }
}
