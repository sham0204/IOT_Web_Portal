const { query } = require('../db-local');

// AI-based predictive maintenance analysis
const predictDeviceFailure = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    if (!deviceId) {
      return res.status(400).json({ 
        error: 'Device ID is required' 
      });
    }

    // Get device information
    const deviceResult = await query(`
      SELECT * FROM iot_devices WHERE device_id = ?
    `, [deviceId]);

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Device not found' 
      });
    }

    const device = deviceResult.rows[0];

    // Get historical sensor data (last 30 days)
    const sensorDataResult = await query(`
      SELECT 
        temperature, 
        humidity, 
        pressure, 
        light_level,
        motion_detected,
        timestamp
      FROM sensor_data 
      WHERE device_id = ? 
        AND timestamp >= datetime('now', '-30 days')
      ORDER BY timestamp ASC
    `, [deviceId]);

    const sensorData = sensorDataResult.rows;

    if (sensorData.length === 0) {
      return res.json({
        failure_risk_percentage: 0,
        predicted_failure_window: "Insufficient data",
        confidence_level: "LOW",
        maintenance_recommendation: "No historical data available for analysis"
      });
    }

    // Perform predictive analysis
    const analysis = analyzeDeviceHealth(sensorData, device);
    
    res.json(analysis);

  } catch (error) {
    console.error('Error in predictive maintenance analysis:', error);
    res.status(500).json({ 
      error: 'Failed to perform predictive analysis' 
    });
  }
};

// Core AI analysis function
function analyzeDeviceHealth(sensorData, device) {
  const analysis = {
    failure_risk_percentage: 0,
    predicted_failure_window: "",
    confidence_level: "HIGH",
    maintenance_recommendation: ""
  };

  // 1. Analyze temperature trends
  const temperatures = sensorData.map(d => d.temperature).filter(t => t !== null);
  const tempAnalysis = analyzeTemperatureTrend(temperatures);
  
  // 2. Analyze humidity trends
  const humidities = sensorData.map(d => d.humidity).filter(h => h !== null);
  const humidityAnalysis = analyzeHumidityTrend(humidities);
  
  // 3. Analyze data consistency and gaps
  const dataConsistency = analyzeDataConsistency(sensorData);
  
  // 4. Analyze device uptime patterns
  const uptimeAnalysis = analyzeDeviceUptime(sensorData);
  
  // 5. Calculate composite risk score
  let riskScore = 0;
  
  // Temperature contribution to risk (30% weight)
  if (tempAnalysis.risk_factor > 0) {
    riskScore += tempAnalysis.risk_factor * 0.3;
  }
  
  // Humidity contribution to risk (25% weight)
  if (humidityAnalysis.risk_factor > 0) {
    riskScore += humidityAnalysis.risk_factor * 0.25;
  }
  
  // Data consistency contribution (20% weight)
  riskScore += (1 - dataConsistency.consistency_score) * 0.2;
  
  // Uptime pattern contribution (25% weight)
  riskScore += uptimeAnalysis.interrupt_risk * 0.25;
  
  // Convert to percentage (0-100)
  analysis.failure_risk_percentage = Math.round(riskScore * 100);
  
  // Determine confidence level
  const dataPoints = sensorData.length;
  if (dataPoints < 50) {
    analysis.confidence_level = "LOW";
  } else if (dataPoints < 200) {
    analysis.confidence_level = "MEDIUM";
  }
  
  // Predict failure window based on risk level
  analysis.predicted_failure_window = predictFailureWindow(analysis.failure_risk_percentage);
  
  // Generate maintenance recommendation
  analysis.maintenance_recommendation = generateMaintenanceRecommendation(
    analysis.failure_risk_percentage,
    tempAnalysis,
    humidityAnalysis,
    dataConsistency,
    uptimeAnalysis
  );
  
  return analysis;
}

