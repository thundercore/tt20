const { expect } = require('chai')
const { BN, expectEvent } = require('@openzeppelin/test-helpers')

const TT20 = artifacts.require('TT20')

contract('TT20', ([owner, receiver]) => {
  it('My TT20 Token', async () => {
    const token = await TT20.new('My Testing Token', 'MTT', 7777)

    const decimals = await token.decimals()

    expect(await token.symbol()).to.be.equals('MTT')

    expect(await token.balanceOf(owner)).to.be.a.bignumber.that.eq(
      new BN(7777).mul(new BN(10).pow(decimals))
    )

    expectEvent(
      await token.transfer(receiver, new BN(10).pow(decimals), { from: owner }),
      'Transfer',
      { from: owner, to: receiver, value: new BN(10).pow(decimals) }
    )
  })
})
