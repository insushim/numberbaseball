import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { getTierByRating } from '@numball/shared';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { email, username, password } = req.body;

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new AppError('이미 사용 중인 이메일입니다.', 400);
    }

    // Check if username exists
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new AppError('이미 사용 중인 닉네임입니다.', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        rating: 1000,
        tier: 'SILVER_1',
        coins: 500,
      },
      select: {
        id: true,
        email: true,
        username: true,
        rating: true,
        tier: true,
        level: true,
        coins: true,
        gems: true,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        rating: true,
        tier: true,
        level: true,
        coins: true,
        gems: true,
        isBanned: true,
        avatarUrl: true,
        gamesPlayed: true,
        gamesWon: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new AppError('이메일 또는 비밀번호가 일치하지 않습니다.', 401);
    }

    if (user.isBanned) {
      throw new AppError('계정이 정지되었습니다.', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('이메일 또는 비밀번호가 일치하지 않습니다.', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken(user.id);

    // Remove password hash from response
    const { passwordHash: _, ...userData } = user;

    res.json({
      success: true,
      data: { user: userData, token },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: '로그아웃되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        rating: true,
        seasonRating: true,
        tier: true,
        level: true,
        experience: true,
        coins: true,
        gems: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        winStreak: true,
        maxWinStreak: true,
      },
    });

    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', 404);
    }

    const tierInfo = getTierByRating(user.rating);

    res.json({
      success: true,
      data: {
        ...user,
        tierInfo,
        winRate: user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError('토큰이 필요합니다.', 400);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isBanned: true },
    });

    if (!user || user.isBanned) {
      throw new AppError('유효하지 않은 토큰입니다.', 401);
    }

    const newToken = generateToken(user.id);

    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      throw new AppError('Google ID token이 필요합니다.', 400);
    }

    // TODO: Verify Google ID token
    // For now, return placeholder
    res.status(501).json({
      success: false,
      message: 'Google OAuth not implemented yet',
    });
  } catch (error) {
    next(error);
  }
};

export const kakaoAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      throw new AppError('Kakao access token이 필요합니다.', 400);
    }

    // TODO: Verify Kakao access token
    // For now, return placeholder
    res.status(501).json({
      success: false,
      message: 'Kakao OAuth not implemented yet',
    });
  } catch (error) {
    next(error);
  }
};
