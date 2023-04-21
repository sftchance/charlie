import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useClient } from "../hooks";

import { ButtonRow } from "../components";

const Buttons = () => {
    const { path, get } = useClient()

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
            <ProfileCard address={address} />

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