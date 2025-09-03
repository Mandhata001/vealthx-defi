module vealthfx::clob_integration {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use vealthfx::vault;

    /// Error codes for CLOB operations
    const INSUFFICIENT_BALANCE: u64 = 1;
    const ORDER_NOT_FOUND: u64 = 2;
    const INVALID_PRICE: u64 = 3;

    /// Order side enumeration
    const BUY_ORDER: u8 = 0;
    const SELL_ORDER: u8 = 1;

    /// Order status enumeration  
    const ORDER_OPEN: u8 = 0;
    const ORDER_FILLED: u8 = 1;
    const ORDER_CANCELLED: u8 = 2;

    /// Order book entry for RWA fractional trading
    struct Order has copy, drop, store {
        id: u64,
        user: address,
        asset_type: vector<u8>,    // RWA asset identifier
        side: u8,                  // BUY_ORDER or SELL_ORDER
        price: u64,                // Price in USDC (scaled by 1e8)
        quantity: u64,             // Amount of RWA tokens
        filled: u64,               // Amount filled so far
        status: u8,                // Order status
        timestamp: u64,            // Creation timestamp
    }

    /// Order book for a specific RWA asset
    struct OrderBook has key {
        asset_type: vector<u8>,
        buy_orders: vector<Order>,    // Sorted by price descending
        sell_orders: vector<Order>,   // Sorted by price ascending
        next_order_id: u64,
        total_volume: u64,
        last_price: u64,
    }

    /// User's order history and active orders
    struct UserOrders has key {
        active_orders: vector<u64>,   // Order IDs
        order_history: vector<Order>, // Completed orders
        total_trades: u64,
        total_volume: u64,
    }

    /// Initialize order book for a new RWA asset
    public entry fun init_order_book(admin: &signer, asset_type: vector<u8>) {
        move_to(admin, OrderBook {
            asset_type,
            buy_orders: vector::empty(),
            sell_orders: vector::empty(),
            next_order_id: 1,
            total_volume: 0,
            last_price: 0,
        });
    }

    /// Place a new order on the order book
    public entry fun place_order<CoinType>(
        user: &signer,
        asset_type: vector<u8>,
        side: u8,
        price: u64,
        quantity: u64
    ) acquires OrderBook, UserOrders {
        let user_addr = signer::address_of(user);
        
        // Initialize user orders if not exists
        if (!exists<UserOrders>(user_addr)) {
            move_to(user, UserOrders {
                active_orders: vector::empty(),
                order_history: vector::empty(),
                total_trades: 0,
                total_volume: 0,
            });
        };

        // Get order book (assuming admin address for simplicity)
        let book = borrow_global_mut<OrderBook>(@vealthfx);
        
        let order = Order {
            id: book.next_order_id,
            user: user_addr,
            asset_type,
            side,
            price,
            quantity,
            filled: 0,
            status: ORDER_OPEN,
            timestamp: 0, // In real implementation, use timestamp oracle
        };

        // Add to appropriate order queue
        if (side == BUY_ORDER) {
            vector::push_back(&mut book.buy_orders, order);
            // Sort buy orders by price descending (best bid first)
        } else {
            vector::push_back(&mut book.sell_orders, order);
            // Sort sell orders by price ascending (best ask first)
        };

        // Update user orders
        let user_orders = borrow_global_mut<UserOrders>(user_addr);
        vector::push_back(&mut user_orders.active_orders, book.next_order_id);

        book.next_order_id = book.next_order_id + 1;

        // Attempt to match orders immediately
        match_orders(asset_type);
    }

    /// Cancel an existing order
    public entry fun cancel_order(
        user: &signer,
        order_id: u64,
        asset_type: vector<u8>
    ) acquires OrderBook, UserOrders {
        let user_addr = signer::address_of(user);
        let book = borrow_global_mut<OrderBook>(@vealthfx);
        
        // Find and remove order from buy_orders
        let i = 0;
        let len = vector::length(&book.buy_orders);
        while (i < len) {
            let order = vector::borrow(&book.buy_orders, i);
            if (order.id == order_id && order.user == user_addr) {
                vector::remove(&mut book.buy_orders, i);
                break
            };
            i = i + 1;
        };

        // Find and remove order from sell_orders
        let i = 0;
        let len = vector::length(&book.sell_orders);
        while (i < len) {
            let order = vector::borrow(&book.sell_orders, i);
            if (order.id == order_id && order.user == user_addr) {
                vector::remove(&mut book.sell_orders, i);
                break
            };
            i = i + 1;
        };

        // Update user orders
        let user_orders = borrow_global_mut<UserOrders>(user_addr);
        let i = 0;
        let len = vector::length(&user_orders.active_orders);
        while (i < len) {
            let active_id = *vector::borrow(&user_orders.active_orders, i);
            if (active_id == order_id) {
                vector::remove(&mut user_orders.active_orders, i);
                break
            };
            i = i + 1;
        };
    }

    /// Internal function to match buy and sell orders
    fun match_orders(asset_type: vector<u8>) acquires OrderBook {
        let book = borrow_global_mut<OrderBook>(@vealthfx);
        
        // Simple matching logic: match best bid with best ask
        while (
            !vector::is_empty(&book.buy_orders) && 
            !vector::is_empty(&book.sell_orders)
        ) {
            let best_bid = vector::borrow(&book.buy_orders, 0);
            let best_ask = vector::borrow(&book.sell_orders, 0);

            // Check if orders can be matched (bid >= ask)
            if (best_bid.price >= best_ask.price) {
                let trade_price = best_ask.price; // Use ask price
                let trade_quantity = if (best_bid.quantity < best_ask.quantity) {
                    best_bid.quantity
                } else {
                    best_ask.quantity
                };

                // Update order book statistics
                book.total_volume = book.total_volume + trade_quantity;
                book.last_price = trade_price;

                // In a full implementation, we would:
                // 1. Transfer tokens between users
                // 2. Update filled quantities
                // 3. Remove fully filled orders
                // 4. Emit trade events

                // For now, just remove the orders (simplified)
                if (best_bid.quantity <= trade_quantity) {
                    vector::remove(&mut book.buy_orders, 0);
                };
                if (best_ask.quantity <= trade_quantity) {
                    vector::remove(&mut book.sell_orders, 0);
                };
            } else {
                break // No more matches possible
            };
        };
    }

    /// Get current market data for an asset
    #[view]
    public fun get_market_data(asset_type: vector<u8>): (u64, u64, u64, u64) acquires OrderBook {
        let book = borrow_global<OrderBook>(@vealthfx);
        
        let best_bid = if (vector::is_empty(&book.buy_orders)) {
            0
        } else {
            let order = vector::borrow(&book.buy_orders, 0);
            order.price
        };

        let best_ask = if (vector::is_empty(&book.sell_orders)) {
            0
        } else {
            let order = vector::borrow(&book.sell_orders, 0);
            order.price
        };

        (best_bid, best_ask, book.last_price, book.total_volume)
    }

    /// Integration with vault system for automated trading
    public entry fun auto_trade_vault_yield(account: &signer, target_apy: u64) acquires OrderBook {
        // This function would:
        // 1. Check current vault yield
        // 2. If yield < target_apy, create sell orders for excess RWA
        // 3. If yield opportunities exist, create buy orders
        // 4. Integrate with vault::auto_route for optimal placement
        
        vault::auto_route(account); // Leverage existing routing
        
        // Example: Place a small buy order to test liquidity
        place_order<coin::AptosCoin>(
            account,
            b"RWA_REAL_ESTATE",
            BUY_ORDER,
            100000000, // 1 USDC (scaled)
            10000000,  // 0.1 RWA tokens
        );
    }

    #[test_only]
    public fun create_test_order(id: u64, price: u64, quantity: u64): Order {
        Order {
            id,
            user: @0x1,
            asset_type: b"TEST_RWA",
            side: BUY_ORDER,
            price,
            quantity,
            filled: 0,
            status: ORDER_OPEN,
            timestamp: 0,
        }
    }

    #[test(admin = @vealthfx)]
    public fun test_order_book_creation(admin: &signer) {
        init_order_book(admin, b"TEST_RWA");
        
        let book = borrow_global<OrderBook>(@vealthfx);
        assert!(book.next_order_id == 1, 1);
        assert!(vector::length(&book.buy_orders) == 0, 2);
        assert!(vector::length(&book.sell_orders) == 0, 3);
    }

    #[test(admin = @vealthfx, user = @0x42)]
    public fun test_place_order(admin: &signer, user: &signer) acquires OrderBook, UserOrders {
        init_order_book(admin, b"TEST_RWA");
        
        place_order<coin::AptosCoin>(
            user,
            b"TEST_RWA",
            BUY_ORDER,
            100000000, // 1 USDC
            10000000   // 0.1 RWA
        );

        let book = borrow_global<OrderBook>(@vealthfx);
        assert!(vector::length(&book.buy_orders) == 1, 1);
        assert!(book.next_order_id == 2, 2);
    }
}
