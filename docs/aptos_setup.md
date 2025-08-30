# Aptos CLI Installation Guide

## Local Aptos CLI Setup

This project uses a local Aptos CLI for development. The binary is not included in the repository due to GitHub file size limits.

### Windows Installation

1. **Create tools directory:**
   ```powershell
   mkdir tools\aptos
   cd tools\aptos
   ```

2. **Download Aptos CLI v7.7.0:**
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/aptos-labs/aptos-core/releases/download/aptos-cli-v7.7.0/aptos-cli-7.7.0-Windows-x86_64.zip" -OutFile "aptos-cli.zip"
   ```

3. **Extract and setup:**
   ```powershell
   Expand-Archive -Path "aptos-cli.zip" -DestinationPath "." -Force
   del aptos-cli.zip
   ```

4. **Verify installation:**
   ```powershell
   cd ..\..
   .\tools\aptos\aptos.exe --version
   ```

### macOS/Linux Installation

1. **Create tools directory:**
   ```bash
   mkdir -p tools/aptos
   cd tools/aptos
   ```

2. **Download and setup:**
   ```bash
   # For macOS
   curl -L https://github.com/aptos-labs/aptos-core/releases/download/aptos-cli-v7.7.0/aptos-cli-7.7.0-MacOSX-x86_64.zip -o aptos-cli.zip
   
   # For Linux
   curl -L https://github.com/aptos-labs/aptos-core/releases/download/aptos-cli-v7.7.0/aptos-cli-7.7.0-Ubuntu-x86_64.zip -o aptos-cli.zip
   
   unzip aptos-cli.zip
   chmod +x aptos
   rm aptos-cli.zip
   ```

3. **Verify installation:**
   ```bash
   cd ../..
   ./tools/aptos/aptos --version
   ```

### Usage

After installation, use the CLI from the project root:

```bash
# Compile Move contracts
.\tools\aptos\aptos.exe move compile --dev    # Windows
./tools/aptos/aptos move compile --dev        # macOS/Linux

# Run tests
.\tools\aptos\aptos.exe move test             # Windows
./tools/aptos/aptos move test                 # macOS/Linux
```

### Alternative: Global Installation

If you prefer a global installation:

```bash
# Using Python pip
pip3 install aptos-cli

# Using Homebrew (macOS)
brew install aptos

# Then use simply:
aptos move compile --dev
aptos move test
```

---

**Note:** The local installation keeps your project self-contained and ensures everyone uses the same CLI version (7.7.0).
