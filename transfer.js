// Synopsis
//
// Transfer crypto (e.g. Ether, TT) to address
//
// $ truffle exec --network thunder-testnet transfer.js address amount
//
// OPTIONS:
// (The --network option is from `truffle exec`)
//
// This is a Truffle external script:
// See: https://truffleframework.com/docs/truffle/getting-started/writing-external-scripts

const process = require('process');
const program = require('commander');
const BN = web3.utils.BN;
const pretty = require('./pretty');

const transfer = async (to, amount)=> {
  const decimals = new BN(18)
  const e = (new BN(10)).pow(decimals)
  const value = (new BN(amount)).mul(e)
  let results
  try {
    results = await Promise.all([
      web3.eth.getAccounts(),
      web3.eth.net.getId(),
    ])
  } catch(err) {
    const msg = `eth.getAccounts or net.getId error: ${err}`
    throw new Error(msg)
  }
  const fromAddress = results[0][0]
  const networkId = results[1]
  try {
    results = await Promise.all([
      web3.eth.getTransactionCount(fromAddress),
      web3.eth.getGasPrice(),
    ])
  } catch (err) {
    const msg = `getTransactionCount or getGasPrice error: ${err}`
    throw new Error(msg)
  }
  const tx = {
    nonce: results[0],
    gasPrice: results[1],
    gas: 21*1000*2,
    chainId: networkId,
    from: fromAddress,
    value: web3.utils.toHex(value),
    to: to,
  }
  console.log('tx:', tx)
  try {
    tx.gas = (await web3.eth.estimateGas(tx))
    console.log('gasEstimate:', tx.gas)
  } catch (err) {
    const msg = `eth.estimateGas error: ${err}`
    throw new Error(msg)
  }
  try {
    const receipt = (await web3.eth.sendTransaction(tx))
    return receipt
  } catch (err) {
    const msg = `eth.sendTransaction error: ${err}`
    throw new Error(msg)
  }
};

module.exports = function(done) {
  program.usage('[options]')
         .option('--network <network>', 'used by truffle only')
         .parse(process.argv);
  (async () => {
    try {
        const l = process.argv.length;
        const to = process.argv[l-2];
        const amount = process.argv[l-1];
        const receipt = await transfer(to, amount);
        console.log('receipt:', pretty.format(receipt));
        done();
    } catch(err) {
      console.log('Exception:', err);
      process.exit(1);
      done();
    }
  })();
}
