import { Routes, Route } from 'react-router-dom'

import { Navbar, Footer } from './components'
import { Home, Account, Discover } from './pages'

import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

import './App.css'

function App() {
  return (
    <WagmiConfig client={client}>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/:address" element={<Account />} />
        </Routes>

        <Footer />
      </div>
    </WagmiConfig>
  )
}

export default App