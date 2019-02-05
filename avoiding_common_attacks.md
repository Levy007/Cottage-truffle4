The Cottage.sol file includesa self destructing function that is used to destroy contracts if ever there are issues

 // deactivate the contract
   function kill() public onlyOwner {
    selfdestruct(owner);
  }
  
  The kill function was implemented in the contract itself so as in case there is an issue in the blockchain, the administrator can delete it easily without permission as it is programmed in the contract itself insteadin other parts of the blockchain which could be easily manipulated or tampered with.
