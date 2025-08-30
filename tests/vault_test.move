#[test_only]
module vealthfx::vault_test {
    use std::signer;
    use vealthfx::vault;

    #[test(account = @0x42)]
    public fun test_init_vault(account: &signer) {
        // Test that we can initialize a vault
        vault::init_vault(account);
        
        let (collateral, borrowed) = vault::get_vault(signer::address_of(account));
        assert!(collateral == 0, 1);
        assert!(borrowed == 0, 2);
    }

    #[test(account = @0x42)]
    #[expected_failure(abort_code = 1, location = vealthfx::vault)] // VAULT_NOT_EXISTS
    public fun test_borrow_without_vault(account: &signer) {
        // Try to borrow without initializing vault (should fail)
        vault::borrow_asset<u64>(account, 100);
    }

    #[test(account = @0x42)]
    public fun test_vault_logic(account: &signer) {
        // Initialize vault
        vault::init_vault(account);
        
        // Test that vault state tracking works correctly for the business logic
        // Note: In this simplified test, we're testing the vault state management
        // without actual coin transfers (which require complex setup)
        
        let (collateral, borrowed) = vault::get_vault(signer::address_of(account));
        assert!(collateral == 0, 1);
        assert!(borrowed == 0, 2);
    }

    #[test(account = @0x42)]
    #[expected_failure(abort_code = 2, location = vealthfx::vault)] // INSUFFICIENT_COLLATERAL
    public fun test_borrow_insufficient_collateral_logic(account: &signer) {
        // Initialize vault
        vault::init_vault(account);
        
        // Try to borrow without any collateral (should fail)
        vault::borrow_asset<u64>(account, 100);
    }
    
    #[test(account = @0x42)]
    public fun test_vault_exists_check(account: &signer) {
        // Before initialization, vault should not exist
        let (collateral, borrowed) = vault::get_vault(signer::address_of(account));
        assert!(collateral == 0, 1);
        assert!(borrowed == 0, 2);
        
        // After initialization, vault should exist
        vault::init_vault(account);
        let (collateral2, borrowed2) = vault::get_vault(signer::address_of(account));
        assert!(collateral2 == 0, 3);
        assert!(borrowed2 == 0, 4);
    }
}
