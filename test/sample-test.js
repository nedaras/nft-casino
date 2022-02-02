const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('MyNFT', function () {
    it('Should mint and transfer NFT', async function () {
        const NFT = await ethers.getContractFactory('FiredGuys')
        const _NFT = await NFT.deploy()
        await _NFT.deployed()

        const recipent = '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199'
        const uri = 'cid/test.png'

        let balance = await _NFT.balanceOf(recipent)
        expect(balance).to.equal(0)

        const token = await _NFT.payToMint(recipent, uri, {
            value: ethers.utils.parseEther('0.05'),
        })
        await token.wait()

        balance = await _NFT.balanceOf(recipent)
        expect(balance).to.equal(1)

        expect(await _NFT.isContentOwned(uri)).to.equal(true)
    })
})
