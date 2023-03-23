pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol


contract YourContract is Ownable {

    struct BuilderStreamInfo {
        uint256 cap;
        uint256 last;
    }
    mapping(address => BuilderStreamInfo) public streamedBuilders;

    uint256 public frequency = 300 seconds; //2592000; // 30 days

    event Withdraw(address indexed to, uint256 amount, string reason);

    constructor(address startingOwner) {
      _transferOwnership(startingOwner);
    }

    function unlockedBuilderAmount(address _builder) public view returns (uint256) {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        require(builderStream.cap > 0, "No active stream for builder");

        if (block.timestamp - builderStream.last > frequency) {
            return builderStream.cap;
        }

        return (builderStream.cap * (block.timestamp - builderStream.last)) / frequency;
    }

    function addBuilderStream(address payable _builder, uint256 _cap) public onlyOwner {
        streamedBuilders[_builder] = BuilderStreamInfo(_cap, block.timestamp - frequency);
        // probably need an event here 
    }

    function streamWithdraw(uint256 _amount, string memory _reason) public {
        require(address(this).balance >= _amount, "Not enough funds in the contract");
        BuilderStreamInfo storage builderStream = streamedBuilders[msg.sender];
        require(builderStream.cap > 0, "No active stream for builder");

        uint256 totalAmountCanWithdraw = unlockedBuilderAmount(msg.sender);
        require(totalAmountCanWithdraw >= _amount,"Not enough in the stream");

        uint256 cappedLast = block.timestamp - frequency;
        if (builderStream.last < cappedLast){
            builderStream.last = cappedLast;
        }

        builderStream.last = builderStream.last + ((block.timestamp - builderStream.last) * _amount / totalAmountCanWithdraw);

        (bool sent,) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        emit Withdraw(msg.sender, _amount, _reason);
    }

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}
}