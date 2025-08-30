# VealthX Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VealthX Architecture                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Users     │    │   Traders    │    │   Lenders    │
│ (Borrowers)  │    │ (RWA Buyers) │    │ (Liquidity)  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └─────────────────┐ │ ┌─────────────────┘
                         │ │ │
                    ┌────▼─▼─▼────┐
                    │   Wallet    │
                    │ Connection  │
                    │(Petra/Aptos)│
                    └─────┬───────┘
                          │
                    ┌─────▼───────┐
                    │  VealthX    │
                    │  Frontend   │
                    │ (React App) │
                    └─────┬───────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
    ┌───────▼───────┐ ┌───▼───┐ ┌───────▼───────┐
    │  RWA Vault    │ │Router │ │  Dashboard    │
    │   Module      │ │Module │ │   Module      │
    │               │ │       │ │               │
    │• Tokenize RWA │ │• Scan │ │• Portfolio    │
    │• Collateralize│ │• Route│ │• Analytics    │
    │• Borrow USDC  │ │• Auto │ │• Real-time    │
    └───────┬───────┘ └───┬───┘ └───────────────┘
            │             │
            │       ┌─────▼─────┐
            │       │ Liquidity │
            │       │  Pools    │
            │       │           │
            │       │• Echelon  │
            │       │• Merkle   │
            │       │• Others   │
            │       └─────┬─────┘
            │             │
    ┌───────▼─────────────▼─────┐
    │     Aptos Blockchain      │
    │   (Move Smart Contracts)  │
    └─────────┬─────────────────┘
              │
    ┌─────────▼─────────────────┐
    │      Oracle Services      │
    │                           │
    │• Pyth (Price Feeds)       │
    │• Mock Oracles (Testing)   │
    │• RWA Valuation APIs       │
    └───────────────────────────┘

Optional Integrations:
┌─────────────────────┐  ┌─────────────────────┐
│    Hyperion         │  │      Econia         │
│  (Streaming Data)   │  │ (CLOB Trading)      │
└─────────────────────┘  └─────────────────────┘
```

## Data Flow Architecture

### 1. **User Interaction Flow**

```
User → Wallet → Frontend → Smart Contracts → Blockchain
```

### 2. **RWA Tokenization Flow**

```
Upload RWA Docs → Verification → Mint Vault Tokens → Collateral Pool
```

### 3. **Borrowing Flow**

```
Vault Tokens → Collateral Check → Oracle Price → Borrow USDC → Transfer
```

### 4. **Yield Routing Flow**

```
Deposit → Router Scan → Best Pool Selection → Auto-Route → Yield Generation
```

### 5. **Liquidation Flow**

```
Price Drop → Health Check → Liquidation Trigger → Asset Sale → Debt Coverage
```

## Technical Stack Components

### **Frontend Layer**

- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite** for build tooling
- **Aptos Wallet Adapter** for wallet integration

### **Smart Contract Layer**

- **Move Language** on Aptos
- **Vault Contracts** for RWA tokenization
- **Router Contracts** for yield optimization
- **Oracle Integration** for price feeds

### **Infrastructure Layer**

- **Aptos Blockchain** (Devnet → Mainnet)
- **IPFS** for document storage
- **Graph Protocol** for indexing (if available)

### **External Integrations**

- **Pyth Network** for real-time price feeds
- **Echelon/Merkle** for liquidity pools
- **Hyperion** for streaming data (optional)
- **Econia** for order book trading (optional)

## Security Architecture

### **Smart Contract Security**

- Multi-signature governance
- Timelock contracts for upgrades
- Audit trail for all transactions
- Emergency pause functionality

### **Oracle Security**

- Multiple price feed sources
- Deviation checks and circuit breakers
- Fallback oracle mechanisms
- Price manipulation protection

### **User Security**

- Non-custodial design (users control keys)
- Collateral ratio monitoring
- Liquidation protection mechanisms
- Secure document verification

---

_Architecture designed: August 30, 2025_

**Note:** For visual diagrams, import this structure into Draw.io or Figma to create professional architecture diagrams for presentations.
