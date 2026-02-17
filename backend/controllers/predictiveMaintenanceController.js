const { query } = require('../db-local');

// Predictive maintenance controller
const predictDeviceFailure = async (req, res) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    // Get device info
    const deviceResult = await query(
      `SELECT * FROM iot_devices WHERE device_id = ?`,
      [deviceId]
    );

    if (!deviceResult.rows.length) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const device = deviceResult.rows[0];

    // Get last 30 days sensor data
    const sensorDataResult = await query(
      `SELECT temperature, humidity, pressure, light_level, motion_detected, timestamp
       FROM sensor_data
       WHERE device_id = ?
       ORDER BY timestamp ASC`,
      [deviceId]
    );

    const sensorData = sensorDataResult.rows;

    if (!sensorData.length) {
      return res.json({
        failure_risk_percentage: 0,
        predicted_failure_window: "Insufficient data",
        confidence_level: "LOW",
        maintenance_recommendation: "No historical data available"
      });
    }

    const analysis = analyzeDeviceHealth(sensorData, device);

    res.json(analysis);

  } catch (error) {
    console.error('Predictive maintenance error:', error);
    res.status(500).json({ error: 'Predictive analysis failed' });
  }
};

// ---------- ANALYSIS FUNCTIONS ----------

function analyzeDeviceHealth(sensorData) {
  const temps = sensorData.map(d => Number(d.temperature)).filter(Boolean);
  const hums = sensorData.map(d => Number(d.humidity)).filter(Boolean);

  const avgTemp = temps.reduce((a,b)=>a+b,0)/temps.length || 0;
  const avgHum  = hums.reduce((a,b)=>a+b,0)/hums.length || 0;

  let risk = 0;

  if (avgTemp > 40) risk += 0.4;
  if (avgHum > 80 || avgHum < 20) risk += 0.3;

  // data gaps
  let gaps = 0;
  for (let i=1;i<sensorData.length;i++){
    const diff = new Date(sensorData[i].timestamp) - new Date(sensorData[i-1].timestamp);
    if (diff > 30*60*1000) gaps++;
  }
  risk += Math.min(0.3, gaps/10);

  const percentage = Math.round(Math.min(1,risk)*100);

  return {
    failure_risk_percentage: percentage,
    predicted_failure_window: predictFailureWindow(percentage),
    confidence_level: sensorData.length > 100 ? "HIGH" : "MEDIUM",
    maintenance_recommendation: generateRecommendation(percentage, avgTemp, avgHum, gaps)
  };
}

function predictFailureWindow(risk){
  if(risk>=80) return "1-7 days";
  if(risk>=60) return "1-4 weeks";
  if(risk>=40) return "1-3 months";
  if(risk>=20) return "3-6 months";
  return "No immediate risk";
}

function generateRecommendation(risk,temp,hum,gaps){
  let r=[];

  if(risk>=80) r.push("Immediate maintenance required");
  else if(risk>=60) r.push("Schedule maintenance soon");
  else r.push("Device operating normally");

  if(temp>40) r.push(`High temperature detected (${temp.toFixed(1)}°C)`);
  if(hum>80||hum<20) r.push(`Humidity abnormal (${hum.toFixed(1)}%)`);
  if(gaps>0) r.push(`${gaps} communication gaps detected`);

  return r.join(". ") + ".";
}

module.exports = { predictDeviceFailure };
