//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract Lottery is VRFConsumerBase, Ownable {

    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
        
    }

    LOTTERY_STATE public lottery_state;

    address payable[] players;
    address payable public recentWinner;
    uint256 public usdEntryFee;
    uint256 public randomResult;

    AggregatorV3Interface internal priceFeed;

    bytes32 internal keyHash;
    uint256 internal fee;

    constructor() VRFConsumerBase(0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, 0xa36085F69e2889c224210F603D836748e7dC0088) {
        usdEntryFee = 50 * 10 ** 18;
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        lottery_state = LOTTERY_STATE.CLOSED;

        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18;

    }

    function enter() public payable {
        require(lottery_state == LOTTERY_STATE.OPEN, 'Lottery is not oppened yet');
        require(msg.value >= getEntrenceFee(), 'More money');
        players.push(payable(msg.sender));

    }

    function getEntrenceFee() internal view returns ( uint256 ) {
        ( , int256 price, , ,  ) = priceFeed.latestRoundData();

        uint256 enterCost = (usdEntryFee * 10 ** 8) / uint256(price);
        return enterCost;

    }

    function startLottery() public onlyOwner {
        require(lottery_state == LOTTERY_STATE.CLOSED, 'Lottery is already opend');
        lottery_state = LOTTERY_STATE.OPEN;

    }

    function endLottery() public onlyOwner {
        require(lottery_state == LOTTERY_STATE.OPEN, 'Lottery is already closed or will be soon');
        require(LINK.balanceOf(address(this)) >= fee, 'Not enough LINK - fill contract with faucet');

        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        requestRandomness(keyHash, fee);

    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, 'Seems that we are not calculating any winners');

        uint256 winnersIndex = randomness % players.length;
        recentWinner = players[winnersIndex];

        recentWinner.transfer(address(this).balance);

        players = new address payable[](0);
        lottery_state = LOTTERY_STATE.CLOSED;

    }

}