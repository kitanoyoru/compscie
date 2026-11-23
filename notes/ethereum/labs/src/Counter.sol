// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @notice A deliberately small contract for local experiments.
/// @dev Anyone can change this counter. That is a feature of the lab, not a
///      pattern to copy into a real application.
contract Counter {
    uint256 public number;

    event NumberChanged(uint256 indexed previousNumber, uint256 indexed newNumber);

    function setNumber(uint256 newNumber) external {
        uint256 previousNumber = number;
        number = newNumber;
        emit NumberChanged(previousNumber, newNumber);
    }

    function increment() external {
        uint256 previousNumber = number;
        number = previousNumber + 1;
        emit NumberChanged(previousNumber, number);
    }
}
