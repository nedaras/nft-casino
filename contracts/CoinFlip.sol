//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract CoinFlip is VRFConsumerBase {

    modifier onlyWhenNotPlaying {
        require(joinedPlayers[msg.sender] == address(0) && getGameId(msg.sender) == -1, 'You are already in game');
        _;

    }

    enum SIDE {
        TAILS,
        HEAD

    }

    enum GAME_STATUS {
        CLOSED,
        WAITING_FOR_PLAYERS,
        GETTING_WINNER

    }

    struct Room {
        address payable player;
        uint256 bet;
        SIDE side;
        GAME_STATUS gameStatus;

    }

    Room[] public rooms;

    mapping(bytes32 => uint256) internal randomnessResponse;
    mapping(address => address) internal joinedPlayers;

    bytes32 internal keyHash;
    uint256 internal fee;

    constructor(address coordinator, address link) VRFConsumerBase(coordinator, link) {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18;

    }

    function createGame(bool tails) onlyWhenNotPlaying public payable returns ( uint256 ) {
        Room memory room = Room(payable(msg.sender), msg.value, tails ? SIDE.TAILS : SIDE.HEAD, GAME_STATUS.WAITING_FOR_PLAYERS);

        uint256 i = generateGameId();

        if (i >= rooms.length) rooms.push(room); 
        else rooms[i] = room;

        return i;

    }

    function enterGame(uint256 gameId) onlyWhenNotPlaying public payable {

        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");

        Room memory room = rooms[gameId];

        require(room.gameStatus == GAME_STATUS.WAITING_FOR_PLAYERS, 'Cant join active or empty game');
        require(room.bet == msg.value, 'You need to bet same money has a creator');

        bytes32 requestId = requestRandomness(keyHash, fee);
        randomnessResponse[requestId] = gameId;

        joinedPlayers[room.player] = msg.sender;
        room.gameStatus = GAME_STATUS.GETTING_WINNER;

    }

    function cancel() public {

        int256 _gameId = getGameId(msg.sender);
        require(_gameId != -1, 'You are not in game');

        uint256 gameId = uint256(_gameId);
        uint256 bet = rooms[gameId].bet;

        payable(msg.sender).transfer(bet);

        delete rooms[gameId];

    }

    function getGameId(address player) internal view returns ( int256 ) {
        for (uint256 i = 0; i < rooms.length; i++) if (rooms[i].player == player) return int256(i);
        return -1;

    }

    function generateGameId() internal view returns ( uint256 ) {
        uint256 i = 0;
        while (i < rooms.length) {
            if (rooms[i].gameStatus == GAME_STATUS.CLOSED) return i;
            i++;

        }
        return i;

    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 gameId = randomnessResponse[requestId];
        Room memory room = rooms[gameId];

        address payable winner = randomness % 100 > 50 ? room.player : payable(joinedPlayers[room.player]);

        winner.transfer(room.bet * 2);

        delete randomnessResponse[requestId];

        delete joinedPlayers[room.player];
        delete rooms[gameId];

    }

}
