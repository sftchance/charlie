import { getCSRFToken } from './'

const _secure = async (method: string, url: string, body?: any) => {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
        mode: 'cors',
        ...(body && { body })
    })
        .then((res) => {
            if (res.status === 401) localStorage.removeItem("address")

            if (res.status >= 400) {
                return res.json().then((data) => {
                    return Promise.reject(data)
                })
            }

            return res
        })
}

const get = async (url: string) => {
    return await _secure("GET", url)
}

const post = async (url: string, body: any) => {
    return await _secure("POST", url, body)
}

const put = async (url: string, body: any) => {
    return await _secure("PUT", url, body)
}

const patch = async (url: string, body: any) => {
    return await _secure("PATCH", url, body)
}

const del = async (url: string) => {
    return await _secure("DELETE", url)
}

export {
    get,
    post,
    patch,
    put,
    del
}