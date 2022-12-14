import React from 'react'
import PropTypes from 'prop-types'

const WalletBox = (props) => {
  const { connect, disConnect, walletAddress } = props
  return (
    <div
      className="wallet-connect"
      onClick={() => {
        if (walletAddress) {
          disConnect()
        } else {
          connect()
        }
      }}
    >
      <img src="img/new/wallet-logo.svg" alt="Wallet Logo" />
      {
        walletAddress
          ? <img src="img/new/wallet-connect.svg" alt="Wallet Connect"/>
          : <img src="img/new/wallet-disconnect.svg" alt="Wallet Disconnect"/>
      }
      <img src="img/new/wallet-box.svg" alt="Wallet Box"/>
    </div>
  )
}

WalletBox.propTypes = {
  connect: PropTypes.elementType.isRequired,
  disConnect: PropTypes.elementType.isRequired,
  walletAddress: PropTypes.elementType
}

export default WalletBox
