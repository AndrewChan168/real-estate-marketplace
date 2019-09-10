pragma solidity >=0.4.21 <0.6.0;
import "./ERC721Token.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./Verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Token{
    Verifier private verifier;
    constructor(address verifierAddress) public {
        verifier = Verifier(verifierAddress);
    }
// TODO define a solutions struct that can hold an index & an address
    struct Solution{
        uint index;
        address solver;
    }

// TODO define an array of the above struct
    Solution[] private solutions;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32=>Solution) private distinctSolution;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(uint index, address solver);

// TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint index, address solver, bytes32 hashedSolution) public{
        Solution memory solution = Solution(index, solver);
        solutions.push(solution);
        distinctSolution[hashedSolution] = solution;

        emit SolutionAdded(index, solver);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function hashSolution(
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) public view returns(bytes32){
        return keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
    }

    function mintNFT(
        address to,
        uint tokenID,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input
    ) public returns (bool){
        bytes32 hashedSolution = hashSolution(a, a_p, b, b_p, c, c_p, h, k, input);
        bool verified = verifier.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);
        require(verified, "Solution could not be verified");
        require(solutions[hashedSolution].solver == address(0), "Solution has been solved before");
        addSolution(tokenID, to, hashedSolution);
        return mint(to, tokenID);
    }
}


























