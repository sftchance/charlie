import { Routes, Route } from 'react-router-dom'

import { Button, ButtonForm, Buttons } from './'

const Account = () => {
    return <Routes>
        <Route path="/" element={<Buttons />} />
        <Route path="/buttons/new/" element={<ButtonForm />} />
        <Route path="/buttons/:buttonId/edit/" element={<ButtonForm isEdit={true} />} />
    </Routes>
}

export { Account }