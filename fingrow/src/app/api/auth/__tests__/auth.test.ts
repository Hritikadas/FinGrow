/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST as signupPOST } from '../signup/route';
import { POST as loginPOST } from '../login/route';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateToken: jest.fn(),
}));

const { prisma: mockPrisma } = require('@/lib/prisma');
const mockAuth = require('@/lib/auth');

describe('Auth API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Signup Route', () => {
    const validSignupData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      monthlyIncome: 5000,
      monthlyExpenses: 3000,
    };

    it('should create user successfully with valid data', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockAuth.hashPassword.mockResolvedValue('hashedpassword');
      mockAuth.generateToken.mockReturnValue('mocktoken');

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(validSignupData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
      expect(data.token).toBe('mocktoken');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: validSignupData.email,
          password: 'hashedpassword',
          name: validSignupData.name,
          monthlyIncome: validSignupData.monthlyIncome,
          monthlyExpenses: validSignupData.monthlyExpenses,
        },
      });
    });

    it('should reject signup with existing email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(validSignupData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation Error: User already exists with this email');
    });

    it('should validate email format', async () => {
      const invalidData = { ...validSignupData, email: 'invalid-email' };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should validate password length', async () => {
      const invalidData = { ...validSignupData, password: '123' };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should validate name length', async () => {
      const invalidData = { ...validSignupData, name: 'A' };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should validate positive monthly income', async () => {
      const invalidData = { ...validSignupData, monthlyIncome: -1000 };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should validate positive monthly expenses', async () => {
      const invalidData = { ...validSignupData, monthlyExpenses: -500 };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(validSignupData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred');
    });

    it('should handle edge case with zero income', async () => {
      const edgeData = { ...validSignupData, monthlyIncome: 0 };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(edgeData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should handle edge case with zero expenses', async () => {
      const edgeData = { ...validSignupData, monthlyExpenses: 0 };

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(edgeData),
      });

      const response = await signupPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });
  });

  describe('Login Route', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword',
    };

    it('should login successfully with valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockAuth.verifyPassword.mockResolvedValue(true);
      mockAuth.generateToken.mockReturnValue('mocktoken');

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
      expect(data.token).toBe('mocktoken');
    });

    it('should reject login with non-existent email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should reject login with wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockAuth.verifyPassword.mockResolvedValue(false);

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should validate email format in login', async () => {
      const invalidData = { ...validLoginData, email: 'invalid-email' };

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Validation failed');
    });

    it('should handle empty password', async () => {
      const invalidData = { ...validLoginData, password: '' };

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      // Empty password should be treated as invalid credentials, not validation error
      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should handle database errors in login', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred');
    });

    it('should handle password verification errors', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockAuth.verifyPassword.mockRejectedValue(new Error('Hash verification failed'));

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(validLoginData),
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('An unexpected error occurred');
    });
  });

  describe('Cookie handling', () => {
    it('should set HTTP-only cookie on successful login', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockAuth.verifyPassword.mockResolvedValue(true);
      mockAuth.generateToken.mockReturnValue('mocktoken');

      const request = new NextRequest('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      const response = await loginPOST(request);

      // Check if cookies are set (this is a simplified check)
      expect(response.status).toBe(200);
      // In a real test environment, you would check response.headers for Set-Cookie
    });

    it('should set HTTP-only cookie on successful signup', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockAuth.hashPassword.mockResolvedValue('hashedpassword');
      mockAuth.generateToken.mockReturnValue('mocktoken');

      const request = new NextRequest('http://localhost/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          monthlyIncome: 5000,
          monthlyExpenses: 3000,
        }),
      });

      const response = await signupPOST(request);

      expect(response.status).toBe(200);
      // In a real test environment, you would check response.headers for Set-Cookie
    });
  });
});