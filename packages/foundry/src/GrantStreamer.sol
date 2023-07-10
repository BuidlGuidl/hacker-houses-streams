//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Owned} from "solmate/auth/Owned.sol";
import {SafeCastLib} from "solady/utils/SafeCastLib.sol";
import {SafeTransferLib} from "solady/utils/SafeTransferLib.sol";

contract GrantStreamer is Owned {
    using SafeCastLib for uint256;
    using SafeTransferLib for address;

    struct BuilderStreamInfo {
        uint128 cap;
        uint128 last;
    }

    mapping(address => BuilderStreamInfo) public streamedBuilders;
    uint256 public constant FREQUENCY = 30 days;

    event Withdraw(address indexed to, uint256 amount, string reason);

    constructor(address startingOwner) Owned(startingOwner) {}

    struct BuilderData {
        address builderAddress;
        uint256 cap;
        uint256 unlockedAmount;
    }

    function allBuildersData(address[] memory builders) public view returns (BuilderData[] memory) {
        uint256 totalBuilders = builders.length;
        BuilderData[] memory result = new BuilderData[](totalBuilders);
        for (uint256 i; i < totalBuilders;) {
            address builderAddress = builders[i];
            BuilderStreamInfo storage builderStream = streamedBuilders[builderAddress];
            result[i] = BuilderData(builderAddress, builderStream.cap, unlockedBuilderAmount(builderAddress));
            unchecked {
                ++i;
            }
        }
        return result;
    }

    function unlockedBuilderAmount(address builder) public view returns (uint256) {
        BuilderStreamInfo memory builderStream = streamedBuilders[builder];
        require(builderStream.cap > 0, "No active stream for builder");

        if (block.timestamp - builderStream.last > FREQUENCY) {
            return builderStream.cap;
        }

        return (builderStream.cap * (block.timestamp - builderStream.last)) / FREQUENCY;
    }

    function addBuilderStream(address payable builder, uint256 cap) public onlyOwner {
        streamedBuilders[builder] = BuilderStreamInfo(cap.toUint128(), (block.timestamp - FREQUENCY).toUint128());
    }

    function updateBuilderStreamCap(address payable builder, uint256 cap) public onlyOwner {
        BuilderStreamInfo memory builderStream = streamedBuilders[builder];
        require(builderStream.cap > 0, "No active stream for builder");
        streamedBuilders[builder].cap = cap.toUint128();
    }

    function streamWithdraw(uint256 amount, string memory reason) public {
        require(address(this).balance >= amount, "Not enough funds in the contract");
        BuilderStreamInfo storage builderStream = streamedBuilders[msg.sender];
        require(builderStream.cap > 0, "No active stream for builder");

        uint256 totalAmountCanWithdraw = unlockedBuilderAmount(msg.sender);
        require(totalAmountCanWithdraw >= amount, "Not enough in the stream");

        uint256 cappedLast = block.timestamp - FREQUENCY;
        if (builderStream.last < cappedLast) {
            builderStream.last = cappedLast.toUint128();
        }

        builderStream.last =
            builderStream.last + ((block.timestamp - builderStream.last) * amount / totalAmountCanWithdraw).toUint128();

        emit Withdraw(msg.sender, amount, reason);

        msg.sender.safeTransferETH(amount);
    }

    // to support receiving ETH by default
    receive() external payable {}
}
