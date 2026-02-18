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

  /**
   * Connect to MQTT broker.
   *
   * - Uses localhost only for development.
   * - In production, set MQTT_URL (or MQTT_BROKER_URL) environment variable.
   * - Falls back to public broker if not set.
   */
  connect() {
    // Use MQTT_URL or MQTT_BROKER_URL env, fallback to public broker for production safety
    const brokerUrl = process.env.MQTT_URL || process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com:1883';
    console.log('[MQTT] Connecting to broker:', brokerUrl);

    try {
      this.client = mqtt.connect(brokerUrl, this.options);
    } catch (err) {
      // Catch synchronous errors (rare)
      console.error('[MQTT] Connection threw error:', err.message);
      this.isConnected = false;
      return;
    }

    this.client.on('connect', () => {
      console.log('[MQTT] Connected successfully');
      this.isConnected = true;

      // Subscribe to sensor data topics (keep unchanged)
      this.client.subscribe('sensors/+/data', (err) => {
        if (err) {
          console.error('[MQTT] Subscription error:', err);
        } else {
          console.log('[MQTT] Subscribed to sensor data topics');
        }
      });

      // Subscribe to device status topics (keep unchanged)
      this.client.subscribe('devices/+/status', (err) => {
        if (err) {
          console.error('[MQTT] Subscription error:', err);
        } else {
          console.log('[MQTT] Subscribed to device status topics');
        }
      });
    });

    this.client.on('error', (err) => {
      // Log error, do not crash app
      console.error('[MQTT] Error:', err.message);
      this.isConnected = false;
      // Optionally, you could implement a retry/backoff here
    });

    this.client.on('reconnect', () => {
      console.log('[MQTT] Attempting to reconnect...');
    });

    this.client.on('close', () => {
      console.log('[MQTT] Disconnected');
      this.isConnected = false;
    });

    // Handle incoming messages (keep unchanged)
    this.client.on('message', async (topic, message) => {
      try {
        console.log(`[MQTT] Received message on topic: ${topic}`);
        await this.handleMessage(topic, message);
      } catch (error) {
        console.error('[MQTT] Error processing message:', error);
      }
    });
  }

  async handleMessage(topic, message) {
    const payload = message.toString();
    console.log(`Processing MQTT message: ${payload}`);

    // Parse the topic to determine the type
    const topicParts = topic.split('/');
    const deviceType = topicParts[0];
    const deviceId = topicParts[1];
    const dataType = topicParts[2];

    // Try to parse as JSON, fallback to plain text
    let data = null;
    let isJson = false;
    try {
      data = JSON.parse(payload);
      isJson = true;
      console.log('MQTT JSON:', data);
    } catch (err) {
      // Not valid JSON, treat as plain text
      data = payload;
      console.log('MQTT TEXT:', data);
    }

    // Handle sensor data (expecting JSON)
    if (deviceType === 'sensors' && dataType === 'data' && isJson) {
      await this.processSensorData(deviceId, data);
      return;
    }

    // Handle device status (can be JSON or plain text)
    if (deviceType === 'devices' && dataType === 'status') {
      if (isJson) {
        await this.processDeviceStatus(deviceId, data);
      } else if (typeof data === 'string' && (data === 'online' || data === 'offline')) {
        // Log and optionally update DB for plain text status
        console.log(`Device ${deviceId} is now: ${data}`);
        // Example: update DB if needed
        try {
          await query(`UPDATE iot_devices SET status = ?, last_seen = datetime('now') WHERE device_id = ?`, [data, deviceId]);
        } catch (dbErr) {
          console.error('Error updating device status for plain text:', dbErr);
        }
      } else {
        console.warn('Unknown device status payload:', data);
      }
      return;
    }
    // For other topics, just log
    if (!isJson) {
      // No crash, just log
      console.warn('Received non-JSON MQTT message for topic:', topic);
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