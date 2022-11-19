import React, { useEffect, useState, useCallback } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import web3 packages
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

// Import ABI
import KingOfTheFools from './contract/KingOfTheFools.json'

import WalletBox from './components/WalletBox'
// const animatedComponents = makeAnimated();
let web3Modal = null
let provider = null
let web3 = null

const netId = Number(process.env.REACT_APP_.NETWORK_ID)
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        [netId]: process.env.REACT_APP_.NETWORK_RPC
      },
      network: process.env.REACT_APP_.NETWORK_NAME
    }
  }
}

web3Modal = new Web3Modal({
  // network: netId,
  cacheProvider: true,
  providerOptions,
  disableInjectedProvider: false
})

const toastStyle = {
  position: 'top-right',
  theme: 'colored',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined
}

function App () {
  const [providerSrc, setProviderSrc] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')

  const errorAlert = useCallback((msg) => {
    toast.error(msg, toastStyle)
  }, [])

  const successAlert = useCallback((msg) => {
    toast.success(msg, toastStyle)
  }, [])

  const walletConnectedReaction = useCallback(async (accounts, networkId) => {
    if (networkId !== netId) {
      errorAlert(`Failed to connect ${providerOptions.walletconnect.options.network} mainnet`)
      setWalletAddress(null)
    } else {
      successAlert('Wallet Connected!')
    }
  }, [errorAlert, successAlert])

  const connectionReaction = useCallback(async () => {
    setProviderSrc(provider)
    web3 = new Web3(provider)
    const kingOfTheFools = new web3.eth.Contract(KingOfTheFools.abi, KingOfTheFools.address)
    kingOfTheFools.events.EthDepositAccepted(() => { })
      .on('connected', function (subscriptionId) {
        console.log('SubID: ', subscriptionId)
      }).on('data', function (event) {
        console.log('Event:', event)
        infoAlert(`Captured event ${event.event} from ${event.returnValues.from} with value ${event.returnValues.value}`)
      })
    kingOfTheFools.events.DepositTranferred(() => { })
      .on('connected', function (subscriptionId) {
        console.log('SubID: ', subscriptionId)
      }).on('data', function (event) {
        console.log('Event:', event)
        infoAlert(`Captured event ${event.event} from ${event.returnValues.from} to ${event.returnValues.to} with value ${event.returnValues.value}`)
      })
    const accounts = await web3.eth.getAccounts()
    setWalletAddress(accounts[0])
    const _networkId = await web3.eth.net.getId()
    await walletConnectedReaction(accounts, _networkId)
  }, [walletConnectedReaction])

  const cachedConnect = useCallback(async () => {
    if (web3Modal.cachedProvider) {
      try {
        provider = await web3Modal.connect()
        await connectionReaction()
      } catch (error) {
        console.log('provider error: ', error)
      }
    }
  }, [connectionReaction])

  useEffect(() => {
    cachedConnect()
    if (providerSrc) {
      (async () => {
        await subscribeProvider(providerSrc)
      })()
    }
  }, [cachedConnect, providerSrc])

  const warningAlert = (msg) => {
    toast.warning(msg, toastStyle)
  }

  const infoAlert = (msg) => {
    toast.info(msg, toastStyle)
  }

  const connect = async () => {
    if (web3Modal) {
      try {
        provider = await web3Modal.connect()
        try {
          await subscribeProvider(provider)
        } catch (error) {
          console.log('subscribe error: ', error)
        }
        await connectionReaction()
      } catch (error) {
        console.log('provider error: ', error)
      }
    } else {
      console.log('web3Modal is null')
    }
  }

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return
    }
    provider.on('accountsChanged', async (accounts) => {
      setWalletAddress(accounts[0])
    })
    provider.on('chainChanged', async (networkId) => {
      // setNetworkId(networkId);
    })
  }

  const disConnect = async () => {
    try {
      if (web3Modal) {
        await web3Modal.clearCachedProvider()
      }
      if (provider) {
        provider = null
        setProviderSrc(provider)
        setWalletAddress(null)
        warningAlert('Wallet Disconnected')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDepositAmountChange = e => {
    setDepositAmount(e.target.value)
  }

  const deposit = async (amount) => {
    try {
      const receipt = await web3.eth.sendTransaction({ from: walletAddress, to: `${KingOfTheFools.address}`, value: amount })
      console.log(receipt)
      successAlert('Deposit Success!')
    } catch (err) {
      const re = /(?<='){.*}(?=')/g
      const matches = err.message.match(re)
      let alertMessage
      if (matches.length) {
        const match = JSON.parse(matches[0])
        const exception = Object.values(match.value.data.data)[0]
        alertMessage = exception.reason
      } else {
        console.log(err)
        alertMessage = err.message
      }
      errorAlert(alertMessage)
      return null
    }
  }

  return (
    <section
      className="kotf-section"
      style={{
        paddingTop: 50
      }}
    >
      <div className="contain">
        <WalletBox
          walletAddress={walletAddress}
          connect={connect}
          disConnect={disConnect}
        />
        <div className="inner-contain">
          <span>Amount to deposit</span>
          <input
            value={depositAmount}
            onChange={handleDepositAmountChange}
          />
          <button
            onClick={() => {
              if (walletAddress) {
                if (depositAmount) {
                  deposit(depositAmount)
                } else {
                  warningAlert('Please input deposit amount')
                }
              } else {
                warningAlert('Please connect wallet')
              }
            }}
          >
            DEPOSIT
          </button>
        </div>
      </div>
      <ToastContainer />
    </section>
  )
}

export default App
