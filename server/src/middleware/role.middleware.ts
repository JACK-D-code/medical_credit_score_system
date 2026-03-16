import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

/**
 * Role-based access control middleware
 * Requires user to have one of the specified roles
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Patient role middleware
 */
export const requirePatient = (req: AuthRequest, res: Response, next: NextFunction) => {
  return requireRole(['PATIENT'])(req, res, next);
};

/**
 * Provider role middleware
 */
export const requireProvider = (req: AuthRequest, res: Response, next: NextFunction) => {
  return requireRole(['PROVIDER'])(req, res, next);
};

/**
 * Admin role middleware
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  return requireRole(['ADMIN'])(req, res, next);
};

/**
 * Provider or Admin role middleware
 */
export const requireProviderOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  return requireRole(['PROVIDER', 'ADMIN'])(req, res, next);
};

/**
 * Patient or Provider role middleware
 */
export const requirePatientOrProvider = (req: AuthRequest, res: Response, next: NextFunction) => {
  return requireRole(['PATIENT', 'PROVIDER'])(req, res, next);
};

/**
 * Check if user can access patient data
 * Patients can only access their own data
 * Providers and Admins can access any patient data
 */
export const canAccessPatientData = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  const { patientId } = req.params;
  const userRole = req.user.role;
  const userId = req.user.id;

  // Admins and Providers can access any patient data
  if (userRole === 'ADMIN' || userRole === 'PROVIDER') {
    return next();
  }

  // Patients can only access their own data
  if (userRole === 'PATIENT') {
    // In a real implementation, you would verify that the patientId belongs to the user
    // For now, we'll assume the patientId is the same as userId for patients
    if (patientId === userId) {
      return next();
    }
  }

  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied to patient data'
  });
};

/**
 * Check if user can modify patient data
 * Patients can only modify their own data
 * Providers can modify patient data they're assigned to
 * Admins can modify any patient data
 */
export const canModifyPatientData = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  const { patientId } = req.params;
  const userRole = req.user.role;
  const userId = req.user.id;

  // Admins can modify any patient data
  if (userRole === 'ADMIN') {
    return next();
  }

  // Providers can modify patient data (with additional checks in service layer)
  if (userRole === 'PROVIDER') {
    return next();
  }

  // Patients can only modify their own data
  if (userRole === 'PATIENT') {
    if (patientId === userId) {
      return next();
    }
  }

  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied to modify patient data'
  });
};

/**
 * Check if user can access provider data
 * Providers can only access their own data
 * Admins can access any provider data
 */
export const canAccessProviderData = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  const { providerId } = req.params;
  const userRole = req.user.role;
  const userId = req.user.id;

  // Admins can access any provider data
  if (userRole === 'ADMIN') {
    return next();
  }

  // Providers can only access their own data
  if (userRole === 'PROVIDER') {
    if (providerId === userId) {
      return next();
    }
  }

  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied to provider data'
  });
};

/**
 * Check if user can access financial data
 * Only Admins and authorized Providers can access financial data
 */
export const canAccessFinancialData = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  const userRole = req.user.role;

  // Only Admins and Providers can access financial data
  if (userRole === 'ADMIN' || userRole === 'PROVIDER') {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied to financial data'
  });
};

/**
 * Check if user can access system analytics
 * Only Admins can access system analytics
 */
export const canAccessAnalytics = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  const userRole = req.user.role;

  // Only Admins can access analytics
  if (userRole === 'ADMIN') {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden',
    message: 'Access denied to system analytics'
  });
};
