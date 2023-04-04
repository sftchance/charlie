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
            isMulti
            styles={{
                control: (provided, state) => ({
                    ...provided,
                    outline: "none",
                    borderRadius: "0.25rem",
                    padding: "4px 16px",
                    border: "1px solid #f0f0f0",
                    color: "#111",
                    marginBottom: "1rem",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    "&:hover": {
                        border: "1px solid rgba(230, 230, 230, 0.95)",
                        boxShadow: "0 0 4px rgba(0, 0, 0, 0)",
                    },
                    "&:focus": {
                        border: "1px solid rgba(85, 85, 85, 0.95)",
                        boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
                    },
                    ...(state.isFocused && {
                        border: "1px solid rgba(85, 85, 85, 0.95)",
                        boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
                    }),
                }),
                option: (provided, state) => ({
                    ...provided,
                    color: "#111",
                    cursor: "pointer",
                    "&:hover": {
                        backgroundColor: "rgba(230, 230, 230, 0.95)",
                    },
                    ...(state.isFocused && {
                        backgroundColor: "rgba(230, 230, 230, 0.95)",
                    }),
                }),
            }} />

        <Error error={error} />
    </>
}

export { MultiSelect }