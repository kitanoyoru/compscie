// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Counter} from "../src/Counter.sol";

/// @notice Forge treats public or external functions starting with `test` as tests.
/// @dev This stays dependency-free on purpose: a failed `require` fails the test.
contract CounterTest {
    Counter private counter;

    function setUp() public {
        counter = new Counter();
    }

    function testStartsAtZero() public view {
        require(counter.number() == 0, "counter should start at zero");
    }

    function testSetNumber() public {
        counter.setNumber(42);
        require(counter.number() == 42, "setNumber should persist state");
    }

    function testIncrement() public {
        counter.increment();
        counter.increment();
        require(counter.number() == 2, "increment should add one");
    }
}
