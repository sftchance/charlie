import { Routes, Route } from 'react-router-dom'

import { useAuthentication } from '../hooks'

import { Card, ConnectButton, WalletButton } from '../components'

import { Button, ButtonForm, Buttons } from './'

const Account = () => {
    const {
        address,
        isAuthenticated,
    } = useAuthentication()

    if (!address) {
        return <Card className="hero fadeInUp">
            <h2>Connect your wallet.</h2>
            <p>Your Charlie with charlie is automatically created when you connect and authenticate your wallet.</p>

            <ConnectButton />
        </Card>
    }

    if (!isAuthenticated) {
        return <Card className="hero fadeInUp">
            <h2>Log in to Charlie!</h2>
            <p>The last step to sign in to your account is authenticating your wallet. Once you've done this you will never have to worry about remembering another password!</p>

            <WalletButton />
        </Card>
    }

    return <Routes>
        <Route path="/" element={<Buttons />} />
        <Route path="/buttons/new/" element={<ButtonForm />} />
        <Route path="/buttons/:buttonId/" element={<Button />} />
        <Route path="/buttons/:buttonId/edit/" element={<ButtonForm />} />
    </Routes>
}

export { Account }