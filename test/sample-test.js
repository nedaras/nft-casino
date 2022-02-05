const { expect } = require('chai')
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require('hardhat')

describe("Lottery Contract", function () {
  it("Checking if getEntrenceFee works correct", async function () {

    const Lottery = await ethers.getContractFactory('Lottery')
    const lottery = await Lottery.deploy();
    await lottery.deployed()

  })
})