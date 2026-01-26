const express = require('express');
const router = express.Router();
const { query } = require('../db-local');

// Get all IoT devices
router.get('/devices', async (req, res) => {
  try {
    const result = await query(`
      SELECT d.*, 
             COUNT(sd.id) as data_points,
             MAX(sd.timestamp) as last_data_point
      FROM iot_devices d
      LEFT JOIN sensor_data sd ON d.device_id = sd.device_id
      GROUP BY d.id
      ORDER BY d.last_seen DESC
    `);
    
    res.json({ 
      success: true, 
      devices: result.rows.map(row => ({
        id: row.id,
        deviceId: row.device_id,
        name: row.name,
        type: row.type,
        location: row.location,
        status: row.status,
        lastSeen: row.last_seen,
        dataPoints: row.data_points,
        lastDataPoint: row.last_data_point,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch devices' 
    });
  }
});

// Get device by ID
router.get('/devices/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const result = await query(`
      SELECT * FROM iot_devices WHERE device_id = ?
    `, [deviceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    res.json({ 
      success: true, 
      device: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch device' 
    });
  }
});

// Register new device
router.post('/devices', async (req, res) => {
  try {
    const { deviceId, name, type, location } = req.body;
    
    if (!deviceId || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Device ID and name are required' 
      });
    }
    
    const result = await query(`
      INSERT INTO iot_devices (device_id, name, type, location, status, last_seen)
      VALUES (?, ?, ?, ?, 'online', datetime('now'))
    `, [deviceId, name, type, location]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Device registered successfully',
      device: { id: result.rows[0].id, deviceId, name, type, location }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ 
        success: false, 
        error: 'Device ID already exists' 
      });
    }
    console.error('Error registering device:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to register device' 
    });
  }
});

// Update device status
router.put('/devices/:deviceId/status', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { status } = req.body;
    
    const result = await query(`
      UPDATE iot_devices 
      SET status = ?, last_seen = datetime('now')
      WHERE device_id = ?
    `, [status, deviceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Device status updated' 
    });
  } catch (error) {
    console.error('Error updating device status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update device status' 
    });
  }
});

// Receive sensor data from device
router.post('/sensor-data', async (req, res) => {
  try {
    const { deviceId, temperature, humidity, pressure, lightLevel, motionDetected } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Device ID is required' 
      });
    }
    
    // Check if device exists, if not create it
    let deviceResult = await query(`
      SELECT * FROM iot_devices WHERE device_id = ?
    `, [deviceId]);
    
    if (deviceResult.rows.length === 0) {
      // Auto-register device
      await query(`
        INSERT INTO iot_devices (device_id, name, type, status, last_seen)
        VALUES (?, ?, 'auto-registered', 'online', datetime('now'))
      `, [deviceId, `Device-${deviceId}`]);
    } else {
      // Update device status
      await query(`
        UPDATE iot_devices 
        SET status = 'online', last_seen = datetime('now')
        WHERE device_id = ?
      `, [deviceId]);
    }
    
    // Insert sensor data
    const result = await query(`
      INSERT INTO sensor_data 
      (device_id, temperature, humidity, pressure, light_level, motion_detected)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [deviceId, temperature, humidity, pressure, lightLevel, motionDetected || false]);
    
    res.json({ 
      success: true, 
      message: 'Sensor data received successfully',
      dataId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error receiving sensor data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to receive sensor data' 
    });
  }
});

// Get latest sensor data for a device
router.get('/sensor-data/latest/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const result = await query(`
      SELECT * FROM sensor_data 
      WHERE device_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [deviceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No sensor data found for this device' 
      });
    }
    
    res.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching latest sensor data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch sensor data' 
    });
  }
});

// Get sensor data for a device with time range
router.get('/sensor-data/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { hours = 24, limit = 100 } = req.query;
    
    const result = await query(`
      SELECT * FROM sensor_data 
      WHERE device_id = ? 
        AND timestamp >= datetime('now', '-${hours} hours')
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [deviceId, parseInt(limit)]);
    
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch sensor data' 
    });
  }
});

// Get aggregated sensor data (hourly averages)
router.get('/sensor-data/aggregated/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { days = 7 } = req.query;
    
    const result = await query(`
      SELECT * FROM sensor_data_hourly 
      WHERE device_id = ? 
        AND hour_start >= datetime('now', '-${days} days')
      ORDER BY hour_start DESC
    `, [deviceId]);
    
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching aggregated sensor data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch aggregated sensor data' 
    });
  }
});

// Get real-time device status
router.get('/devices/:deviceId/status', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    const result = await query(`
      SELECT 
        d.status,
        d.last_seen,
        CASE 
          WHEN d.last_seen >= datetime('now', '-5 minutes') THEN 'online'
          WHEN d.last_seen >= datetime('now', '-30 minutes') THEN 'idle'
          ELSE 'offline'
        END as real_status
      FROM iot_devices d
      WHERE d.device_id = ?
    `, [deviceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Device not found' 
      });
    }
    
    const device = result.rows[0];
    res.json({ 
      success: true, 
      status: device.real_status,
      lastSeen: device.last_seen
    });
  } catch (error) {
    console.error('Error fetching device status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch device status' 
    });
  }
});

module.exports = router;