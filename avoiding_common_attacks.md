The Cottage.sol file includesa self destructing function that is used to destroy contracts if ever there are issues

 36// deactivate the contract
 37   function kill() public onlyOwner {
 38    selfdestruct(owner);
 39  }
