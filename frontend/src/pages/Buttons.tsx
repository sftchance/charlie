import { useState } from "react";

import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

const Buttons = () => {
    const {
        isLoading,
        error,
        data,
    }: {
        isLoading: boolean;
        error: any;
        data: any;
    } = useQuery({
        queryKey: ["buttons"],
        queryFn: () => fetch(`http://localhost:8000/buttons/`).then((res) => res.json())
    });

    const handleDelete = (buttonId: number) => {
        fetch(`http://localhost:8000/buttons/${buttonId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(() => {
            console.log(`Deleted button ${buttonId}`)
        })
    }

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h2>Delegation Buttons
                <Link to="/button/new/">New</Link>
            </h2>

            <hr />

            <ul>
                {data?.length > 0 ? data.map((button: any) => (
                    <li key={button.id}>
                        <Link to={`/button/${button.id}/edit/`}>{button.text}</Link>
                        <Link to={`/button/${button.id}/`}>View</Link>
                        <button onClick={() => handleDelete(button.id)}>Delete</button>
                    </li>
                )) : <p>No buttons yet!</p>}
            </ul>
        </>
    )
}

export { Buttons }