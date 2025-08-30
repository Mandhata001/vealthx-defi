module vealthfx::vault {

    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// A Vault stores user collateral + borrowed balance
    struct Vault has key {
        collateral: coin::Coin<AptosCoin>,
        borrowed: u64,
    }

    /// Initialize a vault for new users
    public fun init_vault(account: &signer) {
        move_to(account, Vault {
            collateral: coin::zero<AptosCoin>(),
            borrowed: 0,
        });
    }

    /// Deposit AptosCoin into vault
    public fun deposit(account: &signer, amount: u64) acquires Vault {
        let vault = borrow_global_mut<Vault>(signer::address_of(account));
        let deposit_coin = coin::withdraw<AptosCoin>(account, amount);
        coin::merge(&mut vault.collateral, deposit_coin);
    }

    /// Borrow AptosCoin against collateral
    public fun borrow(account: &signer, amount: u64) acquires Vault {
        let vault = borrow_global_mut<Vault>(signer::address_of(account));

        // Get collateral value
        let collateral_value = coin::value(&vault.collateral);

        // Require 150% collateral ratio
        assert!(collateral_value >= (amount * 150) / 100, 1);

        vault.borrowed = vault.borrowed + amount;
        coin::deposit(signer::address_of(account), coin::extract(&mut vault.collateral, amount));
    }

    /// Read vault state
    public fun get_vault(account: address): (u64, u64) acquires Vault {
        let v = borrow_global<Vault>(account);
        (coin::value(&v.collateral), v.borrowed)
    }
}
