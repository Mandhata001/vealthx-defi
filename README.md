# VealthX DeFi Project

A comprehensive DeFi platform built on Aptos blockchain with React frontend.

## Project Structure

```
vealthfx/
 ├── frontend/        # React + Tailwind frontend
 ├── contracts/       # Aptos Move smart contracts
 ├── docs/            # Documentation
 └── README.md
```

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Smart Contracts

1. **Install Aptos CLI:**

   - Download from: https://github.com/aptos-labs/aptos-core/releases
   - Or install via Python: `pip3 install aptos-cli`
   - Or install via Homebrew (macOS): `brew install aptos`

2. **Initialize and Build:**
   ```bash
   cd contracts
   aptos move compile
   aptos move test
   ```

## Development

- **Frontend:** React 19 with Tailwind CSS v4
- **Smart Contracts:** Aptos Move language
- **Blockchain:** Aptos Network

## Getting Started

1. Install Aptos CLI (see instructions above)
2. Set up frontend dependencies: `cd frontend && npm install`
3. Start development server: `npm run dev`
4. Compile smart contracts: `cd contracts && aptos move compile`

## Documentation

See the `docs/` folder for detailed documentation.
