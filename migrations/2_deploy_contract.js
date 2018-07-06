const TestToken = artifacts.require("./Escrow.sol");
//const TestToken = artifacts.require("./TestERC20.sol");

module.exports = function(deployer) {
  deployer.deploy(TestToken,"0x13838269a85922206ba2561c5e700460b2031f8c");
  //deployer.deploy(TestToken);
};