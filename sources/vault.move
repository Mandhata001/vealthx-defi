module vealthfx::vault {

    use std::signer;
    use aptos_framework::coin;

    /// Error codes
    const VAULT_NOT_EXISTS: u64 = 1;
    const INSUFFICIENT_COLLATERAL: u64 = 2;

    /// A Vault stores user collateral + borrowed balance
    struct Vault has key {
        collateral: u64,
        borrowed: u64,
    }

    /// Initialize a vault for new users
    public entry fun init_vault(account: &signer) {
        move_to(account, Vault {
            collateral: 0,
            borrowed: 0,
        });
    }

    /// Deposit collateral into vault
    public entry fun deposit_collateral<CoinType>(account: &signer, amount: u64) acquires Vault {
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault = borrow_global_mut<Vault>(signer::address_of(account));
        let deposit_coin = coin::withdraw<CoinType>(account, amount);
        
        // For now, we'll just track the amount (in a real implementation, 
        // we'd store the actual coins or convert to a standard value)
        vault.collateral = vault.collateral + amount;
        
        // In a real vault, we'd store these coins somewhere secure
        coin::deposit(@vealthfx, deposit_coin);
    }

    /// Borrow asset against collateral (simplified for testing)
    public entry fun borrow_asset<CoinType>(account: &signer, amount: u64) acquires Vault {
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault = borrow_global_mut<Vault>(signer::address_of(account));

        // Require 150% collateral ratio (simplified: assuming 1:1 price ratio)
        let required_collateral = (amount * 150) / 100;
        assert!(vault.collateral >= required_collateral, INSUFFICIENT_COLLATERAL);

        vault.borrowed = vault.borrowed + amount;
        
        // For testing, we'll just track the borrowed amount
        // In a real implementation, this would transfer tokens from a liquidity pool
    }

    /// Repay borrowed asset
    public fun repay<CoinType>(account: &signer, amount: u64) acquires Vault {
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault = borrow_global_mut<Vault>(signer::address_of(account));
        assert!(vault.borrowed >= amount, 3); // INSUFFICIENT_DEBT
        
        let repay_coin = coin::withdraw<CoinType>(account, amount);
        vault.borrowed = vault.borrowed - amount;
        
        // Return to protocol reserves
        coin::deposit(@vealthfx, repay_coin);
    }

    /// Withdraw collateral (only if sufficient remains for borrowed amount)
    public fun withdraw_collateral<CoinType>(account: &signer, amount: u64) acquires Vault {
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault = borrow_global_mut<Vault>(signer::address_of(account));
        assert!(vault.collateral >= amount, 4); // INSUFFICIENT_COLLATERAL_BALANCE
        
        // Check that remaining collateral still satisfies 150% ratio
        let remaining_collateral = vault.collateral - amount;
        if (vault.borrowed > 0) {
            let required_collateral = (vault.borrowed * 150) / 100;
            assert!(remaining_collateral >= required_collateral, INSUFFICIENT_COLLATERAL);
        };
        
        vault.collateral = remaining_collateral;
        
        // For testing, we'll just track the collateral change
        // In a real implementation, this would transfer collateral back to user
    }

    /// Read vault state
    public fun get_vault(account: address): (u64, u64) acquires Vault {
        if (!exists<Vault>(account)) {
            return (0, 0)
        };
        let v = borrow_global<Vault>(account);
        (v.collateral, v.borrowed)
    }
}
