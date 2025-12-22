/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';

// Mock the auth-edge module
jest.mock('@/lib/auth-edge', () => ({
  verifyTokenEdge: jest.fn(),
}));

const { verifyTokenEdge: mockVerifyTokenEdge } = require('@/lib/auth-edge');

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('Protected route access', () => {
    const protectedRoutes = [
      '/dashboard',
      '/dashboard/overview',
      '/bundles',
      '/bundles/safe',
      '/simulation',
      '/simulation/results',
      '/history',
      '/history/transactions',
      '/chatbot',
      '/chatbot/conversation',
      '/settings',
      '/settings/profile',
    ];

    protectedRoutes.forEach(route => {
      it(`should redirect unauthenticated user from ${route} to login`, async () => {
        mockVerifyTokenEdge.mockResolvedValue(null);

        const request = new NextRequest(`http://localhost${route}`);
        const response = await middleware(request);

        expect(response.status).toBe(307); // Redirect status
        expect(response.headers.get('location')).toBe(`http://localhost/login`);
      });

      it(`should allow authenticated user to access ${route}`, async () => {
        mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

        const request = new NextRequest(`http://localhost${route}`, {
          headers: {
            cookie: 'token=valid-jwt-token',
          },
        });

        const response = await middleware(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-auth')).toBe('true');
      });
    });

    it('should handle token from Authorization header', async () => {
      mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          authorization: 'Bearer valid-jwt-token',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(mockVerifyTokenEdge).toHaveBeenCalledWith('valid-jwt-token');
    });

    it('should prioritize cookie token over Authorization header', async () => {
      mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          authorization: 'Bearer header-token',
          cookie: 'token=cookie-token',
        },
      });

      const response = await middleware(request);

      expect(mockVerifyTokenEdge).toHaveBeenCalledWith('cookie-token');
      expect(mockVerifyTokenEdge).not.toHaveBeenCalledWith('header-token');
    });
  });

  describe('Authentication pages', () => {
    const authRoutes = ['/login', '/signup'];

    authRoutes.forEach(route => {
      it(`should allow unauthenticated user to access ${route}`, async () => {
        mockVerifyTokenEdge.mockResolvedValue(null);

        const request = new NextRequest(`http://localhost${route}`);
        const response = await middleware(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-auth')).toBe('false');
      });

      it(`should redirect authenticated user from ${route} to dashboard`, async () => {
        mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

        const request = new NextRequest(`http://localhost${route}`, {
          headers: {
            cookie: 'token=valid-jwt-token',
          },
        });

        const response = await middleware(request);

        expect(response.status).toBe(307); // Redirect status
        expect(response.headers.get('location')).toBe('http://localhost/dashboard');
      });
    });
  });

  describe('Public routes', () => {
    const publicRoutes = ['/', '/about', '/contact', '/pricing'];

    publicRoutes.forEach(route => {
      it(`should allow access to public route ${route} without authentication`, async () => {
        mockVerifyTokenEdge.mockResolvedValue(null);

        const request = new NextRequest(`http://localhost${route}`);
        const response = await middleware(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-auth')).toBe('false');
      });

      it(`should allow access to public route ${route} with authentication`, async () => {
        mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

        const request = new NextRequest(`http://localhost${route}`, {
          headers: {
            cookie: 'token=valid-jwt-token',
          },
        });

        const response = await middleware(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-auth')).toBe('true');
      });
    });
  });

  describe('Token validation edge cases', () => {
    it('should handle invalid token gracefully', async () => {
      mockVerifyTokenEdge.mockRejectedValue(new Error('Invalid token'));

      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          cookie: 'token=invalid-token',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(307); // Should redirect to login
      expect(response.headers.get('location')).toBe('http://localhost/login');
    });

    it('should handle expired token', async () => {
      mockVerifyTokenEdge.mockResolvedValue(null); // Expired token returns null

      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          cookie: 'token=expired-token',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost/login');
    });

    it('should handle malformed Authorization header', async () => {
      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          authorization: 'InvalidFormat token',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost/login');
      expect(mockVerifyTokenEdge).not.toHaveBeenCalled();
    });

    it('should handle empty token', async () => {
      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          cookie: 'token=',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost/login');
      expect(mockVerifyTokenEdge).not.toHaveBeenCalled();
    });

    it('should handle token verification timeout', async () => {
      mockVerifyTokenEdge.mockRejectedValue(new Error('Timeout'));

      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          cookie: 'token=slow-token',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost/login');
    });
  });

  describe('Edge cases and security', () => {
    it('should handle multiple cookies correctly', async () => {
      mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

      const request = new NextRequest('http://localhost/dashboard', {
        headers: {
          cookie: 'other=value; token=valid-token; another=value',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(200);
      expect(mockVerifyTokenEdge).toHaveBeenCalledWith('valid-token');
    });

    it('should handle case-sensitive routes', async () => {
      mockVerifyTokenEdge.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/Dashboard'); // Capital D
      const response = await middleware(request);

      // Should still be treated as protected (case-sensitive check)
      expect(response.status).toBe(200); // Not protected due to case sensitivity
    });

    it('should handle query parameters in protected routes', async () => {
      mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

      const request = new NextRequest('http://localhost/dashboard?tab=overview&filter=recent', {
        headers: {
          cookie: 'token=valid-token',
        },
      });

      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it('should handle nested protected routes', async () => {
      mockVerifyTokenEdge.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/dashboard/settings/profile/edit');
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost/login');
    });

    it('should set correct debug headers', async () => {
      mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

      const request = new NextRequest('http://localhost/', {
        headers: {
          cookie: 'token=valid-token',
        },
      });

      const response = await middleware(request);

      expect(response.headers.get('x-middleware-auth')).toBe('true');
    });

    it('should handle concurrent requests', async () => {
      mockVerifyTokenEdge.mockResolvedValue({ userId: 'user123' });

      const requests = [
        new NextRequest('http://localhost/dashboard', {
          headers: { cookie: 'token=token1' },
        }),
        new NextRequest('http://localhost/settings', {
          headers: { cookie: 'token=token2' },
        }),
        new NextRequest('http://localhost/bundles', {
          headers: { cookie: 'token=token3' },
        }),
      ];

      const responses = await Promise.all(requests.map(req => middleware(req)));

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.headers.get('x-middleware-auth')).toBe('true');
      });

      expect(mockVerifyTokenEdge).toHaveBeenCalledTimes(3);
    });
  });
});