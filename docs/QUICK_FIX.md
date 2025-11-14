# ⚡ Quick Fix for ML Service

## Problem
You got `command not found: pip` and `command not found: python` errors.

## Solution ✅

You already have a virtual environment at `/Users/amrendravikramsingh/Desktop/casata/.venv` with all dependencies installed!

### Start ML Service (3 Ways)

**Option 1: Simple Script (Recommended)**
```bash
cd ml-service
./start-simple.sh
```

**Option 2: Direct Command**
```bash
cd ml-service
../.venv/bin/python app.py
```

**Option 3: Activate Venv First**
```bash
# From project root
source .venv/bin/activate
cd ml-service
python app.py
```

## Why This Happened

- `python` and `pip` aren't in your system PATH
- But they ARE in your `.venv` directory
- The scripts now use the full path: `../.venv/bin/python`

## Test It Works

```bash
# Start service (in one terminal)
cd ml-service
../.venv/bin/python app.py

# Test it (in another terminal)
curl http://localhost:5000/health
# Should return: {"status": "healthy", "service": "YieldShift ML Service"}
```

## All Fixed! 🎉

The ML service will now:
- ✅ Use your existing `.venv`
- ✅ Find Python automatically
- ✅ Start on port 5000
- ✅ Work with the frontend

---

**Next:** Start the frontend in another terminal: `npm run dev`

