import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Extend Express Request object to include the user payload
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Authentication middleware for protected routes
 * Validates JWT access token and attaches user info to request
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ 
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
      return;
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);

    // Validate session (optional but recommended for added security)
    const isValidSession = await AuthService.validateSession(token);
    
    if (!isValidSession) {
      res.status(401).json({ 
        error: 'Session expired or invalid.',
        code: 'INVALID_SESSION'
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.message === 'Invalid or expired token') {
      res.status(401).json({ 
        error: 'Invalid or expired token.',
        code: 'TOKEN_EXPIRED'
      });
    } else {
      res.status(403).json({ 
        error: 'Authentication failed.',
        code: 'AUTH_FAILED'
      });
    }
  }
};

/**
 * Role-based access control middleware
 * Requires specific role to access the route
 */
export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ 
        error: `Access denied. Requires ${role} privileges.`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

/**
 * Multiple roles access control middleware
 * Allows access if user has any of the specified roles
 */
export const requireAnyRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        error: `Access denied. Requires one of: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
