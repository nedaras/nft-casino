const { ethers } = require('hardhat')

async function main() {
    const Greeter = await ethers.getContractFactory('CoinFlip')
    const greeter = await Greeter.deploy(
        '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9',
        '0xa36085F69e2889c224210F603D836748e7dC0088'
    )

    await greeter.deployed()
    console.log('Greeter deployed to:', greeter.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
