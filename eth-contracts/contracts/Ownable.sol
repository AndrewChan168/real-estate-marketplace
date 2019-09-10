pragma solidity ^0.5.8;

contract Ownable {
    //  5) create an event that emits anytime ownerShip is transfered (including in the constructor)
    event TransferOwnership(address indexed oldOwner, address indexed newOwner);
    
    //  1) create a private '_owner' variable of type address with a public getter function
    address private _owner;
    function getOwner() public view returns(address){
        return _owner;
    }

    //  2) create an internal constructor that sets the _owner var to the creater of the contract 
    constructor() public{
        _owner = msg.sender;
    }

    //  3) create an 'onlyOwner' modifier that throws if called by any account other than the owner.
    modifier onlyOwner(){
        require(msg.sender==_owner,"Only owner of contract could call this function");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        // TODO add functionality to transfer control of the contract to a newOwner.
        // make sure the new owner is a real address
        require(newOwner!=address(0), "New owner could not be blank");
        address oldOwner = _owner;
        _owner = newOwner;
        emit TransferOwnership(oldOwner, newOwner);
    }
}