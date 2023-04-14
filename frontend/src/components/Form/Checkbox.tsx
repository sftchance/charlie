import "./Checkbox.css";

const Checkbox = ({
    checked = false,
    disabled,
    onChange = () => { },
}: {
    checked: boolean | undefined,
    disabled: boolean | undefined,
    onChange: (() => void) | undefined
}) => {
    return (
        <div className="checkbox">
            <input
                type="checkbox"
                onChange={onChange}
                onClick={onChange}
                disabled={disabled}
                checked={checked}
            />

            <span className={`check${checked ? " checked" : ""}`} />
        </div>
    )
}

export { Checkbox }