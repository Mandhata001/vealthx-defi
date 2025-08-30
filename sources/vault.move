module vealthfx::vault {

    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct Vault has key {
        collateral: coin::Coin<AptosCoin>, // mock RWA collateral
        borrowed: u64,                     // stablecoin borrowed
    }

    public fun init(account: &signer) {
        move_to(account, Vault { 
            collateral: coin::zero<AptosCoin>(), 
            borrowed: 0 
        });
    }
}
