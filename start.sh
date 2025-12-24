#!/bin/bash

# AIDO One-Click Starter for Linux Ubuntu
# Run this script to start the AIDO application
# You can also create a desktop shortcut to this file

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the source directory
cd "$DIR/src"

echo "═══════════════════════════════════════════════════════"
echo "  AIDO - AI-Driven Decentralized Organization"
echo "  Starting Application..."
echo "═══════════════════════════════════════════════════════"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies for the first time..."
    echo "   This may take a few minutes..."
    echo ""
    npm install

    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Error: Failed to install dependencies"
        echo "   Please make sure Node.js and npm are installed"
        echo ""
        echo "   On Ubuntu, install with:"
        echo "   sudo apt update"
        echo "   sudo apt install nodejs npm"
        echo ""
        read -p "Press Enter to close..."
        exit 1
    fi

    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
fi

# Start the development server
echo "🚀 Starting AIDO development server..."
echo ""
echo "   The application will be available at:"
echo "   http://localhost:5173"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Try to open browser after a short delay (works on most Linux desktops)
(sleep 3 && xdg-open http://localhost:5173 2>/dev/null) &

# Start the server
npm run dev

# Keep terminal open on error
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error: Server failed to start"
    echo ""
    read -p "Press Enter to close..."
fi
