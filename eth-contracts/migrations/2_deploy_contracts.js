var Verifier = artifacts.require("./Verifier.sol");
var VerifierNext = artifacts.require("./VerifierNext.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(Verifier).then(()=>{
    return deployer.deploy(SolnSquareVerifier, Verifier.address)
  });
  
 deployer.deploy(VerifierNext);
};
