# VealthX Smart Contract Documentation

## Vault Module (`vealthx::vault`)

The core smart contract implementing VealthX's collateralized lending functionality.

### Overview

The Vault module enables users to:
- Deposit collateral (AptosCoin as RWA proxy)
- Borrow against their collateral with 150% collateral ratio requirement
- Track collateral and borrowed amounts securely

### Data Structures

#### `Vault` Struct
```move
struct Vault has key {
    collateral: coin::Coin<AptosCoin>,  // User's deposited collateral
    borrowed: u64,                      // Amount borrowed by user
}
```

**Abilities:**
- `key`: Stored as a resource in user's account

### Public Functions

#### `init_vault(account: &signer)`
Initializes an empty vault for a new user.

**Parameters:**
- `account`: The signer creating the vault

**Effects:**
- Creates a new Vault resource with zero collateral and borrowed amount
- Moves the vault to the user's account

**Usage:**
```move
vault::init_vault(account);
```

#### `deposit(account: &signer, amount: u64)`
Deposits AptosCoin into the user's vault as collateral.

**Parameters:**
- `account`: The signer depositing funds
- `amount`: Amount of AptosCoin to deposit

**Effects:**
- Withdraws `amount` from user's account
- Adds the coins to their vault's collateral

**Requirements:**
- User must have sufficient balance
- Vault must be initialized

**Usage:**
```move
vault::deposit(account, 1000); // Deposit 1000 APT
```

#### `borrow(account: &signer, amount: u64)`
Allows users to borrow against their collateral.

**Parameters:**
- `account`: The signer requesting the loan
- `amount`: Amount to borrow

**Effects:**
- Increases user's borrowed balance
- Transfers borrowed amount from vault collateral to user's account

**Requirements:**
- Collateral must be ≥ 150% of requested borrow amount
- User must have a vault with sufficient collateral

**Collateral Ratio Calculation:**
```
Required Collateral = Borrow Amount × 150%
```

**Error Codes:**
- `1`: Insufficient collateral (collateral < 150% of borrow amount)

**Usage:**
```move
vault::borrow(account, 500); // Borrow 500 APT (requires 750+ APT collateral)
```

#### `get_vault(account: address): (u64, u64)`
Read-only function to view vault state.

**Parameters:**
- `account`: Address to query

**Returns:**
- `(collateral_value, borrowed_amount)`: Tuple of current collateral and borrowed amounts

**Usage:**
```move
let (collateral, borrowed) = vault::get_vault(@0x123);
```

### Security Features

#### Collateral Requirements
- **150% Minimum Ratio**: Ensures over-collateralization for safety
- **Real-time Validation**: Checked on every borrow operation
- **Atomic Operations**: All state changes happen atomically

#### Access Control
- **Signer Required**: All state-changing functions require user signature
- **Resource Ownership**: Each user owns their vault resource
- **No Admin Privileges**: Decentralized design with no special admin functions

### Example Usage Flow

```move
// 1. Initialize vault
vault::init_vault(user);

// 2. Deposit collateral
vault::deposit(user, 1000); // Deposit 1000 APT

// 3. Borrow against collateral
vault::borrow(user, 600); // Borrow 600 APT (requires 900+ APT collateral)

// 4. Check vault state
let (collateral, borrowed) = vault::get_vault(user_address);
// collateral = 400 APT (1000 - 600)
// borrowed = 600 APT
```

### Mathematical Model

#### Collateral Ratio Formula
```
Collateral Ratio = (Collateral Value / Borrowed Amount) × 100
Minimum Required Ratio = 150%
```

#### Borrowing Capacity
```
Max Borrow = Collateral Value / 1.5
```

### Integration Notes

#### Frontend Integration
- Use `get_vault()` for displaying user's position
- Call `init_vault()` for new users
- Implement collateral ratio warnings in UI

#### Future Extensions
- Liquidation mechanisms (Day 8+)
- Multi-asset collateral support
- Dynamic interest rates
- Yield optimization routing

### Testing

Basic functionality tested in `tests/vault_test.move`:
- ✅ Vault initialization
- ✅ State reading functionality
- 🔄 Full integration tests (requires complex coin setup)

### Error Handling

| Error Code | Description | Solution |
|------------|-------------|----------|
| 1 | Insufficient collateral | Deposit more collateral or borrow less |
| Resource errors | Vault not initialized | Call `init_vault()` first |
| Coin errors | Insufficient balance | Ensure account has enough APT |

---

**Last Updated:** August 30, 2025 (Day 7)  
**Contract Version:** 0.2.0  
**Status:** ✅ Deposit & Borrow functionality complete
