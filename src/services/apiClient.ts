import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

class APIClient<T> {
    endpoint: string

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    getAll = () => {
       return axiosInstance
            .get<T[]>(this.endpoint)
            .then((res) => res.data)
    }

    post = <R = T>(path?: string, params?: Record<string, string>): Promise<R> => {
       return axiosInstance
            .post<R>(`${this.endpoint}${path ?? ''}`, null, {params})
            .then(res => res.data)
    }
}

export default APIClient