// Temperature trend analysis
function analyzeTemperatureTrend(temperatures) {
  if (temperatures.length === 0) {
    return { risk_factor: 0, trend: "stable" };
  }
  
  // Calculate moving averages
  const recentTemps = temperatures.slice(-10); // Last 10 readings
  const olderTemps = temperatures.slice(-20, -10); // Previous 10 readings
  
  const recentAvg = recentTemps.reduce((a, b) => a + b, 0) / recentTemps.length;
  const olderAvg = olderTemps.length > 0 ? 
    olderTemps.reduce((a, b) => a + b, 0) / olderTemps.length : recentAvg;
  
  // Check for overheating (above 40°C)
  const overheatCount = temperatures.filter(t => t > 40).length;
  const overheatRisk = overheatCount / temperatures.length;
  
  // Check for rapid temperature changes
  let tempChanges = 0;
  for (let i = 1; i < temperatures.length; i++) {
    if (Math.abs(temperatures[i] - temperatures[i-1]) > 5) {
      tempChanges++;
    }
  }
  const volatilityRisk = tempChanges / (temperatures.length - 1);
  
  // Overall risk factor (0-1)
  let risk_factor = 0;
  if (recentAvg > 38) risk_factor += 0.4; // High temperature risk
  if (recentAvg > olderAvg + 2) risk_factor += 0.3; // Increasing trend
  risk_factor += overheatRisk * 0.2; // Overheating frequency
  risk_factor += volatilityRisk * 0.1; // Temperature instability
  
  risk_factor = Math.min(risk_factor, 1); // Cap at 1.0
  
  const trend = recentAvg > olderAvg ? "increasing" : 
                recentAvg < olderAvg ? "decreasing" : "stable";
  
  return { risk_factor, trend, recent_avg: recentAvg, overheat_incidents: overheatCount };
}

// Humidity trend analysis
function analyzeHumidityTrend(humidities) {
  if (humidities.length === 0) {
    return { risk_factor: 0, trend: "stable" };
  }
  
  const recentHumidities = humidities.slice(-10);
  const olderHumidities = humidities.slice(-20, -10);
  
  const recentAvg = recentHumidities.reduce((a, b) => a + b, 0) / recentHumidities.length;
  const olderAvg = olderHumidities.length > 0 ? 
    olderHumidities.reduce((a, b) => a + b, 0) / olderHumidities.length : recentAvg;
  
  // Check for extreme humidity conditions
  const highHumidityCount = humidities.filter(h => h > 75).length;
  const lowHumidityCount = humidities.filter(h => h < 25).length;
  const extremeHumidityRisk = (highHumidityCount + lowHumidityCount) / humidities.length;
  
  // Risk factor calculation
  let risk_factor = 0;
  if (recentAvg > 70 || recentAvg < 30) risk_factor += 0.3; // Extreme conditions
  if (Math.abs(recentAvg - olderAvg) > 5) risk_factor += 0.2; // Rapid changes
  risk_factor += extremeHumidityRisk * 0.5; // Frequency of extreme conditions
  
  risk_factor = Math.min(risk_factor, 1);
  
  const trend = recentAvg > olderAvg ? "increasing" : 
                recentAvg < olderAvg ? "decreasing" : "stable";
  
  return { risk_factor, trend, recent_avg: recentAvg };
}

// Data consistency analysis
function analyzeDataConsistency(sensorData) {
  if (sensorData.length === 0) {
    return { consistency_score: 0, gaps_detected: 0 };
  }
  
  // Check for data gaps (missing readings)
  const timestamps = sensorData.map(d => new Date(d.timestamp));
  let gaps = 0;
  let totalExpectedReadings = 0;
  
  // Assume readings should come every 5 minutes (based on typical IoT setups)
  const expectedInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  for (let i = 1; i < timestamps.length; i++) {
    const timeDiff = timestamps[i] - timestamps[i-1];
    const expectedReadings = Math.floor(timeDiff / expectedInterval);
    if (expectedReadings > 1) {
      gaps += (expectedReadings - 1);
    }
    totalExpectedReadings += expectedReadings;
  }
  
  // Consistency score (1 = perfect, 0 = worst)
  const consistency_score = totalExpectedReadings > 0 ? 
    (sensorData.length - gaps) / totalExpectedReadings : 0;
  
  return { 
    consistency_score: Math.max(0, Math.min(1, consistency_score)),
    gaps_detected: gaps,
    data_frequency_issues: gaps > sensorData.length * 0.1 // More than 10% gaps
  };
}

