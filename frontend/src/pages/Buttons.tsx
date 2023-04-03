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
        queryFn: () => fetch(`http://10.0.0.95:8000/buttons/`, {
            method: "GET",
            headers: {},
            credentials: 'include',
            mode: 'cors'
        }).then((res) => res.json())
    });

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h2>
                Delegation Buttons
                <Link to="/account/buttons/new/">New</Link>
            </h2>

            <hr />

            <ul>
                {data?.length > 0 ? data.map((button: any) => (
                    <li key={button.id}>
                        <Link to={`/account/buttons/${button.id}/edit/`}>{button.text}</Link>
                        <Link to={`/hosted/buttons/${button.id}/`}>View</Link>
                        <Link to={`/account/buttons/${button.id}/embed/`}>Embed</Link>
                    </li>
                )) : <p>No buttons yet!</p>}
            </ul>
        </>
    )
}

export { Buttons }