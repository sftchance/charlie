import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import Select from 'react-select'

const ButtonForm = ({ isEdit }: { isEdit?: boolean }) => {
    const { buttonId } = useParams<{ buttonId: string }>();

    const {
        isLoading,
        error,
        data,
    }: {
        isLoading: boolean;
        error: any;
        data: any;
    } = useQuery({
        queryKey: ["button"],
        queryFn: () => {
            if (isEdit == true) {
                return fetch(`http://localhost:8000/buttons/${buttonId}/`).then((res) => res.json())
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

    const handleDelete = () => {
        fetch(`http://localhost:8000/buttons/${buttonId}/`, {
            method: "DELETE",
        }).then(() => {
            console.log("Deleted!")
        })
    }

    const options = dataTokens?.map((token: any) => ({
        value: token.id,
        label: `${token.blockchain} - ${token.name} - ${token.symbol}`
    }))

    useEffect(() => {
        setObject(data)
    }, [data])

    if (isEdit && isLoading || object === null) return <p>Loading...</p>;

    if (isEdit && error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h1>Button Form</h1>
            <p>{JSON.stringify(data, null, 2)}</p>

            <form>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name..."
                    value={object?.name || "Untitled"}
                    onChange={(e) => setObject({ ...object, name: e.target.value })}
                />

                <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description..."
                    value={object?.description || ""}
                    onChange={(e) => setObject({ ...object, description: e.target.value })}
                />

                <input
                    type="text"
                    name="buttonText"
                    id="buttonText"
                    placeholder="Button text..."
                    value={object?.text || "Delegate"}
                    onChange={(e) => setObject({ ...object, text: e.target.value })}
                />

                <div>
                    <div>
                        <input
                            type="text"
                            name="primaryColor"
                            id="primaryColor"
                            placeholder="Primary color..."
                            value={object?.primary_color || "#000000"}
                            onChange={(e) => setObject({ ...object, primary_color: e.target.value })}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            name="secondaryColor"
                            id="secondaryColor"
                            placeholder="Secondary color..."
                            value={object?.secondary_color || "#FFFFFF"}
                            onChange={(e) => setObject({ ...object, secondary_color: e.target.value })}
                        />
                    </div>
                </div>

                <h2>Targeted Tokens</h2>

                <hr />

                <Select
                    options={options || []}
                    isMulti
                    onChange={(e: any) => setObject({ ...object, tokens: e })}
                />

                {object?.tokens?.length > 0 ? object?.tokens?.map((token: any) => (
                    <div key={token.id}>
                        <p>{JSON.stringify(token, null, 2)}</p>
                    </div>
                )) : <p>No tokens targeted...</p>}

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