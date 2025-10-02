<div align="center">

# VealthX Protocol

**Next-Generation DeFi Ecosystem on Aptos Blockchain**

Unified platform for Real-World Assets, Trading, Social Finance, and Global Payments

[![Aptos](https://img.shields.io/badge/Aptos-Blockchain-00D4AA?style=for-the-badge&logo=aptos)](https://aptos.dev)
[![Move](https://img.shields.io/badge/Smart_Contracts-Move-7B42BC?style=for-the-badge)](https://move-language.github.io/move/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[🚀 Live Demo (Vercel)](https://vealthx-defi.vercel.app/) • [📖 Documentation](DOCUMENTATION.md) • [💻 GitHub](https://github.com/Mandhata001/vealthx-defi)

</div>

---

## 📖 About

VealthX Protocol is a comprehensive DeFi ecosystem built on Aptos blockchain that unifies real-world asset tokenization, advanced trading, social finance, and global payments into a single, user-friendly platform.

---

## 🎯 Problem & Solution

### The Problem

Modern DeFi suffers from fragmentation. Users must navigate multiple protocols, each with separate interfaces, wallet connections, and steep learning curves. High fees, slow transactions, and isolated systems create significant barriers to mass adoption.

### How VealthX Solves It

**Unified Experience** - Access RWA vaults, trading, payments, and analytics in one platform  
**Bridge TradFi & DeFi** - Tokenize real-world assets (gold, real estate, bonds)  
**Low Cost & Fast** - Sub-$0.01 fees with sub-second finality on Aptos  
**Social Trading** - Copy successful traders and share strategies  
**Global Payments** - Cross-border remittances at <1% fees

---

## ✨ Features

### 🏦 RWA Vaults

Tokenized real-world asset management with sustainable yields (8-15% APY)

- Gold, real estate, treasury bonds, commodities
- Collateralized borrowing up to 80% LTV
- Instant liquidity with no lockups

### 📊 Advanced Trading

Professional-grade DEX with institutional features

- Market & limit orders
- CLOB integration for deep liquidity
- Real-time price charts
- <2s order execution

### 🤝 Social Trading Hub

Learn from top traders, build your community

- Copy trading with auto-replication
- Leaderboards & verified performance metrics
- Strategy marketplace with monetization

### 💳 Payment Solutions

Global payment infrastructure powered by stablecoins

- Cross-border remittances (<1% fee)
- Instant settlements in <5 seconds
- QR code payments & invoicing
- Payroll & B2B settlements

### 📈 Real-Time Analytics

Data-driven insights for informed decisions

- Portfolio tracking & P&L analysis
- Live price feeds for 100+ assets
- Market trends & performance metrics

### 🤖 AI Insights (Coming Soon)

Intelligent trading recommendations powered by machine learning

---

## 🛠️ Technology Stack

### Blockchain

- **Network:** Aptos Blockchain (Devnet → Mainnet Q1 2026)
- **Smart Contracts:** Move Language
- **Wallet Support:** Petra, Martian, Pontem, Fewcha

### Frontend

- **Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.3
- **Styling:** Tailwind CSS 3.4.15
- **Charts:** Recharts
- **Icons:** Lucide React

### Smart Contracts

```
vealthfx/sources/
├── vault.move              - RWA vault management
├── payments.move           - Payment processing
├── oracle.move             - Price feed oracle
├── router.move             - Transaction routing
└── clob_integration.move   - Order book integration
```

### Integrations

- **CoinGecko API** - Real-time price data
- **Aptos SDK** - Blockchain interaction
- **Hyperion, Merkle Trade, Tapp** - DeFi composability

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Petra Wallet or compatible Aptos wallet
- Aptos CLI (for smart contract deployment)

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/Mandhata001/vealthx-defi.git
cd vealthx-defi/vealthfx/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Configuration

Create `.env.local` in `vealthfx/frontend/`:

```env
VITE_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
VITE_CONTRACT_ADDRESS=your_contract_address_here
VITE_COINGECKO_API_KEY=your_api_key_here
```

### Smart Contract Deployment

```bash
cd vealthfx
aptos init --network devnet
aptos move compile
aptos move publish --named-addresses vealth_addr=YOUR_ADDRESS
```

### Try Demo Mode

Explore without connecting a wallet:

1. Visit [https://vealthx-defi.vercel.app/](https://vealthx-defi.vercel.app/)
2. Toggle "Demo Mode" in the header
3. Experience all features with simulated data

---

## 📊 Development Status

### Current Stage: **Beta (Testnet)**

✅ **Completed**

- Core smart contracts (5 Move modules)
- Complete frontend application
- Wallet integration (Petra, Martian)
- Demo mode for testing
- Comprehensive documentation
- Internal security audit

🔄 **In Progress**

- External security audit (Q4 2025)
- Mainnet preparation
- Mobile responsive optimization
- Additional trading pairs

📅 **Roadmap**

- **Q4 2025:** Mainnet launch, security audit
- **Q1 2026:** Mobile apps, fiat on-ramp
- **Q2 2026:** Cross-chain bridge, AI features
- **Q3 2026:** Governance token, DAO formation

---

## 📚 Resources

### Documentation

- [📖 Complete Documentation](DOCUMENTATION.md) - Comprehensive user guide
- [🧪 Test Report](COMPREHENSIVE_TEST_REPORT.md) - Testing results & analysis
- [🔒 Security](SECURITY.md) - Security guidelines & best practices

### Links

- **Live Demo:** [https://vealthx-defi.vercel.app/](https://vealthx-defi.vercel.app/)
- **GitHub:** [https://github.com/Mandhata001/vealthx-defi](https://github.com/Mandhata001/vealthx-defi)
- **Documentation:** [View Docs](DOCUMENTATION.md)

### External Resources

- [Aptos Blockchain](https://aptoslabs.com)
- [Move Language](https://move-language.github.io/move/)
- [Petra Wallet](https://petra.app)
- [Aptos Developer Docs](https://aptos.dev/docs)

---

## 👨‍💻 Developer

**Mandhata Pathak**  
Full-Stack Blockchain Developer

- 💻 GitHub: [@Mandhata001](https://github.com/Mandhata001)
- 🐦 Twitter: [@Mandhata001](https://x.com/Mandhata001)
- 💼 LinkedIn: [mandhatapathak](https://linkedin.com/in/mandhatapathak)
- 📧 Email: mandhata.dev@gmail.com

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

✅ Commercial use, modification, distribution, and private use permitted  
⚠️ Must include license and copyright notice  
❌ No liability or warranty

---

## 🙏 Acknowledgments

- **Aptos Foundation** - For building an incredible blockchain platform
- **Move Language Team** - For creating a secure smart contract language
- **CoinGecko** - For providing reliable cryptocurrency data
- **Aptos Community** - For support and feedback

---

## 🔒 Security

### Security Measures

✅ Internal security review completed  
✅ Move Prover formal verification  
✅ Access control & permissions  
✅ Reentrancy protection  
✅ Input validation & sanitization

### Risk Disclosure

⚠️ **Important:** DeFi protocols involve inherent risks including smart contract vulnerabilities, market volatility, and potential loss of funds. Always conduct your own research (DYOR) and never invest more than you can afford to lose.

### Report Security Issues

Found a vulnerability? Please report it to: **mandhata.dev@gmail.com**

---

## 📞 Contact & Support

- 📧 Email: mandhata.dev@gmail.com
- 🐛 Report Issues: [GitHub Issues](https://github.com/Mandhata001/vealthx-defi/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Mandhata001/vealthx-defi/discussions)

---

<div align="center">

**Built with ❤️ for the Aptos Ecosystem**

© 2025 VealthX Protocol. All Rights Reserved.

[⭐ Star this repo](https://github.com/Mandhata001/vealthx-defi) • [🐦 Follow on Twitter](https://x.com/Mandhata001) • [🚀 Try Demo](https://vealthx-defi.vercel.app/)

</div>
