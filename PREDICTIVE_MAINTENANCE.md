# Predictive Maintenance AI Feature

## Overview
The SmartDrishti platform now includes an advanced AI-powered predictive maintenance system that analyzes IoT device sensor data to predict potential failures before they occur.

## How It Works

### Data Analysis Components
The system analyzes multiple factors from the last 30 days of sensor data:

1. **Temperature Trends** (30% weight)
   - Monitors for overheating (>40°C)
   - Detects increasing temperature patterns
   - Identifies temperature volatility

2. **Humidity Analysis** (25% weight)
   - Checks for extreme humidity conditions (<25% or >75%)
   - Monitors rapid humidity changes
   - Evaluates exposure to moisture

3. **Data Consistency** (20% weight)
   - Detects data transmission gaps
   - Monitors communication reliability
   - Identifies sensor malfunctions

4. **Device Uptime Patterns** (25% weight)
   - Tracks offline periods
   - Calculates uptime percentage
   - Identifies intermittent connectivity issues

### Risk Calculation
The system combines all factors into a composite risk score (0-100%):
- **0-19%**: Minimal risk - Normal operation
- **20-39%**: Low risk - Routine monitoring recommended
- **40-59%**: Medium risk - Consider preventive maintenance within 3 months
- **60-79%**: High risk - Plan preventive maintenance within 1 month
- **80-100%**: Critical risk - Immediate action required

### Failure Prediction Windows
Based on the risk percentage, the system predicts when failure might occur:
- **80-100%**: 1-7 days
- **60-79%**: 1-4 weeks
- **40-59%**: 1-3 months
- **20-39%**: 3-6 months
- **0-19%**: No immediate risk

## API Endpoint

### GET `/api/iot/devices/:deviceId/predict-failure`

Returns predictive maintenance analysis for a specific device.

**Response Format:**
```json
{
  "failure_risk_percentage": 21,
  "predicted_failure_window": "3-6 months",
  "confidence_level": "MEDIUM",
  "maintenance_recommendation": "Consider preventive maintenance within 3 months."
}
```

## Frontend Integration

### Live Monitor Page
The Live Monitor page now includes a "Predict" button next to each device. Clicking this button navigates to the detailed predictive maintenance analysis page.

### Predictive Maintenance Page
Located at `/devices/:deviceId/predictive-maintenance`, this page displays:
- Visual risk meter with color-coded indicators
- Detailed risk assessment breakdown
- Specific maintenance recommendations
- Device information and status
- Confidence level of the analysis

## Implementation Files

### Backend
- `backend/controllers/predictiveMaintenanceController.js` - Core AI analysis logic
- `backend/routes/iot.js` - API endpoint routing
- `backend/db-local.js` - Database queries for sensor data

### Frontend
- `smartdrishti-platform/src/pages/PredictiveMaintenance.tsx` - Main analysis page
- `smartdrishti-platform/src/pages/LiveMonitor.tsx` - Device list with predict buttons
- `smartdrishti-platform/src/api.ts` - API client functions

## Testing

Run the test script to verify functionality:
```bash
node test-predictive-maintenance.js
```

Or test manually:
```bash
curl -X GET "http://localhost:5000/api/iot/devices/DEVICE_ID/predict-failure"
```

## Requirements
- Devices must have at least some historical sensor data (minimum 50 data points recommended)
- System works with temperature, humidity, pressure, and light level sensors
- Data should be collected regularly for accurate predictions

## Limitations
- Predictions are based on statistical analysis, not guaranteed outcomes
- Confidence level decreases with less historical data
- Environmental factors not accounted for in the current model
- Regular calibration and validation recommended