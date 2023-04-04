import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { Error, Input, MultiSelect } from "../components";
import { useAccount } from "wagmi";
import { getCSRFToken } from "../utils";

const withToken = (token: any) => ({
    ...token,
    value: token.id,
    label: `${token.blockchain} - ${token.name} - ${token.symbol}`
})

const withTokens = (button: any, excludeTokens: any) => ({
    ...button,
    tokens: button.tokens
        ?.map((token: any) => withToken(token))
        ?.filter((token: any) => !excludeTokens?.find((activeToken: any) => activeToken.label === token.label))
        || []
})

const ButtonForm = ({ isEdit }: { isEdit?: boolean }) => {
    const navigate = useNavigate();

    const { buttonId } = useParams<{ buttonId: string }>();

    const { address } = useAccount();

    const API_URL = `http://localhost:8000/buttons/${buttonId}/`

    const {
        isLoading: isLoadingButtons,
        error,
        data,
        refetch,
    }: {
        isLoading: boolean;
        error: any;
        data: any;
        refetch: any;
    } = useQuery({
        queryKey: ["buttons", buttonId],
        queryFn: () => {
            if (isEdit == true)
                return fetch(API_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    },
                    credentials: 'include',
                    mode: 'cors'
                }).then((res) => res.json())

            return null
        },
        refetchOnWindowFocus: true,
        staleTime: 0,
        cacheTime: 0,
        refetchInterval: 0,
    });

    const {
        isLoading: isLoadingTokens,
        error: errorTokens,
        data: dataTokens,
    }: {
        isLoading: boolean;
        error: any;
        data: any;
    } = useQuery({
        queryKey: ["tokens"],
        queryFn: () => fetch(`http://localhost:8000/erc20/`).then((res) => res.json())
    });

    const [object, setObject] = useState<any>({
        ethereum_address: address,
        name: "Untitled",
        description: "Button description...",
        text: "Delegate",
        primary_color: "#000000",
        secondary_color: "#FFFFFF",
        tokens: []
    });

    const [errors, setErrors] = useState<any>([]);

    const options = [...withTokens({ tokens: dataTokens }, object?.tokens || [])?.tokens]

    const handleDelete = () => {
        fetch(API_URL, {
            method: "DELETE",
        }).then(() => navigate("/account/"))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        }

        const body = JSON.stringify({
            ...object,
            tokens: object.tokens.map((token: any) => token.value)
        })

        const response = isEdit ? fetch(API_URL, {
            method: "PUT",
            headers,
            credentials: 'include',
            mode: 'cors',
            body
        }) : fetch(`http://localhost:8000/buttons/`, {
            method: "POST",
            headers,
            credentials: 'include',
            mode: 'cors',
            body
        })

        response
            .then((res): any => {
                if (res.status >= 400) {
                    return res.json().then((data) => {
                        return Promise.reject(data)
                    })
                }

                return res
            })
            .then((res) => res.json())
            .then((data) => {
                refetch()

                navigate(`/account/buttons/${data.id}/edit/`)
            })
            .catch((errors) => {
                setErrors(errors)
            })
    }

    useEffect(() => {
        if (!data) return

        setErrors([])

        setObject(withTokens({
            ethereum_address: data.ethereum_address,
            name: data.name,
            description: data.description,
            text: data.text,
            primary_color: data.primary_color,
            secondary_color: data.secondary_color,
            tokens: data.tokens
        }, []))
    }, [data, refetch])

    if (isEdit && ((isLoadingButtons || isLoadingTokens) || object === null)) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    if (errorTokens) return <p>Error: {errorTokens.message}</p>;

    return (
        <>
            <h3>{isEdit ? "Edit" : "Create"}</h3>
            <h1>{isEdit ? data.name : "Delegation Button"}</h1>

            <Link
                to={isEdit
                    ? `/account/buttons/${buttonId}/`
                    : "/account/"}
                children={<button>Back</button>} />

            <form onSubmit={handleSubmit}>
                <Input
                    label="Name"
                    value={object.name}
                    onChange={(e: any) => setObject({ ...object, name: e.target.value.trim() })}
                    error={errors?.name} />

                <Input
                    label="Delegate Ethereum Address"
                    value={object.ethereum_address}
                    onChange={(e: any) => setObject({ ...object, ethereum_address: e.target.value.trim() })}
                    error={errors?.ethereum_address} />

                <Input
                    label="Description"
                    value={object.description}
                    onChange={(e: any) => setObject({ ...object, description: e.target.value.trim() })}
                    error={errors?.description} />

                <Input
                    label="Button text"
                    value={object.text}
                    onChange={(e: any) => setObject({ ...object, text: e.target.value.trim() })}
                    error={errors?.text} />

                <div>
                    <Input
                        label="Primary color"
                        value={object.primary_color}
                        onChange={(e: any) => setObject({ ...object, primary_color: e.target.value.trim() })}
                        error={errors?.primary_color} />

                    <Input
                        label="Secondary color"
                        value={object.secondary_color}
                        onChange={(e: any) => setObject({ ...object, secondary_color: e.target.value.trim() })}
                        error={errors?.secondary_color} />
                </div>

                <MultiSelect
                    label="Targeted Tokens"
                    value={object.tokens}
                    onChange={(e: any) => setObject({ ...object, tokens: e })}
                    options={options}
                    error={errors?.tokens} />

                {object?.tokens?.length > 0 ? object?.tokens?.map((token: any) =>
                    <p key={token.label}>{JSON.stringify(token, null, 2)}</p>
                ) : <p>No tokens targeted...</p>}

                <Error error={errors?.detail} />

                {isEdit && <button
                    type="button"
                    onClick={handleDelete}
                >Delete</button>}

                <button
                    type="submit"
                    className={isEdit
                        ? "primary block"
                        : "primary secondary block"}>
                    <span className="content">Save</span>
                </button>
            </form>
        </>
    )
}

export { ButtonForm }