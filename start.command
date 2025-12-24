#!/bin/bash

# AIDO One-Click Starter for macOS
# Double-click this file to start the AIDO application

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
        echo "   Visit: https://nodejs.org/"
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
echo "   The application will open in your browser at:"
echo "   http://localhost:5173"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Open browser after a short delay
(sleep 3 && open http://localhost:5173) &

# Start the server
npm run dev

# Keep terminal open on error
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error: Server failed to start"
    echo ""
    read -p "Press Enter to close..."
fi
