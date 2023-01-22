import { useAccount } from 'wagmi'

import { Home, Dashboard } from './pages'

import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

import './App.css'

function App() {
  const { isConnected } = useAccount()

  return (
    <WagmiConfig client={client}>
      <div className="App">
        {isConnected ? <Dashboard /> : <Home />}
      </div>
    </WagmiConfig>
  )
}

export default App