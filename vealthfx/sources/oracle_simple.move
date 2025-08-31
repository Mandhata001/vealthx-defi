module vealthfx::oracle {
    
    public fun get_price(asset: vector<u8>): u64 {
        if (asset == b"RWA1") {
            100
        } else {
            50
        }
    }
}
