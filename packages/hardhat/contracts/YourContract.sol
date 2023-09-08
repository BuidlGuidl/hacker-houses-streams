pragma solidity 0.8.19;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract YourContract is Ownable {
    using SafeERC20 for IERC20;

    /**----------------------------------------------*
     *                Structs                        *
     *-----------------------------------------------*/

    // Struct containing stream specific information
    // It contains info relevant to one builder
    struct BuilderStreamInfo {
        uint128 cap; // max amount that stream can supply
        uint128 last; // amount of last withdrawal
        address optionalTokenAddress; // optional ERC20 address
    }

    // Struct containing Builder specific information
    struct BuilderData {
        address builderAddress; // address of the builder
        uint128 cap; // builder's cap
        uint128 unlockedAmount; // amount currently available
    }

    /**----------------------------------------------*
     *                 Events                        *
     *-----------------------------------------------*/

    // Withdrawal has taken place
    event Withdraw(address indexed to, uint256 amount, string reason);
    // New builder added. Huzzah!
    event AddBuilder(address indexed to, uint256 amount);
    // New batch added
    event BuildersAdded(address[] indexed builders);
    // Builder details updated
    event UpdateBuilder(address indexed to, uint256 amount);

    /**----------------------------------------------*
     *                 Errors                        *
     *-----------------------------------------------*/

    // Not enough funds (base or optional tokens)
    error InsufficientFunds();
    // No stream for builder
    error NoStream();
    // Not enough accrued
    error InsufficientUnlocked();
    // Send ether failed
    error SendFailed();

    /**----------------------------------------------*
     *             State Variables                   *
     *-----------------------------------------------*/
    // Mapping of address to `BuilderStreamInfo` structs
    mapping(address => BuilderStreamInfo) public streamedBuilders;

    /**----------------------------------------------*
     *                Viewers                        *
     *-----------------------------------------------*/

    /// @notice Returns an array of structs containing the data of the requested addresses
    /// @dev Constructs the BuilderDataStruct in function (it's not stored in a mapping somewhere)
    /// @param _builders an array of addresses
    /// @return Array of BuilderData structs
    function allBuildersData(address[] calldata _builders) external view returns (BuilderData[] memory) {
        uint256 length = _builders.length;    
        BuilderData[] memory result = new BuilderData[](_builders.length);

        for (uint256 i; i < length;) {
            address builderAddress = _builders[i];
            BuilderStreamInfo storage builderStream = streamedBuilders[builderAddress];
            result[i] = BuilderData(builderAddress, builderStream.cap, unlockedBuilderAmount(builderAddress));

            unchecked {
                ++i;
            }
        }

        return result;
    }

    /// @notice Returns the amount of funds the builder has unlocked
    /// @param _builder Address of the target builder
    /// @return Amount of funds unlocked at this point in time
    function unlockedBuilderAmount(address _builder) public view returns (uint128) {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        // If the builder doesn't exist yet, return 0
        if (builderStream.cap == 0) {
            return 0;
        }

        // If the current time - last withdrawal is larger than 30 days,
        // then the full amount is available
        if (block.timestamp - builderStream.last > 30 days) {
            return builderStream.cap;
        }

        // Casting timestamp to uint128 is safe
        return (builderStream.cap * (uint128(block.timestamp) - builderStream.last)) / 30 days;
    }

    /**----------------------------------------------*
     *                 Admin                         *
     *-----------------------------------------------*/

    /// @notice Adds a new builder stream OR NB overwrites a current builder stream
    /// @dev Access Control: Owner
    /// @param _builder Address to be added
    /// @param _cap The 30 day amount at which the stream is capped
    /// @param _optionalTokenAddress An optional ERC20 token address, should be `address(0)` for base currency
    function addBuilderStream(
        address payable _builder,
        uint256 _cap,
        address _optionalTokenAddress
    ) public onlyOwner {
        _addBuilderStream(_builder, _cap, _optionalTokenAddress);
        emit AddBuilder(_builder, _cap);
    }

    /// @notice Adds new builders, OR NB overwrites current builders, in one transaction
    /// @dev Access Control: Owner
    /// @param _builders Addresses to be added
    /// @param _caps The 30 day amounts at which the stream is capped
    /// @param _optionalTokenAddresses Optional ERC20 token addresses, should be `address(0)` for base currency
    function addBatch(
        address[] calldata _builders,
        uint256[] calldata _caps,
        address[] calldata _optionalTokenAddresses
    ) public onlyOwner {
        require(_builders.length == _caps.length && _builders.length == _optionalTokenAddresses.length, "Lengths are not equal");
        uint256 length = _builders.length; 

        for (uint256 i; i < length;) {
            _addBuilderStream(payable(_builders[i]), uint128(_caps[i]), _optionalTokenAddresses[i]);
            unchecked {
                ++i;
            }
        }

        emit BuildersAdded(_builders);
    }

    /// @notice Updates an existing builder's stream cap
    /// @dev Access Control: Owner
    /// @param _builder Address of existing builder
    /// @param _cap Amount that stream should be capped at
    function updateBuilderStreamCap(address payable _builder, uint128 _cap) public onlyOwner {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        if (builderStream.cap == 0) revert NoStream();
        //require(builderStream.cap > 0, "No active stream for builder");
        streamedBuilders[_builder].cap = _cap;
        emit UpdateBuilder(_builder, _cap);
    }

    /// @notice Internal helper to add a builder stream
    /// @param _builder Address to be added
    /// @param _cap The 30 day amount at which the stream is capped
    /// @param _optionalTokenAddress An optional ERC20 token address, should be `address(0)` for base currency
    function _addBuilderStream(
        address payable _builder,
        uint256 _cap,
        address _optionalTokenAddress
    ) internal {
        streamedBuilders[_builder] = BuilderStreamInfo(uint128(_cap), uint128(block.timestamp) - 30 days, _optionalTokenAddress);
    }
    /**----------------------------------------------*
     *                 Public                        *
     *-----------------------------------------------*/

    /// @notice Allows builder to withdraw from their stream
    /// @dev Requires the builder to be the msg.sender
    /// @param _amount The amount of funds to withdraw
    /// @param _reason String containing the reason for withdrawal
    function streamWithdraw(uint128 _amount, string calldata _reason) public {
        IERC20 token;
        BuilderStreamInfo storage builderStream = streamedBuilders[msg.sender];
        if (builderStream.cap == 0) revert NoStream();
        
        if (builderStream.optionalTokenAddress == address(0)) {
            if (address(this).balance < _amount) revert InsufficientFunds();
        } else {
            token = IERC20(builderStream.optionalTokenAddress);
            if (token.balanceOf(address(this)) < _amount) revert InsufficientFunds();
        }
        
        uint128 totalAmountCanWithdraw = unlockedBuilderAmount(msg.sender);
        if (totalAmountCanWithdraw < _amount) revert InsufficientUnlocked();

        uint128 cappedLast = uint128(block.timestamp) - 30 days;
        if (builderStream.last < cappedLast){
            builderStream.last = cappedLast;
        }

        builderStream.last = builderStream.last + ((uint128(block.timestamp) - builderStream.last) * _amount / totalAmountCanWithdraw);

        if (builderStream.optionalTokenAddress == address(0)) {

            (bool sent,) = msg.sender.call{value: _amount}("");
            if (!sent) revert SendFailed();
        } else {
            token.safeTransfer(msg.sender, _amount);
        }

        emit Withdraw(msg.sender, _amount, _reason);
    }

    // to support receiving ETH by default
    receive() external payable {}
}