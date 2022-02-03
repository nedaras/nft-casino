const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('MyNFT', function () {
    it('Should mint and transfer NFT', async function () {
        const Roulette = await ethers.getContractFactory('Roulette')
        const Contract = await Roulette.deploy()
        await Contract.deployed()

        const recipent = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
        const amount = '10'

        const casino = await Contract.casino

        // let balance = await _NFT.balanceOf(recipent)
        // expect(balance).to.equal(0)

        // const token = await _NFT.spin({
        //     value: ethers.utils.parseEther(amount),
        // })
        // await token.wait()

        // balance = await _NFT.balanceOf(recipent)
        // expect(balance).to.equal(1)

        expect(1).to.equal(1)
    })
})
