//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Owned} from "solmate/auth/Owned.sol";

contract GrantStreamer is Owned {
    struct BuilderStreamInfo {
        uint256 cap;
        uint256 last;
    }

    mapping(address => BuilderStreamInfo) public streamedBuilders;
    // ToDo. Change to 30 days
    uint256 public frequency = 300 seconds; //2592000; // 30 days

    event Withdraw(address indexed to, uint256 amount, string reason);

    constructor(address startingOwner) Owned(startingOwner) {}

    struct BuilderData {
        address builderAddress;
        uint256 cap;
        uint256 unlockedAmount;
    }

    function allBuildersData(address[] memory _builders) public view returns (BuilderData[] memory) {
        BuilderData[] memory result = new BuilderData[](_builders.length);
        for (uint256 i = 0; i < _builders.length; i++) {
            address builderAddress = _builders[i];
            BuilderStreamInfo storage builderStream = streamedBuilders[builderAddress];
            result[i] = BuilderData(builderAddress, builderStream.cap, unlockedBuilderAmount(builderAddress));
        }
        return result;
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
    }

    function updateBuilderStreamCap(address payable _builder, uint256 _cap) public onlyOwner {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        require(builderStream.cap > 0, "No active stream for builder");
        streamedBuilders[_builder].cap = _cap;
    }

    function streamWithdraw(uint256 _amount, string memory _reason) public {
        require(address(this).balance >= _amount, "Not enough funds in the contract");
        BuilderStreamInfo storage builderStream = streamedBuilders[msg.sender];
        require(builderStream.cap > 0, "No active stream for builder");

        uint256 totalAmountCanWithdraw = unlockedBuilderAmount(msg.sender);
        require(totalAmountCanWithdraw >= _amount, "Not enough in the stream");

        uint256 cappedLast = block.timestamp - frequency;
        if (builderStream.last < cappedLast) {
            builderStream.last = cappedLast;
        }

        builderStream.last =
            builderStream.last + ((block.timestamp - builderStream.last) * _amount / totalAmountCanWithdraw);

        (bool sent,) = msg.sender.call{value: _amount}("");
        require(sent, "Failed to send Ether");

        emit Withdraw(msg.sender, _amount, _reason);
    }

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}
}
