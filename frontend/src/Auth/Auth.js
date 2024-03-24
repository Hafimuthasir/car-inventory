// auth.js

import axios from 'axios';

// Function to check if a JWT token is expired
const isTokenExpired = (token) => {
  if (!token) return true; // Token is considered expired if it's not provided
  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) {
    return true; // Token is considered expired if decoding fails or no expiry time is present
  }
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return decodedToken.exp < currentTime;
};

// Helper function to decode a JWT token
const decodeToken = (token) => {
  try {
    // JWT tokens are base64 encoded, so we decode it and parse it as JSON
    const decodedPayload = JSON.parse(atob(token.split('.')[1]));
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to save authentication tokens to local storage
const saveAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Function to retrieve authentication tokens from local storage
const getAuthTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
};

// Function to clear authentication tokens from local storage
const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Axios interceptor to attach authorization header with access token for every request
axios.interceptors.request.use((config) => {
  const { accessToken } = getAuthTokens();
  if (accessToken && !isTokenExpired(accessToken)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Axios interceptor to handle unauthorized errors (e.g., expired access token) and refresh the access token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken } = getAuthTokens();

    // Check if the error is 401 (Unauthorized) and there's a refresh token
    if (error.response.status === 401 && refreshToken) {
      // Check if the original request is already being retried with the new token
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Request a new access token using the refresh token
          const response = await axios.post('http://localhost:8000/api/refresh-token', {
            refreshToken,
          });
          const newAccessToken = response.data.accessToken;
          // Save the new access token
          saveAuthTokens(newAccessToken, refreshToken);
          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing access token:', refreshError);
          // If refreshing the token fails, logout the user and clear tokens
          clearAuthTokens();
          // Redirect the user to the login page or handle the logout flow
        }
      }
    }
    return Promise.reject(error);
  }
);

export { isTokenExpired, saveAuthTokens, getAuthTokens, clearAuthTokens };
