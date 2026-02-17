const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Use local SQLite database for testing
const { initializeDatabase } = require('./db-local');

// Import routes
const projectRoutes = require('./routes/projects');
const stepRoutes = require('./routes/steps');
const uploadRoutes = require('./routes/uploads');
const authRoutes = require('./routes/auth');
const iotRoutes = require('./routes/iot');

// Import MQTT handler
const MqttHandler = require('./mqtt-handler');
const mqttHandler = new MqttHandler();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server and socket.io
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// Make io instance available globally for MQTT handler
global.appIO = io;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', stepRoutes);
app.use('/api', uploadRoutes);
app.use('/api/iot', iotRoutes);

// Base API endpoint - API documentation/info
app.get('/api', (req, res) => {
  res.json({
    message: 'SmartDrishti IoT Learning Platform API',
    version: '1.0.0',
    description: 'Backend API for IoT project management and learning',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      steps: '/api/projects/:projectId/steps',
      media: '/api/steps/:stepId/media',
      iot: '/api/iot/devices and /api/iot/sensor-data'
    },
    mqttStatus: mqttHandler.getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SmartDrishti Backend is running',
    mqttStatus: mqttHandler.getStatus(),
    timestamp: new Date().toISOString()
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('WebSocket client connected:', socket.id);
  
  // Join device-specific rooms
  socket.on('join-device', (deviceId) => {
    socket.join(`device-${deviceId}`);
    console.log(`Client ${socket.id} joined device room: ${deviceId}`);
  });
  
  // Leave device-specific rooms
  socket.on('leave-device', (deviceId) => {
    socket.leave(`device-${deviceId}`);
    console.log(`Client ${socket.id} left device room: ${deviceId}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('WebSocket client disconnected:', socket.id);
  });
});

// Store io instance for use in routes
app.set('io', io);

// Add real-time sensor data endpoint that broadcasts via WebSocket
app.post('/api/iot/sensor-data/realtime', async (req, res) => {
  try {
    const { deviceId, temperature, humidity, pressure, lightLevel, motionDetected } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Device ID is required' 
      });
    }
    
    // Store data in database (same as regular endpoint)
    const { query } = require('./db-local');
    
    // Check if device exists, if not create it
    let deviceResult = await query(`
      SELECT * FROM iot_devices WHERE device_id = ?
    `, [deviceId]);
    
    if (deviceResult.rows.length === 0) {
      await query(`
        INSERT INTO iot_devices (device_id, name, type, status, last_seen)
        VALUES (?, ?, 'auto-registered', 'online', datetime('now'))
      `, [deviceId, `Device-${deviceId}`]);
    } else {
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
    
    // Broadcast to all clients in the device room
    const io = req.app.get('io');
    const sensorData = {
      id: result.rows[0].id,
      deviceId,
      temperature,
      humidity,
      pressure,
      lightLevel,
      motionDetected: motionDetected || false,
      timestamp: new Date().toISOString()
    };
    
    io.to(`device-${deviceId}`).emit('sensor-data-update', sensorData);
    io.emit('all-devices-update', { deviceId, ...sensorData });
    
    res.json({ 
      success: true, 
      message: 'Sensor data received and broadcasted successfully',
      dataId: result.rows[0].id
    });
  } catch (error) {
    console.error('Error receiving real-time sensor data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to receive sensor data' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Seed demo projects
    const { seedDemoProjects } = require('./seed/demoProjects');
    await seedDemoProjects();
    
    // Initialize MQTT handler
    mqttHandler.connect();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔌 WebSocket available at ws://localhost:${PORT}`);
      console.log(`☁️  MQTT broker: ${process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();