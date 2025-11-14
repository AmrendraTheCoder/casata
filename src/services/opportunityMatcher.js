import { getAssetOpportunities } from "./defiLlama";
import { generateRecommendations } from "./mlService";
import { PROTOCOLS } from "../utils/constants";

// Find migration opportunities for a single position
export const findOpportunitiesForPosition = async (position) => {
  try {
    // Get all opportunities for this asset from DefiLlama
    const allOpportunities = await getAssetOpportunities(position.asset);

    // Filter out current position and format opportunities
    const opportunities = allOpportunities
      .filter((opp) => {
        const oppChain = opp.chain.toLowerCase();
        const posChain = position.chain.toLowerCase();

        // Exclude same chain or if APY is lower
        return oppChain !== posChain && opp.apy > position.currentApy;
      })
      .map((opp) => {
        // Find protocol info
        const protocolEntry = Object.entries(PROTOCOLS).find(([, p]) =>
          opp.protocol.toLowerCase().includes(p.shortName.toLowerCase())
        );

        const protocolInfo = protocolEntry
          ? protocolEntry[1]
          : {
              name: opp.protocol,
              shortName: opp.protocol,
              safetyScore: 7,
              logo: "📊",
            };

        return {
          positionId: position.id,
          targetProtocol: protocolInfo.name,
          targetProtocolLogo: protocolInfo.logo,
          targetChain: opp.chain,
          targetChainId: getChainIdFromName(opp.chain),
          asset: position.asset,
          assetLogo: position.assetLogo || "💵",
          amount: position.amount,
          currentApy: position.currentApy,
          targetApy: opp.apy,
          apyDifferential: opp.apy - position.currentApy,
          protocolSafetyScore: protocolInfo.safetyScore,
          tvl: opp.tvl,
        };
      })
      .slice(0, 10); // Limit to top 10

    return opportunities;
  } catch (error) {
    console.error("Error finding opportunities for position:", error);
    return [];
  }
};

// Find opportunities for all positions
export const findAllOpportunities = async (positions) => {
  try {
    const allOpportunities = [];

    for (const position of positions) {
      const opportunities = await findOpportunitiesForPosition(position);
      allOpportunities.push(...opportunities);
    }

    return allOpportunities;
  } catch (error) {
    console.error("Error finding all opportunities:", error);
    return [];
  }
};

// Get scored and ranked opportunities
export const getScoredOpportunities = async (positions) => {
  try {
    // First, find all raw opportunities
    const rawOpportunities = await findAllOpportunities(positions);

    if (rawOpportunities.length === 0) {
      return [];
    }

    // Then, score them using ML service
    const scoredOpportunities = await generateRecommendations(
      positions,
      rawOpportunities
    );

    // Add additional metadata
    const enrichedOpportunities = scoredOpportunities.map((opp) => ({
      ...opp,
      socialProof: generateSocialProof(opp.score),
      timing: generateTimingRecommendation(opp.score, opp.apyDifferential),
      migrationSteps: generateMigrationSteps(opp),
    }));

    return enrichedOpportunities;
  } catch (error) {
    console.error("Error getting scored opportunities:", error);
    return [];
  }
};

// Generate social proof data (can be enhanced with real data later)
const generateSocialProof = (score) => {
  // Mock social proof based on score
  if (score >= 85) {
    return {
      similarWallets: Math.floor(40 + Math.random() * 20),
      avgGain: Math.floor(800 + Math.random() * 200),
      timeframe: "7 days",
    };
  } else if (score >= 70) {
    return {
      similarWallets: Math.floor(20 + Math.random() * 15),
      avgGain: Math.floor(500 + Math.random() * 300),
      timeframe: "14 days",
    };
  } else {
    return {
      similarWallets: Math.floor(5 + Math.random() * 10),
      avgGain: Math.floor(200 + Math.random() * 200),
      timeframe: "30 days",
    };
  }
};

// Generate timing recommendation
const generateTimingRecommendation = (score, apyDiff) => {
  if (score >= 85) {
    return {
      recommendation: "Move in next 48 hours",
      reason: `APY differential of ${apyDiff.toFixed(1)}% is exceptional`,
      urgency: "high",
    };
  } else if (score >= 70) {
    return {
      recommendation: "Good opportunity, consider this week",
      reason: "Strong yield improvement potential",
      urgency: "medium",
    };
  } else {
    return {
      recommendation: "Monitor for better timing",
      reason: "Moderate opportunity, wait for optimal conditions",
      urgency: "low",
    };
  }
};

// Generate migration steps
const generateMigrationSteps = (opportunity) => {
  const { amount, asset, targetProtocol, targetChain } = opportunity;

  // In a real app, you'd get the current position info
  const currentChain = "Ethereum"; // This should come from the position

  return [
    `Withdraw ${formatAmount(
      amount
    )} ${asset} from your current protocol on ${currentChain}`,
    `Bridge ${asset} from ${currentChain} to ${targetChain} (estimated fee: $${
      opportunity.costs?.bridge || 3.2
    })`,
    `Approve ${asset} for ${targetProtocol} on ${targetChain}`,
    `Deposit ${formatAmount(
      amount
    )} ${asset} to ${targetProtocol} on ${targetChain}`,
    `Start earning ${opportunity.targetApy.toFixed(2)}% APY`,
  ];
};

// Helper to get chain ID from name
const getChainIdFromName = (chainName) => {
  const chainMap = {
    ethereum: 1,
    base: 8453,
    arbitrum: 42161,
  };
  return chainMap[chainName.toLowerCase()] || 1;
};

// Helper to format amounts
const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Get best opportunity for a position
export const getBestOpportunity = (opportunities, positionId) => {
  const positionOpps = opportunities.filter(
    (opp) => opp.positionId === positionId
  );

  if (positionOpps.length === 0) return null;

  return positionOpps.reduce((best, current) =>
    current.score > best.score ? current : best
  );
};

// Filter opportunities by minimum score
export const filterByScore = (opportunities, minScore = 70) => {
  return opportunities.filter((opp) => opp.score >= minScore);
};

// Group opportunities by position
export const groupOpportunitiesByPosition = (opportunities) => {
  const grouped = {};

  opportunities.forEach((opp) => {
    if (!grouped[opp.positionId]) {
      grouped[opp.positionId] = [];
    }
    grouped[opp.positionId].push(opp);
  });

  // Sort each group by score
  Object.keys(grouped).forEach((positionId) => {
    grouped[positionId].sort((a, b) => b.score - a.score);
  });

  return grouped;
};
