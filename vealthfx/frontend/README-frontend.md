# VealthX Frontend - CTRL+MOVE Hackathon Edition

Modern React frontend for VealthX DeFi protocol built with Vite, Tailwind CSS, and **Aptos Build integration** for the CTRL+MOVE Global Hackathon.

## 🏆 Hackathon Features

### ✅ Aptos Build Integration
- **Gas Station**: Sponsored transactions for zero-friction UX
- **No-Code Indexer**: Real-time vault and pool analytics
- **Enhanced API**: Dedicated keys for improved performance
- **GraphQL Streaming**: Live blockchain data feeds

### ✅ Advanced Analytics
- **Order Book Explorer**: Real-time trading data visualization  
- **Copy Trading Signals**: Strategy replication mechanics
- **Live Pool Stats**: Dynamic yield and risk metrics
- **Performance Charts**: Historical APY tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Petra Wallet browser extension installed
- Aptos devnet account with some test APT

### Setup

1. **Environment Configuration**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Update Contract Address & API Key**
   Edit `.env.local`:
   ```
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here
   VITE_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
   VITE_NETWORK=devnet
   
   # Aptos Build Integration (CTRL+MOVE Hackathon)
   VITE_APTOS_BUILD_API_KEY=your_api_key_here
   VITE_GAS_STATION_ENABLED=true
   VITE_ENABLE_REAL_TIME_UPDATES=true
   VITE_ENABLE_ORDER_BOOK=true
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Navigate to `http://localhost:5173`

## 🎯 Core Features

### ✅ Wallet Integration
- **Petra Wallet** support with auto-detection
- **Connect/Disconnect** functionality
- **Account address display** with truncation
- **Error handling** for wallet interactions

### ✅ DeFi Operations
- **Deposit Collateral** - APT deposits with transaction confirmation
- **Borrow Assets** - Instant borrowing with collateral ratio checks
- **Vault Viewer** - Real-time vault state with health ratio
- **Transaction Links** - Direct links to Aptos Explorer

### ✅ Analytics Dashboard
- **Pool Stats** - Live yield data from multiple pools  
- **Best Pool Detection** - Auto-router recommendations
- **Yield Charts** - 7-day performance visualization
- **Risk Assessment** - Pool risk ratings and TVL data

### ✅ User Experience
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Loading States** - Smooth loading animations
- **Error Handling** - User-friendly error messages
- **Real-time Updates** - Live data refresh capabilities

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── DepositForm.js   # Collateral deposit interface
│   │   ├── BorrowForm.js    # Asset borrowing interface  
│   │   ├── VaultViewer.js   # Vault state display
│   │   ├── PoolStats.js     # Pool analytics
│   │   └── YieldChart.js    # Performance charts
│   ├── lib/                 # Utilities and configuration
│   │   ├── aptos.js        # Aptos SDK and contract functions
│   │   └── constants.js    # App constants and mock data
│   ├── App.jsx             # Main application component
│   └── main.jsx            # App entry point with providers
├── .env.example            # Environment template
├── .env.local             # Local environment (create this)
└── package.json           # Dependencies and scripts
```

## 🔧 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4  
- **Wallet**: Aptos Wallet Adapter
- **Blockchain**: Aptos TypeScript SDK
- **Charts**: Recharts
- **Icons**: Heroicons (via Tailwind)

## 🎮 Demo Flow

### 1. Connect Wallet
```
1. Click "Connect Wallet"
2. Approve Petra connection
3. See connected address in header
```

### 2. Deposit Collateral  
```
1. Enter APT amount (e.g., 0.5)
2. Click "Deposit Collateral"  
3. Confirm transaction in Petra
4. View transaction on Explorer
```

### 3. Borrow Assets
```
1. Check collateral ratio (>150%)
2. Enter borrow amount (e.g., 0.2)
3. Click "Borrow Assets"
4. Confirm transaction
```

### 4. Monitor Vault
```
1. View vault stats in "Your Vault"
2. Check health ratio
3. Monitor yield performance
```

## 📊 Contract Integration

### Transaction Payloads
```javascript
// Deposit
{
  function: `${CONTRACT_ADDRESS}::vault::deposit_collateral`,
  type_arguments: ["0x1::aptos_coin::AptosCoin"],
  arguments: [toOctas(amount)]
}

// Borrow  
{
  function: `${CONTRACT_ADDRESS}::vault::borrow_asset`,
  arguments: [toOctas(amount)]
}
```

### Data Reading
```javascript
// Vault state
const vault = await aptos.getAccountResource({
  accountAddress: account.address,
  resourceType: `${CONTRACT_ADDRESS}::vault::Vault`
});
```

## 🐛 Common Issues & Solutions

### Wallet Connection
- **Error**: "Wallet not detected"
  - **Solution**: Install Petra wallet extension
  - **Check**: Extension is enabled and unlocked

### Transaction Failures
- **Error**: "Insufficient funds"
  - **Solution**: Get devnet APT from faucet
  - **Check**: Account has enough APT for transaction + gas

### Contract Address
- **Error**: "Contract not found"  
  - **Solution**: Update `VITE_CONTRACT_ADDRESS` in `.env.local`
  - **Check**: Contract is deployed to devnet

### Build Issues
- **Error**: Module resolution errors
  - **Solution**: `rm -rf node_modules && npm install`
  - **Check**: Node.js version 18+

## 📱 Mobile Support

- **Responsive breakpoints** for mobile/tablet
- **Touch-friendly** buttons and forms
- **Mobile wallet** integration ready
- **Progressive Web App** capabilities

## 🔐 Security

- **Environment variables** for sensitive config
- **No private keys** in frontend code
- **Transaction validation** before submission
- **Error boundary** protection

## 🚀 Deployment

### Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production  
npm run preview  # Preview production build
```

### Production
```bash
# Build
npm run build

# Deploy to static hosting (Vercel, Netlify, etc.)
# Update environment variables for mainnet
```

## 📈 Performance

- **Bundle size**: ~500KB gzipped
- **Load time**: <2s on fast connection
- **Wallet connection**: <1s with Petra
- **Transaction**: ~3-5s on devnet

## 🤝 Contributing

1. Follow component structure in `/components`
2. Use Tailwind for styling (no custom CSS)
3. Add proper TypeScript types (future)
4. Test wallet interactions thoroughly
5. Update this README for new features

## 📄 License

MIT License - see root LICENSE file

---

**Ready for hackathon demo! 🎉**

*Next steps: Connect wallet → Deposit APT → Borrow → Monitor yields*
