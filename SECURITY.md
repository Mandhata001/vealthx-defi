# 🔐 Security Guidelines

## ⚠️ IMPORTANT SECURITY NOTICE

This repository contains smart contract code for development and hackathon purposes. Please follow these security guidelines:

### 🚨 Never Commit Private Keys

- ✅ **DO**: Use environment variables for private keys
- ✅ **DO**: Add `.aptos/` and `.env` to `.gitignore`
- ❌ **DON'T**: Commit private keys or config files with sensitive data
- ❌ **DON'T**: Hardcode addresses in production code

### 🛡️ Best Practices

1. **Environment Setup:**
   ```bash
   # Create .env file (add to .gitignore)
   APTOS_PRIVATE_KEY=your_private_key_here
   APTOS_ACCOUNT_ADDRESS=your_account_address_here
   ```

2. **Configuration:**
   - Use placeholders like `<YOUR_CONTRACT_ADDRESS>` in documentation
   - Use `"_"` in Move.toml for development
   - Configure actual addresses only in local environment

3. **Repository Safety:**
   - Always review commits before pushing
   - Use `.gitignore` for sensitive files
   - Consider using separate accounts for development vs production

### 🔧 Development Workflow

1. **Initial Setup:**
   ```bash
   aptos init --network devnet
   # This creates .aptos/config.yaml with your keys locally
   ```

2. **Update Move.toml:**
   ```toml
   [addresses]
   vealthfx = "YOUR_ACTUAL_ADDRESS_HERE"  # Only locally
   ```

3. **Use Environment Variables:**
   ```bash
   # In your shell/scripts
   aptos move compile --named-addresses vealthfx=$APTOS_ACCOUNT_ADDRESS
   ```

### 📋 Security Checklist

- [ ] `.aptos/` is in `.gitignore`
- [ ] `.env` files are in `.gitignore`  
- [ ] No private keys in any committed files
- [ ] Addresses are parameterized, not hardcoded
- [ ] Sensitive config files are excluded from git

### 🚀 For Production

- Use hardware wallets or secure key management
- Separate development and production accounts
- Implement proper access controls
- Regular security audits

---

**Remember: Once a private key is committed to git, consider it compromised forever!**
