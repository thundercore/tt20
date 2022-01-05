const HDWalletProvider = require('@truffle/hdwallet-provider')

// Import values from .env file as runtime environment variables.
require('dotenv').config()

const SECRET = ((secret = '') => {
  if (typeof secret !== 'string' || secret.length === 0) {
    throw new Error(`Require env variable "SECRET" with your private key or mnemonic`)
  }

  if (secret.indexOf(' ') === -1) {
    // private keys
    return [secret]
  }
  // mnemonic
  return secret
})(process.env.SECRET)

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //   host: "127.0.0.1",     // Localhost (default: none)
    //   port: 8545,            // Standard Ethereum port (default: none)
    //   network_id: "*",       // Any network (default: none)
    // },
    'thunder-testnet': {
      provider: () => new HDWalletProvider(SECRET, 'https://testnet-rpc.thundercore.com'),
      network_id: 18,
      gas: 90000000,
      gasPrice: 1e9, // (in wei, default: 100 gwei)
    },
    'thunder-mainnet': {
      provider: () => new HDWalletProvider(SECRET, 'https://mainnet-rpc.thundercore.com'),
      network_id: 108,
      gas: 90000000,
      gasPrice: 1e9, // (in wei, default: 100 gwei)
      production: true,
    },
  },

  compilers: {
    solc: {
      version: '0.8.10',
      settings: {
       optimizer: {
         enabled: false,
         runs: 200,
       },
       evmVersion: 'london',
      },
    },
  },
};
