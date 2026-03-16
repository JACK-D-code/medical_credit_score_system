import { Request, Response } from 'express';
import {
  UserRole,
  Permission,
  RolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireAnyRole,
  getPermissionsForRole,
} from '../rbac';
import { AuthRequest } from '../auth';

describe('RBAC Middleware', () => {
  describe('Permission Checking Functions', () => {
    describe('hasPermission', () => {
      it('should return true when role has the permission', () => {
        expect(hasPermission(UserRole.SUPER_ADMIN, Permission.MANAGE_USERS)).toBe(true);
        expect(hasPermission(UserRole.PROVIDER, Permission.CREATE_PATIENTS)).toBe(true);
        expect(hasPermission(UserRole.BILLING_STAFF, Permission.RECORD_PAYMENTS)).toBe(true);
      });

      it('should return false when role does not have the permission', () => {
        expect(hasPermission(UserRole.PROVIDER, Permission.MANAGE_USERS)).toBe(false);
        expect(hasPermission(UserRole.BILLING_STAFF, Permission.APPROVE_EMI_PLANS)).toBe(false);
        expect(hasPermission(UserRole.PROVIDER, Permission.EXPORT_AUDIT_LOGS)).toBe(false);
      });
    });

    describe('hasAnyPermission', () => {
      it('should return true when role has at least one permission', () => {
        expect(
          hasAnyPermission(UserRole.PROVIDER, [
            Permission.MANAGE_USERS,
            Permission.CREATE_PATIENTS,
          ])
        ).toBe(true);
      });

      it('should return false when role has none of the permissions', () => {
        expect(
          hasAnyPermission(UserRole.BILLING_STAFF, [
            Permission.MANAGE_USERS,
            Permission.APPROVE_EMI_PLANS,
          ])
        ).toBe(false);
      });
    });

    describe('hasAllPermissions', () => {
      it('should return true when role has all permissions', () => {
        expect(
          hasAllPermissions(UserRole.SUPER_ADMIN, [
            Permission.MANAGE_USERS,
            Permission.CREATE_PATIENTS,
            Permission.VIEW_BILLS,
          ])
        ).toBe(true);
      });

      it('should return false when role is missing any permission', () => {
        expect(
          hasAllPermissions(UserRole.PROVIDER, [
            Permission.CREATE_PATIENTS,
            Permission.APPROVE_EMI_PLANS,
          ])
        ).toBe(false);
      });
    });

    describe('getPermissionsForRole', () => {
      it('should return all permissions for a role', () => {
        const permissions = getPermissionsForRole(UserRole.PROVIDER);
        expect(permissions).toContain(Permission.CREATE_PATIENTS);
        expect(permissions).toContain(Permission.VIEW_PATIENTS);
        expect(permissions).toContain(Permission.CREATE_BILLS);
        expect(permissions).not.toContain(Permission.MANAGE_USERS);
      });

      it('should return empty array for invalid role', () => {
        const permissions = getPermissionsForRole('invalid_role' as UserRole);
        expect(permissions).toEqual([]);
      });
    });
  });

  describe('Role Permission Mappings', () => {
    describe('Super Admin', () => {
      it('should have all permissions', () => {
        const permissions = RolePermissions[UserRole.SUPER_ADMIN];
        expect(permissions).toContain(Permission.MANAGE_USERS);
        expect(permissions).toContain(Permission.MANAGE_SYSTEM_CONFIG);
        expect(permissions).toContain(Permission.CREATE_PATIENTS);
        expect(permissions).toContain(Permission.APPROVE_EMI_PLANS);
        expect(permissions).toContain(Permission.EXPORT_AUDIT_LOGS);
      });
    });

    describe('Financial Admin', () => {
      it('should have credit scoring and EMI approval permissions', () => {
        const permissions = RolePermissions[UserRole.FINANCIAL_ADMIN];
        expect(permissions).toContain(Permission.CALCULATE_CREDIT_SCORE);
        expect(permissions).toContain(Permission.APPROVE_EMI_PLANS);
        expect(permissions).toContain(Permission.VIEW_FINANCIAL_REPORTS);
        expect(permissions).toContain(Permission.VIEW_AUDIT_LOGS);
      });

      it('should not have user management or system config permissions', () => {
        const permissions = RolePermissions[UserRole.FINANCIAL_ADMIN];
        expect(permissions).not.toContain(Permission.MANAGE_USERS);
        expect(permissions).not.toContain(Permission.MANAGE_SYSTEM_CONFIG);
      });

      it('should not have patient or bill creation permissions', () => {
        const permissions = RolePermissions[UserRole.FINANCIAL_ADMIN];
        expect(permissions).not.toContain(Permission.CREATE_PATIENTS);
        expect(permissions).not.toContain(Permission.CREATE_BILLS);
      });
    });

    describe('Provider', () => {
      it('should have patient and bill management permissions', () => {
        const permissions = RolePermissions[UserRole.PROVIDER];
        expect(permissions).toContain(Permission.CREATE_PATIENTS);
        expect(permissions).toContain(Permission.VIEW_PATIENTS);
        expect(permissions).toContain(Permission.UPDATE_PATIENTS);
        expect(permissions).toContain(Permission.CREATE_BILLS);
        expect(permissions).toContain(Permission.VIEW_BILLS);
      });

      it('should have view-only credit score and EMI permissions', () => {
        const permissions = RolePermissions[UserRole.PROVIDER];
        expect(permissions).toContain(Permission.VIEW_CREDIT_SCORE);
        expect(permissions).toContain(Permission.VIEW_EMI_PLANS);
        expect(permissions).not.toContain(Permission.CALCULATE_CREDIT_SCORE);
        expect(permissions).not.toContain(Permission.APPROVE_EMI_PLANS);
      });

      it('should not have admin or financial permissions', () => {
        const permissions = RolePermissions[UserRole.PROVIDER];
        expect(permissions).not.toContain(Permission.MANAGE_USERS);
        expect(permissions).not.toContain(Permission.APPROVE_EMI_PLANS);
        expect(permissions).not.toContain(Permission.VIEW_AUDIT_LOGS);
      });
    });

    describe('Billing Staff', () => {
      it('should have bill and payment management permissions', () => {
        const permissions = RolePermissions[UserRole.BILLING_STAFF];
        expect(permissions).toContain(Permission.VIEW_BILLS);
        expect(permissions).toContain(Permission.UPDATE_BILLS);
        expect(permissions).toContain(Permission.RECORD_PAYMENTS);
        expect(permissions).toContain(Permission.VIEW_PAYMENTS);
      });

      it('should have basic reporting permissions', () => {
        const permissions = RolePermissions[UserRole.BILLING_STAFF];
        expect(permissions).toContain(Permission.VIEW_FINANCIAL_REPORTS);
        expect(permissions).toContain(Permission.VIEW_DASHBOARD);
      });

      it('should not have patient creation or credit scoring permissions', () => {
        const permissions = RolePermissions[UserRole.BILLING_STAFF];
        expect(permissions).not.toContain(Permission.CREATE_PATIENTS);
        expect(permissions).not.toContain(Permission.CALCULATE_CREDIT_SCORE);
        expect(permissions).not.toContain(Permission.APPROVE_EMI_PLANS);
      });
    });
  });

  describe('Middleware Functions', () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
      mockRequest = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: UserRole.PROVIDER,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      nextFunction = jest.fn();
    });

    describe('requirePermission', () => {
      it('should call next() when user has the required permission', () => {
        const middleware = requirePermission(Permission.CREATE_PATIENTS);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should return 403 when user lacks the required permission', () => {
        const middleware = requirePermission(Permission.MANAGE_USERS);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Access denied. Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: Permission.MANAGE_USERS,
        });
        expect(nextFunction).not.toHaveBeenCalled();
      });

      it('should return 401 when user is not authenticated', () => {
        mockRequest.user = undefined;
        const middleware = requirePermission(Permission.CREATE_PATIENTS);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: 'Authentication required.',
          code: 'NOT_AUTHENTICATED',
        });
        expect(nextFunction).not.toHaveBeenCalled();
      });
    });

    describe('requireAnyPermission', () => {
      it('should call next() when user has at least one permission', () => {
        const middleware = requireAnyPermission([
          Permission.MANAGE_USERS,
          Permission.CREATE_PATIENTS,
        ]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should return 403 when user has none of the permissions', () => {
        const middleware = requireAnyPermission([
          Permission.MANAGE_USERS,
          Permission.APPROVE_EMI_PLANS,
        ]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(nextFunction).not.toHaveBeenCalled();
      });
    });

    describe('requireAllPermissions', () => {
      it('should call next() when user has all permissions', () => {
        const middleware = requireAllPermissions([
          Permission.CREATE_PATIENTS,
          Permission.VIEW_PATIENTS,
        ]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should return 403 when user is missing any permission', () => {
        const middleware = requireAllPermissions([
          Permission.CREATE_PATIENTS,
          Permission.APPROVE_EMI_PLANS,
        ]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(nextFunction).not.toHaveBeenCalled();
      });
    });

    describe('requireRole', () => {
      it('should call next() when user has the required role', () => {
        const middleware = requireRole(UserRole.PROVIDER);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should return 403 when user has different role', () => {
        const middleware = requireRole(UserRole.SUPER_ADMIN);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: `Access denied. Requires ${UserRole.SUPER_ADMIN} role.`,
          code: 'INSUFFICIENT_PERMISSIONS',
          required: UserRole.SUPER_ADMIN,
        });
        expect(nextFunction).not.toHaveBeenCalled();
      });
    });

    describe('requireAnyRole', () => {
      it('should call next() when user has one of the required roles', () => {
        const middleware = requireAnyRole([UserRole.PROVIDER, UserRole.SUPER_ADMIN]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(nextFunction).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should return 403 when user has none of the required roles', () => {
        const middleware = requireAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCIAL_ADMIN]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
        
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(nextFunction).not.toHaveBeenCalled();
      });
    });
  });

  describe('Permission Coverage', () => {
    it('should ensure all roles have at least one permission', () => {
      Object.values(UserRole).forEach(role => {
        const permissions = RolePermissions[role];
        expect(permissions).toBeDefined();
        expect(permissions.length).toBeGreaterThan(0);
      });
    });

    it('should ensure super admin has the most permissions', () => {
      const superAdminPerms = RolePermissions[UserRole.SUPER_ADMIN].length;
      const financialAdminPerms = RolePermissions[UserRole.FINANCIAL_ADMIN].length;
      const providerPerms = RolePermissions[UserRole.PROVIDER].length;
      const billingStaffPerms = RolePermissions[UserRole.BILLING_STAFF].length;

      expect(superAdminPerms).toBeGreaterThan(financialAdminPerms);
      expect(superAdminPerms).toBeGreaterThan(providerPerms);
      expect(superAdminPerms).toBeGreaterThan(billingStaffPerms);
    });
  });
});
