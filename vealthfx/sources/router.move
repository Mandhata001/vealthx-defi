module vealthfx::router {
    use std::vector;

    struct Pool has copy, drop {
        name: vector<u8>,
        apy: u64,
    }

    public fun best_pool(pools: vector<Pool>): Pool {
        let len = vector::length(&pools);
        assert!(len > 0, 1); // EMPTY_POOLS
        
        let best = *vector::borrow(&pools, 0);
        let i = 1;
        while (i < len) {
            let candidate = *vector::borrow(&pools, i);
            if (candidate.apy > best.apy) {
                best = candidate;
            };
            i = i + 1;
        };
        best
    }

    public fun create_pool(name: vector<u8>, apy: u64): Pool {
        Pool { name, apy }
    }

    public fun get_apy(pool: &Pool): u64 {
        pool.apy
    }

    public fun get_name(pool: &Pool): vector<u8> {
        pool.name
    }

    #[test]
    public fun test_best_pool() {
        let pools = vector[
            Pool { name: b"Echelon", apy: 8 },
            Pool { name: b"Merkle", apy: 10 }
        ];
        let best = best_pool(pools);
        assert!(best.apy == 10, 1);
    }

    #[test]
    public fun test_best_pool_tie() {
        let pools = vector[
            Pool { name: b"A", apy: 10 },
            Pool { name: b"B", apy: 10 }
        ];
        let best = best_pool(pools);
        // best.apy is 10; tie resolving to first element is acceptable
        assert!(best.apy == 10, 1);
        assert!(best.name == b"A", 2); // Should pick first in case of tie
    }

    #[test]
    public fun test_best_pool_single() {
        let pools = vector[
            Pool { name: b"OnlyOne", apy: 5 }
        ];
        let best = best_pool(pools);
        assert!(best.apy == 5, 1);
        assert!(best.name == b"OnlyOne", 2);
    }

    #[test]
    public fun test_best_pool_multiple() {
        let pools = vector[
            Pool { name: b"Low", apy: 3 },
            Pool { name: b"Medium", apy: 7 },
            Pool { name: b"High", apy: 12 },
            Pool { name: b"Medium2", apy: 6 }
        ];
        let best = best_pool(pools);
        assert!(best.apy == 12, 1);
        assert!(best.name == b"High", 2);
    }
}
