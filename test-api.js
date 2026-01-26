const axios = require('axios');

async function testBackendAPI() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('🔍 Testing SmartDrishti Backend API...\n');
    
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test creating a project
    console.log('\n2. Testing project creation...');
    const projectData = {
      title: 'Test IoT Project',
      difficulty: 'Easy',
      estimated_time: '2-3 hours',
      description: 'A test project for IoT learning',
      steps: [
        {
          title: 'Setup Arduino IDE',
          description: 'Install and configure Arduino IDE',
          status: 'not_started'
        },
        {
          title: 'Connect Hardware',
          description: 'Connect sensors to microcontroller',
          status: 'not_started'
        }
      ]
    };
    
    const createResponse = await axios.post(`${baseURL}/projects`, projectData);
    console.log('✅ Project created:', createResponse.data);
    
    const projectId = createResponse.data.project.id;
    
    // Test getting all projects
    console.log('\n3. Testing get all projects...');
    const allProjectsResponse = await axios.get(`${baseURL}/projects`);
    console.log('✅ Retrieved projects:', allProjectsResponse.data.length, 'projects found');
    
    // Test getting specific project
    console.log('\n4. Testing get specific project...');
    const projectResponse = await axios.get(`${baseURL}/projects/${projectId}`);
    console.log('✅ Retrieved project:', projectResponse.data.title);
    
    // Test updating project
    console.log('\n5. Testing project update...');
    const updateResponse = await axios.put(`${baseURL}/projects/${projectId}`, {
      title: 'Updated Test Project'
    });
    console.log('✅ Project updated:', updateResponse.data.project.title);
    
    // Test creating a step
    console.log('\n6. Testing step creation...');
    const stepData = {
      title: 'New Test Step',
      description: 'This is a test step',
      status: 'not_started'
    };
    
    const stepResponse = await axios.post(`${baseURL}/projects/${projectId}/steps`, stepData);
    console.log('✅ Step created:', stepResponse.data.step.title);
    
    // Test updating step
    console.log('\n7. Testing step update...');
    const stepId = stepResponse.data.step.id;
    const updateStepResponse = await axios.put(`${baseURL}/steps/${stepId}`, {
      status: 'completed'
    });
    console.log('✅ Step updated:', updateStepResponse.data.step.status);
    
    console.log('\n🎉 All API tests passed successfully!');
    console.log('🔧 Backend is ready for use!');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tip: Make sure the backend server is running on port 5000');
      console.log('   Run: cd backend && npm run dev');
    }
  }
}

// Run the test
testBackendAPI();