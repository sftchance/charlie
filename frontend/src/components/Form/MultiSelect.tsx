import Select from 'react-select'

import { Error } from "./"

const MultiSelect = ({ label, options, value, onChange, error }: {
    label?: string | undefined,
    options: any,
    value: any,
    onChange: any,
    error: any
}) => {
    return <>
        <label htmlFor={label}>{label}</label>
        <Select
            name={label}
            id={label}
            options={options || []}
            value={value}
            onChange={onChange}
            isMulti />

        <Error error={error} />
    </>
}

export { MultiSelect }