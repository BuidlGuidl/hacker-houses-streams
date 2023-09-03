pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

// custom errors
error TRANSFER_FAILED();
error INVALID_ARRAY_INPUT();
error NO_ACTIVE_STREAM();
error NOT_ENOUGH_FUNDS_IN_CONTRACT();
error NOT_ENOUGH_FUNDS_IN_STREAM();

contract YourContract is Ownable {
    struct BuilderStreamInfo {
        uint256 cap;
        uint256 last;
        address optionalTokenAddress;
    }
    mapping(address => BuilderStreamInfo) public streamedBuilders;
    // ToDo. Change to 30 days
    uint256 public constant FREQUENCY = 2592000; // 30 days

    event Withdraw(address indexed to, uint256 amount, string reason);
    event AddBuilder(address indexed to, uint256 amount);
    event UpdateBuilder(address indexed to, uint256 amount);

    constructor() { }

    struct BuilderData {
        address builderAddress;
        uint256 cap;
        uint256 unlockedAmount;
    }

    function allBuildersData(address[] calldata _builders) public view returns (BuilderData[] memory) {
        // cache length
        uint256 _length = _builders.length;
        BuilderData[] memory result = new BuilderData[](_length);
        for (uint256 i = 0; i < _length;) {
            address builderAddress = _builders[i];
            BuilderStreamInfo memory builderStream = streamedBuilders[builderAddress];
            result[i] = BuilderData(builderAddress, builderStream.cap, unlockedBuilderAmount(builderAddress));
            unchecked {
                ++ i;
            }
        }
        return result;
    }

    function unlockedBuilderAmount(address _builder) public view returns (uint256) {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        if (builderStream.cap == 0) {
            return 0;
        }

        if (block.timestamp - builderStream.last > FREQUENCY) {
            return builderStream.cap;
        }

        return (builderStream.cap * (block.timestamp - builderStream.last)) / FREQUENCY;
    }

    function addBuilderStream(address payable _builder, uint256 _cap, address _optionalTokenAddress) public onlyOwner {
        streamedBuilders[_builder] = BuilderStreamInfo(_cap, block.timestamp - FREQUENCY, _optionalTokenAddress);
        emit AddBuilder(_builder, _cap);
    }

    function addBatch(address[] calldata _builders, uint256[] calldata _caps, address[] calldata _optionalTokenAddresses) public onlyOwner {
        // cache length
        uint256 _length = _builders.length;
        if (_length != _caps.length) revert INVALID_ARRAY_INPUT();
        for (uint256 i = 0; i < _length;) {
            addBuilderStream(payable(_builders[i]), _caps[i],_optionalTokenAddresses[i]);
            unchecked {
                ++ i;
            }
        }
    }

    function updateBuilderStreamCap(address payable _builder, uint256 _cap) public onlyOwner {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        if (builderStream.cap == 0) revert NO_ACTIVE_STREAM();
        
        streamedBuilders[_builder].cap = _cap;
        emit UpdateBuilder(_builder, _cap);
    }

    function streamWithdraw(uint256 _amount, string calldata _reason) public {
        IERC20 token;
        BuilderStreamInfo storage builderStream = streamedBuilders[msg.sender];
        
        if (builderStream.optionalTokenAddress == address(0)){
            if (address(this).balance < _amount) revert NOT_ENOUGH_FUNDS_IN_CONTRACT();
        } else { 
            token = IERC20(builderStream.optionalTokenAddress);
            if (token.balanceOf(address(this)) < _amount) revert NOT_ENOUGH_FUNDS_IN_CONTRACT();
        }
        
        if (builderStream.cap == 0) revert NO_ACTIVE_STREAM();

        uint256 totalAmountCanWithdraw = unlockedBuilderAmount(msg.sender);
        if(totalAmountCanWithdraw < _amount) revert NOT_ENOUGH_FUNDS_IN_STREAM();

        uint256 cappedLast = block.timestamp - FREQUENCY;
        if (builderStream.last < cappedLast){
            builderStream.last = cappedLast;
        }

        builderStream.last = builderStream.last + ((block.timestamp - builderStream.last) * _amount / totalAmountCanWithdraw);

        if(builderStream.optionalTokenAddress == address(0)){

            (bool sent,) = msg.sender.call{value: _amount}("");
            if (!sent) revert TRANSFER_FAILED();

        } else {
            bool success = token.transfer(msg.sender, _amount);
            if (!success) revert TRANSFER_FAILED();
        }

        emit Withdraw(msg.sender, _amount, _reason);
    }

    // to support receiving ETH by default
    receive() external payable {}
}