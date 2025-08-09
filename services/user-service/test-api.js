const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/v1/users';

// Test data
const newUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User'
};

// Register a new user
async function registerUser() {
  try {
    console.log('Registering a new user...');
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();
    console.log('Register Response:', data);
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to register');
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    // If error is due to duplicate user, continue to login
    if (error.message.includes('already exists')) {
      console.log('User already exists, proceeding to login...');
      return { success: false, userExists: true };
    }
    throw error;
  }
}

// Login with the user
async function loginUser() {
  try {
    console.log('Logging in...');
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: newUser.email,
        password: newUser.password
      })
    });

    const data = await response.json();
    console.log('Login Response:', data);
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to login');
    }
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

// Get user profile (requires authentication)
async function getUserProfile(token) {
  try {
    console.log('Getting user profile...');
    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Profile Response:', data);
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to get profile');
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    throw error;
  }
}

// Run the tests
async function runTests() {
  try {
    // Step 1: Register user
    const registerResult = await registerUser();
    
    // Step 2: Login user
    const loginResult = await loginUser();
    
    if (loginResult.data && loginResult.data.token) {
      // Step 3: Get profile with token
      await getUserProfile(loginResult.data.token);
    }
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run all tests
runTests();
