import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import Select from 'react-select'

const ButtonForm = ({ isEdit }: { isEdit?: boolean }) => {
    const navigate = useNavigate();

    const { buttonId } = useParams<{ buttonId: string }>();

    const API_URL = `http://localhost:8000/buttons/${buttonId}/`

    const {
        isLoading: isLoadingButtons,
        error,
        data,
    }: {
        isLoading: boolean;
        error: any;
        data: any;
    } = useQuery({
        queryKey: ["buttons", buttonId],
        queryFn: () => {
            if (isEdit == true) {
                return fetch(API_URL).then((res) => res.json())
            } return null
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
        queryFn: () => fetch(`http://localhost:8000/erc20/`).then((res) => res.json())
    });

    const [object, setObject] = useState<any>(null);

    const objectToken = (token: any) => ({
        ...token,
        value: token.id,
        label: `${token.blockchain} - ${token.name} - ${token.symbol}`
    })

    const objectWithTokens = (button: any) => ({
        ...button,
        tokens: button.tokens.map((token: any) => objectToken(token))
    })

    const options = dataTokens?.map((token: any) => objectToken(token))

    const handleDelete = () => {
        fetch(API_URL, {
            method: "DELETE",
        }).then(() => navigate("/buttons"))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('object', object)
    }

    useEffect(() => {
        if (!data) return;

        setObject(objectWithTokens(data))
    }, [data])

    if (isEdit && ((isLoadingButtons || isLoadingTokens) || object === null)) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    if (errorTokens) return <p>Error: {errorTokens.message}</p>;

    return (
        <>
            <h1>Button Form</h1>

            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name..."
                    value={object?.name || "Untitled"}
                    onChange={(e) => setObject({ ...object, name: e.target.value })}
                    required
                />

                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description..."
                    value={object?.description || ""}
                    onChange={(e) => setObject({ ...object, description: e.target.value })}
                />

                <label htmlFor="buttonText">Button text</label>
                <input
                    type="text"
                    name="buttonText"
                    id="buttonText"
                    placeholder="Button text..."
                    value={object?.text || "Delegate"}
                    onChange={(e) => setObject({ ...object, text: e.target.value })}
                    required
                />

                <div>
                    <div>
                        <label htmlFor="primaryColor">Primary color</label>
                        <input
                            type="text"
                            name="primaryColor"
                            id="primaryColor"
                            placeholder="Primary color..."
                            value={object?.primary_color || "#000000"}
                            onChange={(e) => setObject({ ...object, primary_color: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="secondaryColor">Secondary color</label>
                        <input
                            type="text"
                            name="secondaryColor"
                            id="secondaryColor"
                            placeholder="Secondary color..."
                            value={object?.secondary_color || "#FFFFFF"}
                            onChange={(e) => setObject({ ...object, secondary_color: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <h2>Targeted Tokens</h2>
                <hr />

                <Select
                    options={options || []}
                    value={object?.tokens || []}
                    isMulti
                    onChange={(e: any) => setObject({ ...object, tokens: e })}
                />

                {object?.tokens?.length > 0 ? object?.tokens?.map((token: any) =>
                    <p key={token.label}>{JSON.stringify(token, null, 2)}</p>
                ) : <p>No tokens targeted...</p>}

                {isEdit && <button
                    type="button"
                    onClick={handleDelete}
                >Delete</button>}

                <button type="submit">Save</button>
            </form>
        </>
    )
}

export { ButtonForm }