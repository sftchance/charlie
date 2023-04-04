import { Link, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query";

const Button = () => {
    const { buttonId } = useParams();

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
        queryFn: () =>
            fetch(`http://localhost:8000/buttons/${buttonId}/`, {
                method: "GET",
                headers: {},
                credentials: 'include',
                mode: 'cors'
            }).then((res) => res.json()),
    });

    if (isLoading) return <>{"Loading..."}</>;

    if (error) return <>{"An error has occurred: " + error.message}</>;

    return <>
        <h1>{data.name}</h1>

        <Link to="/account/" children={
            <button>Back</button>
        } />

        <Link to={`/hosted/buttons/${buttonId}/embed`} children={
            <button>Preview</button>
        } />

        <Link
            to={`/account/buttons/${buttonId}/edit`}
            children={<button className="primary secondary">
                <span className="content">Edit</span>
            </button>} />


        <p>{data.description}</p>
    </>
}

export { Button }