// Test if a new solution can be added for contract - SolnSquareVerifier
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
const fs = require('fs');
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

contract(`Test Soln Square Verifier`, accounts=>{
    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];
    const { proof,inputs } = JSON.parse(fs.readFileSync("../zokrates/code/square/proof.json"));
    const trueProof = proof;
    const fakeProof = Object.assign({}, proof);
    fakeProof.a = fakeProof.c;

    beforeEach(async()=>{
        let verifier = await Verifier.new({from:owner});
        this.contract = await SolnSquareVerifier.new(verifier.address, {from:owner});
    });

    it(`add solution to ERC721`, async()=>{
        this.trueProofHash = await this.contract.hashSolution.call(trueProof.a, trueProof.b, trueProof.c, inputs);
        this.fakeProofHash = await this.contract.hashSolution.call(fakeProof.a, fakeProof.b, fakeProof.c, inputs);
        let canAddTrue = true;
        try {
            await this.contract.addSolution(account1, this.trueProofHash, {from:account1});
        } catch(err){
            console.log(err.message);
            canAddTrue = false;
        }
        assert.equal(canAddTrue, true, "Cannot add solution for true proof");

        let canAddFake = true;
        try {
            await this.contract.addSolution(account2, this.fakeProofHash, {from:account2});
        } catch(err){
            console.log(err.message);
            canAddFake = false;
        }
        assert.equal(canAddFake, true, "Cannot add solution for fake proof");

        const trueSolutionInfo = await this.contract.getSoluction.call(this.trueProofHash);
        const fakeSolutionInfo = await this.contract.getSoluction.call(this.fakeProofHash);
        assert.equal(trueSolutionInfo.solver, account1, "Solver saved is incorrect for true proof");
        assert.equal(trueSolutionInfo.index.toNumber(), 1, "Token ID saved is incorrect for true proof");
        assert.equal(fakeSolutionInfo.solver, account2, "Solver saved is incorrect for fake proof");
        assert.equal(fakeSolutionInfo.index.toNumber(), 2, "Token ID saved is incorrect for fake proof");
    });

    it(`ERC721 token will be minted for contract when correct proof provded`, async()=>{
        let canMint = true;
        try{
            await this.contract.mintNFT(account1, trueProof.a, trueProof.b, trueProof.c, inputs, {from:owner});
        } catch(err){
            console.log(err.message);
            canMint = false;
        }
        assert.equal(canMint, true, "cannot be minted when correct proof provded");
    });

    it(`ERC721 token will not be minted for contract when fake proof provded`, async()=>{
        let canMint = true;
        try{
            await this.contract.mintNFT(account1, fakeProof.a, fakeProof.b, fakeProof.c, inputs, {from:owner});
        } catch(err){
            console.log(err.message);
            canMint = false;
        }
        assert.equal(canMint, false, "can be minted when fake proof provded");
    });
})