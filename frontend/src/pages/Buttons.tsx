import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { useAuthentication } from "../hooks";

import { ButtonRow } from "../components/Button";

import { path, get, formatAddress } from "../utils";

const Buttons = () => {
    const { address } = useAuthentication()

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
        queryFn: () => get(path("buttons/"))
    });

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <div className="card">
                <h2>Delegation Buttons</h2>
            </div>

            <Link
                to="/account/buttons/new/"
                children={<button className="primary secondary block">
                    <span className="content">Create button</span>
                </button>} />

            <ButtonRow buttons={data} />
        </>
    )
}

export { Buttons }