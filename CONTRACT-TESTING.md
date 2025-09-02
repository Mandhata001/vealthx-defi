# VealthX Contract Testing Script

## 🎯 Contract Deployment Summary

**✅ Contract Successfully Deployed!**

- **Contract Address**: `60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf`
- **Network**: Aptos Devnet
- **Transaction**: https://explorer.aptoslabs.com/txn/0xaf3cb1e0e16016aaa352fb01f13b3bb7270038cddb84a4f47c64e354143a75aa?network=devnet

## 🔧 Testing Commands

### 1. Verify Contract Deployment
```bash
# Check account resources (should show deployed modules)
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" account list --query resources --account 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf
```

### 2. Initialize a Vault
```bash
# Initialize vault for the account
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" move run --function-id 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::init_vault --profile default
```

### 3. Deposit Collateral (0.1 APT = 10000000 octas)
```bash
# Deposit 0.1 APT as collateral
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" move run --function-id 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::deposit_collateral --type-args 0x1::aptos_coin::AptosCoin --args u64:10000000 --profile default
```

### 4. Check Vault State
```bash
# View vault resource after deposit
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" account list --query resources --account 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf
```

## 🌐 Frontend Testing

### 1. Start Development Server
```bash
cd "d:\Dev Projects\VealthX-Defi Project\vealthfx\frontend"
npm run dev
```

### 2. Open Application
- Navigate to: http://localhost:5173
- Connect Petra wallet
- Use account: `60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf`

### 3. Test Flow
1. **Connect Wallet** ✅
2. **Deposit Collateral** (try 0.1 APT)
3. **View Vault State** (should show collateral)
4. **Borrow Assets** (try 0.05 APT)
5. **Monitor Real-time Data** (check pool stats)

## 🔍 Verification Steps

### Contract Functions Available:
- ✅ `vault::init_vault()` - Initialize user vault
- ✅ `vault::deposit_collateral<CoinType>(amount)` - Deposit APT
- ✅ `vault::borrow_asset(amount)` - Borrow against collateral
- ✅ `vault::withdraw_collateral<CoinType>(amount)` - Withdraw collateral
- ✅ `vault::repay_debt<CoinType>(amount)` - Repay borrowed amount

### Frontend Features:
- ✅ Wallet Connection (Petra)
- ✅ Contract Address Configuration
- ✅ Gas Station Integration (sponsored transactions)
- ✅ Real-time Analytics Dashboard
- ✅ Order Book Explorer
- ✅ Responsive Mobile Design

## 🎯 Demo Script

### Complete Testing Flow:
```bash
# 1. Initialize vault
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" move run --function-id 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::init_vault --profile default

# 2. Check balance before
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" account list --query balance --account 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf

# 3. Deposit 0.1 APT
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" move run --function-id 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf::vault::deposit_collateral --type-args 0x1::aptos_coin::AptosCoin --args u64:10000000 --profile default

# 4. Check vault state
& "C:\Users\MANDHATA PATHAK\.aptoscli\bin\aptos.exe" account list --query resources --account 60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf
```

## 🏆 Hackathon Readiness Checklist

- ✅ **Move Contract Deployed** (with security features)
- ✅ **Frontend Running** (React + Vite + Tailwind)
- ✅ **Wallet Integration** (Petra wallet adapter)
- ✅ **Real-time Features** (GraphQL + order book)
- ✅ **Gas Station** (sponsored transactions)
- ✅ **Mobile Responsive** (Tailwind CSS)
- ✅ **Documentation** (comprehensive README)
- ✅ **Demo Ready** (complete user flow)

## 🎉 Success!

Your VealthX DeFi project is now **fully deployed and testable**! 

**Contract Address**: `60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf`  
**Frontend URL**: http://localhost:5173  
**Explorer**: https://explorer.aptoslabs.com/account/60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf?network=devnet

---

**Ready for CTRL+MOVE Hackathon submission! 🚀**
