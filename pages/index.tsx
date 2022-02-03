import { Web3Provider } from '@ethersproject/providers'
import { Contract } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'

const Home: NextPage = () => {

    const [ greeting, setGreetingValue ] = useState('')
    const [ balance, setBalance ] = useState('')

    useEffect(() => { getBalance() }, [])

    async function getBalance() {

        if (process.browser && typeof window.ethereum !== 'undefined') {
            const [ account ]: [ string ] = await window.ethereum.request({ method: 'eth_requestAccounts' })
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

    async function fetchGreeting() {

        if (process.browser && typeof window.ethereum !== 'undefined') {
            const provider = new Web3Provider(window.ethereum)
            const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT!, Greeter.abi, provider)

            try {

                const data = await contract.greet()
                console.log(`data: ${data}`)
                

            } catch(error) {
                console.error(error)

            }

        }

    }

    async function setGreeting() {

        if (process.browser && greeting && typeof window.ethereum !== 'undefined') {
            await requestAccount()

            const provider = new Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT!, Greeter.abi, signer)
            const transaction = await contract.setGreeting(greeting)
            setGreetingValue('')
            await transaction.wait()
            fetchGreeting()
            
        }

    }

    return <div>
        <button onClick={fetchGreeting} >Fetch Greeting</button>
        <button onClick={setGreeting} >Set Greeting</button>

        <input
            onChange={(e) => setGreetingValue(e.target.value)}
            placeholder='Set greeting'
            value={greeting}
        />

        <button onClick={getBalance} >Update Balance</button>
        Your balance { balance }

    </div>
}

export default Home
