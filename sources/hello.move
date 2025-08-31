module vealthfx::hello {
    use std::debug;

    public entry fun say_hello(_account: &signer) {
        // Just a log statement for now
        debug::print(&b"Hello from VealthFX!");
    }
}
