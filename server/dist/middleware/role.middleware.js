"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessAnalytics = exports.canAccessFinancialData = exports.canAccessProviderData = exports.canModifyPatientData = exports.canAccessPatientData = exports.requirePatientOrProvider = exports.requireProviderOrAdmin = exports.requireAdmin = exports.requireProvider = exports.requirePatient = exports.requireRole = void 0;
/**
 * Role-based access control middleware
 * Requires user to have one of the specified roles
 */
const requireRole = (roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
/**
 * Patient role middleware
 */
const requirePatient = (req, res, next) => {
    return (0, exports.requireRole)(['PATIENT'])(req, res, next);
};
exports.requirePatient = requirePatient;
/**
 * Provider role middleware
 */
const requireProvider = (req, res, next) => {
    return (0, exports.requireRole)(['PROVIDER'])(req, res, next);
};
exports.requireProvider = requireProvider;
/**
 * Admin role middleware
 */
const requireAdmin = (req, res, next) => {
    return (0, exports.requireRole)(['ADMIN'])(req, res, next);
};
exports.requireAdmin = requireAdmin;
/**
 * Provider or Admin role middleware
 */
const requireProviderOrAdmin = (req, res, next) => {
    return (0, exports.requireRole)(['PROVIDER', 'ADMIN'])(req, res, next);
};
exports.requireProviderOrAdmin = requireProviderOrAdmin;
/**
 * Patient or Provider role middleware
 */
const requirePatientOrProvider = (req, res, next) => {
    return (0, exports.requireRole)(['PATIENT', 'PROVIDER'])(req, res, next);
};
exports.requirePatientOrProvider = requirePatientOrProvider;
/**
 * Check if user can access patient data
 * Patients can only access their own data
 * Providers and Admins can access any patient data
 */
const canAccessPatientData = (req, res, next) => {
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
exports.canAccessPatientData = canAccessPatientData;
/**
 * Check if user can modify patient data
 * Patients can only modify their own data
 * Providers can modify patient data they're assigned to
 * Admins can modify any patient data
 */
const canModifyPatientData = (req, res, next) => {
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
exports.canModifyPatientData = canModifyPatientData;
/**
 * Check if user can access provider data
 * Providers can only access their own data
 * Admins can access any provider data
 */
const canAccessProviderData = (req, res, next) => {
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
exports.canAccessProviderData = canAccessProviderData;
/**
 * Check if user can access financial data
 * Only Admins and authorized Providers can access financial data
 */
const canAccessFinancialData = (req, res, next) => {
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
exports.canAccessFinancialData = canAccessFinancialData;
/**
 * Check if user can access system analytics
 * Only Admins can access system analytics
 */
const canAccessAnalytics = (req, res, next) => {
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
exports.canAccessAnalytics = canAccessAnalytics;
