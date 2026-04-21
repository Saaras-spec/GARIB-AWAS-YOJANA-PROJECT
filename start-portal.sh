#!/bin/bash

# Configuration
PORT=5001
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting Garib Awas Yojana Portal..."

# Navigate to project directory
cd "$PROJECT_DIR"

# Check if node_modules exists in root, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

# Check if node_modules exists in backend
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start the application in the background
echo "⚡ Launching Unified Application..."
npm start &

# Wait for Server to be ready
echo "🌐 Waiting for server to be ready..."
sleep 2

# Open the browser
echo "✨ Opening your project..."
open "http://localhost:$PORT"

echo "✅ App is running! You can keep this terminal open or minimize it."
echo "Press Ctrl+C to stop the server when you are done."

# Wait for the background process
wait
