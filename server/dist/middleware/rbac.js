"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsForRole = exports.requireAnyRole = exports.requireRole = exports.requireAllPermissions = exports.requireAnyPermission = exports.requirePermission = exports.hasAllPermissions = exports.hasAnyPermission = exports.hasPermission = exports.RolePermissions = exports.Permission = exports.UserRole = void 0;
/**
 * User roles in the system
 */
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["FINANCIAL_ADMIN"] = "financial_admin";
    UserRole["PROVIDER"] = "provider";
    UserRole["BILLING_STAFF"] = "billing_staff";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * System permissions
 */
var Permission;
(function (Permission) {
    // User Management
    Permission["MANAGE_USERS"] = "manage_users";
    Permission["VIEW_USERS"] = "view_users";
    // System Configuration
    Permission["MANAGE_SYSTEM_CONFIG"] = "manage_system_config";
    Permission["VIEW_SYSTEM_CONFIG"] = "view_system_config";
    // Patient Management
    Permission["CREATE_PATIENTS"] = "create_patients";
    Permission["VIEW_PATIENTS"] = "view_patients";
    Permission["UPDATE_PATIENTS"] = "update_patients";
    Permission["DELETE_PATIENTS"] = "delete_patients";
    // Bill Management
    Permission["CREATE_BILLS"] = "create_bills";
    Permission["VIEW_BILLS"] = "view_bills";
    Permission["UPDATE_BILLS"] = "update_bills";
    Permission["DELETE_BILLS"] = "delete_bills";
    // Credit Scoring
    Permission["CALCULATE_CREDIT_SCORE"] = "calculate_credit_score";
    Permission["VIEW_CREDIT_SCORE"] = "view_credit_score";
    // EMI Plans
    Permission["CREATE_EMI_PLANS"] = "create_emi_plans";
    Permission["VIEW_EMI_PLANS"] = "view_emi_plans";
    Permission["APPROVE_EMI_PLANS"] = "approve_emi_plans";
    Permission["MODIFY_EMI_PLANS"] = "modify_emi_plans";
    // Payments
    Permission["RECORD_PAYMENTS"] = "record_payments";
    Permission["VIEW_PAYMENTS"] = "view_payments";
    Permission["PROCESS_REFUNDS"] = "process_refunds";
    // Financial Reports
    Permission["VIEW_FINANCIAL_REPORTS"] = "view_financial_reports";
    Permission["EXPORT_FINANCIAL_REPORTS"] = "export_financial_reports";
    // Audit Logs
    Permission["VIEW_AUDIT_LOGS"] = "view_audit_logs";
    Permission["EXPORT_AUDIT_LOGS"] = "export_audit_logs";
    // Analytics
    Permission["VIEW_ANALYTICS"] = "view_analytics";
    Permission["VIEW_DASHBOARD"] = "view_dashboard";
})(Permission || (exports.Permission = Permission = {}));
/**
 * Role-based permission mapping
 * Defines what permissions each role has
 */
exports.RolePermissions = {
    [UserRole.SUPER_ADMIN]: [
        // Full system access
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.MANAGE_SYSTEM_CONFIG,
        Permission.VIEW_SYSTEM_CONFIG,
        Permission.CREATE_PATIENTS,
        Permission.VIEW_PATIENTS,
        Permission.UPDATE_PATIENTS,
        Permission.DELETE_PATIENTS,
        Permission.CREATE_BILLS,
        Permission.VIEW_BILLS,
        Permission.UPDATE_BILLS,
        Permission.DELETE_BILLS,
        Permission.CALCULATE_CREDIT_SCORE,
        Permission.VIEW_CREDIT_SCORE,
        Permission.CREATE_EMI_PLANS,
        Permission.VIEW_EMI_PLANS,
        Permission.APPROVE_EMI_PLANS,
        Permission.MODIFY_EMI_PLANS,
        Permission.RECORD_PAYMENTS,
        Permission.VIEW_PAYMENTS,
        Permission.PROCESS_REFUNDS,
        Permission.VIEW_FINANCIAL_REPORTS,
        Permission.EXPORT_FINANCIAL_REPORTS,
        Permission.VIEW_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_DASHBOARD,
    ],
    [UserRole.FINANCIAL_ADMIN]: [
        // Credit scoring, EMI approval, financial reports, audit logs
        Permission.VIEW_USERS,
        Permission.VIEW_PATIENTS,
        Permission.VIEW_BILLS,
        Permission.CALCULATE_CREDIT_SCORE,
        Permission.VIEW_CREDIT_SCORE,
        Permission.CREATE_EMI_PLANS,
        Permission.VIEW_EMI_PLANS,
        Permission.APPROVE_EMI_PLANS,
        Permission.MODIFY_EMI_PLANS,
        Permission.VIEW_PAYMENTS,
        Permission.PROCESS_REFUNDS,
        Permission.VIEW_FINANCIAL_REPORTS,
        Permission.EXPORT_FINANCIAL_REPORTS,
        Permission.VIEW_AUDIT_LOGS,
        Permission.EXPORT_AUDIT_LOGS,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_DASHBOARD,
    ],
    [UserRole.PROVIDER]: [
        // Patient management, bill creation, view credit scores, view EMI plans
        Permission.CREATE_PATIENTS,
        Permission.VIEW_PATIENTS,
        Permission.UPDATE_PATIENTS,
        Permission.CREATE_BILLS,
        Permission.VIEW_BILLS,
        Permission.UPDATE_BILLS,
        Permission.VIEW_CREDIT_SCORE,
        Permission.VIEW_EMI_PLANS,
        Permission.VIEW_PAYMENTS,
        Permission.VIEW_DASHBOARD,
    ],
    [UserRole.BILLING_STAFF]: [
        // Bill management, payment tracking, basic reporting
        Permission.VIEW_PATIENTS,
        Permission.VIEW_BILLS,
        Permission.UPDATE_BILLS,
        Permission.RECORD_PAYMENTS,
        Permission.VIEW_PAYMENTS,
        Permission.VIEW_EMI_PLANS,
        Permission.VIEW_FINANCIAL_REPORTS,
        Permission.VIEW_DASHBOARD,
    ],
};
/**
 * Check if a role has a specific permission
 */
