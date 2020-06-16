const Token = artifacts.require("Token");
const { expect } = require('chai');
const { BN, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract("BlackList test", accounts => {
    it("Destroy black funds", async () => {
        if (accounts.length < 2) {
            console.log(('skipping test: requires accounts.length > 1'));
            return;
        }
        const token = await Token.deployed();
        const [from, dirtyAddress] = accounts;
        const expectedBalance = new BN(10);
        const transfer = async (from) => {
            return token.transfer(dirtyAddress, expectedBalance, {
                from: from,
            });
        };
        const getBalance = async () => {
            return token.balanceOf(dirtyAddress);
        };

        await transfer(from)
            .then(() => getBalance())
            .then((balance) => {
                expect(balance).to.be.bignumber.equal(expectedBalance);
            })
            .then(() => token.addBlackList(dirtyAddress))
            .then((receipt) => {
                expectEvent.inLogs(receipt.logs, 'AddedBlackList', {
                    _user: dirtyAddress,
                });
            })
            .then(() => {
                shouldFail.reverting(transfer(dirtyAddress));
            })
            .then(() => token.destroyBlackFunds(dirtyAddress))
            .then((receipt) => {
                expectEvent.inLogs(receipt.logs, 'DestroyedBlackFunds', {
                    _blackListedUser: dirtyAddress,
                    _balance: expectedBalance,
                });
            })
            .then(() => getBalance())
            .then((balance) => {
                expect(balance).to.be.bignumber.equal(new BN(0));
            })
            .then(() => token.removeBlackList(dirtyAddress))
            .then((receipt) => {
                expectEvent.inLogs(receipt.logs, 'RemovedBlackList', {
                    _user: dirtyAddress,
                });
            });
    });
});