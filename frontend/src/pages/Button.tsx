import { Link, useParams } from "react-router-dom"

import { useQuery } from "@tanstack/react-query";

import { useClient, useNavbar } from "../hooks";

import { ButtonPreview, Input } from "../components";

import { copy } from "../utils";

const Button = () => {
    const { buttonId } = useParams();

    const { path, get } = useClient();

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

        <Link
            className="input-group"
            to={`/account/buttons/${buttonId}/edit`}
            children={<button className="primary secondary block">
                <span className="content">Edit button</span>
            </button>} />

        <Input
            label="Button Link"
            value={`${window.location.origin}/hosted/buttons/${buttonId}/embed/`}
            append={<button className="secondary" onClick={() => {
                copy(`${window.location.origin}/hosted/buttons/${buttonId}/embed/`)
            }}>
                <span className="content">Copy</span>
            </button>}
            disabled
        />

        <Input
            label="Button Widget"
            value={`<iframe src='${window.location.origin}/hosted/buttons/${buttonId}/embed/?c=1'></iframe>`}
            append={<button className="secondary" onClick={() => {
                copy(`<iframe src='${window.location.origin}/hosted/buttons/${buttonId}/embed/?c=1'></iframe>`)
            }}>
                <span className="content">Copy</span>
            </button>}
            disabled
        />

        <label>Live Button Preview</label>
        <ButtonPreview button={data} />
    </>
}

export { Button }