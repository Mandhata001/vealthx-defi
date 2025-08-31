# VealthX Technology Stack

## Frontend

- **Framework:** React 19
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite v7.1.3
- **Package Manager:** npm 11.4.1
- **Node.js:** v22.18.0

## Smart Contracts

- **Language:** Aptos Move
- **Network:** Aptos Blockchain
- **Framework:** Aptos Framework

## Aptos CLI

- **Version:** 7.7.0
- **Location:** `/tools/aptos/aptos.exe`
- **Usage:** `.\tools\aptos\aptos.exe <command>` (from project root)
- **Docs:** https://aptos.dev/tools/aptos-cli/

## Development Tools

- **Local Aptos CLI:** Self-contained in project
- **PostCSS:** For Tailwind CSS processing
- **ESLint:** Code linting
- **Autoprefixer:** CSS vendor prefixes

## Project Structure

```
vealthfx/
 ├── frontend/          # React + Tailwind frontend
 ├── contracts/         # Aptos Move smart contracts
 ├── tools/aptos/       # Local Aptos CLI binary
 ├── docs/              # Documentation
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
cd contracts
..\tools\aptos\aptos.exe move compile
..\tools\aptos\aptos.exe move test
```

### CLI Usage Examples

```bash
# From project root (vealthfx/)
.\tools\aptos\aptos.exe --version
.\tools\aptos\aptos.exe move compile --package-dir contracts
.\tools\aptos\aptos.exe init --network devnet
```

## Benefits of Local CLI Setup

- ✅ **Self-contained:** No global installation required
- ✅ **Portable:** Anyone can clone and run immediately
- ✅ **Version-locked:** Consistent CLI version across team
- ✅ **Clean:** No system pollution
- ✅ **Hackathon-ready:** Complete setup in one repo
