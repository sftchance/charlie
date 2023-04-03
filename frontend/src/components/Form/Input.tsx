import { Error } from './'

const Input = ({ value, label, placeholder, onChange, error }: {
    value: any,
    label?: string | undefined,
    placeholder?: string | undefined,
    onChange: any,
    error: any
}) => {
    return <>
        <label htmlFor={label}>{label}</label>
        <input
            type="text"
            name={label}
            id={label}
            placeholder={placeholder || `${label}...` || undefined}
            value={value}
            onChange={onChange} />

        <Error error={error} />
    </>
}

export { Input }