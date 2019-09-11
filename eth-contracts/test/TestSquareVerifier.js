// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
const Verifier = artifacts.require("Verifier");
const fs = require('fs');
// Test verification with correct proof
contract(`Test Square Verifier`, accounts=>{
    const {proof, inputs} = JSON.parse(fs.readFileSync("../zokrates/code/square/proof.json"));
    const owner = accounts[0];

    beforeEach(async()=>{
        this.contract = await Verifier.new({from:owner});
    })
    // - use the contents from proof.json generated from zokrates steps
    it('Verifier could return true when correct proof', async()=>{ 
        const verifyResult = await this.contract.verifyTx.call(proof.a, proof.b, proof.c, inputs);
        assert.equal(verifyResult, true, "verifier return false when correct proof was provided");
    })
    // Test verification with incorrect proof
    it(`Verifier could return false when incorrect proof`, async()=>{
        const fakeA = proof.c
        const verifyResult = await this.contract.verifyTx.call(fakeA, proof.b, proof.c, inputs)
        //const verifyResult = await this.contract.verifyTx.call(fakeA, proof.b, proof.c, inputs);
        assert.equal(verifyResult, false, "verifier return true when incorrect proof was provided");
    })
})