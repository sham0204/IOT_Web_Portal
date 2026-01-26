/**
 * Test script to simulate hardware sensor data for SmartDrishti IoT platform
 * This script sends simulated sensor readings to the backend to test the integration
 */

const axios = require('axios');

async function sendTestData() {
  console.log('Starting hardware simulation...');
  
  // Create an array of device IDs to simulate
  const devices = ['esp32-sim-001', 'esp32-sim-002', 'raspberry-pi-001'];
  
  setInterval(async () => {
    for (const deviceId of devices) {
      try {
        // Generate realistic sensor data
        const data = {
          deviceId: deviceId,
          temperature: 20 + Math.random() * 15, // Random temp between 20-35°C
          humidity: 40 + Math.random() * 30,    // Random humidity between 40-70%
          pressure: 1000 + Math.random() * 20,  // Random pressure between 1000-1020 hPa
          lightLevel: Math.floor(Math.random() * 1000), // Random light level 0-1000 lux
          motionDetected: Math.random() > 0.7 // Motion detected ~30% of the time
        };
        
        // Send data to the real-time endpoint which also broadcasts via WebSocket
        const response = await axios.post('http://localhost:5000/api/iot/sensor-data/realtime', data);
        console.log(`✓ Sent data for ${deviceId}:`, {
          temp: data.temperature.toFixed(2) + '°C',
          humidity: data.humidity.toFixed(1) + '%',
          pressure: data.pressure.toFixed(1) + ' hPa',
          light: data.lightLevel + ' lux'
        });
      } catch (error) {
        console.error(`✗ Error sending data for ${deviceId}:`, error.response?.data || error.message);
      }
    }
  }, 5000); // Send data every 5 seconds
}

// Also add a function to test device registration
async function registerTestDevices() {
  console.log('Registering test devices...');
  
  const testDevices = [
    { deviceId: 'esp32-sim-001', name: 'ESP32 Simulator 1', type: 'ESP32', location: 'Lab Room A' },
    { deviceId: 'esp32-sim-002', name: 'ESP32 Simulator 2', type: 'ESP32', location: 'Lab Room B' },
    { deviceId: 'raspberry-pi-001', name: 'Raspberry Pi Test', type: 'Raspberry Pi', location: 'Workshop' }
  ];
  
  for (const device of testDevices) {
    try {
      const response = await axios.post('http://localhost:5000/api/iot/devices', device);
      console.log(`✓ Registered device: ${device.deviceId}`);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('already exists')) {
        console.log(`- Device ${device.deviceId} already registered`);
      } else {
        console.error(`✗ Error registering ${device.deviceId}:`, error.message);
      }
    }
  }
}

// Run the test
async function runTest() {
  try {
    // First register test devices
    await registerTestDevices();
    
    // Wait a bit for registration to complete
    setTimeout(() => {
      // Start sending simulated data
      sendTestData();
    }, 2000);
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
runTest();

console.log('\nHardware simulation started!');
console.log('- Data will be sent every 5 seconds');
console.log('- Check your Live Monitor page for real-time updates');
console.log('- Press Ctrl+C to stop the simulation\n');