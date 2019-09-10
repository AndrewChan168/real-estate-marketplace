pragma solidity ^0.5.8;

import "./Ownable.sol";

//  TODO's: Create a Pausable contract that inherits from the Ownable contract
//  1) create a private '_paused' variable of type bool
//  2) create a public setter using the inherited onlyOwner modifier 
//  3) create an internal constructor that sets the _paused variable to false
//  4) create 'whenNotPaused' & 'paused' modifier that throws in the appropriate situation
//  5) create a Paused & Unpaused event that emits the address that triggered the event

contract ERC165 is Ownable{
    //  1) create a private '_paused' variable of type bool
    bool private _paused;

    //  2) create a public setter using the inherited onlyOwner modifier 
    function setPausedState(bool isPaused) public onlyOwner{
        if(_paused && !isPaused) emit UnpausedContract();
        if(!_paused && isPaused) emit PauseContract();
        _paused = isPaused;
    }

    //  4) create 'whenNotPaused' & 'paused' modifier that throws in the appropriate situation
    modifier whenNotPaused(){
        require(!_paused, "Contract must not be paused");
        _;
    }

    modifier paused(){
        require(_paused, "Contract must not be paused");
        _;
    }

    //  5) create a Paused & Unpaused event that emits the address that triggered the event
    event PauseContract();
    event UnpausedContract();

    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;
    /*
     * 0x01ffc9a7 ===
     *     bytes4(keccak256('supportsInterface(bytes4)'))
     */

    /**
     * @dev a mapping of interface id to whether or not it's supported
     */
    mapping(bytes4 => bool) private _supportedInterfaces;

    /**
     * @dev A contract implementing SupportsInterfaceWithLookup
     * implement ERC165 itself
     */
    constructor () internal {
        _registerInterface(_INTERFACE_ID_ERC165);
        //  3) create an internal constructor that sets the _paused variable to false
        _paused = false;
    }

    /**
     * @dev implement supportsInterface(bytes4) using a lookup table
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return _supportedInterfaces[interfaceId];
    }

    /**
     * @dev internal method for registering an interface
     */
    function _registerInterface(bytes4 interfaceId) internal {
        require(interfaceId != 0xffffffff);
        _supportedInterfaces[interfaceId] = true;
    }
}