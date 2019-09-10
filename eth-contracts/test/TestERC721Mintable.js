var ERC721Token = artifacts.require('ERC721Token');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const account_three = accounts[3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Token.new({from: owner});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, {from:owner});
            await this.contract.mint(account_two, 2, {from:owner});
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply.toNumber(), 2, "Total Supply is incorrect");
        })

        it('should get token balance', async function () { 
            const tokenBalance = await this.contract.balanceOf(account_two);
            assert.equal(tokenBalance.toNumber(), 1, "Token balance is incorrect");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const uri = await this.contract.tokenURI.call(1);
            const expectedURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            assert.equal(uri, expectedURI, "token URI is incorrect");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, 1, {from:account_one});
            const newOwner = await this.contract.ownerOf.call(1);
            assert.equal(newOwner, account_two, "Token could not be transfered");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Token.new({from: owner});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let couldFail = false;
            try{
                await this.contract.mint(account_three, 1, {from:account_three});
            } catch(err) {
                //console.log(err.message);
                couldFail=true;
            }
            assert.equal(couldFail,true, "contract could not fail to mint when it is not from token owner");
        })

        it('should return contract owner', async function () { 
            const contractOwner = await this.contract.getOwner.call();
            assert.equal(contractOwner, owner, "Contract owner is incorrect");
        })

    });
})