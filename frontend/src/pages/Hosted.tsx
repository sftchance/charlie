import { Routes, Route } from 'react-router-dom'

import { Button } from './'

const Hosted = () => {
    return <Routes>
        <Route path="/buttons/:buttonId/" element={<Button />} />
    </Routes>
}

export { Hosted }