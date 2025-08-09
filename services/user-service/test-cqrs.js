/**
 * Test script for CQRS with Redis fallback
 */
const axios = require('axios');

const API_URL = 'http://localhost:3001/api/v1';
let authToken = '';

// Helper function for API calls
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

// Set authorization header when token is available
api.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Test registration
const testRegistration = async () => {
  try {
    console.log('Testing user registration...');
    const response = await api.post('/users/register', {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'Password123!'
    });
    
    console.log('Registration successful!');
    console.log('User ID:', response.data.data.user._id);
    
    return response.data.data.user;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test login
const testLogin = async (email, password) => {
  try {
    console.log('Testing user login...');
    const response = await api.post('/users/login', {
      email,
      password
    });
    
    authToken = response.data.data.token;
    console.log('Login successful!');
    console.log('Token received:', authToken.substring(0, 20) + '...');
    
    return response.data.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test get user profile
const testGetProfile = async () => {
  try {
    console.log('Testing get user profile...');
    const response = await api.get('/users/me');
    
    console.log('Profile retrieved successfully!');
    console.log('User:', response.data.data.user.firstName, response.data.data.user.lastName);
    
    return response.data.data.user;
  } catch (error) {
    console.error('Get profile failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test listing users
const testListUsers = async () => {
  try {
    console.log('Testing list users...');
    const response = await api.get('/users?page=1&limit=10');
    
    console.log('Users list retrieved successfully!');
    console.log(`Retrieved ${response.data.data.users.length} users`);
    console.log('Pagination:', response.data.data.pagination);
    
    return response.data.data;
  } catch (error) {
    console.error('List users failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test searching users
const testSearchUsers = async (query) => {
  try {
    console.log(`Testing search users with query: ${query}...`);
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    
    console.log('Search completed successfully!');
    console.log(`Found ${response.data.data.length} users matching "${query}"`);
    
    return response.data.data;
  } catch (error) {
    console.error('Search users failed:', error.response?.data || error.message);
    throw error;
  }
};

// Run all tests
const runTests = async () => {
  try {
    console.log('=== Starting CQRS Test Suite ===');
    
    // Registration & Login
    const newUser = await testRegistration();
    await testLogin(newUser.email, 'Password123!');
    
    // Test authenticated endpoints
    const profile = await testGetProfile();
    
    // Test listing and searching
    await testListUsers();
    await testSearchUsers(profile.firstName);
    
    console.log('=== All tests completed successfully! ===');
  } catch (error) {
    console.error('Test suite failed!', error.message);
  }
};

// Run the tests
runTests();
