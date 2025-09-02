# 🐛 VealthX Button Debug Guide

**Quick Fix for Non-Working Buttons**

## 🚨 **IMMEDIATE ACTION STEPS**

### Step 1: Test in Browser (2 minutes)

1. Open http://localhost:5173/ in Chrome/Edge
2. Press F12 to open Developer Tools
3. Click "Connect Wallet" button
4. Check Console tab for error messages

### Step 2: Common Issues & Fixes

#### ❌ **Issue: "Connect Wallet" Button Not Working**

**Likely Cause:** Petra wallet not installed or not detected

**Fix:**

1. Install Petra Wallet Chrome extension
2. Create/import a wallet
3. Switch to Devnet in Petra settings
4. Refresh page and try again

#### ❌ **Issue: Wallet Connects But Other Buttons Don't Work**

**Likely Cause:** Network or balance issues

**Fix:**

1. Check wallet has APT balance (get from faucet)
2. Verify network is set to Devnet
3. Check browser console for specific errors

#### ❌ **Issue: Buttons Trigger Loading But Never Complete**

**Likely Cause:** Contract interaction failure

**Fix:**

1. Check contract address in .env.local
2. Test contract exists on blockchain
3. Verify wallet permissions

### Step 3: Debug Console Errors

**Copy this code into browser console to test contract:**

```javascript
// Test if contract exists
fetch(
  "https://fullnode.devnet.aptoslabs.com/v1/accounts/0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf"
)
  .then((r) => r.json())
  .then(console.log);
```

### Step 4: Manual Testing Checklist

- [ ] Petra wallet installed and configured
- [ ] Wallet has APT balance (> 0.1 APT)
- [ ] Network set to Devnet
- [ ] Browser console shows no errors
- [ ] Contract address accessible
- [ ] Wallet permissions granted

---

## 🔧 **CODE FIXES** (If needed)

### Fix 1: Wallet Detection Issue

If wallet not detected, add this to main.jsx:

```jsx
// Add wallet detection
useEffect(() => {
  if (window.aptos) {
    console.log("Petra wallet detected");
  } else {
    console.log("Please install Petra wallet");
  }
}, []);
```

### Fix 2: Network Configuration

Update .env.local if needed:

```bash
VITE_NETWORK=devnet
VITE_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
VITE_CONTRACT_ADDRESS=0x60543f2bb7710af2225194e1046db5605d85933eb4f14ba574bf58d56beef7bf
```

### Fix 3: Error Handling

Add error logging to components:

```jsx
const handleDeposit = async () => {
  try {
    console.log("Starting deposit...");
    // existing code
  } catch (error) {
    console.error("Deposit failed:", error);
    alert(`Error: ${error.message}`);
  }
};
```

---

## 📱 **Expected Behavior**

### ✅ **When Working Correctly:**

1. Click "Connect Wallet" → Petra popup appears
2. Approve connection → Wallet address shows in header
3. Navigate tabs → Content switches smoothly
4. Enter amount + click "Deposit" → Loading spinner → Success message
5. Transaction appears in Petra history
6. Balance updates in wallet

### ❌ **Red Flags (Issues):**

- Button clicks do nothing
- Console shows "undefined" errors
- Wallet popup never appears
- Loading states get stuck
- "Network error" messages

---

## 🎯 **Most Likely Issue:**

**90% chance it's one of these:**

1. Petra wallet not installed/configured (60% probability)
2. Network mismatch (devnet vs mainnet) (20% probability)
3. Insufficient APT balance for gas (10% probability)

**Quick Test:** Open browser console and type `window.aptos` - if it returns `undefined`, install Petra wallet.

---

## ✅ **Success Indicators**

You'll know it's working when:

- Wallet address appears in top-right corner
- Tab navigation is smooth
- Deposit button shows loading spinner when clicked
- Success messages appear after transactions
- Petra wallet shows transaction history

**🚀 The UI is beautiful and the backend works - just need to connect them properly!**
