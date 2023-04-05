import { ButtonEmbed } from "./"

import "./ButtonPreview.css"

const ButtonPreview = ({ button }: any) => {
    return <div className="input-group">
        <div className="card">
            <div className="preview">
                <ButtonEmbed />
            </div>
        </div>
    </div>
}

export { ButtonPreview }