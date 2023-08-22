pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SomeERC20 is ERC20 {
    constructor() ERC20("SomeERC20", "SE20") {
        _mint(0x98AfB7982F8E86AC8944Bd3c1b6376D1B8033944, 1000 ether);
    }
}