// Device uptime analysis
function analyzeDeviceUptime(sensorData) {
  if (sensorData.length === 0) {
    return { interrupt_risk: 1, uptime_percentage: 0 };
  }
  
  // Check for periods of no data (device offline)
  const timestamps = sensorData.map(d => new Date(d.timestamp));
  let offlinePeriods = 0;
  const offlineThreshold = 30 * 60 * 1000; // 30 minutes
  
  for (let i = 1; i < timestamps.length; i++) {
    const gap = timestamps[i] - timestamps[i-1];
    if (gap > offlineThreshold) {
      offlinePeriods++;
    }
  }
  
  // Interrupt risk based on offline periods
  const interrupt_risk = Math.min(1, offlinePeriods / Math.max(1, sensorData.length / 100));
  
  // Uptime percentage
  const totalDays = 30; // Analysis period
  const activeDays = totalDays - (offlinePeriods * 0.5); // Assume each offline period affects 0.5 day
  const uptime_percentage = Math.max(0, Math.min(100, (activeDays / totalDays) * 100));
  
  return { interrupt_risk, uptime_percentage, offline_periods: offlinePeriods };
}

// Predict failure window based on risk percentage
function predictFailureWindow(riskPercentage) {
  if (riskPercentage >= 80) {
    return "1-7 days";
  } else if (riskPercentage >= 60) {
    return "1-4 weeks";
  } else if (riskPercentage >= 40) {
    return "1-3 months";
  } else if (riskPercentage >= 20) {
    return "3-6 months";
  } else {
    return "No immediate risk";
  }
}

// Generate maintenance recommendations
function generateMaintenanceRecommendation(riskPercentage, tempAnalysis, humidityAnalysis, dataConsistency, uptimeAnalysis) {
  const recommendations = [];
  
  if (riskPercentage >= 80) {
    recommendations.push("IMMEDIATE ACTION REQUIRED - Critical failure risk detected");
    recommendations.push("Schedule emergency maintenance within 24-48 hours");
  } else if (riskPercentage >= 60) {
    recommendations.push("High priority maintenance recommended within 1-2 weeks");
  } else if (riskPercentage >= 40) {
    recommendations.push("Plan preventive maintenance within 1 month");
  } else if (riskPercentage >= 20) {
    recommendations.push("Consider preventive maintenance within 3 months");
  } else {
    recommendations.push("Device operating normally - routine monitoring recommended");
  }
  
  // Specific recommendations based on analysis
  if (tempAnalysis.risk_factor > 0.5) {
    recommendations.push(`Temperature concerns detected: Current avg ${tempAnalysis.recent_avg.toFixed(1)}°C`);
    if (tempAnalysis.overheat_incidents > 0) {
      recommendations.push(`${tempAnalysis.overheat_incidents} overheating incidents recorded`);
    }
  }
  
  if (humidityAnalysis.risk_factor > 0.5) {
    recommendations.push(`Humidity issues detected: Current avg ${humidityAnalysis.recent_avg.toFixed(1)}%`);
  }
  
  if (dataConsistency.gaps_detected > 0) {
    recommendations.push(`${dataConsistency.gaps_detected} data transmission gaps detected`);
  }
  
  if (uptimeAnalysis.offline_periods > 0) {
    recommendations.push(`${uptimeAnalysis.offline_periods} offline periods detected affecting ${uptimeAnalysis.uptime_percentage.toFixed(1)}% uptime`);
  }
  
  return recommendations.join(". ") + ".";
}

module.exports = {
  predictDeviceFailure
};