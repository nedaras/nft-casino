import { Contract, providers, utils } from 'ethers'
import { NextPage } from 'next'
import { useState } from 'react'
import Greeter from '../artifacts/contracts/CoinFlip.sol/CoinFlip.json'

const Home: NextPage = () => {
    const [ adress, setAdress ] = useState('')

    async function interact() {
        if (!process.browser || typeof (window as any).ethereum === 'undefined') return

        await (window as any).ethereum.request({
            method: 'eth_requestAccounts',
        })

        const provider = new providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()

        const contract = new Contract(adress, Greeter.abi, signer)

        //contract.cancel()

        // await contract.createGame(false, { value: parseEther('0.01') })

        // await contract.enterGame(0, { value: parseEther('0.01') })

        //console.log(await contract.players(0))

        // console.log(await contract.latestWinner())
        // console.log(await contract.latestLosser())
        // console.log(formatUnits(await contract.latestRandomNumber(), 0))

        const [ player, bet, side, status ] = await contract.players(0)

        console.log(player)
        console.log(utils.formatEther(bet))
        console.log(side == 0 ? 'Tails' : 'Head')
        if (status == 0) console.log('This game is Closed')
        if (status == 1) console.log('Waiting for players')
        if (status == 2) console.log('Getting winner')
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
