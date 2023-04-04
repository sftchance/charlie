import { Routes, Route } from 'react-router-dom'

import { ButtonEmbed } from './'

const Hosted = () => {
    return <Routes>
        <Route path="/buttons/:buttonId/embed/" element={<ButtonEmbed />} />
    </Routes>
}

export { Hosted }