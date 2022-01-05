const TT20 = artifacts.require('TT20')

const NAME = 'My ThunderCore Token'
const SYMBOL = 'MTT'
const TOTAL_SUPPLY = 1e6

module.exports = function (deployer) {
  deployer.deploy(TT20, NAME, SYMBOL, TOTAL_SUPPLY)
}
