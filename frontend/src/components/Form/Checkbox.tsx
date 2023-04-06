import "./Checkbox.css";

const Checkbox = ({ 
    checked, onChange 
}: { 
    checked: boolean | undefined, onChange: (() => void) | undefined
}) => {
    return (
        <div className="checkbox" onClick={onChange}>
            <input
                type="checkbox"
                onChange={onChange}
                onClick={onChange}
                checked={checked}
            />
            <span className={`check${checked ? " checked" : ""}`} />
        </div>
    )
}

export { Checkbox }