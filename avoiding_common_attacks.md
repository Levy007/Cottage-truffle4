The Cottage.sol file includesa self destructing function that is used to destroy contracts if ever there are issues

 // deactivate the contract
   function kill() public onlyOwner {
    selfdestruct(owner);
  }
