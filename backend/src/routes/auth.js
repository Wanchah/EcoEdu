import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { validateEmail, validatePassword, validateName, checkValidation } from '../middleware/validate.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', 
  validateName,
  validateEmail,
  validatePassword,
  checkValidation,
  signup
);

// POST /api/auth/login
router.post('/login',
  validateEmail,
  checkValidation,
  login
);

export default router;