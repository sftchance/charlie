import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { Error, Input, MultiSelect } from "../components";
import { useAccount } from "wagmi";

import { path, get, put, post, del } from "../utils";
import { useNavbar } from "../hooks";

import "./ButtonForm.css";

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

const ButtonForm = () => {
    const navigate = useNavigate();

    const { buttonId } = useParams<{ buttonId: string }>();

    const isEdit = !!buttonId;

    console.log(buttonId, isEdit)

    useNavbar(<Link to={
        isEdit
            ? `/account/buttons/${buttonId}/`
            : "/account/"}
        children={<button>Back</button>} />)

    const { address } = useAccount();

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
        queryKey: ["buttons", `${isEdit}${buttonId}`],
        queryFn: () => {
            if (!isEdit) return null

            return get(path(`buttons/${buttonId}/`))
        }
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
        queryFn: () => get(path("erc20/"))
    });

    const [object, setObject] = useState<any>({
        ethereum_address: address,
        name: "Untitled",
        description: "Button description...",
        text: "Delegate",
        primary_color: "#FF04C9",
        secondary_color: "#FF6804",
        tokens: []
    });

    const [errors, setErrors] = useState<any>([]);

    const options = [...withTokens({ tokens: dataTokens }, object?.tokens || [])?.tokens]

    const handleDelete = (e: any) => {
        e.preventDefault()

        del(path(`buttons/${buttonId}`)).then(() => navigate("/account/"))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const body = JSON.stringify({
            ...object,
            tokens: object.tokens.map((token: any) => token.value)
        })

        const response = isEdit
            ? put(path(`buttons/${buttonId}/`), body)
            : post(path("buttons/"), body)

        response
            .then((data) => {
                refetch()

                navigate(`/account/buttons/${data.id}/`)
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
            <div className="card">
                <h2>{isEdit ? data.name : "Create button"}</h2>
                <p>{isEdit ? data.description : "Setup your button now and start collecting delegations like the pro you are."}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Name"
                    value={object.name}
                    onChange={(e: any) => setObject({ ...object, name: e.target.value })}
                    error={errors?.name} />

                <Input
                    label="Delegate Ethereum Address"
                    value={object.ethereum_address}
                    onChange={(e: any) => setObject({ ...object, ethereum_address: e.target.value.trim() })}
                    error={errors?.ethereum_address} />

                <Input
                    label="Description"
                    value={object.description}
                    onChange={(e: any) => setObject({ ...object, description: e.target.value })}
                    error={errors?.description} />

                <Input
                    label="Button text"
                    value={object.text}
                    onChange={(e: any) => setObject({ ...object, text: e.target.value })}
                    error={errors?.text} />

                <div className="colors">
                    <Input
                        label="Primary color"
                        value={object.primary_color}
                        onChange={(e: any) => setObject({ ...object, primary_color: e.target.value.trim() })}
                        error={errors?.primary_color}
                        color />

                    <Input
                        label="Secondary color"
                        value={object.secondary_color}
                        onChange={(e: any) => setObject({ ...object, secondary_color: e.target.value.trim() })}
                        error={errors?.secondary_color}
                        color />
                </div>

                <MultiSelect
                    label="Targeted Tokens"
                    value={object.tokens}
                    onChange={(e: any) => setObject({ ...object, tokens: e })}
                    options={options}
                    error={errors?.tokens} />

                <Error error={errors?.detail} />

                <div className={isEdit ? "buttons" : "buttons create"}>
                    {isEdit && <button
                        className="danger block"
                        onClick={handleDelete}
                    >Delete</button>}

                    <button
                        type="submit"
                        className={isEdit
                            ? "primary secondary block"
                            : "primary block"}>
                        <span className="content">Save</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export { ButtonForm }