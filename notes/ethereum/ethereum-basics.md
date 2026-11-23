---
date: 2026-11-23
concepts: Blockchain foundations, Ethereum state, Accounts and transactions, Consensus
---

# Ethereum basics

> Ethereum is a shared, replicated state machine: signed transactions deterministically change its state, and proof-of-stake consensus lets independently operated nodes agree on their ordered history. Ether is its native asset; smart contracts are programs whose code and persistent storage live in that shared state.

## Questions this answers

- What problem does Ethereum solve beyond sending ETH?
- What is the difference between the blockchain, the current state, and a block?
- What happens between signing a transaction and reaching finality?
- Why are execution and consensus separate, and why does gas exist?

## The mental model

Ethereum is not a distributed hard drive and not just a payments network. It is a deterministic state-transition system replicated by many nodes.

At a point in time, its **state** includes accounts, their ETH balances and nonces, deployed contract code, and contract storage. A valid transaction is a signed instruction that proposes a state change. Nodes independently run the same transaction against the same prior state; if the transaction is included in the agreed chain, they reach the same next state.

```
signed transaction → pending at nodes → proposed in a block
                   → independently executed → attested to → finalized
```

The **blockchain** is the ordered, tamper-evident history used to agree on those state transitions. The current state is the result of applying that history. A block is a batch of transactions plus the data needed for nodes to verify and place it in that history.

## The main pieces

| Piece       | Role                                                          | Important distinction                                                                                 |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Account     | Holds ETH and has an address                                  | An externally owned account is controlled by a signing key; a contract account is controlled by code. |
| Transaction | Signed, state-changing instruction                            | A read-only query to a node is not an on-chain transaction and normally needs no gas.                 |
| EVM         | Deterministic runtime that executes contract bytecode         | Every full execution node can re-execute the same call and verify its result.                         |
| Gas         | Unit measuring work performed by execution                    | Gas is not a currency; the fee is gas used multiplied by the applicable gas price.                    |
| Block       | Proposed batch of state transitions                           | Inclusion means it is in a block; finality is a stronger, later confidence threshold.                 |
| Validator   | Proof-of-stake participant that proposes or attests to blocks | A validator is not a wallet and is not every node.                                                    |

## Transaction lifecycle

1. A wallet constructs a transaction: recipient or contract, value, data, nonce, gas limit, and fee settings.
2. The account holder signs it with the private key. The signature lets nodes recover and verify the sender without publishing the key.
3. A node checks basic validity and shares it with peers. Each node maintains its own pending-transaction pool; there is no single global mempool.
4. The validator selected to propose a block obtains an execution payload, and the transaction may be included and executed by the EVM.
5. Other nodes re-execute the payload and validators attest if it is valid and is the correct next block under fork choice.
6. After the consensus protocol finalizes the relevant checkpoints, reversing that transaction would require an exceptional failure of Ethereum's security assumptions.

An included transaction can still fail during EVM execution—for example, a contract can revert or the call can run out of gas. In that case its intended contract-state changes do not persist, but it still consumed network work and the sender still pays for gas used.

## Execution and consensus

Modern Ethereum has cooperating layers, not separate "Ethereum 1" and "Ethereum 2" networks:

- The **execution layer** validates transactions, runs the EVM, tracks account/contract state, and holds a local transaction pool.
- The **consensus layer** runs proof-of-stake, chooses the chain head, and coordinates attestations and finality.

Node operators run an execution client and a consensus client together. A validator client is added when the node participates in proposing and attesting to blocks. The layers communicate locally through the Engine API.

## Why gas and fees exist

Without a cost for computation, an attacker could ask every node to perform unlimited work or store unlimited data. Gas makes every EVM operation metered, bounds computation per transaction, and prices scarce block space.

For a typical post-EIP-1559 transaction, the total fee is approximately:

```
gas used × (base fee + priority fee)
```

The protocol burns the base fee; the priority fee rewards the block proposer. The gas limit is a cap on units of gas the sender is prepared to let the transaction consume, not the fee itself. Fee-market details and transaction types deserve their own note.

## What Ethereum does and does not guarantee

Ethereum's protocol can verify signatures, execute deterministic code, and establish a highly secure ordering of state changes under its consensus assumptions. It does **not** guarantee that a smart contract is safe, a token has value, a user understood a signature, an RPC provider is honest, or a bridge is secure. Those are separate trust and security questions.

...

## Gotchas

- **Address ≠ identity.** An address identifies an account in the protocol, not a human or organization.
- **Wallet ≠ account.** A wallet manages keys and signs requests; accounts exist in Ethereum state.
- **A transaction can be mined but fail.** Inclusion does not mean the called contract operation succeeded.
- **"Confirmed" and "finalized" differ.** Applications choose a risk tolerance for confirmations; protocol finality is stronger.
- **Proof of stake did not make gas cheap.** Fees respond primarily to demand for block space and execution resources.
- **Never share a seed phrase or private key.** Anyone with it can control the assets protected by it.

## Open questions

- How are Ethereum addresses derived from public keys, and how do nonces prevent replay and ordering mistakes?
- Which EVM state changes persist after `revert`, and which costs remain?
- What exact trust assumptions differ among an RPC provider, a light client, a rollup, and a bridge?
- How do EIP-1559 base-fee updates and priority fees affect replacement and inclusion of a transaction?

## Sources

- [Technical introduction to Ethereum](https://ethereum.org/developers/docs/intro-to-ethereum/) — state, accounts, transactions, and the EVM.
- [Ethereum transactions](https://ethereum.org/developers/docs/transactions/) — transaction execution and failure behavior.
- [Gas and fees](https://ethereum.org/developers/docs/gas/) — gas as metered computation and fees.
- [Consensus mechanisms](https://ethereum.org/developers/docs/consensus-mechanisms/) — proof of stake, block production, fork choice, and finality.
- [Nodes and clients](https://ethereum.org/developers/docs/nodes-and-clients/) — execution, consensus, and validator-client responsibilities.

## Try it

Use the [local Foundry / Anvil lab](labs/README.md) after reading this note. It makes the transaction lifecycle tangible without a real network, wallet, or funds.
