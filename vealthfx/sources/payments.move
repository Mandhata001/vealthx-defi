module vealthfx::payments {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::timestamp;

    /// Error codes
    const PAYMENT_NOT_FOUND: u64 = 1;
    const INSUFFICIENT_BALANCE: u64 = 2;
    const INVALID_RECIPIENT: u64 = 3;
    const PAYMENT_ALREADY_CLAIMED: u64 = 4;

    /// Payment status constants
    const PAYMENT_PENDING: u8 = 0;
    const PAYMENT_COMPLETED: u8 = 1;
    const PAYMENT_CANCELLED: u8 = 2;

    /// Cross-border payment with metadata
    struct Payment has store, drop {
        id: u64,
        sender: address,
        recipient: address,
        amount: u64,
        currency_type: vector<u8>,    // "USDC", "USDT", "APT", etc.
        memo: vector<u8>,             // Payment description
        status: u8,
        timestamp: u64,
        fees_paid: u64,
        exchange_rate: u64,           // For multi-currency support
        country_code: vector<u8>,     // Recipient country
    }

    /// Global payment registry
    struct PaymentRegistry has key {
        payments: vector<Payment>,
        next_payment_id: u64,
        total_volume: u64,
        total_fees_collected: u64,
    }

    /// User payment history and preferences
    struct UserPayments has key {
        sent_payments: vector<u64>,     // Payment IDs
        received_payments: vector<u64>, // Payment IDs
        default_currency: vector<u8>,
        trusted_recipients: vector<address>,
        total_sent: u64,
        total_received: u64,
    }

    /// Remittance corridor with specific rates
    struct RemittanceCorridor has key, store {
        from_country: vector<u8>,
        to_country: vector<u8>,
        base_fee: u64,              // Fixed fee in octas
        percentage_fee: u64,        // Percentage fee (basis points)
        exchange_rate: u64,         // Real-time rate (scaled)
        daily_limit: u64,
        monthly_limit: u64,
        is_active: bool,
    }

    /// Initialize the payments system
    public entry fun initialize_payments(admin: &signer) {
        move_to(admin, PaymentRegistry {
            payments: vector::empty(),
            next_payment_id: 1,
            total_volume: 0,
            total_fees_collected: 0,
        });
    }

    /// Send a cross-border payment
    public entry fun send_payment<CoinType>(
        sender: &signer,
        recipient: address,
        amount: u64,
        currency_type: vector<u8>,
        memo: vector<u8>,
        country_code: vector<u8>
    ) acquires PaymentRegistry, UserPayments {
        let sender_addr = signer::address_of(sender);
        
        // Initialize user payments if not exists
        if (!exists<UserPayments>(sender_addr)) {
            move_to(sender, UserPayments {
                sent_payments: vector::empty(),
                received_payments: vector::empty(),
                default_currency: currency_type,
                trusted_recipients: vector::empty(),
                total_sent: 0,
                total_received: 0,
            });
        };

        // Calculate fees (simplified - 0.1% + 0.01 APT base fee)
        let percentage_fee = (amount * 10) / 10000; // 0.1%
        let base_fee = 1000000; // 0.01 APT in octas
        let total_fee = percentage_fee + base_fee;
        let net_amount = amount - total_fee;

        // Withdraw payment amount + fees from sender
        let payment_coin = coin::withdraw<CoinType>(sender, amount);
        let fee_coin = coin::extract(&mut payment_coin, total_fee);
        
        // Deposit fee to treasury (simplified - send to @vealthfx)
        coin::deposit(@vealthfx, fee_coin);
        
        // Hold payment amount in escrow (simplified - deposit to recipient)
        coin::deposit(recipient, payment_coin);

        // Get registry
        let registry = borrow_global_mut<PaymentRegistry>(@vealthfx);
        
        let payment = Payment {
            id: registry.next_payment_id,
            sender: sender_addr,
            recipient,
            amount: net_amount,
            currency_type,
            memo,
            status: PAYMENT_COMPLETED, // Simplified - instant settlement
            timestamp: timestamp::now_seconds(),
            fees_paid: total_fee,
            exchange_rate: 100000000, // 1:1 rate (scaled)
            country_code,
        };

        vector::push_back(&mut registry.payments, payment);
        registry.total_volume = registry.total_volume + amount;
        registry.total_fees_collected = registry.total_fees_collected + total_fee;

        // Update user stats
        let user_payments = borrow_global_mut<UserPayments>(sender_addr);
        vector::push_back(&mut user_payments.sent_payments, registry.next_payment_id);
        user_payments.total_sent = user_payments.total_sent + amount;

        // Update recipient stats if they have an account
        if (exists<UserPayments>(recipient)) {
            let recipient_payments = borrow_global_mut<UserPayments>(recipient);
            vector::push_back(&mut recipient_payments.received_payments, registry.next_payment_id);
            recipient_payments.total_received = recipient_payments.total_received + net_amount;
        };

        registry.next_payment_id = registry.next_payment_id + 1;
    }

    /// Bulk payment for payroll systems
    public entry fun send_bulk_payment<CoinType>(
        sender: &signer,
        recipients: vector<address>,
        amounts: vector<u64>,
        memo: vector<u8>
    ) acquires PaymentRegistry, UserPayments {
        let len = vector::length(&recipients);
        assert!(len == vector::length(&amounts), INVALID_RECIPIENT);

        let i = 0;
        while (i < len) {
            let recipient = *vector::borrow(&recipients, i);
            let amount = *vector::borrow(&amounts, i);
            
            send_payment<CoinType>(
                sender,
                recipient,
                amount,
                b"USDC", // Default to USDC for payroll
                memo,
                b"GLOBAL" // Global payroll
            );
            
            i = i + 1;
        };
    }

    /// Set up a remittance corridor
    public entry fun setup_corridor(
        admin: &signer,
        from_country: vector<u8>,
        to_country: vector<u8>,
        base_fee: u64,
        percentage_fee: u64,
        exchange_rate: u64,
        daily_limit: u64,
        monthly_limit: u64
    ) {
        move_to(admin, RemittanceCorridor {
            from_country,
            to_country,
            base_fee,
            percentage_fee,
            exchange_rate,
            daily_limit,
            monthly_limit,
            is_active: true,
        });
    }

    /// Add trusted recipient for faster payments
    public entry fun add_trusted_recipient(
        user: &signer,
        recipient: address
    ) acquires UserPayments {
        let user_addr = signer::address_of(user);
        
        if (!exists<UserPayments>(user_addr)) {
            move_to(user, UserPayments {
                sent_payments: vector::empty(),
                received_payments: vector::empty(),
                default_currency: b"USDC",
                trusted_recipients: vector::empty(),
                total_sent: 0,
                total_received: 0,
            });
        };

        let user_payments = borrow_global_mut<UserPayments>(user_addr);
        vector::push_back(&mut user_payments.trusted_recipients, recipient);
    }

    /// Get payment history for a user
    #[view]
    public fun get_user_payments(user: address): (vector<u64>, vector<u64>, u64, u64) acquires UserPayments {
        if (!exists<UserPayments>(user)) {
            return (vector::empty(), vector::empty(), 0, 0)
        };

        let user_payments = borrow_global<UserPayments>(user);
        (
            user_payments.sent_payments,
            user_payments.received_payments,
            user_payments.total_sent,
            user_payments.total_received
        )
    }

    /// Get payment details by ID
    #[view]
    public fun get_payment_details(payment_id: u64): (address, address, u64, vector<u8>, u8) acquires PaymentRegistry {
        let registry = borrow_global<PaymentRegistry>(@vealthfx);
        let len = vector::length(&registry.payments);
        
        let i = 0;
        while (i < len) {
            let payment = vector::borrow(&registry.payments, i);
            if (payment.id == payment_id) {
                return (
                    payment.sender,
                    payment.recipient,
                    payment.amount,
                    payment.memo,
                    payment.status
                )
            };
            i = i + 1;
        };
        
        // Payment not found
        (@0x0, @0x0, 0, b"", PAYMENT_CANCELLED)
    }

    /// Get global payment statistics
    #[view]
    public fun get_payment_stats(): (u64, u64, u64) acquires PaymentRegistry {
        let registry = borrow_global<PaymentRegistry>(@vealthfx);
        (
            vector::length(&registry.payments),
            registry.total_volume,
            registry.total_fees_collected
        )
    }

    /// Treasury management - withdraw collected fees
    public entry fun withdraw_fees<CoinType>(
        admin: &signer,
        amount: u64
    ) acquires PaymentRegistry {
        // Only admin can withdraw fees
        assert!(signer::address_of(admin) == @vealthfx, INVALID_RECIPIENT);
        
        let fees = coin::withdraw<CoinType>(admin, amount);
        coin::deposit(@vealthfx, fees);
        
        // Update registry
        let registry = borrow_global_mut<PaymentRegistry>(@vealthfx);
        registry.total_fees_collected = registry.total_fees_collected - amount;
    }

    #[test_only]
    public fun create_test_payment(
        id: u64,
        sender: address,
        recipient: address,
        amount: u64
    ): Payment {
        Payment {
            id,
            sender,
            recipient,
            amount,
            currency_type: b"USDC",
            memo: b"Test payment",
            status: PAYMENT_COMPLETED,
            timestamp: 1693747200, // Fixed timestamp for testing
            fees_paid: 10000,
            exchange_rate: 100000000,
            country_code: b"US",
        }
    }

    #[test(admin = @vealthfx)]
    public fun test_initialize_payments(admin: &signer) {
        initialize_payments(admin);
        
        let registry = borrow_global<PaymentRegistry>(@vealthfx);
        assert!(registry.next_payment_id == 1, 1);
        assert!(vector::length(&registry.payments) == 0, 2);
    }

    #[test(admin = @vealthfx, sender = @0x42)]
    public fun test_payment_flow(admin: &signer, sender: &signer) acquires PaymentRegistry, UserPayments {
        initialize_payments(admin);
        
        // Note: In a real test, we'd need to set up coin balances
        // This is a simplified structure test
        
        let (sent, received, total_sent, total_received) = get_user_payments(@0x42);
        assert!(vector::length(&sent) == 0, 1);
        assert!(total_sent == 0, 2);
    }
}
