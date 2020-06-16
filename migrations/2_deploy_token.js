const Token = artifacts.require("./Token");

const web3 = require('web3');
const BN = web3.utils.BN;

const decimals = new BN(8);

// 1e9 * 10^decimals
const initialSupply = new BN(0)

const name = 'CXKJ';
const symbol = 'CXKJ';

module.exports = function(deployer) {
  deployer.deploy(Token, initialSupply, name, symbol, decimals);
};
