const Token = artifacts.require("./Token");
const config = require("../config.json");

const web3 = require('web3');
const BN = web3.utils.BN;

const initialSupply = new BN(config.initialSupply);
const name = config.name;
const symbol = config.symbol;
const decimals = new BN(config.decimals);

module.exports = function(deployer) {
  deployer.deploy(Token, initialSupply, name, symbol, decimals);
};
