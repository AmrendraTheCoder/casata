#!/bin/bash

# Quick start script for ML Service
# Usage: chmod +x start.sh && ./start.sh

# Get the script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "🚀 Starting YieldShift ML Service"
echo "================================="
echo ""

# Check for Python in various locations
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif [ -f "$PROJECT_ROOT/.venv/bin/python" ]; then
    PYTHON_CMD="$PROJECT_ROOT/.venv/bin/python"
elif [ -f "$PROJECT_ROOT/.venv/bin/python3" ]; then
    PYTHON_CMD="$PROJECT_ROOT/.venv/bin/python3"
elif [ -f "/usr/bin/python3" ]; then
    PYTHON_CMD="/usr/bin/python3"
else
    echo "❌ Python 3 is not found"
    echo "   Install from: https://www.python.org/downloads/"
    echo "   Or create a virtual environment: python3 -m venv .venv"
    exit 1
fi

echo "✅ Python found: $($PYTHON_CMD --version)"
echo ""

# Check for virtual environment (prefer root .venv, then ml-service/venv)
VENV_PATH=""
if [ -d "$PROJECT_ROOT/.venv" ]; then
    VENV_PATH="$PROJECT_ROOT/.venv"
    echo "📦 Using root virtual environment: $VENV_PATH"
elif [ -d "$SCRIPT_DIR/venv" ]; then
    VENV_PATH="$SCRIPT_DIR/venv"
    echo "📦 Using ml-service virtual environment: $VENV_PATH"
else
    echo "📦 Creating virtual environment in ml-service..."
    $PYTHON_CMD -m venv "$SCRIPT_DIR/venv"
    VENV_PATH="$SCRIPT_DIR/venv"
    echo "✅ Virtual environment created"
fi
echo ""

# Activate venv
echo "🔌 Activating virtual environment..."
source "$VENV_PATH/bin/activate"
echo ""

# Get pip command
PIP_CMD="pip"
if ! command -v pip &> /dev/null; then
    if [ -f "$VENV_PATH/bin/pip" ]; then
        PIP_CMD="$VENV_PATH/bin/pip"
    elif [ -f "$VENV_PATH/bin/pip3" ]; then
        PIP_CMD="$VENV_PATH/bin/pip3"
    else
        echo "❌ pip not found in virtual environment"
        exit 1
    fi
fi

# Check if requirements are installed
if [ ! -f "$VENV_PATH/installed.txt" ]; then
    echo "📥 Installing dependencies..."
    $PIP_CMD install -r "$SCRIPT_DIR/requirements.txt"
    touch "$VENV_PATH/installed.txt"
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Get Python command from venv
VENV_PYTHON="$VENV_PATH/bin/python"
if [ ! -f "$VENV_PYTHON" ]; then
    VENV_PYTHON="$VENV_PATH/bin/python3"
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
echo "================================="
echo ""

cd "$SCRIPT_DIR"
$VENV_PYTHON app.py

