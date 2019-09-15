# Udacity Decentralised Real Estate Marketplace
In this project, I build a decentralized housing product basing on Ethereum. The Dapp fulfills ERC721 token standard and implemented with Zero-Knowledge proofs (zkSnarks project).

***
# Libraries used in this project
This project is implement on on Ethereum and is based on Truffle. The version of libraries used:
* __Truffle__: v5.0.33
* __Solidity__: v0.5.0
* __web3__: v1.2.1
* __openzeppelin-solidity__: v2.3.0
* __truffle-hdwallet-provider__: v1.0.7

***
# Install, test and deploy the project
### Install the packages
1. go to _eth-contracts_ directory 
```
cd /<path to real-estata-marketplace project>/eth-contracts
```
2. install all required packages
```js
npm install
```
### Use Zokrates to prepare verifier and proof json
###### 1. _Go to code directory and run docker for ZoKrates_
```
cd real-estate-marketplace/zokrates/code
docker run -v /<path to real-estata-marketplace project>/zokrates/code:/home/zokrates/code -ti zokrates/zokrates /bin/bash
```
###### 2. _Compile the square code_
```
~/zokrates compile -i ~/code/square/square.code
~/zokrates setup
```
###### 3. _Generate witness and proof and export verifier_
```
~/zokrates compute-witness -a 3 9
~/zokrates generate-proof
~/zokrates export-verifier
```
###### 4. _Move generated code from docker to local file system_
Open another terminal
```
docker cp <container ID>:/home/zokrates/out real-estate-marketplace/zokrates/code/square/ 
docker cp <container ID>:/home/zokrates/out.code real-estate-marketplace/zokrates/code/square/ 
docker cp <container ID>:/home/zokrates/proof.json real-estate-marketplace/zokrates/code/square/ 
docker cp <container ID>:/home/zokrates/proving.key real-estate-marketplace/zokrates/code/square/
docker cp <container ID>:/home/zokrates/verification.key real-estate-marketplace/zokrates/code/square/
docker cp <container ID>:/home/zokrates/verifier.sol real-estate-marketplace/zokrates/code/square/
docker cp <container ID>:/home/zokrates/witness real-estate-marketplace/zokrates/code/square/
```
###### 5. _Generate five more proof jsons_
```
~/zokrates compute-witness -a <a> <b>
~/zokrates generate-proof
docker cp <container ID>:/home/zokrates/proof.json real-estate-marketplace/zokrates/code/square/ 
```
### Test contracts
go to _eth-contracts_ directory 
```
cd /<path to real-estata-marketplace project>/eth-contracts
truffle comiple
truffle test
```
### Deploy contracts to Rinkeby testnet
```
truffle deploy --network rinkeby
```
### Use truffle to mint five more tokens
```
const fs = require('fs')
var proofJSON
var proof
var inputs

const owner = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
let verifier = await Verifier.at("0x68B99dAb984A3B8Bb3418c9CdD22E241E767F9Ba")
let contract = await SolnSquareVerifier.at("0xc698BE04c294954FeA22d5f7EeA5EefB7dFe6218")

//#1
proofJSON = JSON.parse(fs.readFileSync("../zokrates/code/square/proof1.json"))
proof = proofJSON.proof
inputs = proofJSON.inputs
await contract.mintNFT(owner, proof.a, proof.b, proof.c, inputs, {from:owner})

//#2
proofJSON = JSON.parse(fs.readFileSync("../zokrates/code/square/proof2.json"))
proof = proofJSON.proof
inputs = proofJSON.inputs
await contract.mintNFT(owner, proof.a, proof.b, proof.c, inputs, {from:owner})

//#3
proofJSON = JSON.parse(fs.readFileSync("../zokrates/code/square/proof3.json"))
proof = proofJSON.proof
inputs = proofJSON.inputs
await contract.mintNFT(owner, proof.a, proof.b, proof.c, inputs, {from:owner})

//#4
proofJSON = JSON.parse(fs.readFileSync("../zokrates/code/square/proof4.json"))
proof = proofJSON.proof
inputs = proofJSON.inputs
await contract.mintNFT(owner, proof.a, proof.b, proof.c, inputs, {from:owner})

//#5
proofJSON = JSON.parse(fs.readFileSync("../zokrates/code/square/proof5.json"))
proof = proofJSON.proof
inputs = proofJSON.inputs
await contract.mintNFT(owner, proof.a, proof.b, proof.c, inputs, {from:owner})
```

***
# Smart Contract address
Smart Contracts are deployed to __Rinkeby__ testnet.
* __SolnSquareVerifier__: 0xc698BE04c294954FeA22d5f7EeA5EefB7dFe6218
* __Verifier__: 0x68B99dAb984A3B8Bb3418c9CdD22E241E767F9Ba

***
# Assets list
https://rinkeby.opensea.io/assets/0xc698be04c294954fea22d5f7eea5eefb7dfe6218/1
https://rinkeby.opensea.io/assets/0xc698be04c294954fea22d5f7eea5eefb7dfe6218/2
https://rinkeby.opensea.io/assets/0xc698be04c294954fea22d5f7eea5eefb7dfe6218/3
https://rinkeby.opensea.io/assets/0xc698be04c294954fea22d5f7eea5eefb7dfe6218/4
https://rinkeby.opensea.io/assets/0xc698be04c294954fea22d5f7eea5eefb7dfe6218/5

***
# Some useful links
* [Deploy to testnet by truffle](https://medium.com/@jianjye/5-min-to-deploy-ethereum-smart-contract-to-ropsten-testnet-via-infura-35d556a4c87)
* [Opensea tutorial on medium](https://medium.com/opensea/how-to-create-your-own-marketplace-on-opensea-in-three-minutes-or-less-12373ca5818a)
* [Opensea tutorial on youtube](https://www.youtube.com/watch?v=lbXcvRx0o3Y)

***
# Project Resources
* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)
