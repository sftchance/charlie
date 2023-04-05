import { ButtonCard } from './ButtonCard'

const ButtonRow = ({ buttons }: any) => {
    return <>
        {buttons?.length > 0 ? buttons.map((button: any) => (
            <ButtonCard key={button.id} button={button} />
        )) : <p>No buttons yet!</p>}
    </>
}

export { ButtonRow }