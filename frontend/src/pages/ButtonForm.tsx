import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

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

    const [object, setObject] = useState<any>(data);

    const handleDelete = () => {
        fetch(`http://localhost:8000/buttons/${buttonId}/`, {
            method: "DELETE",
        }).then(() => {
            console.log("Deleted!")
        })
    }

    if (isEdit && isLoading) return <p>Loading...</p>;

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
                    defaultValue={data?.name}
                    value={object?.name}
                    onChange={(e) => setObject({ ...object, name: e.target.value })}
                />

                <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description..."
                    defaultValue={data?.description}
                    value={object?.description}
                    onChange={(e) => setObject({ ...object, description: e.target.value })}
                />

                <input
                    type="text"
                    name="buttonText"
                    id="buttonText"
                    placeholder="Button text..."
                    defaultValue={data?.text}
                    value={object?.text}
                    onChange={(e) => setObject({ ...object, text: e.target.value })}
                />

                <div>
                    <div>
                        <input
                            type="text"
                            name="primaryColor"
                            id="primaryColor"
                            placeholder="Primary color..."
                            defaultValue={data?.primary_color}
                            value={object?.primary_color}
                            onChange={(e) => setObject({ ...object, primary_color: e.target.value })}
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            name="secondaryColor"
                            id="secondaryColor"
                            placeholder="Secondary color..."
                            defaultValue={data?.secondary_color}
                            value={object?.secondary_color}
                            onChange={(e) => setObject({ ...object, secondary_color: e.target.value })}
                        />
                    </div>
                </div>

                <h2>Targeted Tokens</h2>

                <hr />

                <div className="input-append">
                    <input type="text" name="search" id="search" placeholder="Search..." />
                    <button type="button">Search</button>
                </div>

                {data?.tokens?.length > 0 ? data?.tokens?.map((token: any) => (
                    <div key={token.id}>
                        <input type="checkbox" name="token" id={`token-${token.id}`} />
                        <label htmlFor={`token-${token.id}`}>{token.name}</label>
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