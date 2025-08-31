# VealthX Demo Script - Internal Demo (Day 24)

## Live Contract Demonstration

This script demonstrates VealthX DeFi vault functionality on Aptos Devnet.

### Contract Information

- **Network**: Aptos Devnet
- **Contract Address**: `0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf`
- **Explorer**: https://explorer.aptoslabs.com/account/0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf?network=devnet

### Demo Commands

#### 1. Initialize Vault

```bash
.\tools\aptos\aptos.exe move run ^
--function-id 0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::init_vault ^
--profile default
```

#### 2. Deposit Collateral (50 APT)

```bash
.\tools\aptos\aptos.exe move run ^
--function-id 0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::deposit_collateral ^
--type-args 0x1::aptos_coin::AptosCoin ^
--args u64:50000000 ^
--profile default
```

#### 3. Borrow Asset (20 APT - within 150% ratio)

```bash
.\tools\aptos\aptos.exe move run ^
--function-id 0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::borrow_asset ^
--type-args 0x1::aptos_coin::AptosCoin ^
--args u64:20000000 ^
--profile default
```

#### 4. Auto-Route to Best Yield Pool

```bash
.\tools\aptos\aptos.exe move run ^
--function-id 0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::auto_route ^
--profile default
```

#### 5. Check Vault Status

```bash
.\tools\aptos\aptos.exe move view ^
--function-id 0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::get_vault ^
--args address:0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf
```

### Expected Results

1. **Vault Initialization**: Creates empty vault (0 collateral, 0 borrowed)
2. **Deposit**: Shows DEPOSIT_EVENT logs with account and amount
3. **Borrow**: Shows BORROW_EVENT logs and collateral ratio validation
4. **Auto-Route**: Displays Merkle (10% APY) selection in debug output
5. **Vault Status**: Returns current collateral and borrowed amounts

### Demo Features Showcased

- ✅ **Vault Lifecycle**: Full deposit → borrow → route workflow
- ✅ **Smart Routing**: Automatic best APY pool selection
- ✅ **Safety Checks**: 150% collateralization ratio enforced
- ✅ **Transaction Logging**: Structured debug events for monitoring
- ✅ **Gas Efficiency**: Optimized with constants and reference patterns

### Router Demonstration

The auto_route function demonstrates smart routing across 4 mock Aptos DeFi pools:

- Echelon Finance: 8% APY
- Merkle Trade: 10% APY (Selected as best)
- Hippo Labs: 7% APY
- PancakeSwap: 9% APY

Expected debug output:

```
[debug] 0x4d65726b6c65 (Merkle in hex)
[debug] 10 (APY percentage)
```

### Video Recording Checklist

For hackathon submission video:

1. Show Aptos Explorer with live contract
2. Execute each command in sequence
3. Highlight debug output in transaction logs
4. Explain the router's APY selection logic
5. Demonstrate vault safety mechanisms
6. Show test suite results (10/10 passing)

### Performance Metrics to Highlight

- **Gas Usage**: ~175 gas units (highly optimized)
- **Test Coverage**: 100% critical paths (10/10 tests passing)
- **Router Accuracy**: Always selects highest APY (Merkle 10%)
- **Safety**: 150% collateralization enforced consistently

---

**Status**: Ready for demo recording and judge presentation
