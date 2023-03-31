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

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h2>Delegation Buttons
                <Link to="/buttons/new/">New</Link>
            </h2>

            <hr />

            <ul>
                {data?.length > 0 ? data.map((button: any) => (
                    <li key={button.id}>
                        <Link to={`/buttons/${button.id}/edit/`}>{button.text}</Link>
                        <Link to={`/buttons/${button.id}/`}>View</Link>
                        <Link to={`/buttons/${button.id}/embed/`}>Embed</Link>
                    </li>
                )) : <p>No buttons yet!</p>}
            </ul>
        </>
    )
}

export { Buttons }