const hasPermission = (role, permission) => {
    const permissions = exports.RolePermissions[role];
    return permissions ? permissions.includes(permission) : false;
};
exports.hasPermission = hasPermission;
/**
 * Check if a role has any of the specified permissions
 */
const hasAnyPermission = (role, permissions) => {
    return permissions.some(permission => (0, exports.hasPermission)(role, permission));
};
exports.hasAnyPermission = hasAnyPermission;
/**
 * Check if a role has all of the specified permissions
 */
const hasAllPermissions = (role, permissions) => {
    return permissions.every(permission => (0, exports.hasPermission)(role, permission));
};
exports.hasAllPermissions = hasAllPermissions;
/**
 * Middleware to require a specific permission
 * Usage: requirePermission(Permission.CREATE_BILLS)
 */
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED',
            });
            return;
        }
        const userRole = req.user.role;
        if (!(0, exports.hasPermission)(userRole, permission)) {
            res.status(403).json({
                error: 'Access denied. Insufficient permissions.',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: permission,
            });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
/**
 * Middleware to require any of the specified permissions
 * Usage: requireAnyPermission([Permission.VIEW_BILLS, Permission.CREATE_BILLS])
 */
const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED',
            });
            return;
        }
        const userRole = req.user.role;
        if (!(0, exports.hasAnyPermission)(userRole, permissions)) {
            res.status(403).json({
                error: 'Access denied. Insufficient permissions.',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: permissions,
            });
            return;
        }
        next();
    };
};
exports.requireAnyPermission = requireAnyPermission;
/**
 * Middleware to require all of the specified permissions
 * Usage: requireAllPermissions([Permission.VIEW_BILLS, Permission.UPDATE_BILLS])
 */
const requireAllPermissions = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED',
            });
            return;
        }
        const userRole = req.user.role;
        if (!(0, exports.hasAllPermissions)(userRole, permissions)) {
            res.status(403).json({
                error: 'Access denied. Insufficient permissions.',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: permissions,
            });
            return;
        }
        next();
    };
};
exports.requireAllPermissions = requireAllPermissions;
/**
 * Middleware to require a specific role
 * Usage: requireRole(UserRole.SUPER_ADMIN)
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED',
            });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({
                error: `Access denied. Requires ${role} role.`,
                code: 'INSUFFICIENT_PERMISSIONS',
                required: role,
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
/**
 * Middleware to require any of the specified roles
 * Usage: requireAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCIAL_ADMIN])
 */
const requireAnyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Authentication required.',
                code: 'NOT_AUTHENTICATED',
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: `Access denied. Requires one of: ${roles.join(', ')}`,
                code: 'INSUFFICIENT_PERMISSIONS',
                required: roles,
            });
            return;
        }
        next();
    };
};
exports.requireAnyRole = requireAnyRole;
/**
 * Get all permissions for a role
 */
const getPermissionsForRole = (role) => {
    return exports.RolePermissions[role] || [];
};
exports.getPermissionsForRole = getPermissionsForRole;
