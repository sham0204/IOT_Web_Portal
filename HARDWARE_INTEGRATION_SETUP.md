# SmartDrishti IoT Learning Platform - Hardware Integration Guide

This document explains how to set up real hardware integration with your SmartDrishti platform to receive live sensor readings.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Hardware Setup](#hardware-setup)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SQLite database (already configured)
- An MQTT broker (like Mosquitto) or use public brokers for testing
- IoT hardware (ESP32, Arduino, Raspberry Pi, etc.)
- Sensors (temperature, humidity, etc.)

## Backend Setup

### 1. Install Dependencies
The necessary dependencies for IoT integration have been added to your backend:
- `mqtt`: For MQTT communication with devices
- `socket.io`: For real-time WebSocket connections

### 2. Environment Variables
Update your `backend/.env` file with MQTT broker configuration:
```env
PORT=5000
DATABASE_URL=your_database_connection_string
FRONTEND_URL=http://localhost:5173
MQTT_BROKER_URL=mqtt://localhost:1883
```

### 3. Database Tables
The following tables have been created for storing IoT data:
- `iot_devices`: Stores information about connected devices
- `sensor_data`: Stores raw sensor readings
- `sensor_data_hourly`: Stores aggregated hourly data for performance

### 4. API Endpoints
New endpoints are available for IoT integration:
- `GET /api/iot/devices` - Get all registered devices
- `POST /api/iot/devices` - Register a new device
- `POST /api/iot/sensor-data` - Submit sensor data (HTTP)
- `POST /api/iot/sensor-data/realtime` - Submit sensor data with WebSocket broadcast
- `GET /api/iot/sensor-data/:deviceId` - Get sensor data for a specific device
- `GET /api/iot/sensor-data/latest/:deviceId` - Get latest sensor data for a device

## Frontend Setup

### 1. Live Monitor Component
The `LiveMonitor.tsx` component has been updated to:
- Connect to WebSocket server for real-time updates
- Display live sensor readings from connected devices
- Allow device selection and monitoring
- Show real-time charts with live data

### 2. Dependencies
The following dependencies have been added to the frontend:
- `socket.io-client`: For WebSocket communication with the backend

## Hardware Setup

### Option 1: ESP32/ESP8266 with Arduino IDE

1. Install the Arduino IDE and ESP32 board package
2. Install required libraries:
   - WiFi
   - HTTPClient
   - ArduinoJson (if using JSON for MQTT)

3. Create a new sketch with the following code:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>  // Include if you're sending JSON data

// Replace with your network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your server IP address
const char* serverName = "http://YOUR_SERVER_IP:5000/api/iot/sensor-data/realtime";

// Sensor pins (adjust according to your setup)
#define TEMP_SENSOR_PIN 4  // Example pin for temperature sensor

String deviceId = "esp32-" + String(ESP.getEfuseMac(), HEX);

unsigned long lastTime = 0;
unsigned long timerDelay = 5000;  // Send data every 5 seconds

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while(WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  // Initialize sensors
  pinMode(TEMP_SENSOR_PIN, INPUT);
}

void loop() {
  // Send data periodically
  if ((millis() - lastTime) > timerDelay) {
    // Read sensor values
    float temperature = analogRead(TEMP_SENSOR_PIN) * (3.3 / 4095.0) * 100; // Example conversion
    float humidity = 50.0 + (random(0, 20) - 10); // Example: simulate humidity
    
    // Prepare JSON payload
    HTTPClient http;
    
    String serverPath = serverName;
    
    http.begin(serverPath.c_str());
    
    // Specify content-type header
    http.addHeader("Content-Type", "application/json");
    
    // Create JSON object
    StaticJsonDocument<200> doc;
    doc["deviceId"] = deviceId;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    // Add more sensor values as needed
    // doc["pressure"] = pressure_value;
    // doc["lightLevel"] = light_value;
    // doc["motionDetected"] = motion_value;
    
    String payload;
    serializeJson(doc, payload);
    
    // Send HTTP POST request
    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    
    // Free resources
    http.end();
    
    lastTime = millis();
  }
}
```

### Option 2: Using MQTT Protocol

If you prefer MQTT communication, use this alternative ESP32 code:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Replace with your network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your MQTT Broker IP
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String deviceId = "esp32-" + String(ESP.getEfuseMac(), HEX);

long lastMsg = 0;
char msg[50];
int value = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(deviceId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("devices/" + deviceId + "/status", "online");
      // ... and resubscribe
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    // Read sensor values
    float temperature = analogRead(A0) * (3.3 / 4095.0) * 100; // Example conversion
    float humidity = 50.0 + (random(0, 20) - 10); // Example: simulate humidity

    // Create JSON object
    StaticJsonDocument<200> doc;
    doc["deviceId"] = deviceId;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    // Add more sensor values as needed
    
    char payload[256];
    serializeJson(doc, payload);
    
    // Publish sensor data
    String topic = "sensors/" + deviceId + "/data";
    client.publish(topic.c_str(), payload);
    
    Serial.print("Publishing to ");
    Serial.print(topic);
    Serial.print(": ");
    Serial.println(payload);
  }
}
```

## Running the System

### 1. Start the Backend Server
```bash
cd backend
npm install  # if dependencies haven't been installed
npm run dev  # for development mode with auto-restart
```

### 2. Start the Frontend
```bash
cd smartdrishti-platform
npm install  # if dependencies haven't been installed
npm run dev
```

### 3. Deploy Hardware Code
Upload the appropriate code to your IoT device based on your choice (HTTP or MQTT).

## Testing

### 1. Verify Backend Connection
- Check that the backend server is running on `http://localhost:5000`
- Visit `http://localhost:5000/api/health` to confirm the server is responding
- Check the console logs for MQTT connection status

### 2. Verify Frontend Connection
- Open the Live Monitor page in your browser
- Look for the connection status indicator (should show "Connected")
- Check the device selection dropdown to see registered devices

### 3. Simulate Sensor Data (Alternative Method)
If you don't have hardware yet, you can test with simulated data using this Node.js script:

```javascript
// test-hardware-simulation.js
const axios = require('axios');

async function sendTestData() {
  const devices = ['esp32-test-001', 'esp32-test-002'];
  
  setInterval(async () => {
    for (const deviceId of devices) {
      try {
        const data = {
          deviceId: deviceId,
          temperature: 20 + Math.random() * 15, // Random temp between 20-35°C
          humidity: 40 + Math.random() * 30,    // Random humidity between 40-70%
          pressure: 1000 + Math.random() * 20,  // Random pressure between 1000-1020 hPa
          lightLevel: Math.floor(Math.random() * 1000), // Random light level
          motionDetected: Math.random() > 0.7 // Motion detected 30% of the time
        };
        
        const response = await axios.post('http://localhost:5000/api/iot/sensor-data/realtime', data);
        console.log(`Sent data for ${deviceId}:`, response.data);
      } catch (error) {
        console.error(`Error sending data for ${deviceId}:`, error.message);
      }
    }
  }, 5000); // Send data every 5 seconds
}

sendTestData();
```

## Troubleshooting

### Common Issues

1. **WebSocket Connection Issues**
   - Ensure the backend server is running
   - Check CORS settings in the backend
   - Verify firewall settings aren't blocking WebSocket connections

2. **MQTT Connection Issues**
   - Verify MQTT broker is running
   - Check MQTT broker IP and port in environment variables
   - Ensure network connectivity between device and broker

3. **Database Connection Issues**
   - Verify SQLite database file permissions
   - Check database initialization in backend logs

4. **Sensor Data Not Appearing**
   - Check backend logs for incoming requests
   - Verify device registration in the `iot_devices` table
   - Ensure sensors are sending data in the correct format

### Debugging Tips

1. Check backend server logs for incoming connections and data
2. Use browser developer tools to inspect WebSocket connections
3. Verify sensor data format matches the expected schema
4. Test with the simulation script to isolate hardware issues

## Next Steps

1. **Expand Sensor Support**: Add support for more sensor types (gas sensors, accelerometers, etc.)
2. **Data Analytics**: Implement data analysis and trend reporting
3. **Alerting System**: Create alerts for out-of-range sensor values
4. **Mobile App**: Develop a mobile application for remote monitoring
5. **Cloud Deployment**: Deploy the backend to cloud providers for remote access