const { ethers } = require('hardhat')

async function main() {
    const Greeter = await ethers.getContractFactory('Lottery')
    const greeter = await Greeter.deploy()

    await greeter.deployed()
    console.log('Greeter deployed to:', greeter.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
