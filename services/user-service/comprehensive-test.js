/**
 * Comprehensive test script for the CQRS User Service
 */
const fetch = require('node-fetch');

// Base URL for the API
const API_URL = 'http://localhost:3001/api/v1/users';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User'
};

const adminUser = {
  email: 'admin@example.com',
  password: 'AdminPass123!',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

const updateData = {
  firstName: 'Updated',
  lastName: 'Name'
};

// Store tokens and IDs for later tests
let userToken = null;
let adminToken = null;
let userId = null;
let adminId = null;

/**
 * Helper function to make API requests with retries
 */
async function apiRequest(endpoint, method = 'GET', data = null, token = null, retries = 3) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
    // Set timeout for fetch to 10 seconds
    timeout: 10000
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  let lastError = null;
  
  // Try with retries
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`API Request (${method} ${url}) - Attempt ${attempt + 1}/${retries}`);
      
      // Add a small delay between retries (exponential backoff)
      if (attempt > 0) {
        const delay = attempt * 500; // 500ms, 1000ms, 1500ms, etc.
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');
      
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { rawText: text };
      }
      
      return {
        status: response.status,
        ok: response.ok,
        data: result
      };
    } catch (error) {
      lastError = error;
      console.error(`API Request Error (Attempt ${attempt + 1}/${retries}):`, error.message);
      
      // Only retry on network errors, not on HTTP errors
      if (!error.message.includes('ECONNRESET') && 
          !error.message.includes('network') &&
          !error.message.includes('timeout')) {
        throw error;
      }
    }
  }
  
  // If all retries failed
  console.error(`All ${retries} attempts failed for ${url}`);
  throw lastError;
}

/**
 * Test Functions
 */

// 1. Register a regular user
async function registerUser() {
  console.log('\n=== TEST: Register User ===');
  try {
    const result = await apiRequest('/register', 'POST', testUser);
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.ok) {
      userId = result.data.data._id;
      console.log(`User ID: ${userId}`);
    }
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 2. Register an admin user
async function registerAdmin() {
  console.log('\n=== TEST: Register Admin ===');
  try {
    const result = await apiRequest('/register', 'POST', adminUser);
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.ok) {
      adminId = result.data.data._id;
      console.log(`Admin ID: ${adminId}`);
    }
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 3. Login as regular user
async function loginUser() {
  console.log('\n=== TEST: Login User ===');
  try {
    const result = await apiRequest('/login', 'POST', {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.ok && result.data.data.token) {
      userToken = result.data.data.token;
      console.log(`User Token: ${userToken.substring(0, 20)}...`);
    }
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 4. Login as admin user
async function loginAdmin() {
  console.log('\n=== TEST: Login Admin ===');
  try {
    const result = await apiRequest('/login', 'POST', {
      email: adminUser.email,
      password: adminUser.password
    });
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.ok && result.data.data.token) {
      adminToken = result.data.data.token;
      console.log(`Admin Token: ${adminToken.substring(0, 20)}...`);
    }
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 5. Get user profile
async function getUserProfile() {
  console.log('\n=== TEST: Get User Profile ===');
  try {
    const result = await apiRequest('/profile', 'GET', null, userToken);
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 6. Update user profile
async function updateUserProfile() {
  console.log('\n=== TEST: Update User Profile ===');
  try {
    const result = await apiRequest('/profile', 'PUT', updateData, userToken);
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 7. List all users (admin only)
async function listUsers() {
  console.log('\n=== TEST: List All Users (Admin) ===');
  try {
    const result = await apiRequest('/', 'GET', null, adminToken);
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 8. Search users (admin only)
async function searchUsers() {
  console.log('\n=== TEST: Search Users (Admin) ===');
  try {
    const result = await apiRequest('/search?query=test', 'GET', null, adminToken);
    
    console.log(`Status: ${result.ok ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

// 9. Unauthorized test - list users without admin token
async function unauthorizedListUsers() {
  console.log('\n=== TEST: Unauthorized List Users (Regular User) ===');
  try {
    const result = await apiRequest('/', 'GET', null, userToken);
    
    // This should fail with 403
    const expectedFail = result.status === 403;
    console.log(`Status: ${expectedFail ? 'PASSED' : 'FAILED'} (${result.status})`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    return result;
  } catch (error) {
    console.log('Status: FAILED (Exception)');
    console.error('Error:', error.message);
    return null;
  }
}

/**
 * Run all tests sequentially
 */
async function runTests() {
  console.log('Starting CQRS User Service Tests...');
  console.log('=====================================');
  
  try {
    // Try to register users - if they already exist, try logging in
    const registerResult = await registerUser();
    if (!registerResult?.ok && registerResult?.data?.message?.includes('already exists')) {
      console.log('User already exists, continuing with login...');
    } else if (!registerResult?.ok) {
      throw new Error('User registration failed, cannot continue tests');
    }
    
    const registerAdminResult = await registerAdmin();
    if (!registerAdminResult?.ok && registerAdminResult?.data?.message?.includes('already exists')) {
      console.log('Admin already exists, continuing with login...');
    }
    
    // Login tests
    await loginUser();
    await loginAdmin();
    
    if (!userToken) {
      throw new Error('Failed to get user token, cannot continue tests');
    }
    
    // Profile tests
    await getUserProfile();
    await updateUserProfile();
    
    // Admin tests
    if (adminToken) {
      await listUsers();
      await searchUsers();
      await unauthorizedListUsers();
    } else {
      console.log('\nSkipping admin tests - no admin token available');
    }
    
    console.log('\n=====================================');
    console.log('All tests completed!');
  } catch (error) {
    console.error('\n=====================================');
    console.error('Tests failed:', error.message);
  }
}

// Run the tests
runTests();
