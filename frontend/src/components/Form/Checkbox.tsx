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
        <label className="checkbox">
            <input
                type="checkbox"
                onChange={onChange}
                disabled={disabled}
                checked={checked}
            />

            <span className={`check${checked ? " checked" : ""}`} />
        </label>
    )
}

export { Checkbox }