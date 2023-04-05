import { Error } from './'

import "./Input.css"

interface InputProps {
    value: any,
    label?: string,
    placeholder?: string,
    onChange?: any,
    error?: any,
    disabled?: boolean,
}

const ColorInput = ({
    value,
    label,
    placeholder,
    onChange,
    error,
    disabled,
}: InputProps) => {
    return <div>
        <label htmlFor={label}>{label}</label>

        <div className="input-group">
            <input
                type="text"
                className="color"
                name={label}
                id={label}
                placeholder={placeholder || `${label}...` || undefined}
                value={value}
                onChange={onChange}
                disabled={disabled} />
        </div >

        <Error error={error} />
    </div>
}

export { ColorInput }