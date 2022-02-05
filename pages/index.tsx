import { Contract, providers } from 'ethers'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
import { NextPage } from 'next'
import { useState } from 'react'
import Greeter from '../artifacts/contracts/Fund.sol/Fund.json'

const Home: NextPage = () => {

    const [ adress, setAdress ] = useState('')

    async function interact() {
        
        if (!process.browser || typeof (window as any).ethereum === 'undefined') return;

        const [ account ]: [ string ] =  await (window as any).ethereum.request({ method: 'eth_requestAccounts' })

        const provider = new providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()

        const contract = new Contract(adress, Greeter.abi, signer)

        //const transection = await contract.fund({ value: parseEther('0.005') })
        //await transection.wait()

        //await contract.fund({ value: parseEther('0.05') })
        //await contract.withdraw()
        const price = await contract.fund({ value: parseEther('0.01') })

        //console.log(formatUnits(price))

    }

    return <>
        <input
            placeholder='Contract'
            onChange={(event) => setAdress(event.target.value)}
            value={adress}
        />
        <button onClick={() => interact()} >Interact</button>

    </>
}

export default Home
