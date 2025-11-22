// routes/admin.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword,
  sendCredentials,
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Middleware to ensure only admins can access these routes
router.use(authenticateToken);
router.use(requireAdmin);

// User management routes
router.get('/users', getAllUsers);
router.post('/auth/register', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.post('/users/:id/reset-password', resetUserPassword);

// Standalone email sending
router.post('/send-credentials', sendCredentials);

module.exports = router;
