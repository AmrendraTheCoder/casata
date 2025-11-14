"""
Migration Score Calculator
Calculates the migration score for DeFi yield opportunities
"""

import math

def calculate_migration_score(data):
    """
    Calculate migration score based on multiple factors
    
    Args:
        data (dict): Contains currentPosition, targetOpportunity, bridgeCost, gasCost
    
    Returns:
        dict: Score, annual gain, breakeven time, and costs
    """
    try:
        current_position = data.get('currentPosition', {})
        target_opportunity = data.get('targetOpportunity', {})
        bridge_cost = data.get('bridgeCost', 3.20)
        gas_cost = data.get('gasCost', 0.80)
        
        # Extract values
        amount = current_position.get('amount', 0)
        current_apy = current_position.get('currentApy', 0)
        target_apy = target_opportunity.get('targetApy', 0)
        protocol_safety_score = target_opportunity.get('protocolSafetyScore', 8)
        
        # Calculate APY differential score (40% weight)
        apy_diff = target_apy - current_apy
        apy_diff_percent = (apy_diff / current_apy * 100) if current_apy > 0 else 0
        apy_score = min(100, max(0, apy_diff_percent * 5))  # Scale to 0-100
        
        # Protocol safety score (30% weight) - Already 0-10, scale to 0-100
        safety_score = protocol_safety_score * 10
        
        # Cost efficiency score (20% weight)
        total_cost = bridge_cost + gas_cost
        cost_percent = (total_cost / amount * 100) if amount > 0 else 100
        cost_score = max(0, 100 - cost_percent * 20)
        
        # Timing factor (10% weight) - Assume moderate gas for now
        gas_price = 25  # Gwei
        average_gas_price = 30  # Gwei
        if gas_price <= average_gas_price:
            timing_score = 100
        else:
            timing_score = max(0, 100 - ((gas_price - average_gas_price) / average_gas_price) * 100)
        
        # Calculate weighted score
        final_score = (
            apy_score * 0.40 +
            safety_score * 0.30 +
            cost_score * 0.20 +
            timing_score * 0.10
        )
        
        final_score = round(min(100, max(0, final_score)))
        
        # Calculate annual gain
        current_annual_yield = amount * current_apy / 100
        target_annual_yield = amount * target_apy / 100
        annual_gain = target_annual_yield - current_annual_yield - total_cost
        
        # Calculate breakeven time
        daily_gain = (target_annual_yield - current_annual_yield) / 365
        breakeven_days = total_cost / daily_gain if daily_gain > 0 else float('inf')
        
        return {
            'score': final_score,
            'annualGain': max(0, annual_gain),
            'breakeven': breakeven_days,
            'costs': {
                'bridge': bridge_cost,
                'gas': gas_cost,
                'total': total_cost
            }
        }
        
    except Exception as e:
        print(f"Error calculating score: {str(e)}")
        return {
            'score': 0,
            'annualGain': 0,
            'breakeven': float('inf'),
            'costs': {
                'bridge': 0,
                'gas': 0,
                'total': 0
            }
        }

def batch_score_opportunities(opportunities):
    """
    Score multiple opportunities at once
    
    Args:
        opportunities (list): List of opportunity data dicts
    
    Returns:
        list: List of opportunities with scores
    """
    scored = []
    
    for opp in opportunities:
        score_result = calculate_migration_score(opp)
        scored_opp = {**opp, **score_result}
        scored.append(scored_opp)
    
    return scored

