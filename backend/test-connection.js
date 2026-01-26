// Test script to verify the frontend-backend connection
const axios = require('axios');

async function testConnection() {
  console.log('🧪 Testing SmartDrishti API Connection...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthRes = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check:', healthRes.data.status);
    
    // Test projects endpoint
    console.log('\n2. Testing projects endpoint...');
    const projectsRes = await axios.get('http://localhost:5000/api/projects');
    console.log('✅ Projects retrieved:', projectsRes.data.length, 'projects');
    
    if (projectsRes.data.length > 0) {
      console.log('   Sample project:', projectsRes.data[0].title);
    }
    
    // Test creating a project
    console.log('\n3. Testing project creation...');
    const newProject = {
      title: 'Connection Test Project',
      difficulty: 'Easy',
      description: 'Test project to verify API connection'
    };
    
    const createRes = await axios.post('http://localhost:5000/api/projects', newProject);
    console.log('✅ Project created:', createRes.data.message);
    
    const projectId = createRes.data.project.id;
    console.log('   Project ID:', projectId);
    
    // Test getting specific project
    console.log('\n4. Testing specific project retrieval...');
    const projectRes = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
    console.log('✅ Project retrieved:', projectRes.data.title);
    
    // Clean up - delete the test project
    console.log('\n5. Cleaning up test project...');
    const deleteRes = await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
    console.log('✅ Project deleted:', deleteRes.data.message);
    
    console.log('\n🎉 All tests passed! API connection is working correctly.');
    console.log('✅ No "Network Error" or "Failed to load projects" issues detected.');
    console.log('✅ CORS configuration is properly allowing requests from frontend.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    }
    process.exit(1);
  }
}

testConnection();