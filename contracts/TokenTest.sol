


/**
 * @title ERC20 interface
 * @dev see https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20 {
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address who) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  function decimals() external view returns(uint8);
}


contract TokenTest {
    function testTransferFrom(address tokenAddr, uint value) public {
        // sender already approve me to transfer `value`, we transfer from sender to this address
        IERC20 token = IERC20(tokenAddr);
        uint ourBalance = token.balanceOf(address(this));
        uint theirBalance = token.balanceOf(msg.sender);
        require(token.allowance(msg.sender, address(this)) >= value, 'insufficient allowance.');
        require(token.transferFrom(msg.sender, address(this), value), 'cannot transfer from sender, make sure allowance');
        require(ourBalance + value == token.balanceOf(address(this)), 'to balance mismatch after transfer');

        require(theirBalance == token.balanceOf(msg.sender) + value, 'from balance mismatch after transfer');
    }

    function testApprove(address tokenAddr, uint value) public {
        // approving sender to transfer from this address
        IERC20 token = IERC20(tokenAddr);
        uint allowance = token.allowance(address(this), msg.sender);
        require(token.approve(msg.sender, value), 'Cannnot approve sender');
        require(allowance + value == token.allowance(address(this), msg.sender), 'Allowance does not change after calling approve');
    }

    function testTransfer(address tokenAddr, address to, uint value) public {
        // transfer from this address and make sure the balance
        IERC20 token = IERC20(tokenAddr);
        uint ourBalance = token.balanceOf(address(this));
        uint theirBalance = token.balanceOf(to);
        require(ourBalance >= value, 'Insufficient token balance');
        require(token.transfer(to, value), 'Cannot transfer');
        require(theirBalance + value == token.balanceOf(to), 'to balances after transfer');
        require(token.balanceOf(address(this)) + value == ourBalance, 'from balances mistmatch after transfer');
    }

    function testDecimals(address tokenAddr) public {
        IERC20 token = IERC20(tokenAddr);
        uint8 decimals = token.decimals();
        require(decimals <= 255, 'decimals out of range');
    }
}
