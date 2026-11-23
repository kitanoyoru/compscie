// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Counter} from "../src/Counter.sol";

/// @dev Minimal subset of Foundry's cheatcode interface needed for broadcasting.
interface Vm {
    function envUint(string calldata name) external returns (uint256 value);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

/// @notice Deploys Counter to the RPC endpoint passed to `forge script`.
/// @dev ANVIL_PRIVATE_KEY must be a disposable Anvil account, never a real key.
contract Deploy {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external returns (Counter counter) {
        uint256 deployerPrivateKey = vm.envUint("ANVIL_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        counter = new Counter();
        vm.stopBroadcast();
    }
}
