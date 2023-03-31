import { useState } from "react"

import { Balance } from "../types"

import "./ButtonForm.css"

const ButtonForm = () => {
    const [nameField, setNameField] = useState<string>("Flipside Homepage");
    const [description, setDescription] = useState<string>("");
    const [buttonText, setButtonText] = useState<string>("");
    const [hexColorPrimary, setHexColorPrimary] = useState<string>("#000000");
    const [hexColorSecondary, setHexColorSecondary] = useState<string>("#FFFFFF");
    const [tokens, setTokens] = useState<Balance[]>([]);

    const onAddToken = () => {

    }

    const onDelete = () => {

    }

    const onSave = async () => {
        const obj = {
            ethereum_address: "0x123",
            name: nameField,
            description: description,
            button_text: buttonText,
            hex_color_primary: hexColorPrimary,
            hex_color_secondary: hexColorSecondary,
            tokens: tokens,
        }

        const res = await fetch("http://localhost:8000/buttons/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })

        console.log("res", res)

        console.log("Saved!")
    }

    return (
        <div className="button-form">
            <h1>{nameField}</h1>
            <div className="button-details">
                <input
                    className="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description..."
                    type="text"
                />
                <input
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Button Text..."
                    type="text"
                />
                <div className="button-colors">
                    <input
                        className="button-color"
                        value={hexColorPrimary}
                        onChange={(e) => setHexColorPrimary(e.target.value)}
                        placeholder="Hex Color Primary..."
                        type="color"
                    />
                    <input
                        className="button-color"
                        value={hexColorSecondary}
                        onChange={(e) => setHexColorSecondary(e.target.value)}
                        placeholder="Hex Color Secondary..."
                        type="color"
                    />
                </div>
            </div>

            <div className="tokens">
                <div className="action-bar">
                    <h2>Allowed Tokens</h2>
                    <button onClick={onAddToken}>Add</button>
                </div>

                <hr/>
                {tokens && tokens.map((token, index) => (
                    <div key={index} className="token">
                        {token.name} {token.symbol}
                    </div>
                ))}
            </div>
            
            <div className="actions">
                <button onClick={onDelete}>Delete</button>
                <button onClick={onSave}>Save button</button>
            </div>

        </div>
    )
}

export { ButtonForm }