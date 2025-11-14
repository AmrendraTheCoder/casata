#!/bin/bash

# Simple start script using root .venv
# Usage: chmod +x start-simple.sh && ./start-simple.sh

# Get project root (parent of ml-service)
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
VENV_PYTHON="$PROJECT_ROOT/.venv/bin/python"

echo "🚀 Starting YieldShift ML Service (Simple Mode)"
echo "=============================================="
echo ""

# Check if .venv exists
if [ ! -f "$VENV_PYTHON" ]; then
    echo "❌ Virtual environment not found at: $PROJECT_ROOT/.venv"
    echo ""
    echo "Creating virtual environment..."
    cd "$PROJECT_ROOT"
    python3 -m venv .venv
    echo "Installing dependencies..."
    "$PROJECT_ROOT/.venv/bin/pip" install -r "$PROJECT_ROOT/ml-service/requirements.txt"
    echo "✅ Virtual environment created and dependencies installed"
    echo ""
fi

# Check if dependencies are installed
echo "🔍 Checking dependencies..."
if ! "$VENV_PYTHON" -c "import flask, flask_cors, numpy" 2>/dev/null; then
    echo "📥 Installing missing dependencies..."
    "$PROJECT_ROOT/.venv/bin/pip" install -r "$PROJECT_ROOT/ml-service/requirements.txt"
    echo "✅ Dependencies installed"
    echo ""
fi

# Start the service
echo "🎯 Starting ML Service on http://localhost:5001"
echo ""
echo "Available endpoints:"
echo "  GET  /health          - Health check"
echo "  POST /api/score       - Score single opportunity"
echo "  POST /api/batch-score - Score multiple opportunities"
echo "  POST /api/predict     - Predict yield trend"
echo ""
echo "Press Ctrl+C to stop"
echo "=============================================="
echo ""

cd "$( dirname "${BASH_SOURCE[0]}" )"
"$VENV_PYTHON" app.py

