import { Error } from './'

import "./Input.css"

const StaticInput = ({
    value,
    label,
    placeholder,
    onChange,
    disabled,
}: {
    value: any,
    label?: string,
    placeholder?: string,
    onChange?: any,
    disabled?: boolean,
}) => {
    return <input
        type="text"
        name={label}
        id={label}
        placeholder={placeholder || `${label}...` || undefined}
        value={value}
        onChange={onChange}
        disabled={disabled} />
}

const Input = (props: any) => {
    const { append, color, label, value, error, } = props;

    return <div>
        <label htmlFor={label}>{label}</label>

        <div className={`input-group ${!!append && 'append'}`}>
            {color ? <div className="color" style={{ backgroundColor: value }}>
                <StaticInput {...props} />
            </div> : <StaticInput {...props} />}

            {append && append}
        </div >

        <Error error={error} />
    </div >
}

export { Input }