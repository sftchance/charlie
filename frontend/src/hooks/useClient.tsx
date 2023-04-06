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

import { useNavigate } from "react-router";

import { getCSRFToken } from '../utils'

const useClient = () => {
    const navigate = useNavigate()

    const _logout = (response: any) => {
        if (response.status === 403) {
            localStorage.removeItem('address');
            navigate('/');
        }

        return response
    }

    const _secure = async (method: string, url: string, body?: any) => {
        // const { logout } = useAuthentication()

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
        }).pipe(retry({ count: 1, delay: 200 }), share())

        const logout = request.pipe(
            filter((r: any) => r.status === 403),
            switchMap((r) => _logout(r)),
            switchMap((r) => throwError(() => new Error("Unauthorized")))
        )

        const failure = request.pipe(
            filter((r: any) => !r.ok),
            switchMap((r) => r.json() as Promise<{ detail: string } | null>),
            switchMap((r) => throwError(() => new Error(r?.detail ?? "Unknown error")))
        )

        const success = request.pipe(
            filter((r: any) => r.ok),
            switchMap((r) => r.status === 204 ? Promise.resolve() : r.json() as Promise<any>)
        )

        return firstValueFrom(merge(logout, failure, success))
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

    return {
        path,
        get,
        post,
        patch,
        put,
        del
    }
}

export { useClient }