# Middleware Documentation

## Authentication & Authorization

This directory contains middleware for authentication and role-based access control (RBAC).

### Authentication Middleware (`auth.ts`)

Provides JWT-based authentication for protected routes.

#### Available Middleware:

- **`authenticateToken`**: Validates JWT access token and attaches user info to request
- **`requireRole(role)`**: Requires a specific role to access the route
- **`requireAnyRole(roles)`**: Allows access if user has any of the specified roles
- **`optionalAuth`**: Attaches user info if token is present, but doesn't require it

#### Usage Example:

```typescript
import { authenticateToken, requireRole } from './middleware/auth';

// Protect a route with authentication
router.get('/api/profile', authenticateToken, getProfile);

// Require specific role
router.post('/api/users', authenticateToken, requireRole('super_admin'), createUser);

// Allow multiple roles
router.get('/api/reports', authenticateToken, requireAnyRole(['super_admin', 'financial_admin']), getReports);
```

---

### RBAC Middleware (`rbac.ts`)

Provides comprehensive role-based access control with fine-grained permissions.

#### User Roles:

1. **Super Admin** (`super_admin`)
   - Full system access
   - User management
   - System configuration
   - All permissions

2. **Financial Admin** (`financial_admin`)
   - Credit scoring
   - EMI approval
   - Financial reports
   - Audit logs
   - Cannot manage users or system config

3. **Provider** (`provider`)
   - Patient management (create, view, update)
   - Bill creation and management
   - View credit scores (cannot calculate)
   - View EMI plans (cannot approve)
   - View payments

4. **Billing Staff** (`billing_staff`)
   - Bill management (view, update)
   - Payment tracking
   - Basic reporting
   - Cannot create patients or approve EMIs

#### Permissions:

The system defines granular permissions for different operations:

**User Management:**
- `MANAGE_USERS` - Create, update, delete users
- `VIEW_USERS` - View user information

**System Configuration:**
- `MANAGE_SYSTEM_CONFIG` - Modify system settings
- `VIEW_SYSTEM_CONFIG` - View system settings

**Patient Management:**
- `CREATE_PATIENTS` - Create new patients
- `VIEW_PATIENTS` - View patient information
- `UPDATE_PATIENTS` - Update patient information
- `DELETE_PATIENTS` - Delete patients

**Bill Management:**
- `CREATE_BILLS` - Create new bills
- `VIEW_BILLS` - View bills
- `UPDATE_BILLS` - Update bills
- `DELETE_BILLS` - Delete bills

**Credit Scoring:**
- `CALCULATE_CREDIT_SCORE` - Calculate credit scores
- `VIEW_CREDIT_SCORE` - View credit scores

**EMI Plans:**
- `CREATE_EMI_PLANS` - Create EMI plans
- `VIEW_EMI_PLANS` - View EMI plans
- `APPROVE_EMI_PLANS` - Approve EMI plans
- `MODIFY_EMI_PLANS` - Modify EMI plans

**Payments:**
- `RECORD_PAYMENTS` - Record payments
- `VIEW_PAYMENTS` - View payments
- `PROCESS_REFUNDS` - Process refunds

**Financial Reports:**
- `VIEW_FINANCIAL_REPORTS` - View financial reports
- `EXPORT_FINANCIAL_REPORTS` - Export financial reports

**Audit Logs:**
- `VIEW_AUDIT_LOGS` - View audit logs
- `EXPORT_AUDIT_LOGS` - Export audit logs

**Analytics:**
- `VIEW_ANALYTICS` - View analytics
- `VIEW_DASHBOARD` - View dashboard

#### Available Middleware:

1. **`requirePermission(permission)`**: Requires a specific permission
2. **`requireAnyPermission(permissions)`**: Requires at least one of the specified permissions
3. **`requireAllPermissions(permissions)`**: Requires all of the specified permissions
4. **`requireRole(role)`**: Requires a specific role
5. **`requireAnyRole(roles)`**: Requires one of the specified roles

#### Helper Functions:

- **`hasPermission(role, permission)`**: Check if a role has a permission
- **`hasAnyPermission(role, permissions)`**: Check if a role has any of the permissions
- **`hasAllPermissions(role, permissions)`**: Check if a role has all permissions
- **`getPermissionsForRole(role)`**: Get all permissions for a role

#### Usage Examples:

```typescript
import { authenticateToken } from './middleware/auth';
import {
  UserRole,
  Permission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireAnyRole,
} from './middleware/rbac';

// Require specific permission
router.post(
  '/api/patients',
  authenticateToken,
  requirePermission(Permission.CREATE_PATIENTS),
  createPatient
);

// Require any of multiple permissions
router.get(
  '/api/bills',
  authenticateToken,
  requireAnyPermission([Permission.VIEW_BILLS, Permission.CREATE_BILLS]),
  getBills
);

// Require all permissions
router.put(
  '/api/bills/:id',
  authenticateToken,
  requireAllPermissions([Permission.VIEW_BILLS, Permission.UPDATE_BILLS]),
  updateBill
);

// Require specific role
router.post(
  '/api/users',
  authenticateToken,
  requireRole(UserRole.SUPER_ADMIN),
  createUser
);

// Require any of multiple roles
router.post(
  '/api/emi-plans/:id/approve',
  authenticateToken,
  requireAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCIAL_ADMIN]),
  approveEMIPlan
);

// Check permissions programmatically
import { hasPermission } from './middleware/rbac';

if (hasPermission(user.role as UserRole, Permission.APPROVE_EMI_PLANS)) {
  // User can approve EMI plans
}
```

#### Route Guard Examples:

