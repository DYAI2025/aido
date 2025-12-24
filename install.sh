#!/bin/bash

# AIDO Installation Script
# Run this once to set up the application

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "═══════════════════════════════════════════════════════"
echo "  AIDO Installation"
echo "  AI-Driven Decentralized Organization"
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo ""

    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   On macOS, install Node.js from:"
        echo "   https://nodejs.org/"
        echo ""
        echo "   Or use Homebrew:"
        echo "   brew install node"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "   On Ubuntu/Debian, install with:"
        echo "   sudo apt update"
        echo "   sudo apt install nodejs npm"
        echo ""
        echo "   Or visit: https://nodejs.org/"
    fi

    echo ""
    read -p "Press Enter to close..."
    exit 1
else
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    echo "✅ Node.js detected: $NODE_VERSION"
    echo "✅ npm detected: $NPM_VERSION"
fi

echo ""
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."
echo ""

# Navigate to src directory and install
cd "$DIR/src"
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Installation failed"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ Installation Complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  You can now start AIDO:"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  macOS: Double-click 'start.command'"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "  Linux: Run './start.sh' or double-click 'AIDO.desktop'"
fi

echo ""
echo "  Or manually with: cd src && npm run dev"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""
read -p "Press Enter to close..."
