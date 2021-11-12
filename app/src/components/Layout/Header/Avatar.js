import { useMetaMask } from 'metamask-react'

function Avatar({ address }) {
  const { status, account, connect } = useMetaMask()

  return (
    <p className="Address">
      {status === 'initializing' &&
        <span>Initializing...</span>}

      {status === 'connecting' &&
        <span>Connecting...</span>}

      {status === 'unavailable' &&
        <span><a href="https://metamask.io/" rel="noreferrer" target="_blank">MetaMask Required</a></span>}

      {status === 'notConnected' &&
        <span onClick={connect}>Connect</span>}

      {status === 'connected' &&
        <span style={{ color: '#888888' }}>
          0x
          <span style={{ 'color': 'var(--primary-account-color)' }}>
            {account.slice(2, 8)}
          </span>
          . . .
          <span style={{ 'color': 'var(--secondary-account-color)' }}>
            {account.slice(-6)}
          </span>
        </span>}

      <span className="Avatar"></span>
    </p>
  )
}

export default Avatar