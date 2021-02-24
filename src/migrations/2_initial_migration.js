const ERC20 = artifacts.require("ERC20");

module.exports = function (deployer) {
  deployer.deploy(ERC20,"RockToken" , 0 ,"Rock" , 1000000000000);
};
