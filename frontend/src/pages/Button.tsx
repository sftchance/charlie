import { Link, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query";

import { Input } from "../components";

import { path, get, copy } from "../utils";

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
        queryFn: () => get(path(`buttons/${buttonId}/`))
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

        <Input
            label="Button Link"
            value="http://example.com/hosted/buttons/1/embed/"
            append={<button className="secondary" onClick={() => {
                copy("http://example.com/hosted/buttons/1/embed/")
            }}>
                <span className="content">Copy</span>
            </button>}
            disabled
        />
    </>
}

export { Button }