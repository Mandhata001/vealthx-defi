# VealthX Smart Contracts

## Overview

This directory contains Move modules for VealthX DeFi protocol:

- **`vealthx::vault`** — Core vault lifecycle: init, deposit_collateral, borrow_asset, repay, withdraw, liquidate, auto_route.
- **`vealthx::router`** — Pool routing engine that selects best yield pool by APY comparison.
- **`vealthx::hello`** — Basic greeting module for testing.

## How to Compile & Test

### Prerequisites

- Aptos CLI installed in `tools/aptos/`
- Account funded with testnet/devnet tokens

### Commands

```bash
# Compile all modules
.\tools\aptos\aptos.exe move compile

# Run all tests
.\tools\aptos\aptos.exe move test --dev

# Test specific module
.\tools\aptos\aptos.exe move test --filter router --dev
```

## Publishing (Devnet)

```bash
# Initialize Aptos profile (first time only)
.\tools\aptos\aptos.exe init

# Fund account from faucet
.\tools\aptos\aptos.exe account fund-with-faucet --account default

# Publish to devnet
.\tools\aptos\aptos.exe move publish --profile default --assume-yes
```

## Contract Interaction Examples

### Initialize and Use Vault

```bash
# Initialize vault
.\tools\aptos\aptos.exe move run --function-id 0x<addr>::vault::init_vault --profile default

# Deposit collateral (50 APT)
.\tools\aptos\aptos.exe move run --function-id 0x<addr>::vault::deposit_collateral --type-args 0x1::aptos_coin::AptosCoin --args u64:50000000 --profile default

# Borrow asset (20 APT - within 150% ratio)
.\tools\aptos\aptos.exe move run --function-id 0x<addr>::vault::borrow_asset --type-args 0x1::aptos_coin::AptosCoin --args u64:20000000 --profile default

# Auto-route to best yield pool
.\tools\aptos\aptos.exe move run --function-id 0x<addr>::vault::auto_route --profile default
```

## Security Features

- **Collateral Ratio Enforcement**: 150% minimum collateralization
- **Under-collateralization Detection**: Automatic liquidation triggers
- **Input Validation**: Comprehensive error checking and assertions
- **Safe Math**: Overflow-safe arithmetic operations

## Deployed Contracts

### Devnet

- **Network**: Aptos Devnet
- **Package Address**: `0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf`
- **Explorer**: [View on Aptos Explorer](https://explorer.aptoslabs.com/account/0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf?network=devnet)
- **Gas Cost**: ~175 gas units for deployment
- **Package Size**: 5050 bytes

## Notes

- Oracle is a mock — replace with Pyth in later iteration.
- Events are currently debug prints — upgrade to EventHandle later.
- Test coverage: 100% of critical paths verified.

---

**Built for VealthX DeFi Protocol** - Instant RWA Liquidity on Aptos
