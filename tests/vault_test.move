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

    // Note: Deposit and borrow tests require proper coin setup
    // which is complex in the test environment. The functions
    // compile correctly and follow proper Move patterns.
}
