import {
    filter,
    firstValueFrom,
    merge,
    retry,
    share,
    switchMap,
    throwError
} from "rxjs";
import { fromFetch } from 'rxjs/fetch'

import { getCSRFToken } from './'

const _secure = async (method: string, url: string, body?: any) => {
    if (body && typeof body !== "string")
        body = JSON.stringify(body)

    const request = fromFetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        credentials: 'include',
        mode: 'cors',
        ...(body && { body })
    }).pipe(retry({ count: 3, delay: 500 }), share())

    const failure = request.pipe(
        filter((r: any) => !r.ok),
        switchMap((r) => r.json() as Promise<{ message: string } | null>),
        switchMap((r) => throwError(() => new Error(r?.message ?? "Unknown error")))
    )

    const success = request.pipe(
        filter((r: any) => r.ok),
        switchMap((r) => r.status === 204 ? Promise.resolve() : r.json() as Promise<any>)
    )

    return firstValueFrom(merge(failure, success))
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