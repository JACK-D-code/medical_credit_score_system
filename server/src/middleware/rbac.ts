import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * User roles in the system
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  FINANCIAL_ADMIN = 'financial_admin',
  PROVIDER = 'provider',
  BILLING_STAFF = 'billing_staff',
}

/**
 * System permissions
 */
export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  VIEW_USERS = 'view_users',
  
  // System Configuration
  MANAGE_SYSTEM_CONFIG = 'manage_system_config',
  VIEW_SYSTEM_CONFIG = 'view_system_config',
  
  // Patient Management
  CREATE_PATIENTS = 'create_patients',
  VIEW_PATIENTS = 'view_patients',
  UPDATE_PATIENTS = 'update_patients',
  DELETE_PATIENTS = 'delete_patients',
  
  // Bill Management
  CREATE_BILLS = 'create_bills',
  VIEW_BILLS = 'view_bills',
  UPDATE_BILLS = 'update_bills',
  DELETE_BILLS = 'delete_bills',
  
  // Credit Scoring
  CALCULATE_CREDIT_SCORE = 'calculate_credit_score',
  VIEW_CREDIT_SCORE = 'view_credit_score',
  
  // EMI Plans
  CREATE_EMI_PLANS = 'create_emi_plans',
  VIEW_EMI_PLANS = 'view_emi_plans',
  APPROVE_EMI_PLANS = 'approve_emi_plans',
  MODIFY_EMI_PLANS = 'modify_emi_plans',
  
  // Payments
  RECORD_PAYMENTS = 'record_payments',
  VIEW_PAYMENTS = 'view_payments',
  PROCESS_REFUNDS = 'process_refunds',
  
  // Financial Reports
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  EXPORT_FINANCIAL_REPORTS = 'export_financial_reports',
  
  // Audit Logs
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  EXPORT_AUDIT_LOGS = 'export_audit_logs',
  
  // Analytics
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_DASHBOARD = 'view_dashboard',
}

/**
 * Role-based permission mapping
 * Defines what permissions each role has
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
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
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  const permissions = RolePermissions[role];
  return permissions ? permissions.includes(permission) : false;
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Middleware to require a specific permission
 * Usage: requirePermission(Permission.CREATE_BILLS)
 */
export const requirePermission = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED',
      });
      return;
    }

    const userRole = req.user.role as UserRole;
    
    if (!hasPermission(userRole, permission)) {
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

/**
 * Middleware to require any of the specified permissions
 * Usage: requireAnyPermission([Permission.VIEW_BILLS, Permission.CREATE_BILLS])
 */
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED',
      });
      return;
    }

    const userRole = req.user.role as UserRole;
    
    if (!hasAnyPermission(userRole, permissions)) {
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

/**
 * Middleware to require all of the specified permissions
 * Usage: requireAllPermissions([Permission.VIEW_BILLS, Permission.UPDATE_BILLS])
 */
export const requireAllPermissions = (permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED',
      });
      return;
    }

    const userRole = req.user.role as UserRole;
    
    if (!hasAllPermissions(userRole, permissions)) {
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

/**
 * Middleware to require a specific role
 * Usage: requireRole(UserRole.SUPER_ADMIN)
 */
export const requireRole = (role: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

/**
 * Middleware to require any of the specified roles
 * Usage: requireAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCIAL_ADMIN])
 */
export const requireAnyRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required.',
        code: 'NOT_AUTHENTICATED',
      });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
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

/**
 * Get all permissions for a role
 */
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return RolePermissions[role] || [];
};
