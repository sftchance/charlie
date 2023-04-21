import { useState } from 'react';

import { BlockPicker } from 'react-color';

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

    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const upperValue = value.toUpperCase();
    const valueIsHex = upperValue.startsWith('#') && upperValue.length <= 7 && upperValue.length >= 4;

    const colors = valueIsHex ? [upperValue] : []

    if (upperValue !== '#FF04C9') colors.push('#FF04C9')
    if (upperValue !== '#FF6905') colors.push('#FF6905')
    if (upperValue !== '#43F9E1') colors.push('#43F9E1')
    if (upperValue !== '#5243F9') colors.push('#5243F9')
    if (colors.length === 4 && upperValue !== '#F9E143') colors.push('#F9E143')

    return <div>
        <label htmlFor={label}>{label}</label>

        <div className={`input-group ${!!append && 'append'}`}>
            {color ? <div className="color" style={{ backgroundColor: value }}>
                <input
                    type="text"
                    name={label}
                    id={label}
                    placeholder={label || undefined}
                    value={value}
                    onFocus={() => setDisplayColorPicker(true)}
                    onChange={(e) => {
                        props.onChange({ target: { value: e.target.value } })
                        setDisplayColorPicker(false)
                    }}
                    disabled={props.disabled}
                />

                {/* <input
                    type="text"
                    name={label}
                    id={label}
                    placeholder={placeholder || `${label}...` || undefined}
                    value={value}
                    onChange={onChange}
                    disabled={disabled} /> */}

                {displayColorPicker && <BlockPicker
                    className="color-picker"
                    color={value}
                    onChangeComplete={(color) => {
                        props.onChange({ target: { value: color.hex } })
                        setDisplayColorPicker(false)
                    }}
                    colors={colors}
                    styles={{
                        default: {
                            card: {
                                background: 'var(--charlieWhite)',
                                boxShadow: 'none',
                                position: 'absolute',
                                zIndex: 10,
                            },
                            head: {
                                display: 'none',
                            },
                            label: {
                                display: 'none',
                            },
                            input: {
                                display: 'none',
                            },
                            triangle: {
                                display: 'none',
                            }
                        },
                    }}
                />}
            </div> : <StaticInput {...props} />}

            {append && append}
        </div >

        <Error error={error} />
    </div >
}

export { Input }