# RBAC Integration Guide

## Quick Start

The RBAC system is now fully integrated with the authentication middleware. Here's how to use it in your routes:

### Basic Usage

```typescript
import { Router } from 'express';
import { authenticateToken } from './middleware/auth';
import { Permission, requirePermission } from './middleware/rbac';

const router = Router();

// Step 1: Authenticate the user
// Step 2: Check their permissions
router.post(
  '/api/patients',
  authenticateToken,              // Validates JWT and attaches user to request
  requirePermission(Permission.CREATE_PATIENTS),  // Checks if user has permission
  createPatientController
);
```

### Migration from Old Auth Middleware

If you were using the old `requireRole` or `requireAnyRole` from `auth.ts`, you can now use the more flexible permission-based approach:

**Before (auth.ts):**
```typescript
import { authenticateToken, requireRole } from './middleware/auth';

router.post('/api/bills', authenticateToken, requireRole('provider'), createBill);
```

**After (rbac.ts) - Recommended:**
```typescript
import { authenticateToken } from './middleware/auth';
import { Permission, requirePermission } from './middleware/rbac';

router.post('/api/bills', authenticateToken, requirePermission(Permission.CREATE_BILLS), createBill);
```

**Why permission-based is better:**
- More flexible: Multiple roles can have the same permission
- Easier to maintain: Change permissions without touching routes
- Better security: Fine-grained control over what users can do

### Common Patterns

#### 1. Single Permission Check
```typescript
router.post(
  '/api/patients',
  authenticateToken,
  requirePermission(Permission.CREATE_PATIENTS),
  createPatient
);
```

#### 2. Multiple Permissions (OR logic)
User needs at least ONE of the permissions:
```typescript
router.get(
  '/api/bills',
  authenticateToken,
  requireAnyPermission([Permission.VIEW_BILLS, Permission.CREATE_BILLS]),
  getBills
);
```

#### 3. Multiple Permissions (AND logic)
User needs ALL of the permissions:
```typescript
router.put(
  '/api/bills/:id',
  authenticateToken,
  requireAllPermissions([Permission.VIEW_BILLS, Permission.UPDATE_BILLS]),
  updateBill
);
```

#### 4. Role-Based Check (when needed)
```typescript
router.post(
  '/api/users',
  authenticateToken,
  requireRole(UserRole.SUPER_ADMIN),
  createUser
);
```

#### 5. Multiple Roles
```typescript
router.post(
  '/api/emi-plans/:id/approve',
  authenticateToken,
  requireAnyRole([UserRole.SUPER_ADMIN, UserRole.FINANCIAL_ADMIN]),
  approveEMIPlan
);
```

### Programmatic Permission Checks

Sometimes you need to check permissions in your controller logic:

```typescript
import { hasPermission, UserRole, Permission } from './middleware/rbac';
import { AuthRequest } from './middleware/auth';

export const getBillDetails = async (req: AuthRequest, res: Response) => {
  const userRole = req.user.role as UserRole;
  
  // Check if user can see sensitive financial data
  if (hasPermission(userRole, Permission.VIEW_FINANCIAL_REPORTS)) {
    // Include detailed financial breakdown
    return res.json({
      bill: billData,
      financialDetails: detailedFinancials,
    });
  }
  
  // Return basic bill info only
  return res.json({
    bill: billData,
  });
};
```

### Role Hierarchy

```
Super Admin (Full Access)
├── User Management
├── System Configuration
└── All other permissions

Financial Admin
├── Credit Scoring
├── EMI Approval
├── Financial Reports
└── Audit Logs

Provider
├── Patient Management
├── Bill Creation
└── View Credit Scores

Billing Staff
├── Bill Management
├── Payment Tracking
└── Basic Reporting
```

### Permission Matrix Quick Reference

| Action | Super Admin | Financial Admin | Provider | Billing Staff |
|--------|-------------|-----------------|----------|---------------|
| Create Patients | ✓ | ✗ | ✓ | ✗ |
| Create Bills | ✓ | ✗ | ✓ | ✗ |
| Calculate Credit Score | ✓ | ✓ | ✗ | ✗ |
| Approve EMI Plans | ✓ | ✓ | ✗ | ✗ |
| Record Payments | ✓ | ✗ | ✗ | ✓ |
| View Audit Logs | ✓ | ✓ | ✗ | ✗ |
| Manage Users | ✓ | ✗ | ✗ | ✗ |

### Testing Your Routes

```typescript
import request from 'supertest';
import app from '../app';

describe('Protected Routes', () => {
  it('should allow provider to create patients', async () => {
    const token = generateToken({ role: 'provider' });
    
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send(patientData);
    
    expect(response.status).toBe(201);
  });
  
  it('should deny billing staff from creating patients', async () => {
    const token = generateToken({ role: 'billing_staff' });
    
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send(patientData);
    
    expect(response.status).toBe(403);
    expect(response.body.code).toBe('INSUFFICIENT_PERMISSIONS');
  });
});
```

### Error Responses

When a user lacks permissions, they'll receive:

```json
{
  "error": "Access denied. Insufficient permissions.",
  "code": "INSUFFICIENT_PERMISSIONS",
  "required": "create_patients"
}
```

When not authenticated:

```json
{
  "error": "Authentication required.",
  "code": "NOT_AUTHENTICATED"
}
```

### Best Practices

1. **Always authenticate first**: Use `authenticateToken` before any permission checks
2. **Use permissions over roles**: More flexible and maintainable
3. **Document your routes**: Add comments explaining permission requirements
4. **Test thoroughly**: Test both allowed and denied access scenarios
5. **Keep permissions granular**: Better to have specific permissions than broad ones
6. **Use TypeScript enums**: Prevents typos and provides autocomplete

### Adding New Permissions

To add a new permission:

1. Add it to the `Permission` enum in `rbac.ts`:
```typescript
export enum Permission {
  // ... existing permissions
  NEW_PERMISSION = 'new_permission',
}
```

2. Add it to the appropriate role(s) in `RolePermissions`:
```typescript
[UserRole.PROVIDER]: [
  // ... existing permissions
  Permission.NEW_PERMISSION,
],
```

3. Use it in your routes:
```typescript
router.post('/api/new-feature', 
  authenticateToken, 
  requirePermission(Permission.NEW_PERMISSION), 
  handler
);
```

### Troubleshooting

**Issue**: User has correct role but still gets 403
- Check if the role has the required permission in `RolePermissions`
- Verify the JWT token contains the correct role
- Check if `authenticateToken` is called before permission check

**Issue**: Permission check not working
- Ensure you're importing from `./middleware/rbac`, not `./middleware/auth`
- Verify the permission enum value matches exactly
- Check that the user object is attached to the request

**Issue**: Tests failing
- Mock the `authenticateToken` middleware in tests
- Ensure test tokens include the `role` field
- Use the correct role enum values

### Next Steps

1. Review the example routes in `routes/example-protected-routes.ts`
2. Update your existing routes to use the new RBAC system
3. Run the test suite: `npm test -- rbac.test.ts`
4. Check the full documentation in `middleware/README.md`
