// Production authentication API functions for Spring Boot backend
// Backend endpoints: /api/auth/login and /api/auth/register

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/auth';

/**
 * Production login function that calls the Spring Boot backend
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data from backend
 */
export const loginUser = async (credentials) => {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Backend returns: { message, userId, email, role }
    // We need to create a user object that matches what the frontend expects
    return {
      id: data.userId,
      email: data.email,
      name: data.name || 'User', // Backend doesn't return name on login
      role: data.role?.toLowerCase() || 'customer',
      token: `jwt-token-${data.userId}`, // Backend doesn't return JWT yet
      basic: btoa(`${credentials.email}:${credentials.password}`)
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
    }
    throw error;
  }
};

/**
 * Production registration function that calls the Spring Boot backend
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.role - User's role (customer/provider)
 * @returns {Promise<Object>} User data from backend
 */
export const registerUser = async (userData) => {
  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    throw new Error('All fields are required');
  }

  if (userData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error('Please enter a valid email address');
  }

  // Role validation - convert to uppercase for backend
  const validRoles = ['customer', 'provider'];
  if (!validRoles.includes(userData.role)) {
    throw new Error('Invalid role selected');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role.toUpperCase(), // Backend expects uppercase
        phone: userData.phone || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Backend returns: { message, userId, email }
    // Create user object that matches frontend expectations
    return {
      id: data.userId,
      email: data.email,
      name: userData.name,
      role: userData.role,
      token: `jwt-token-${data.userId}`, // Backend doesn't return JWT yet
      basic: btoa(`${userData.email}:${userData.password}`)
    };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please ensure the backend is running.');
    }
    throw error;
  }
};

/**
 * Logout function
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  // In a real JWT implementation, you would call a logout endpoint
  // For now, just return a resolved promise
  return Promise.resolve();
};



