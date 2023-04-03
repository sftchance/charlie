import { useNavigate } from "react-router-dom";

import { useAuthentication } from "../hooks";

const WalletButton = (props: any) => {
    const navigate = useNavigate();

    const { address } = useAuthentication();

    if (!address) return <></>

    return <button {...props} className="primary" onClick={() => navigate("/account")}>
        <span className="content">
            {address.slice(0, 6) + "..." + address.slice(-4)}
        </span>
    </button>
}

export { WalletButton }