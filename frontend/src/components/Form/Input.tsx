import { Error } from './'

import "./Input.css"

interface InputProps {
    value: any,
    label?: string,
    placeholder?: string,
    onChange?: any,
    error?: any,
    disabled?: boolean,
    append?: any,
}

const Input = ({
    value,
    label,
    placeholder,
    onChange,
    error,
    disabled,
    append,
}: InputProps) => {
    return <>
        <label htmlFor={label}>{label}</label>

        <div className={`input-group ${!!append && 'append'}`}>
            <input
                type="text"
                name={label}
                id={label}
                placeholder={placeholder || `${label}...` || undefined}
                value={value}
                onChange={onChange}
                disabled={disabled} />

            {append && append}
        </div >

        <Error error={error} />
    </>
}

export { Input }