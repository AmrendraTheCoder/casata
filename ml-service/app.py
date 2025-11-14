from flask import Flask, request, jsonify
from flask_cors import CORS
from scorer import calculate_migration_score, batch_score_opportunities
from predictor import predict_yield

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'YieldShift ML Service'}), 200

@app.route('/api/score', methods=['POST'])
def score_opportunity():
    """
    Score a single migration opportunity
    
    Expected JSON body:
    {
        "currentPosition": {
            "protocol": "aave-v3",
            "chain": "ethereum",
            "asset": "USDC",
            "amount": 12300,
            "currentApy": 8.1
        },
        "targetOpportunity": {
            "protocol": "aave-v3",
            "chain": "base",
            "targetApy": 14.2,
            "protocolSafetyScore": 9
        },
        "bridgeCost": 3.20,
        "gasCost": 0.80
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Calculate migration score
        result = calculate_migration_score(data)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/batch-score', methods=['POST'])
def batch_score():
    """
    Score multiple opportunities at once
    
    Expected JSON body:
    {
        "opportunities": [
            { ... opportunity data ... },
            { ... opportunity data ... }
        ]
    }
    """
    try:
        data = request.json
        
        if not data or 'opportunities' not in data:
            return jsonify({'error': 'No opportunities provided'}), 400
        
        opportunities = data['opportunities']
        
        # Batch score all opportunities
        scored_opportunities = batch_score_opportunities(opportunities)
        
        return jsonify({'scoredOpportunities': scored_opportunities}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict yield trend for a protocol/chain/asset combination
    
    Expected JSON body:
    {
        "protocol": "aave-v3",
        "chain": "base",
        "asset": "USDC"
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        protocol = data.get('protocol')
        chain = data.get('chain')
        asset = data.get('asset')
        
        # Get yield prediction
        prediction = predict_yield(protocol, chain, asset)
        
        return jsonify(prediction), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    # Use port 5001 to avoid conflict with macOS AirPlay Receiver (port 5000)
    port = int(os.environ.get('PORT', 5001))
    
    print("🚀 YieldShift ML Service starting...")
    print("📊 Endpoints available:")
    print("   GET  /health          - Health check")
    print("   POST /api/score       - Score single opportunity")
    print("   POST /api/batch-score - Score multiple opportunities")
    print("   POST /api/predict     - Predict yield trend")
    print(f"\n✅ Service running on http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=True)

