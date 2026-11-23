# Ethereum Local Lab

An isolated Ethereum sandbox for the accompanying notes. It uses [Foundry](https://book.getfoundry.sh/) for Solidity tooling and [Anvil](https://book.getfoundry.sh/anvil/) for a local, instant-mining Ethereum node. Nothing here connects to mainnet or needs real ETH.

## One-time prerequisite

Install Foundry using the [official installation instructions](https://book.getfoundry.sh/getting-started/installation). Confirm the three commands are available:

```sh
forge --version
anvil --version
cast --version
```

The lab intentionally has no library dependencies. Foundry downloads the pinned Solidity compiler on first build if it is not already installed.

## First pass: compile and test

From this directory:

```sh
forge build
forge test -vvv
```

Read [`src/Counter.sol`](src/Counter.sol), then make one small change and write a test first in [`test/Counter.t.sol`](test/Counter.t.sol). Test contracts do not become part of a deployment.

## Run a local chain

In a separate terminal, from any directory:

```sh
anvil
```

Anvil starts a fresh local node at `http://127.0.0.1:8545`, creates pre-funded disposable accounts, and mines submitted transactions immediately. Stopping it resets its state unless you explicitly configure persistence.

Copy the private key for one of the accounts **printed by that Anvil process**. It is valid only for this local chain; never use or paste a real wallet key.

```sh
cd notes/ethereum/labs
cp .env.example .env
# Edit .env and set ANVIL_PRIVATE_KEY to an Anvil key.
set -a; source .env; set +a
forge script script/Deploy.s.sol:Deploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

The command prints the new `Counter` address. Assign it once in the terminal where you want to interact with it:

```sh
export COUNTER_ADDRESS=0xPASTE_THE_DEPLOYED_CONTRACT_ADDRESS
```

## Inspect and change state

`cast call` performs a free, read-only RPC query. `cast send` signs and broadcasts a transaction, changing Anvil's state.

```sh
# Read the current value (starts at 0).
cast call "$COUNTER_ADDRESS" "number()(uint256)" --rpc-url http://127.0.0.1:8545

# Change it. Shell loads only the disposable key from .env.
set -a; source .env; set +a
cast send "$COUNTER_ADDRESS" "setNumber(uint256)" 42 \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --rpc-url http://127.0.0.1:8545

# Verify the next state.
cast call "$COUNTER_ADDRESS" "number()(uint256)" --rpc-url http://127.0.0.1:8545
```

Try `increment()` next, then inspect the transaction hash Anvil prints with `cast receipt <tx-hash> --rpc-url http://127.0.0.1:8545`. Compare the state change, logs, gas used, and receipt status with the transaction-lifecycle section of [Ethereum basics](../ethereum-basics.md#transaction-lifecycle).

## Experiments

1. Run `forge test --gas-report` and compare the gas used by `setNumber` and `increment`.
2. Change `increment` to add 2; update the test before rerunning it.
3. Call `increment()` twice with `cast send`, then query `number()` after each call.
4. Stop and restart Anvil. Notice that its unpersisted chain and deployed contract disappear.
5. Add a restricted function and see how authorization is enforced by contract code—not by the fact that an address looks familiar.

## Safety boundary

- `.env`, compiler output, cache, and deployment artifacts are ignored by Git.
- Anvil keys are test-only. A real private key or seed phrase must never be placed in this repository, a command history, or a chat.
- This is a development chain, not a simulation of production security. It has instant blocks, no real economic stake, and no adversarial network conditions.
