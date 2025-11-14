# 🔧 Port 5000 → 5001 Fix

## Issue
Port 5000 was already in use by macOS AirPlay Receiver, preventing the ML service from starting.

## Solution ✅
Changed ML service to use **port 5001** by default.

## What Was Updated

1. ✅ `ml-service/app.py` - Changed default port to 5001
2. ✅ `src/services/mlService.js` - Updated default URL to port 5001
3. ✅ `scripts/test-ml-service.sh` - Updated test script
4. ✅ `ml-service/start.sh` - Updated startup message
5. ✅ `ml-service/start-simple.sh` - Updated startup message

## Current Status

✅ **ML Service is running on port 5001**

Test it:
```bash
curl http://localhost:5001/health
```

Should return:
```json
{
  "service": "YieldShift ML Service",
  "status": "healthy"
}
```

## How to Use

### Start ML Service

```bash
cd ml-service
./start-simple.sh
```

The service will start on **http://localhost:5001**

### Frontend Integration

The frontend automatically uses port 5001. No changes needed!

If you want to use a different port, set in `.env`:
```env
VITE_ML_SERVICE_URL=http://localhost:YOUR_PORT
```

### Test the Service

```bash
# Health check
curl http://localhost:5001/health

# Or use the test script
./scripts/test-ml-service.sh
```

## Why Port 5001?

- Port 5000 is commonly used by macOS AirPlay Receiver
- Port 5001 avoids this conflict
- You can still use port 5000 by setting `PORT=5000` environment variable

## Custom Port

To use a different port:

```bash
# Set environment variable
export PORT=5002
cd ml-service
./start-simple.sh
```

Or in `.env`:
```env
VITE_ML_SERVICE_URL=http://localhost:5002
```

---

**All fixed!** The ML service is now running and accessible. 🎉