```typescript
// Patient Management Routes
router.post('/api/patients', authenticateToken, requirePermission(Permission.CREATE_PATIENTS), createPatient);
router.get('/api/patients', authenticateToken, requirePermission(Permission.VIEW_PATIENTS), getPatients);
router.put('/api/patients/:id', authenticateToken, requirePermission(Permission.UPDATE_PATIENTS), updatePatient);
router.delete('/api/patients/:id', authenticateToken, requirePermission(Permission.DELETE_PATIENTS), deletePatient);

// Bill Management Routes
router.post('/api/bills', authenticateToken, requirePermission(Permission.CREATE_BILLS), createBill);
router.get('/api/bills', authenticateToken, requirePermission(Permission.VIEW_BILLS), getBills);
router.put('/api/bills/:id', authenticateToken, requirePermission(Permission.UPDATE_BILLS), updateBill);

// Credit Scoring Routes
router.post('/api/credit-scores/calculate', authenticateToken, requirePermission(Permission.CALCULATE_CREDIT_SCORE), calculateCreditScore);
router.get('/api/credit-scores/:id', authenticateToken, requirePermission(Permission.VIEW_CREDIT_SCORE), getCreditScore);

// EMI Plan Routes
router.post('/api/emi-plans', authenticateToken, requirePermission(Permission.CREATE_EMI_PLANS), createEMIPlan);
router.post('/api/emi-plans/:id/approve', authenticateToken, requirePermission(Permission.APPROVE_EMI_PLANS), approveEMIPlan);

// Payment Routes
router.post('/api/payments', authenticateToken, requirePermission(Permission.RECORD_PAYMENTS), recordPayment);
router.post('/api/payments/:id/refund', authenticateToken, requirePermission(Permission.PROCESS_REFUNDS), processRefund);

// Admin Routes
router.get('/api/audit-logs', authenticateToken, requirePermission(Permission.VIEW_AUDIT_LOGS), getAuditLogs);
router.get('/api/analytics/dashboard', authenticateToken, requirePermission(Permission.VIEW_DASHBOARD), getDashboard);
```

#### Permission Matrix:

| Permission | Super Admin | Financial Admin | Provider | Billing Staff |
|-----------|-------------|-----------------|----------|---------------|
| Manage Users | ✓ | ✗ | ✗ | ✗ |
| Manage System Config | ✓ | ✗ | ✗ | ✗ |
| Create Patients | ✓ | ✗ | ✓ | ✗ |
| View Patients | ✓ | ✓ | ✓ | ✓ |
| Update Patients | ✓ | ✗ | ✓ | ✗ |
| Delete Patients | ✓ | ✗ | ✗ | ✗ |
| Create Bills | ✓ | ✗ | ✓ | ✗ |
| View Bills | ✓ | ✓ | ✓ | ✓ |
| Update Bills | ✓ | ✗ | ✓ | ✓ |
| Delete Bills | ✓ | ✗ | ✗ | ✗ |
| Calculate Credit Score | ✓ | ✓ | ✗ | ✗ |
| View Credit Score | ✓ | ✓ | ✓ | ✗ |
| Create EMI Plans | ✓ | ✓ | ✗ | ✗ |
| View EMI Plans | ✓ | ✓ | ✓ | ✓ |
| Approve EMI Plans | ✓ | ✓ | ✗ | ✗ |
| Modify EMI Plans | ✓ | ✓ | ✗ | ✗ |
| Record Payments | ✓ | ✗ | ✗ | ✓ |
| View Payments | ✓ | ✓ | ✓ | ✓ |
| Process Refunds | ✓ | ✓ | ✗ | ✗ |
| View Financial Reports | ✓ | ✓ | ✗ | ✓ |
| Export Financial Reports | ✓ | ✓ | ✗ | ✗ |
| View Audit Logs | ✓ | ✓ | ✗ | ✗ |
| Export Audit Logs | ✓ | ✓ | ✗ | ✗ |
| View Analytics | ✓ | ✓ | ✗ | ✗ |
| View Dashboard | ✓ | ✓ | ✓ | ✓ |

#### Best Practices:

1. **Always use `authenticateToken` first**: Ensure the user is authenticated before checking permissions
   ```typescript
   router.post('/api/bills', authenticateToken, requirePermission(Permission.CREATE_BILLS), createBill);
   ```

2. **Use permission-based guards over role-based guards**: Permissions are more flexible and maintainable
   ```typescript
   // Good: Permission-based
   requirePermission(Permission.APPROVE_EMI_PLANS)
   
   // Less flexible: Role-based
   requireRole(UserRole.FINANCIAL_ADMIN)
   ```

3. **Use `requireAnyPermission` for OR logic**: When multiple permissions can grant access
   ```typescript
   requireAnyPermission([Permission.VIEW_BILLS, Permission.CREATE_BILLS])
   ```

4. **Use `requireAllPermissions` for AND logic**: When all permissions are required
   ```typescript
   requireAllPermissions([Permission.VIEW_BILLS, Permission.UPDATE_BILLS])
   ```

5. **Check permissions programmatically when needed**: For conditional logic in controllers
   ```typescript
   import { hasPermission } from './middleware/rbac';
   
   if (hasPermission(req.user.role as UserRole, Permission.APPROVE_EMI_PLANS)) {
     // Show approval button
   }
   ```

6. **Document permission requirements**: Add comments to routes explaining why specific permissions are needed
   ```typescript
   // Only financial admins and super admins can approve EMI plans
   router.post('/api/emi-plans/:id/approve', 
     authenticateToken, 
     requirePermission(Permission.APPROVE_EMI_PLANS), 
     approveEMIPlan
   );
   ```

#### Testing:

Run the RBAC middleware tests:

```bash
npm test -- rbac.test.ts
```

The test suite covers:
- Permission checking functions
- Role permission mappings
- Middleware functions
- Permission coverage
- All four user roles and their permissions
