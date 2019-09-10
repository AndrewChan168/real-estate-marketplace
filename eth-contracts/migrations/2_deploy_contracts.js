// migrating the appropriate contracts
//var SquareVerifier = artifacts.require("./SquareVerifier.sol");
//var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721Token = artifacts.require("./ERC721Token.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC721Token);
  //deployer.deploy(SquareVerifier);
  //deployer.deploy(SolnSquareVerifier);
};
