"""
Yield Predictor
Predicts yield trends for DeFi protocols
"""

import random

def predict_yield(protocol, chain, asset):
    """
    Predict yield trend for a protocol/chain/asset combination
    
    In a production environment, this would use ML models trained on historical data.
    For now, we return simple heuristic predictions.
    
    Args:
        protocol (str): Protocol name (e.g., 'aave-v3')
        chain (str): Chain name (e.g., 'base')
        asset (str): Asset symbol (e.g., 'USDC')
    
    Returns:
        dict: Prediction, confidence, and trend
    """
    
    # Simple heuristic predictions based on protocol and chain
    predictions = ['stable', 'increasing', 'decreasing']
    trends = ['up', 'neutral', 'down']
    
    # Bias towards stable for established protocols
    if protocol.lower() in ['aave-v3', 'compound-v3']:
        prediction = 'stable'
        confidence = 0.75 + random.random() * 0.15
        trend = 'neutral'
    elif chain.lower() == 'base':
        # Base often has higher yields due to incentives
        prediction = 'stable'
        confidence = 0.65 + random.random() * 0.20
        trend = 'up'
    else:
        # Random for others
        prediction = random.choice(predictions)
        confidence = 0.50 + random.random() * 0.30
        trend = random.choice(trends)
    
    return {
        'prediction': prediction,
        'confidence': round(confidence, 2),
        'trend': trend,
        'protocol': protocol,
        'chain': chain,
        'asset': asset
    }

