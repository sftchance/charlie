import { Link, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query";

import { useNavbar } from "../hooks";

import { ButtonPreview, Input } from "../components";

import { path, get, copy } from "../utils";

const Button = () => {
    const { buttonId } = useParams();

    useNavbar(<Link to="/account/" children={
        <button>Back</button>
    } />);

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
        <div className="card">
            <h2>{data.name}</h2>
            <p>{data.description}</p>
        </div>

        <Input
            label="Button Link"
            value="http://example.com/hosted/buttons/1/embed/"
            append={<button className="primary secondary" onClick={() => {
                copy("http://example.com/hosted/buttons/1/embed/")
            }}>
                <span className="content">Copy</span>
            </button>}
            disabled
        />

        <Input
            label="Premade Widget"
            value="<iframe src='http://example.com/hosted/buttons/1/embed/'></iframe>"
            append={<button className="secondary" onClick={() => {
                copy("http://example.com/hosted/buttons/1/embed/")
            }}>
                <span className="content">Copy</span>
            </button>}
            disabled
        />

        <label>Live Button Preview</label>
        <ButtonPreview button={data} />

        <Input
            label="Premade Button Image"
            value="https://api.example.com/hosted/buttons/1/embed/"
            append={<button className="secondary" onClick={() => {
                copy("http://example.com/hosted/buttons/1/embed/")
            }}>
                <span className="content">Copy</span>
            </button>}
            disabled
        />

        <Link
            to={`/account/buttons/${buttonId}/edit`}
            children={<button className="primary secondary block">
                <span className="content">Edit</span>
            </button>} />

    </>
}

export { Button }