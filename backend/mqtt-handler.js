const mqtt = require('mqtt');
const { query } = require('./db-local');

class MqttHandler {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.options = {
      clientId: 'smartdrishti-backend-' + Math.random().toString(16).substr(2, 8),
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      // If using authentication, uncomment and set credentials
      // username: process.env.MQTT_USERNAME,
      // password: process.env.MQTT_PASSWORD,
    };
  }

  connect(brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883') {
    console.log('Connecting to MQTT broker:', brokerUrl);
    
    this.client = mqtt.connect(brokerUrl, this.options);

    this.client.on('connect', () => {
      console.log('MQTT Client connected to broker');
      this.isConnected = true;
      
      // Subscribe to sensor data topics
      this.client.subscribe('sensors/+/data', (err) => {
        if (err) {
          console.error('MQTT subscription error:', err);
        } else {
          console.log('Subscribed to sensor data topics');
        }
      });
      
      // Subscribe to device status topics
      this.client.subscribe('devices/+/status', (err) => {
        if (err) {
          console.error('MQTT subscription error:', err);
        } else {
          console.log('Subscribed to device status topics');
        }
      });
    });

    this.client.on('error', (error) => {
      console.error('MQTT Client Error:', error);
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log('MQTT Client attempting to reconnect');
    });

    this.client.on('close', () => {
      console.log('MQTT Client disconnected');
      this.isConnected = false;
    });

    // Handle incoming messages
    this.client.on('message', async (topic, message) => {
      try {
        console.log(`Received MQTT message on topic: ${topic}`);
        await this.handleMessage(topic, message);
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });
  }

  async handleMessage(topic, message) {
    try {
      const payload = message.toString();
      console.log(`Processing MQTT message: ${payload}`);

      // Parse the topic to determine the type
      const topicParts = topic.split('/');
      const deviceType = topicParts[0];
      const deviceId = topicParts[1];
      const dataType = topicParts[2];

      if (deviceType === 'sensors' && dataType === 'data') {
        // Parse sensor data
        const sensorData = JSON.parse(payload);
        await this.processSensorData(deviceId, sensorData);
      } else if (deviceType === 'devices' && dataType === 'status') {
        // Parse device status
        const statusData = JSON.parse(payload);
        await this.processDeviceStatus(deviceId, statusData);
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error, 'Topic:', topic, 'Payload:', message.toString());
    }
  }

  async processSensorData(deviceId, sensorData) {
    try {
      console.log(`Processing sensor data for device: ${deviceId}`, sensorData);
      
      // Check if device exists, if not create it
      let deviceResult = await query(`
        SELECT * FROM iot_devices WHERE device_id = ?
      `, [deviceId]);
      
      if (deviceResult.rows.length === 0) {
        await query(`
          INSERT INTO iot_devices (device_id, name, type, status, last_seen)
          VALUES (?, ?, 'ESP32', 'online', datetime('now'))
        `, [deviceId, `ESP32-${deviceId}`]);
      } else {
        await query(`
          UPDATE iot_devices 
          SET status = 'online', last_seen = datetime('now')
          WHERE device_id = ?
        `, [deviceId]);
      }
      
      // Insert sensor data into database
      await query(`
        INSERT INTO sensor_data 
        (device_id, temperature, humidity, pressure, light_level, motion_detected)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        deviceId,
        sensorData.temperature || null,
        sensorData.humidity || null,
        sensorData.pressure || null,
        sensorData.light_level || null,
        sensorData.motion_detected || false
      ]);
      
      // Emit WebSocket event for real-time updates
      const io = global.appIO; // Assuming you store io instance globally
      if (io) {
        const eventData = {
          deviceId,
          ...sensorData,
          timestamp: new Date().toISOString()
        };
        
        io.to(`device-${deviceId}`).emit('sensor-data-update', eventData);
        io.emit('all-devices-update', eventData);
      }
      
      console.log(`Sensor data saved for device: ${deviceId}`);
    } catch (error) {
      console.error('Error processing sensor data:', error);
    }
  }

  async processDeviceStatus(deviceId, statusData) {
    try {
      console.log(`Processing status for device: ${deviceId}`, statusData);
      
      // Update device status in database
      await query(`
        UPDATE iot_devices 
        SET status = ?, last_seen = datetime('now')
        WHERE device_id = ?
      `, [statusData.status || 'online', deviceId]);
      
      console.log(`Device status updated for: ${deviceId}`);
    } catch (error) {
      console.error('Error processing device status:', error);
    }
  }

  // Publish message to MQTT broker
  publish(topic, message) {
    if (this.client && this.isConnected) {
      this.client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
        if (err) {
          console.error('Error publishing MQTT message:', err);
        } else {
          console.log(`Published to ${topic}:`, message);
        }
      });
    } else {
      console.warn('MQTT client not connected, cannot publish:', topic);
    }
  }

  // Disconnect from MQTT broker
  disconnect() {
    if (this.client) {
      this.client.end(true, () => {
        console.log('MQTT client disconnected');
        this.isConnected = false;
      });
    }
  }

  // Get connection status
  getStatus() {
    return {
      isConnected: this.isConnected,
      clientId: this.options.clientId
    };
  }
}

module.exports = MqttHandler;