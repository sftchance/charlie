import { Routes, Route } from 'react-router-dom'

import { Navbar } from './components'
import { Home, Dashboard, Recent } from './pages'

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
          <Route path="/recent" element={<Recent />} />
          <Route path="/account" element={<Dashboard />} />
          <Route path="/account/:address" element={<Dashboard />} />
        </Routes>

        {/* {isConnected ? <Dashboard /> : <Home />} */}
      </div>
    </WagmiConfig>
  )
}

export default App