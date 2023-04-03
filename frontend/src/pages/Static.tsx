import { Routes, Route } from "react-router-dom";

import { AuthenticationProvider } from "../contexts";

import { Navbar, Footer } from "../components";

import { Account, Home, NotFound } from "../pages";

const Static = () => {

    return <AuthenticationProvider>
        <div className="App">
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account/*" element={<Account />} />

                <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
        </div>
    </AuthenticationProvider>
}

export { Static }