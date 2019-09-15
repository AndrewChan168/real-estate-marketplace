const fs = require('fs');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
/*const Verifier1 = artifacts.require('Verifier1');
const Verifier2 = artifacts.require('Verifier2');*/

contract(`Test Soln Square Verifier`, accounts=>{
    const owner = accounts[0]
    const account1 = accounts[1]

    var proof;
    var inputs;

    beforeEach(async()=>{
        this.verifier = await Verifier.new({from:owner});
        /*this.verifier1 = await Verifier1.new({from:owner});
        this.verifier2 = await Verifier2.new({from:owner});*/
        this.contract = await SolnSquareVerifier.new(this.verifier.address, {from:owner});
    });

    it(`ERC721 token will be minted for contract when correct proof provded`, async()=>{
        let proofJson = JSON.parse(fs.readFileSync("../zokrates/code/square/proof.json"));
        proof = proofJson.proof;
        inputs = proofJson.inputs;

        let canMint = true;
        try{
            await this.contract.mintNFT(account1, proof.a, proof.b, proof.c, inputs, {from:owner});
        }catch(err){
            canMint = false;
            console.log(err.message);
        }
        assert.equal(canMint, true, "cannot be minted when correct proof provded");
    });

    it(`ERC721 token will not be minted for contract when proof is incorrect`, async()=>{
        /*let proofJson1 = JSON.parse(fs.readFileSync("../zokrates/code/square/proof1.json"));
        proof = proofJson1.proof;
        inputs = proofJson1.inputs;*/
        let proofJson = JSON.parse(fs.readFileSync("../zokrates/code/square/proof.json"));
        proof = proofJson.proof;
        inputs = proofJson.inputs;
        
        let canMint = true;
        try{
            await this.contract.mintNFT(account1, proof.c, proof.b, proof.c, inputs, {from:owner});
        }catch(err){
            canMint = false;
            console.log(err.message);
        }
        assert.equal(canMint, false, "can be minted when incorrect proof provded");
    });

    it(`ERC721 token could mint for several different proofs`, async()=>{
        let proofJson = JSON.parse(fs.readFileSync("../zokrates/code/square/proofNext.json"));
        proof = proofJson.proof;
        inputs = proofJson.inputs;
        let canMint;
        canMint = true;
        try{
            //await this.contract.setVerifier(this.verifier1.address, {from:owner});
            await this.contract.mintNFT(account1, proof.a, proof.b, proof.c, inputs, {from:owner});
        }catch(err){
            canMint = false;
            console.log(err.message);
        }
        assert.equal(canMint, true, "cannot be minted when correct proof-Next provded");
    });

    it(`ERC721 could mint for 5 more tokens with different proof`, async()=>{
        var canMint;
        var proofJson;
        for(let i=1;i<=5;i++){
            proofJson = JSON.parse(fs.readFileSync(`../zokrates/code/square/proof${i}.json`));
            proof = proofJson.proof;
            inputs = proofJson.inputs;
            canMint = true;
            try{
                await this.contract.mintNFT(account1, proof.a, proof.b, proof.c, inputs, {from:owner});
            }catch(err){
                canMint = false;
                console.log(`At token-${i} with error:${err.message}`); 
            }
            assert.equal(canMint, true, `cannot be minted for token-${i}`);
        }
    });
});