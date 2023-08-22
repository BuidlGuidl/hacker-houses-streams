pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol


contract YourContract is Ownable {

    struct BuilderStreamInfo {
        uint256 cap;
        uint256 last;
        address optionalTokenAddress;
    }
    mapping(address => BuilderStreamInfo) public streamedBuilders;
    // ToDo. Change to 30 days
    uint256 public frequency = 2592000; // 30 days

    event Withdraw(address indexed to, uint256 amount, string reason);
    event AddBuilder(address indexed to, uint256 amount);
    event UpdateBuilder(address indexed to, uint256 amount);

    constructor() { }

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
        if (builderStream.cap == 0) {
            return 0;
        }

        if (block.timestamp - builderStream.last > frequency) {
            return builderStream.cap;
        }

        return (builderStream.cap * (block.timestamp - builderStream.last)) / frequency;
    }

    function addBuilderStream(address payable _builder, uint256 _cap, address _optionalTokenAddress) public onlyOwner {
        streamedBuilders[_builder] = BuilderStreamInfo(_cap, block.timestamp - frequency, _optionalTokenAddress);
        emit AddBuilder(_builder, _cap);
    }

    function addBatch(address[] memory _builders, uint256[] memory _caps, address[] memory _optionalTokenAddresses) public onlyOwner {
        require(_builders.length == _caps.length, "Lengths are not equal");
        for (uint256 i = 0; i < _builders.length; i++) {
            addBuilderStream(payable(_builders[i]), _caps[i],_optionalTokenAddresses[i]);
        }
    }

    function updateBuilderStreamCap(address payable _builder, uint256 _cap) public onlyOwner {
        BuilderStreamInfo memory builderStream = streamedBuilders[_builder];
        require(builderStream.cap > 0, "No active stream for builder");
        streamedBuilders[_builder].cap = _cap;
        emit UpdateBuilder(_builder, _cap);
    }

    function streamWithdraw(uint256 _amount, string memory _reason) public {

        IERC20 token;
        BuilderStreamInfo storage builderStream = streamedBuilders[msg.sender];
        
        if(builderStream.optionalTokenAddress == address(0)){
            require(address(this).balance >= _amount, "Not enough funds in the contract");
        }else{
            token = IERC20(builderStream.optionalTokenAddress);
            require(token.balanceOf(address(this)) >= _amount, "Not enough tokens in the contract");
        }
        
        require(builderStream.cap > 0, "No active stream for builder");
        

        uint256 totalAmountCanWithdraw = unlockedBuilderAmount(msg.sender);
        require(totalAmountCanWithdraw >= _amount,"Not enough in the stream");

        uint256 cappedLast = block.timestamp - frequency;
        if (builderStream.last < cappedLast){
            builderStream.last = cappedLast;
        }

        builderStream.last = builderStream.last + ((block.timestamp - builderStream.last) * _amount / totalAmountCanWithdraw);

        if(builderStream.optionalTokenAddress == address(0)){

            (bool sent,) = msg.sender.call{value: _amount}("");
            require(sent, "Failed to send Ether");

        }else{

            token.transfer(msg.sender, _amount);
            
        }
        

        emit Withdraw(msg.sender, _amount, _reason);
    }

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}
}