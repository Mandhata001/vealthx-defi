# vealthx-defi

VealthX — Instant RWA Liquidity on Aptos

## Overview

VealthX is a revolutionary DeFi platform that enables instant liquidity for Real World Assets (RWAs) on the Aptos blockchain. Users can tokenize their real-world assets, use them as collateral to borrow stablecoins instantly, and earn optimized yields through automated liquidity routing.

## Key Features

- **Instant RWA Tokenization**: Convert real estate, invoices, and other RWAs into liquid vault tokens
- **Collateralized Borrowing**: Borrow USDC/USDT instantly against RWA collateral
- **Automated Yield Routing**: AI-powered routing to maximize yields across multiple pools
- **Real-time Analytics**: Live dashboard with portfolio tracking and risk management

## Tech Stack

- **Blockchain**: Aptos (Move smart contracts)
- **Frontend**: React 19 + Tailwind CSS v4
- **Build Tool**: Vite
- **CLI**: Aptos CLI v7.7.0
- **Oracles**: Pyth Network (planned)

## Project Structure

```
vealthfx/
├── frontend/          # React + Tailwind frontend
├── sources/           # Move smart contracts
├── docs/              # Complete documentation
├── tools/aptos/       # Local Aptos CLI
└── README.md
```

## Getting Started

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Smart Contract Development
```bash
.\tools\aptos\aptos.exe move compile --dev
.\tools\aptos\aptos.exe move test
```

## Documentation

- [Competitor Analysis](docs/competitors.md)
- [MVP Features & User Stories](docs/features.md)
- [Technology Stack](docs/stack.md)
- [System Architecture](docs/architecture.md)
- [Project Status](docs/project_status.md)

## Development Status

✅ Complete documentation and competitive analysis  
✅ Tech stack installed and configured  
✅ Move smart contracts scaffolded  
✅ React frontend with Tailwind CSS  
✅ Working Hello World contract  
🔄 Advanced DeFi contracts (in progress)  

## Contributing

This project is under active development!

## License

MIT License - see LICENSE file for details.

---
![Aptos](https://img.shields.io/badge/Aptos-Move-blue)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-green)
*Built with ❤️ on Aptos blockchain*
