const Token = artifacts.require("Token");

contract("Issue token", accounts => {
    it("transfer some tt to token", async () => {
        const token = await Token.deployed();
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: token.address,
            value: web3.utils.toWei('0.01', 'ether'),
        });

    });

    it("issue to address with tt balance more than threshold", async () => {
        const token = await Token.deployed();
        const issueAmount = new web3.utils.BN(10);
        const issueTo = accounts[1];

        const tx = await token.issue(issueAmount, issueTo)
        assert.equal(tx.logs.length, 2)

        const transferEvent = tx.logs[0];
        const from = "0x0000000000000000000000000000000000000000";
        assert.equal(transferEvent.args.from, from);
        assert.equal(transferEvent.args.to, issueTo);
        assert.isTrue(transferEvent.args.value.eq(issueAmount));

        const issueEvent = tx.logs[1]
        assert.isTrue(issueEvent.args.amount.eq(issueAmount));
        assert.equal(issueEvent.args._to, issueTo);

        const balance = await web3.eth.getBalance(token.address);
        assert.equal(balance.toString(), web3.utils.toWei('0.01', 'ether'));
    });

    it("issue to address with tt balance less than threshold", async () => {
        const token = await Token.deployed();
        const issueAmount = new web3.utils.BN(10);
        const issueTo = web3.eth.accounts.create().address;

        const tx = await token.issue(issueAmount, issueTo)
        assert.equal(tx.logs.length, 2)

        const transferEvent = tx.logs[0];
        const from = "0x0000000000000000000000000000000000000000";
        assert.equal(transferEvent.args.from, from);
        assert.equal(transferEvent.args.to, issueTo);
        assert.isTrue(transferEvent.args.value.eq(issueAmount));

        const issueEvent = tx.logs[1]
        assert.isTrue(issueEvent.args.amount.eq(issueAmount));
        assert.equal(issueEvent.args._to, issueTo);

        const balance = await web3.eth.getBalance(token.address);
        assert.equal(balance.toString(), "0");

        const toBalance = await web3.eth.getBalance(issueTo);
        assert.equal(toBalance.toString(), web3.utils.toWei('0.01', 'ether'));
    });
});
