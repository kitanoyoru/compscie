---
title: Ethereum
status: active
started: 2026-11-23
focus: Build a precise mental model of Ethereum's state machine and transaction lifecycle.
next: Learn accounts, keys, and wallets; then follow one transaction from signing through finalization.
concepts: Blockchain foundations, Ethereum state, Accounts and transactions, EVM, Gas and fees, Consensus, Smart contracts, Layer 2
---

# Ethereum

<!-- status: planned | active | paused | done. The root README reads the block above.
     concepts: comma-separated, in the order the Knowledge Map draws them; each note lists the ones it covers. -->

These notes start from protocol fundamentals, then move toward reading, deploying, and safely interacting with smart contracts.

## Why I'm learning this

- Explain what a wallet, transaction, block, validator, and smart contract actually do.
- Reason about state changes, gas costs, finality, and common security boundaries before writing Solidity.
- Build small applications against Ethereum testnets without treating a wallet or RPC provider as a trusted black box.

## Learning path

1. [Ethereum basics](ethereum-basics.md) — network model, state, transactions, blocks, and finality.
2. Accounts, keys, wallets, and signatures.
3. The EVM: bytecode, calldata, storage, logs, and contract calls.
4. Gas, EIP-1559 fees, and transaction lifecycle.
5. Solidity fundamentals and secure-contract patterns.
6. Layer 2s, bridges, and the trust assumptions they add.

## Local lab

The [Foundry / Anvil local lab](labs/README.md) is a self-contained sandbox for compiling, testing, deploying, and calling a deliberately small contract. It never needs a real wallet or funds.

## Resources

- Official docs: [ethereum.org developer documentation](https://ethereum.org/developers/docs/)
- Protocol specifications: [Execution specs](https://ethereum.github.io/execution-specs/), [Consensus specs](https://ethereum.github.io/consensus-specs/)
- Reference: [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)

## Notes

One file per note, flat in this folder. Start one with `make note TOPIC=ethereum NOTE=<slug>`; the list below rebuilds on commit.

<!-- notes:start - generated, newest first -->

- 2026-11-23 - [Ethereum basics](ethereum-basics.md)

<!-- notes:end -->

## Working rules

- Treat a private key or seed phrase as permanently secret; never put one in a note, commit, screenshot, or chat.
- Use testnets and disposable accounts for experiments until the asset and contract-risk models are understood.
- Separate protocol guarantees from wallet, RPC-provider, bridge, and application assumptions.
