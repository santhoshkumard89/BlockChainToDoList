
const ToDoList = artifacts.require("ToDoList");

module.exports = function(deployer, network, accounts){
    console.log(network, accounts);
    deployer.deploy(ToDoList, {
        // parameters if any
        // from: '0x06490FD654bBC0AB1b186813f3191Ae0f6C064Ac',
        replace: true,
    });
}