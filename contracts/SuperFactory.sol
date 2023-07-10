// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import { FlowSplitter } from "./FlowSplitter.sol";
import { ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

contract SuperFactory {



    address public superTokenAddress=0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f;
    address public hostAddress=0xEB796bdb90fFA0f28255275e16936D25d3418603;

    mapping(address => address[]) private deployedSplitters ;

    

    function createNewSplitter( address _mainReceiver, address _sideReceiver,int96 _sideReceiverPortion) external returns (address) {

        FlowSplitter splitter = new FlowSplitter(_mainReceiver,_sideReceiver,_sideReceiverPortion,ISuperToken(superTokenAddress),ISuperfluid(hostAddress));

        deployedSplitters[msg.sender].push(address(splitter));

        return address(splitter);
    }

    function getDesployedSplitters(address deployer) external view returns (address[] memory){

        return deployedSplitters[deployer];
    }
}