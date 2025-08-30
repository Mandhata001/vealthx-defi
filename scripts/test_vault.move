script {
    use vealthfx::vault;
    use std::signer;

    fun test_vault_functionality(account: &signer) {
        // Initialize a vault for the account
        vault::init_vault(account);
        
        // Check initial vault state
        let (collateral, borrowed) = vault::get_vault(signer::address_of(account));
        assert!(collateral == 0, 1);
        assert!(borrowed == 0, 2);
    }
}
