// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TT20 is ERC20 {
  constructor(string memory _name, string memory _symbol, uint256 total) ERC20(_name, _symbol) {
    _mint(msg.sender, total * 10 ** decimals());
  }
}
