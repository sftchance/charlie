import { ButtonCard, Card } from '../'

const ButtonRow = ({ buttons }: any) => {
    return <>
        {buttons?.length > 0 ? buttons.map((button: any) => (
            <ButtonCard key={button.id} button={button} />
        )) : <Card className="hero">
            <h2>No buttons created yet.</h2>
            <p>Click the <strong>Create button</strong> above to get started!</p>
        </Card>}
    </>
}

export { ButtonRow }