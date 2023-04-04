import { Routes, Route } from 'react-router-dom'

import { useAuthentication } from '../hooks'

import { Button, ButtonForm, Buttons } from './'

const Account = () => {
    const {
        address,
        user,
        isAuthenticated,
    } = useAuthentication()

    if (!address) {
        return <div>Not connected</div>
    }

    if (!isAuthenticated) {
        return <div>Not authenticated</div>
    }

    return <Routes>
        <Route path="/" element={<Buttons />} />
        <Route path="/buttons/new/" element={<ButtonForm />} />
        <Route path="/buttons/:buttonId/" element={<Button />} />
        <Route path="/buttons/:buttonId/edit/" element={<ButtonForm isEdit={true} />} />
    </Routes>
}

export { Account }