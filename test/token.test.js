const Token = artifacts.require("Token");
const TokenTest = artifacts.require("TokenTest");

const { BN, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract("Test token test", accounts => {
    before(async ()=>{
        const issueTo = accounts[2];
        const token = await Token.deployed();
        const issueAmount = new web3.utils.BN(1000);
        await token.issue(issueAmount, issueTo);
    })

    it("cannot transfer from before approve", async() => {
        const token = await Token.deployed();
        const tokenTest = await TokenTest.deployed();
        const acc = accounts[2];
        const txValue = new web3.utils.BN(10);
        await shouldFail.reverting(tokenTest.testTransferFrom(token.address, txValue, {from:acc}));
    });

    it("can transfer from after approve", async () => {
        const token = await Token.deployed();
        const tokenTest = await TokenTest.deployed();
        const acc = accounts[2];
        const approveAmount = new web3.utils.BN(100);
        await token.approve(tokenTest.address, approveAmount, {from:acc});
        await tokenTest.testTransferFrom(token.address, approveAmount, {from:acc})
    });

    it("can approve", async () => {
        const token = await Token.deployed();
        const tokenTest = await TokenTest.deployed();
        const acc = accounts[2];
        const approveAmount = new web3.utils.BN(10);

        await tokenTest.testApprove(token.address, approveAmount, {from:acc});
        await token.transferFrom(tokenTest.address, acc, approveAmount, {from:acc});
    });

    it("can transfer", async () => {
        const token = await Token.deployed();
        const tokenTest = await TokenTest.deployed();
        const acc = accounts[2];
        const approveAmount = new web3.utils.BN(90);

        await tokenTest.testTransfer(token.address, acc, approveAmount, {from:acc});
    });

    it("has decimals", async() => {
        const token = await Token.deployed();
        const tokenTest = await TokenTest.deployed();
        const acc = accounts[2];
        const ret = await token.decimals();
        console.log('token decimals', ret);
        await tokenTest.testDecimals(token.address, {from:acc});
    })
});