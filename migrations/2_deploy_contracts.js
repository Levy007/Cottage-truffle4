var Cottage = artifacts.require("./Cottage.sol");

module.exports = function(deployer) {
  deployer.deploy(Cottage);
}
