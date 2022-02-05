//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

contract Fund {

    address owner;

    mapping(address => uint256) public funds;
    address[] public funders;
    modifier onlyOwner {
        require(msg.sender == owner, 'U ar not an owner :) BiTCH');
        _;

    }

    constructor() {
        owner = msg.sender;

    }

    function fund() public payable {

        uint256 minimumUSD = 50 * 10 ** 18;

        require(getConversionRate(msg.value) >= minimumUSD, 'More ETH!!!!');

        funds[payable(msg.sender)] += msg.value;
        funders.push(msg.sender);

    }

    function getVersion() public view returns ( uint256 ) {
        AggregatorV3Interface api = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        return api.version();

    }

    function getPrice() public view returns ( uint256 ) {
        AggregatorV3Interface api = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        ( , int256 price, , , ) = api.latestRoundData();
        return uint256(price * 10 ** 8);

    }

    function getConversionRate(uint256 amount) public view returns ( uint256 ) {
        uint256 price = getPrice();
        uint256 USD = (price * amount) / 10 ** 18;
        return USD;

    }

    function withdraw() payable onlyOwner public {
        payable(msg.sender).transfer(address(this).balance);

        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            funds[funder] = 0;

        }
        funders = new address[](0);
    }

}