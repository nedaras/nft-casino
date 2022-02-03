//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract Roulette {

    address payable public casino;

    uint lucky_number = 11;

    constructor() {
        casino = payable(msg.sender);

    }

    function spin(uint bet_number) payable public {
        
        address payable player = payable(msg.sender);

        if (bet_number == lucky_number % 36) {
            (bool success, ) = player.call{value:msg.value*2}("");
            require(success, "failed to send ether :(");

        }

    }

}