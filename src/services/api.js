// API Service Layer for Career Closet Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Helper function to get stored user credentials for Basic Auth
const getUserCredentials = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Helper function to create Basic Auth header
const createBasicAuthHeader = () => {
  const credentials = getUserCredentials();
  if (credentials && credentials.email && credentials.password) {
    const basicAuth = btoa(`${credentials.email}:${credentials.password}`);
    return `Basic ${basicAuth}`;
  }
  return null;
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const authHeader = createBasicAuthHeader();
    if (authHeader) {
      headers.Authorization = authHeader;
    }
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(options.includeAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Products API - matches your backend endpoints
export const productsAPI = {
  // Get all products
  getAll: () => apiCall('/products'),
  
  // Get product by ID
  getById: (id) => apiCall(`/products/${id}`),
  
  // Add new product (admin)
  create: (productData) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  // Update product
  update: (id, productData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  // Delete product
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Authentication API - matches your backend
export const authAPI = {
  // Register user (signup)
  register: (userData) => apiCall('/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    includeAuth: false,
  }),
  
  // Login user
  login: (credentials) => apiCall('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    includeAuth: false,
  }),
  
  // Check password
  checkPassword: (credentials) => apiCall('/checkpassword', {
    method: 'POST',
    body: JSON.stringify(credentials),
    includeAuth: false,
  }),
  
  // Get user by ID
  getUserById: (userId) => apiCall(`/users/${userId}`),
  
  // Update user profile
  updateProfile: (userId, userData) => apiCall(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Cart API - matches your backend
export const cartAPI = {
  // Get all cart items
  getAll: () => apiCall('/carts'),
  
  // Get cart by ID
  getById: (cartId) => apiCall(`/carts/${cartId}`),
  
  // Add item to cart
  addItem: (cartData) => apiCall('/carts', {
    method: 'POST',
    body: JSON.stringify(cartData),
  }),
  
  // Update cart item
  updateItem: (cartId, cartData) => apiCall(`/carts/${cartId}`, {
    method: 'PUT',
    body: JSON.stringify(cartData),
  }),
  
  // Remove item from cart
  removeItem: (cartId) => apiCall(`/carts/${cartId}`, {
    method: 'DELETE',
  }),
};

// Orders API - matches your backend
export const ordersAPI = {
  // Get all orders
  getAll: () => apiCall('/orders'),
  
  // Get order by ID
  getById: (orderId) => apiCall(`/orders/${orderId}`),
  
  // Create new order
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Update order
  update: (orderId, orderData) => apiCall(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  // Delete order
  delete: (orderId) => apiCall(`/orders/${orderId}`, {
    method: 'DELETE',
  }),
};

// Reviews API - matches your backend
export const reviewsAPI = {
  // Get all reviews
  getAll: () => apiCall('/reviews'),
  
  // Get review by ID
  getById: (reviewId) => apiCall(`/reviews/${reviewId}`),
  
  // Add new review
  create: (reviewData) => apiCall('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  // Update review
  update: (reviewId, reviewData) => apiCall(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),
  
  // Delete review
  delete: (reviewId) => apiCall(`/reviews/${reviewId}`, {
    method: 'DELETE',
  }),
};

// Payments API - matches your backend
export const paymentsAPI = {
  // Get all payments
  getAll: () => apiCall('/payments'),
  
  // Get payment by ID
  getById: (paymentId) => apiCall(`/payments/${paymentId}`),
  
  // Process payment
  create: (paymentData) => apiCall('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  
  // Update payment
  update: (paymentId, paymentData) => apiCall(`/payments/${paymentId}`, {
    method: 'PUT',
    body: JSON.stringify(paymentData),
  }),
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const credentials = getUserCredentials();
    return credentials && credentials.email && credentials.password;
  },
  
  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  },
  
  // Save authentication (store user credentials and ID)
  saveAuth: (email, password, userId) => {
    const userData = { email, password, userId };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userId', userId);
  },
  
  // Get saved user
  getUser: () => getUserCredentials(),
  
  // Get user ID
  getUserId: () => localStorage.getItem('userId'),
};

export default {
  products: productsAPI,
  auth: authAPI,
  cart: cartAPI,
  orders: ordersAPI,
  reviews: reviewsAPI,
  payments: paymentsAPI,
  utils: apiUtils,
};
