import axios from 'axios'

// 创建 Axios 实例
const myAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
    withCredentials: true, // 确保这个设置为true以发送cookie
})

// 获取CSRF Token的函数
function getCSRFToken() {
    // 从cookie中获取CSRF Token
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1]
    return cookieValue || ''
}

// 全局请求拦截器
myAxios.interceptors.request.use(
    function (config) {
        // 对于修改数据的请求(POST, PUT, PATCH, DELETE)添加CSRF Token
        const method = config.method?.toLowerCase()
        if (['post', 'put', 'patch', 'delete'].includes(method || '')) {
            const csrfToken = getCSRFToken()
            if (csrfToken) {
                // 添加CSRF Token到请求头
                config.headers['X-Csrftoken'] = csrfToken
            } else {
                console.warn('CSRF Token not found in cookies')
            }
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// 全局响应拦截器
myAxios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        // 处理CSRF错误
        if (error.response && error.response.status === 403 && error.response.data === 'CSRF Failed: CSRF token missing or incorrect.') {
            console.error('CSRF验证失败，请检查CSRF Token是否正确')
            // 这里可以添加重定向到登录页或其他处理逻辑
        }
        return Promise.reject(error)
    }
)

export default myAxios
