/**
 * Test script for the predictive maintenance AI feature
 * Demonstrates how to use the new predictive failure analysis endpoint
 */

const axios = require('axios');

async function testPredictiveMaintenance() {
  console.log('🧪 Testing Predictive Maintenance AI Feature\n');
  
  // Test with different devices
  const testDevices = ['esp32-sim-001', 'esp32-sim-002', 'raspberry-pi-001'];
  
  for (const deviceId of testDevices) {
    try {
      console.log(`🔍 Analyzing device: ${deviceId}`);
      
      const response = await axios.get(`http://localhost:5000/api/iot/devices/${deviceId}/predict-failure`);
      const analysis = response.data;
      
      console.log('📊 Analysis Results:');
      console.log(`   Failure Risk: ${analysis.failure_risk_percentage}%`);
      console.log(`   Confidence: ${analysis.confidence_level}`);
      console.log(`   Predicted Failure Window: ${analysis.predicted_failure_window}`);
      console.log(`   Recommendation: ${analysis.maintenance_recommendation}`);
      console.log('---');
      
    } catch (error) {
      console.error(`❌ Error analyzing ${deviceId}:`, error.response?.data || error.message);
    }
  }
  
  console.log('\n✅ Predictive maintenance testing completed!');
  console.log('\n💡 To use this feature in the UI:');
  console.log('1. Navigate to Live Monitor (/live-monitor)');
  console.log('2. Find your device in the device list');
  console.log('3. Click the "Predict" button next to the device');
  console.log('4. View detailed predictive maintenance analysis');
}

// Run the test
testPredictiveMaintenance().catch(console.error);