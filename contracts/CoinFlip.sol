//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract CoinFlip {

    modifier onlyWhenNotPlaying {
        require(storedPlayers[msg.sender] == false, 'You are already in game');
        _;

    }

    enum Side {
        TAILS,
        HEAD

    }

    struct Player {
        address payable playerAdress;
        uint256 bet;
        Side side;

    }

    mapping(address => bool) internal storedPlayers;
    Player[] public players;

    function createGame(bool tails) onlyWhenNotPlaying public payable returns ( uint256 ) {
        Player memory player = Player(payable(msg.sender), msg.value, tails ? Side.TAILS : Side.HEAD);
        return uint256(create(player));

    }

    function enterGame(uint256 gameId) onlyWhenNotPlaying public payable returns ( address ) {

        uint256 bet = players[gameId].bet;
        require(msg.value == bet, 'You need to bet same money has a creator');

        address payable winner = flip(gameId);
        winner.transfer(bet + msg.value);

        clear(gameId);

        return winner;

    }

    function cancel() public {
        int256 gameId = getGameId(msg.sender);
        require(gameId != -1, 'You are not in game!');

        uint256 fixedGameId = uint256(gameId);
        uint256 bet = players[fixedGameId].bet;

        payable(msg.sender).transfer(bet);

        clear(fixedGameId);

    }

    function flip(uint256 gameId) internal view returns ( address payable ) {
        Player memory player = players[gameId];
        return getRandomSide() == player.side ? player.playerAdress : payable(msg.sender);

    }

    function getRandomSide() internal view returns ( Side ) {
        uint256 fakeRandomNumber = uint256(keccak256(abi.encodePacked(block.number, msg.sender, block.difficulty, block.timestamp))) % 2;
        return fakeRandomNumber == 0 ? Side.HEAD : Side.TAILS;

    }

    function getGameId(address player) internal view returns ( int256 ) {

        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].playerAdress == player) return int256(i);

        }

        return -1;

    }

    function create(Player memory player) internal returns ( int256 ) {
        players.push(player);
        storedPlayers[msg.sender] = true;

        return getGameId(player.playerAdress);

    }

    function clear(uint256 gameId) internal {
        address playerAdress = players[gameId].playerAdress;
        
        delete storedPlayers[playerAdress];
        delete storedPlayers[msg.sender];

        delete players[gameId];

    }

}
