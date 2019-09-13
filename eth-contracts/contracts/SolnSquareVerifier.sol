pragma solidity >=0.4.21 <0.6.0;
import "./ERC721Token.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
//import "./Verifier.sol";
contract VerifierInterface {
    function verifyTx(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[2] calldata inputs
    ) external returns (bool result);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Token{
    VerifierInterface private verifier;
    uint private tokenID;
    address private contractOwner;

    constructor(address _verifierAddress) public {
        tokenID = 1;
        contractOwner = msg.sender;
        verifier = VerifierInterface(_verifierAddress);
    }

    function setVerifier(address verifierAddress) public{
        require(contractOwner==msg.sender, "Only contract owner could set Verifier");
        require(verifierAddress!=address(0), "Verifier address is invalid");
        verifier = VerifierInterface(verifierAddress);
    }
// TODO define a solutions struct that can hold an index & an address
    struct Solution{
        uint index;
        address solver;
        address verifierAddress;
    }

// TODO define an array of the above struct
    Solution[] private solutions;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32=>Solution) private distinctSolution;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(uint index, address solver);

// TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address solver, bytes32 hashedSolution, address verifierAddress) public returns(uint _tokenID){
        _tokenID = tokenID;
        Solution memory solution = Solution(tokenID, solver, verifierAddress);
        solutions.push(solution);
        distinctSolution[hashedSolution] = solution;
        emit SolutionAdded(tokenID, solver);
        tokenID += 1;
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function hashSolution(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory inputs
    ) public pure returns(bytes32){
        return keccak256(abi.encodePacked(a, b, c, inputs));
    }

    function verify(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory inputs
    ) public returns(bool){
        return verifier.verifyTx(a, b, c, inputs);
    }

    function mintNFT(
        address to,
        address verifierAddress,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory inputs
    ) public returns (bool){
        bytes32 hashedSolution = hashSolution(a, b, c, inputs);
        require(verifierAddress!=address(0), "Address of verifier is invalid");
        setVerifier(verifierAddress);
        bool verified = verifier.verifyTx(a, b, c, inputs);
        require(verified, "Solution could not be verified");
        require(distinctSolution[hashedSolution].solver == address(0), "Solution has been solved before");
        addSolution(to, hashedSolution, verifierAddress);
        bool mintResult = mint(to, tokenID);
        return mintResult;
    }

    function getLatestTokenID() public view returns(uint){
        return tokenID;
    }

    function getSoluction(bytes32 _hash) public view returns(uint index, address solver){
        index = distinctSolution[_hash].index;
        solver = distinctSolution[_hash].solver;
    }
}