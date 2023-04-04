import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { ButtonRow } from "../components/Button";

import { get } from "../utils";

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
        queryFn: () => get(`http://localhost:8000/buttons/`)
            .then((res) => res.json())
    });

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <h2>Buttons</h2>

            <Link
                to="/account/buttons/new/"
                children={<button className="primary secondary">
                    <span className="content">New</span>
                </button>} />

            <ButtonRow buttons={data} />
        </>
    )
}

export { Buttons }