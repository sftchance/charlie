import { Routes, Route } from "react-router-dom";

import { AuthenticationProvider, NavbarProvider } from "../contexts";

import { Navbar, Footer } from "../components";

import { Account, NotFound } from "../pages";

const Static = () => {
    return <AuthenticationProvider>
        <div className="App container">
            <NavbarProvider>
                <Navbar />

                <Routes>
                    <Route path="/account/*" element={<Account />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
            </NavbarProvider>
        </div>
    </AuthenticationProvider>
}

export { Static }