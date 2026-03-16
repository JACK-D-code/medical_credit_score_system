"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rbac_1 = require("../rbac");
describe('RBAC Middleware', () => {
    describe('Permission Checking Functions', () => {
        describe('hasPermission', () => {
            it('should return true when role has the permission', () => {
                expect((0, rbac_1.hasPermission)(rbac_1.UserRole.SUPER_ADMIN, rbac_1.Permission.MANAGE_USERS)).toBe(true);
                expect((0, rbac_1.hasPermission)(rbac_1.UserRole.PROVIDER, rbac_1.Permission.CREATE_PATIENTS)).toBe(true);
                expect((0, rbac_1.hasPermission)(rbac_1.UserRole.BILLING_STAFF, rbac_1.Permission.RECORD_PAYMENTS)).toBe(true);
            });
            it('should return false when role does not have the permission', () => {
                expect((0, rbac_1.hasPermission)(rbac_1.UserRole.PROVIDER, rbac_1.Permission.MANAGE_USERS)).toBe(false);
                expect((0, rbac_1.hasPermission)(rbac_1.UserRole.BILLING_STAFF, rbac_1.Permission.APPROVE_EMI_PLANS)).toBe(false);
                expect((0, rbac_1.hasPermission)(rbac_1.UserRole.PROVIDER, rbac_1.Permission.EXPORT_AUDIT_LOGS)).toBe(false);
            });
        });
        describe('hasAnyPermission', () => {
            it('should return true when role has at least one permission', () => {
                expect((0, rbac_1.hasAnyPermission)(rbac_1.UserRole.PROVIDER, [
                    rbac_1.Permission.MANAGE_USERS,
                    rbac_1.Permission.CREATE_PATIENTS,
                ])).toBe(true);
            });
            it('should return false when role has none of the permissions', () => {
                expect((0, rbac_1.hasAnyPermission)(rbac_1.UserRole.BILLING_STAFF, [
                    rbac_1.Permission.MANAGE_USERS,
                    rbac_1.Permission.APPROVE_EMI_PLANS,
                ])).toBe(false);
            });
        });
        describe('hasAllPermissions', () => {
            it('should return true when role has all permissions', () => {
                expect((0, rbac_1.hasAllPermissions)(rbac_1.UserRole.SUPER_ADMIN, [
                    rbac_1.Permission.MANAGE_USERS,
                    rbac_1.Permission.CREATE_PATIENTS,
                    rbac_1.Permission.VIEW_BILLS,
                ])).toBe(true);
            });
            it('should return false when role is missing any permission', () => {
                expect((0, rbac_1.hasAllPermissions)(rbac_1.UserRole.PROVIDER, [
                    rbac_1.Permission.CREATE_PATIENTS,
                    rbac_1.Permission.APPROVE_EMI_PLANS,
                ])).toBe(false);
            });
        });
        describe('getPermissionsForRole', () => {
            it('should return all permissions for a role', () => {
                const permissions = (0, rbac_1.getPermissionsForRole)(rbac_1.UserRole.PROVIDER);
                expect(permissions).toContain(rbac_1.Permission.CREATE_PATIENTS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_PATIENTS);
                expect(permissions).toContain(rbac_1.Permission.CREATE_BILLS);
                expect(permissions).not.toContain(rbac_1.Permission.MANAGE_USERS);
            });
            it('should return empty array for invalid role', () => {
                const permissions = (0, rbac_1.getPermissionsForRole)('invalid_role');
                expect(permissions).toEqual([]);
            });
        });
    });
    describe('Role Permission Mappings', () => {
        describe('Super Admin', () => {
            it('should have all permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.SUPER_ADMIN];
                expect(permissions).toContain(rbac_1.Permission.MANAGE_USERS);
                expect(permissions).toContain(rbac_1.Permission.MANAGE_SYSTEM_CONFIG);
                expect(permissions).toContain(rbac_1.Permission.CREATE_PATIENTS);
                expect(permissions).toContain(rbac_1.Permission.APPROVE_EMI_PLANS);
                expect(permissions).toContain(rbac_1.Permission.EXPORT_AUDIT_LOGS);
            });
        });
        describe('Financial Admin', () => {
            it('should have credit scoring and EMI approval permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.FINANCIAL_ADMIN];
                expect(permissions).toContain(rbac_1.Permission.CALCULATE_CREDIT_SCORE);
                expect(permissions).toContain(rbac_1.Permission.APPROVE_EMI_PLANS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_FINANCIAL_REPORTS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_AUDIT_LOGS);
            });
            it('should not have user management or system config permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.FINANCIAL_ADMIN];
                expect(permissions).not.toContain(rbac_1.Permission.MANAGE_USERS);
                expect(permissions).not.toContain(rbac_1.Permission.MANAGE_SYSTEM_CONFIG);
            });
            it('should not have patient or bill creation permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.FINANCIAL_ADMIN];
                expect(permissions).not.toContain(rbac_1.Permission.CREATE_PATIENTS);
                expect(permissions).not.toContain(rbac_1.Permission.CREATE_BILLS);
            });
        });
        describe('Provider', () => {
            it('should have patient and bill management permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.PROVIDER];
                expect(permissions).toContain(rbac_1.Permission.CREATE_PATIENTS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_PATIENTS);
                expect(permissions).toContain(rbac_1.Permission.UPDATE_PATIENTS);
                expect(permissions).toContain(rbac_1.Permission.CREATE_BILLS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_BILLS);
            });
            it('should have view-only credit score and EMI permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.PROVIDER];
                expect(permissions).toContain(rbac_1.Permission.VIEW_CREDIT_SCORE);
                expect(permissions).toContain(rbac_1.Permission.VIEW_EMI_PLANS);
                expect(permissions).not.toContain(rbac_1.Permission.CALCULATE_CREDIT_SCORE);
                expect(permissions).not.toContain(rbac_1.Permission.APPROVE_EMI_PLANS);
            });
            it('should not have admin or financial permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.PROVIDER];
                expect(permissions).not.toContain(rbac_1.Permission.MANAGE_USERS);
                expect(permissions).not.toContain(rbac_1.Permission.APPROVE_EMI_PLANS);
                expect(permissions).not.toContain(rbac_1.Permission.VIEW_AUDIT_LOGS);
            });
        });
        describe('Billing Staff', () => {
            it('should have bill and payment management permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.BILLING_STAFF];
                expect(permissions).toContain(rbac_1.Permission.VIEW_BILLS);
                expect(permissions).toContain(rbac_1.Permission.UPDATE_BILLS);
                expect(permissions).toContain(rbac_1.Permission.RECORD_PAYMENTS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_PAYMENTS);
            });
            it('should have basic reporting permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.BILLING_STAFF];
                expect(permissions).toContain(rbac_1.Permission.VIEW_FINANCIAL_REPORTS);
                expect(permissions).toContain(rbac_1.Permission.VIEW_DASHBOARD);
            });
            it('should not have patient creation or credit scoring permissions', () => {
                const permissions = rbac_1.RolePermissions[rbac_1.UserRole.BILLING_STAFF];
                expect(permissions).not.toContain(rbac_1.Permission.CREATE_PATIENTS);
                expect(permissions).not.toContain(rbac_1.Permission.CALCULATE_CREDIT_SCORE);
                expect(permissions).not.toContain(rbac_1.Permission.APPROVE_EMI_PLANS);
            });
        });
    });
    describe('Middleware Functions', () => {
        let mockRequest;
        let mockResponse;
        let nextFunction;
        beforeEach(() => {
            mockRequest = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    role: rbac_1.UserRole.PROVIDER,
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
                const middleware = (0, rbac_1.requirePermission)(rbac_1.Permission.CREATE_PATIENTS);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
            it('should return 403 when user lacks the required permission', () => {
                const middleware = (0, rbac_1.requirePermission)(rbac_1.Permission.MANAGE_USERS);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(mockResponse.status).toHaveBeenCalledWith(403);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'Access denied. Insufficient permissions.',
                    code: 'INSUFFICIENT_PERMISSIONS',
                    required: rbac_1.Permission.MANAGE_USERS,
                });
                expect(nextFunction).not.toHaveBeenCalled();
            });
            it('should return 401 when user is not authenticated', () => {
                mockRequest.user = undefined;
                const middleware = (0, rbac_1.requirePermission)(rbac_1.Permission.CREATE_PATIENTS);
                middleware(mockRequest, mockResponse, nextFunction);
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
                const middleware = (0, rbac_1.requireAnyPermission)([
                    rbac_1.Permission.MANAGE_USERS,
                    rbac_1.Permission.CREATE_PATIENTS,
                ]);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
            it('should return 403 when user has none of the permissions', () => {
                const middleware = (0, rbac_1.requireAnyPermission)([
                    rbac_1.Permission.MANAGE_USERS,
                    rbac_1.Permission.APPROVE_EMI_PLANS,
                ]);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(mockResponse.status).toHaveBeenCalledWith(403);
                expect(nextFunction).not.toHaveBeenCalled();
            });
        });
        describe('requireAllPermissions', () => {
            it('should call next() when user has all permissions', () => {
                const middleware = (0, rbac_1.requireAllPermissions)([
                    rbac_1.Permission.CREATE_PATIENTS,
                    rbac_1.Permission.VIEW_PATIENTS,
                ]);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
            it('should return 403 when user is missing any permission', () => {
                const middleware = (0, rbac_1.requireAllPermissions)([
                    rbac_1.Permission.CREATE_PATIENTS,
                    rbac_1.Permission.APPROVE_EMI_PLANS,
                ]);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(mockResponse.status).toHaveBeenCalledWith(403);
                expect(nextFunction).not.toHaveBeenCalled();
            });
        });
        describe('requireRole', () => {
            it('should call next() when user has the required role', () => {
                const middleware = (0, rbac_1.requireRole)(rbac_1.UserRole.PROVIDER);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
            it('should return 403 when user has different role', () => {
                const middleware = (0, rbac_1.requireRole)(rbac_1.UserRole.SUPER_ADMIN);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(mockResponse.status).toHaveBeenCalledWith(403);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: `Access denied. Requires ${rbac_1.UserRole.SUPER_ADMIN} role.`,
                    code: 'INSUFFICIENT_PERMISSIONS',
                    required: rbac_1.UserRole.SUPER_ADMIN,
                });
                expect(nextFunction).not.toHaveBeenCalled();
            });
        });
        describe('requireAnyRole', () => {
            it('should call next() when user has one of the required roles', () => {
                const middleware = (0, rbac_1.requireAnyRole)([rbac_1.UserRole.PROVIDER, rbac_1.UserRole.SUPER_ADMIN]);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
            it('should return 403 when user has none of the required roles', () => {
                const middleware = (0, rbac_1.requireAnyRole)([rbac_1.UserRole.SUPER_ADMIN, rbac_1.UserRole.FINANCIAL_ADMIN]);
                middleware(mockRequest, mockResponse, nextFunction);
                expect(mockResponse.status).toHaveBeenCalledWith(403);
                expect(nextFunction).not.toHaveBeenCalled();
            });
        });
    });
    describe('Permission Coverage', () => {
        it('should ensure all roles have at least one permission', () => {
            Object.values(rbac_1.UserRole).forEach(role => {
                const permissions = rbac_1.RolePermissions[role];
                expect(permissions).toBeDefined();
                expect(permissions.length).toBeGreaterThan(0);
            });
        });
        it('should ensure super admin has the most permissions', () => {
            const superAdminPerms = rbac_1.RolePermissions[rbac_1.UserRole.SUPER_ADMIN].length;
            const financialAdminPerms = rbac_1.RolePermissions[rbac_1.UserRole.FINANCIAL_ADMIN].length;
            const providerPerms = rbac_1.RolePermissions[rbac_1.UserRole.PROVIDER].length;
            const billingStaffPerms = rbac_1.RolePermissions[rbac_1.UserRole.BILLING_STAFF].length;
            expect(superAdminPerms).toBeGreaterThan(financialAdminPerms);
            expect(superAdminPerms).toBeGreaterThan(providerPerms);
            expect(superAdminPerms).toBeGreaterThan(billingStaffPerms);
        });
    });
});
