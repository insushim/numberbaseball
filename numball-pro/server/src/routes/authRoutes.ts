import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation
const registerValidation = [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('username')
    .isLength({ min: 2, max: 20 })
    .withMessage('닉네임은 2-20자 사이여야 합니다.')
    .matches(/^[a-zA-Z0-9가-힣_]+$/)
    .withMessage('닉네임은 영문, 숫자, 한글, 밑줄만 사용할 수 있습니다.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 6자 이상이어야 합니다.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/refresh', authController.refreshToken);
router.post('/google', authController.googleAuth);
router.post('/kakao', authController.kakaoAuth);

export default router;
