import "./Modal.css";

const Modal = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="modal">
            { children }
        </div>
    )
}

export { Modal }