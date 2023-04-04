import { Link } from 'react-router-dom'

const ButtonCard = ({ button }: any) => {
    return <Link to={`/account/buttons/${button.id}/`}>
        <div className="card">
            <h4>{button.name}</h4>
        </div>
    </Link>
}

export { ButtonCard }