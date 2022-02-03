import { Web3Provider } from '@ethersproject/providers'
import { Contract } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Greeter from '../artifacts/contracts/Roulette.sol/Roulette.json'

const Home: NextPage = () => {
    const [greeting, setGreetingValue] = useState('')
    const [balance, setBalance] = useState('')
    const [number, setNumber] = useState('')

    useEffect(() => {
        getBalance()
    }, [])

    async function getBalance() {
        if (process.browser && typeof window.ethereum !== 'undefined') {
            const [account]: [string] = await window.ethereum.request({
                method: 'eth_requestAccounts',
            })
            const provider = new Web3Provider(window.ethereum)
            const balance = await provider.getBalance(account)

            setBalance(formatEther(balance))
        }
    }

    async function requestAccount() {
        if (process.browser && typeof window.ethereum !== 'undefined') {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        }
    }

    async function setGreeting() {
        if (process.browser && greeting && typeof window.ethereum !== 'undefined') {
            await requestAccount()

            const provider = new Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT!, Greeter.abi, signer)
            const transaction = await contract.spin(+number, { value: parseEther(greeting) })
            setGreetingValue('')
            setNumber('')
            await transaction.wait()
            getBalance()
        }
    }

    return (
        <div>
            <button onClick={setGreeting}>Gamble</button>
            <input
                onChange={(e) => setGreetingValue(e.target.value)}
                placeholder="Eth to gamble"
                value={greeting}
            />
            <input
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Lucky number"
                value={number}
            />
            <button onClick={getBalance}>Update Balance</button>
            Your balance {balance}
        </div>
    )
}

export default Home
