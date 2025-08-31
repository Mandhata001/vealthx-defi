module vealthfx::vault {

    use std::signer;
    use aptos_framework::coin;
    use vealthfx::router;
    use vealthfx::oracle;
    use std::debug;
    use std::string;

    /// Error codes
    const VAULT_NOT_EXISTS: u64 = 1;
    const INSUFFICIENT_COLLATERAL: u64 = 2;
    const INSUFFICIENT_DEBT: u64 = 3;
    const INSUFFICIENT_COLLATERAL_BALANCE: u64 = 4;
    const NOT_LIQUIDATABLE: u64 = 5;
    
    /// Optimization constants
    const COLLATERAL_RATIO: u64 = 150;
    const RATIO_DENOMINATOR: u64 = 100;

    /// A Vault stores user collateral + borrowed balance
    struct Vault has key {
        collateral: u64,
        borrowed: u64,
    }

    #[test_only]
    public fun create_vault_for_test(collateral: u64, borrowed: u64): Vault {
        Vault { 
            collateral, 
            borrowed, 
        }
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
        debug::print(&b"Deposit called");
        debug::print(&amount);
        
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault_ref = borrow_global_mut<Vault>(signer::address_of(account));
        let deposit_coin = coin::withdraw<CoinType>(account, amount);
        
        // For now, we'll just track the amount (in a real implementation, 
        // we'd store the actual coins or convert to a standard value)
        vault_ref.collateral = vault_ref.collateral + amount;
        
        debug::print(&b"New collateral balance");
        debug::print(&vault_ref.collateral);
        
        // Log deposit for monitoring (structured event logging for production)
        debug::print(&b"DEPOSIT_EVENT");
        debug::print(&signer::address_of(account));
        debug::print(&amount);
        
        // In a real vault, we'd store these coins somewhere secure
        coin::deposit(@vealthfx, deposit_coin);
    }

    /// Borrow asset against collateral (simplified for testing)
    public entry fun borrow_asset<CoinType>(account: &signer, amount: u64) acquires Vault {
        debug::print(&b"Borrow called");
        debug::print(&amount);
        
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault_ref = borrow_global_mut<Vault>(signer::address_of(account));

        // Use oracle price to calculate collateral value
        // Get asset price from oracle
        let price = oracle::get_price(b"RWA1");
        debug::print(&string::utf8(b"Oracle price retrieved: "));
        debug::print(&price);
        let collateral_value = vault_ref.collateral * price;
        
        // Use constants for 150% collateral ratio (based on value, not units)
        let required_value = (amount * COLLATERAL_RATIO) / RATIO_DENOMINATOR;
        assert!(collateral_value >= required_value, INSUFFICIENT_COLLATERAL);

        vault_ref.borrowed = vault_ref.borrowed + amount;
        
        debug::print(&b"New borrowed balance");
        debug::print(&vault_ref.borrowed);
        debug::print(&b"Collateral value (price-adjusted)");
        debug::print(&collateral_value);
        debug::print(&b"Oracle price used");
        debug::print(&price);
        
        // Log borrow for monitoring (structured event logging for production)
        debug::print(&b"BORROW_EVENT");
        debug::print(&signer::address_of(account));
        debug::print(&amount);
        
        // For testing, we'll just track the borrowed amount
        // In a real implementation, this would transfer tokens from a liquidity pool
    }

    /// Repay borrowed asset
    public entry fun repay<CoinType>(account: &signer, amount: u64) acquires Vault {
        debug::print(&b"Repay called");
        debug::print(&amount);
        
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault_ref = borrow_global_mut<Vault>(signer::address_of(account));
        assert!(vault_ref.borrowed >= amount, 3); // INSUFFICIENT_DEBT
        
        let repay_coin = coin::withdraw<CoinType>(account, amount);
        vault_ref.borrowed = vault_ref.borrowed - amount;
        
        debug::print(&b"Remaining debt");
        debug::print(&vault_ref.borrowed);
        
        // Log repay for monitoring (structured event logging for production)
        debug::print(&b"REPAY_EVENT");
        debug::print(&signer::address_of(account));
        debug::print(&amount);
        
        // Return to protocol reserves
        coin::deposit(@vealthfx, repay_coin);
    }

    /// Withdraw collateral (only if sufficient remains for borrowed amount)
    public entry fun withdraw_collateral<CoinType>(account: &signer, amount: u64) acquires Vault {
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let vault_ref = borrow_global_mut<Vault>(signer::address_of(account));
        assert!(vault_ref.collateral >= amount, INSUFFICIENT_COLLATERAL_BALANCE);
        
        // Check that remaining collateral still satisfies ratio
        let remaining_collateral = vault_ref.collateral - amount;
        if (vault_ref.borrowed > 0) {
            let required_collateral = (vault_ref.borrowed * COLLATERAL_RATIO) / RATIO_DENOMINATOR;
            assert!(remaining_collateral >= required_collateral, INSUFFICIENT_COLLATERAL);
        };
        
        vault_ref.collateral = remaining_collateral;
        
        // For testing, we'll just track the collateral change
        // In a real implementation, this would transfer collateral back to user
    }

    /// Liquidate under-collateralized vault
    public entry fun liquidate<CoinType>(liquidator: &signer, vault_owner: address) acquires Vault {
        assert!(exists<Vault>(vault_owner), VAULT_NOT_EXISTS);
        
        let vault_ref = borrow_global_mut<Vault>(vault_owner);
        
        // Check if vault is under-collateralized using constants
        let required_collateral = (vault_ref.borrowed * COLLATERAL_RATIO) / RATIO_DENOMINATOR;
        assert!(vault_ref.collateral < required_collateral, NOT_LIQUIDATABLE);
        
        // Liquidator pays the debt, gets the collateral
        let debt_payment = coin::withdraw<CoinType>(liquidator, vault_ref.borrowed);
        coin::deposit(@vealthfx, debt_payment);
        
        // Transfer collateral to liquidator (simplified for testing)
        vault_ref.borrowed = 0;
        vault_ref.collateral = 0;
    }

    /// Auto-route funds to best yield pool
    public entry fun auto_route(account: &signer) acquires Vault {
        assert!(exists<Vault>(signer::address_of(account)), VAULT_NOT_EXISTS);
        
        let _vault = borrow_global_mut<Vault>(signer::address_of(account));
        
        // Mock pool scan - simulate checking multiple Aptos DeFi pools
        let pools = vector[
            router::create_pool(b"Echelon", 8),     // 8% APY
            router::create_pool(b"Merkle", 10),     // 10% APY  
            router::create_pool(b"Hippo", 7),       // 7% APY
            router::create_pool(b"Pancake", 9)      // 9% APY
        ];
        
        let best = router::best_pool(pools);
        
        // Log the routing decision (for now)
        debug::print(&router::get_name(&best));
        debug::print(&router::get_apy(&best));
        
        // In a real implementation, this would:
        // 1. Withdraw funds from current pool
        // 2. Deposit into the best pool 
        // 3. Update vault's pool allocation
    }

    
    #[view]
    public fun get_vault(account: address): (u64, u64) acquires Vault {
        if (!exists<Vault>(account)) {
            return (0, 0)
        };
        let v = borrow_global<Vault>(account);
        (v.collateral, v.borrowed)
    }
}
