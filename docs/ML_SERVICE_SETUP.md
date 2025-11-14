# 🐍 ML Service Setup Guide

Quick guide to get the Python ML service running.

## ✅ Quick Start (Using Existing .venv)

You already have a virtual environment at the project root. Use this simple command:

```bash
cd ml-service
./start-simple.sh
```

Or manually:

```bash
# From project root
cd ml-service
../.venv/bin/python app.py
```

## 🔧 Alternative: Using the Smart Start Script

The `start.sh` script automatically detects your setup:

```bash
cd ml-service
./start.sh
```

This script will:
- ✅ Find your Python installation
- ✅ Use root `.venv` if it exists
- ✅ Create `ml-service/venv` if needed
- ✅ Install dependencies automatically
- ✅ Start the service

## 📋 Manual Setup

If the scripts don't work, set up manually:

### Step 1: Activate Virtual Environment

```bash
# From project root
source .venv/bin/activate
```

### Step 2: Install Dependencies (if needed)

```bash
cd ml-service
pip install -r requirements.txt
```

### Step 3: Start Service

```bash
python app.py
```

## 🧪 Test the Service

Once running, test it:

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {"status": "healthy", "service": "YieldShift ML Service"}
```

Or use the test script:

```bash
# From project root
./scripts/test-ml-service.sh
```

## 🐛 Troubleshooting

### Issue: "command not found: python" or "command not found: pip"

**Solution:** Use the full path to the virtual environment:

```bash
# Instead of: python app.py
# Use:
../.venv/bin/python app.py

# Instead of: pip install
# Use:
../.venv/bin/pip install -r requirements.txt
```

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution:** Install dependencies:

```bash
# Activate venv first
source ../.venv/bin/activate

# Then install
pip install -r requirements.txt
```

### Issue: "Port 5000 already in use"

**Solution:** Kill the process or use a different port:

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in app.py (line 120):
# app.run(host='0.0.0.0', port=5001, debug=True)
```

### Issue: "Permission denied" when running script

**Solution:** Make script executable:

```bash
chmod +x start.sh
chmod +x start-simple.sh
```

## 📝 What the ML Service Does

The ML service provides AI-powered scoring for migration opportunities:

1. **Score Endpoint** (`/api/score`): Scores a single migration opportunity
2. **Batch Score** (`/api/batch-score`): Scores multiple opportunities at once
3. **Predict** (`/api/predict`): Predicts yield trends
4. **Health** (`/health`): Service health check

## 🔗 Integration with Frontend

The frontend automatically detects if the ML service is running:

- ✅ If running: Uses AI-powered scoring
- ❌ If not running: Falls back to client-side calculations

No configuration needed! Just start the service and the frontend will use it.

## 🚀 Running in Background

To run the service in the background:

```bash
# Using nohup
cd ml-service
nohup ../.venv/bin/python app.py > ml-service.log 2>&1 &

# Check if running
curl http://localhost:5000/health

# Stop it
pkill -f "python app.py"
```

## 📚 Next Steps

1. ✅ Start ML service: `cd ml-service && ./start-simple.sh`
2. ✅ Start frontend: `npm run dev` (in another terminal)
3. ✅ Test integration: Connect wallet and check browser console
4. ✅ See AI scores: Opportunities will have ML-powered scores

---

**Need help?** Check `INTEGRATION_GUIDE.md` for full setup instructions.

