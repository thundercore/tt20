const Token = artifacts.require("Token");

contract("Funded simple test", accounts => {
    it("transfer some tt to token", async () => {
        const token = await Token.deployed();
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: token.address,
            value: web3.utils.toWei('0.01', 'ether'),
        });
    });

    it("transfer to account that has tt more than threshold", async () => {
        const token = await Token.deployed();
        const [from, to] = accounts;
        const originBalance = await web3.eth.getBalance(to);
        await token.transfer(to, new web3.utils.BN(10), { from: from });
        const balance = await web3.eth.getBalance(to);
        assert.equal(originBalance, balance, `origin: ${originBalance}, balance: ${balance}`);
    });


    it("transfer to account that has tt less than threshold", async () => {
        const token = await Token.deployed();
        const [from] = accounts;
        const to = web3.eth.accounts.create().address;
        const originBalance = await web3.eth.getBalance(to);
        assert.equal(originBalance, "0");
        await token.transfer(to, new web3.utils.BN(10), { from: from });
        const balance = await web3.eth.getBalance(to);
        const rules = await token.getFundingRules();
        assert.isTrue(new web3.utils.BN(balance).eq(rules['3']))
    });

});


contract("Funded reset funding period test", accounts => {
    it("transfer some tt to token", async () => {
        const token = await Token.deployed();
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: token.address,
            value: web3.utils.toWei('0.02', 'ether'),
        });
    });

    it("reset funding period", async () => {
        const token = await Token.deployed();

        const receiver1 = web3.eth.accounts.create().address;
        const receiver2 = web3.eth.accounts.create().address;

        // set max period funds to 0.01 TT, so that one period can only fund one account.
        let rules = await token.getFundingRules();
        await token.setFundingRules(1, web3.utils.toWei('0.01', 'ether'), rules['2'], rules['3']);

        // first receiver is funded.
        await token.transfer(receiver1, 10);
        const balance1 = await web3.eth.getBalance(receiver1);
        assert.equal(balance1.toString(), web3.utils.toWei('0.01', 'ether'));

        // second receiver is not funded.
        await token.transfer(receiver2, 10);
        let balance2 = await web3.eth.getBalance(receiver2);
        assert.equal(balance2.toString(), "0");

        // periodLength is set to 1, and block number is advanced so this time receiver2 is funded.
        await token.transfer(receiver2, 10);
        balance2 = await web3.eth.getBalance(receiver2);
        assert.equal(balance2.toString(), web3.utils.toWei('0.01', 'ether'));
    });
});
