const { query } = require('../db-local');

// Simple predictive maintenance heuristic: analyze recent sensor_data
const predictDeviceFailure = async (req, res) => {
  try {
    const { deviceId } = req.params;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'Device ID required' });
    }

    // Get recent sensor samples (last 24 hours)
    const result = await query(
      `SELECT temperature, humidity, pressure, timestamp FROM sensor_data WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100`,
      [deviceId]
    );

    const rows = result.rows || [];
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No sensor data for device' });
    }

    // Basic checks: temperature variance and increasing trend
    const temps = rows.map(r => Number(r.temperature)).filter(t => !isNaN(t));
    const avgTemp = temps.reduce((a,b)=>a+b,0)/temps.length;
    const tempVariance = temps.reduce((a,b)=>a+Math.pow(b-avgTemp,2),0)/temps.length;

    // Trend: compare last temp to earlier median
    const recent = temps.slice(0, Math.min(5, temps.length));
    const earlier = temps.slice(Math.min(5, temps.length), Math.min(20, temps.length));
    const recentAvg = recent.length ? recent.reduce((a,b)=>a+b,0)/recent.length : avgTemp;
    const earlierAvg = earlier.length ? earlier.reduce((a,b)=>a+b,0)/earlier.length : avgTemp;

    let risk = 'low';
    if (tempVariance > 25 || (recentAvg - earlierAvg) > 5) {
      risk = 'high';
    } else if (tempVariance > 10 || (recentAvg - earlierAvg) > 2) {
      risk = 'medium';
    }

    res.json({
      success: true,
      deviceId,
      riskLevel: risk,
      metrics: {
        samples: rows.length,
        avgTemp,
        tempVariance,
        recentAvg,
        earlierAvg
      }
    });
  } catch (error) {
    console.error('Predictive analysis error:', error);
    res.status(500).json({ success: false, error: 'Predictive analysis failed' });
  }
};

module.exports = { predictDeviceFailure };
