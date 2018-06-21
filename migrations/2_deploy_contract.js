const TestToken = artifacts.require("./AxpireToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TestToken);
};