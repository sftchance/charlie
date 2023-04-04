import { getCSRFToken } from './'

const _secure = async (method: string, url: string, body?: any) => {
    if (body && typeof body !== "string")
        body = JSON.stringify(body)

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
        .then((res) => {
            if (res.status === 204) return Promise.resolve()

            return res.json()
        });
}

const path = (url: string) => {
    return `${import.meta.env.VITE_API_URL}${url}`
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
    path,
    get,
    post,
    patch,
    put,
    del
}