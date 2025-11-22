// controllers/adminController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { USER_ROLES } = require('../config/constants');

// Email configuration (configure with your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate secure password
const generatePassword = () => {
  const length = 12;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Generate unique User ID
const generateUserID = async (role, firstName, lastName) => {
  const rolePrefix = {
    [USER_ROLES.ADMIN]: 'ADM',
    [USER_ROLES.TEACHER]: 'TCH',
    [USER_ROLES.STUDENT]: 'STD',
    [USER_ROLES.PARENT]: 'PAR',
  };

  const prefix = rolePrefix[role] || 'USR';
  const timestamp = Date.now().toString().slice(-4);
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

  let userID = `${prefix}${initials}${timestamp}`;
  let counter = 1;

  // Ensure uniqueness
  while (await User.findOne({ userID })) {
    userID = `${prefix}${initials}${timestamp}${counter
      .toString()
      .padStart(2, '0')}`;
    counter++;
  }

  return userID;
};

// Send credentials email
const sendCredentialsEmail = async (email, password, userID, firstName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to School Management System - Your Login Credentials',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to School Management System</h2>
                
                <p>Dear ${firstName},</p>
                
                <p>Your account has been created successfully. Here are your login credentials:</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>User ID:</strong> ${userID}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Temporary Password:</strong> ${password}</p>
                </div>
                
                <p>Please log in using these credentials and change your password immediately for security.</p>
                
                <p><a href="${process.env.FRONTEND_URL}/login" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a></p>
                
                <p>If you have any questions, please contact the administration.</p>
                
                <p>Best regards,<br>School Administration</p>
            </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const roleFilter = req.query.role ? { role: parseInt(req.query.role) } : {};
    const searchFilter = req.query.search
      ? {
          $or: [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
            { userID: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const filter = { ...roleFilter, ...searchFilter };

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      role,
      password,
      phone,
      address,
      dob,
      gender,
      bloodGroup,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate userID if not provided
    let userID = req.body.userID;
    if (!userID) {
      userID = await generateUserID(role, firstName, lastName);
    } else {
      // Check if userID is unique
      const existingUserID = await User.findOne({ userID });
      if (existingUserID) {
        return res.status(400).json({
          success: false,
          message: 'User ID already exists',
        });
      }
    }

    // Create user
    const user = new User({
      email,
      firstName,
      lastName,
      role,
      password, // Will be hashed by pre-save middleware
      phone,
      userID,
      address,
      dob,
      gender,
      bloodGroup,
    });

    await user.save();

    // Send credentials email
    try {
      await sendCredentialsEmail(email, password, userID, firstName);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the user creation if email fails
    }

    // Return user without password
    const userResponse = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove sensitive fields from updates
    delete updates.password;
    delete updates._id;
    delete updates.createdAt;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

// Toggle user status
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: { isActive: user.isActive },
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message,
    });
  }
};

// Reset user password
const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newPassword = generatePassword();
    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    // Send new password via email
    try {
      await sendCredentialsEmail(
        user.email,
        newPassword,
        user.userID,
        user.firstName
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Password reset successfully and sent via email',
      data: { password: newPassword },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

// Send credentials email (standalone)
const sendCredentials = async (req, res) => {
  try {
    const { email, password, userID, firstName } = req.body;

    await sendCredentialsEmail(email, password, userID, firstName);

    res.json({
      success: true,
      message: 'Credentials sent successfully',
    });
  } catch (error) {
    console.error('Send credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send credentials',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword,
  sendCredentials,
};
