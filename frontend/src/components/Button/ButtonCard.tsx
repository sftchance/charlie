import { Link } from 'react-router-dom'

const ButtonCard = ({ button }: any) => {
    return (
        <div className="card">
            <Link to={`/account/buttons/${button.id}/`}>{button.text}</Link>
        </div>
    )
}

export { ButtonCard }