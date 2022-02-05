import { Contract, providers } from 'ethers'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
import { NextPage } from 'next'
import { useState } from 'react'
import Greeter from '../artifacts/contracts/CoinFlip.sol/CoinFlip.json'

const Home: NextPage = () => {
    const [ adress, setAdress ] = useState('')

    async function interact() {
        if (!process.browser || typeof (window as any).ethereum === 'undefined') return

        const [ account ]: [string] = await (window as any).ethereum.request({
            method: 'eth_requestAccounts',
        })

        const provider = new providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()

        const contract = new Contract(adress, Greeter.abi, signer)

        contract.cancel()

        //const transection = await contract.createGame(false, { value: parseEther('9000') })
        // const res = await transection.wait()

        // console.log(res)

        const winner = await contract.enterGame(4, { value: parseEther('9000') })
        // console.log(winner)

        //console.log(await contract.players(0))

        // const [ player, bet, side ] = await contract.players(1);

        // console.log(player)
        // console.log(formatEther(bet))
        // console.log(side == 0 ? 'Tails' : 'Head')

    }

    return (
        <>
            <input
                placeholder="Contract"
                onChange={(event) => setAdress(event.target.value)}
                value={adress}
            />
            <button onClick={() => interact()}>Interact</button>
        </>
    )
}

export default Home
