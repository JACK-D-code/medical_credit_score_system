# Database Seeding

This directory contains the database schema and seed data for the Provider/Admin Portal.

## Seed Data Overview

The seed script (`seed.ts`) populates the database with comprehensive test data for development and testing purposes.

### What Gets Seeded

1. **Users (4 total)**
   - Super Admin: `admin@hospital.com`
   - Financial Admin: `finance@hospital.com`
   - Provider: `doctor@hospital.com`
   - Billing Staff: `billing@hospital.com`
   - All passwords: `password123`

2. **Patients (5 total)**
   - PAT-001: Alice Johnson (High credit score, fully paid bill)
   - PAT-002: Bob Smith (Good credit score, pending bill)
   - PAT-003: Carol Williams (Medium credit score, active EMI plan)
   - PAT-004: David Brown (Low credit score, high-risk EMI plan)
   - PAT-005: Emma Davis (Good credit score, 0% interest EMI)

3. **Bills (5 total)**
   - BILL-2024-001: $525 - Paid (Annual Physical)
   - BILL-2024-002: $2,525 - Pending (Emergency Room)
   - BILL-2024-003: $8,200 - EMI (Surgical Procedure)
   - BILL-2024-004: $3,675 - Pending (Specialist Consultation)
   - BILL-2024-005: $1,210 - Partial (Dental Procedure)

4. **Credit Scores (5 total)**
   - Scores ranging from 450 (high risk) to 780 (low risk)
   - Complete factor breakdowns and bonus points
   - Detailed payment history, income, debt, and insurance data

5. **EMI Plans (3 total)**
   - EMI-2024-001: 6 months, 10% interest (medium risk)
   - EMI-2024-002: 12 months, 12% interest (high risk, co-signer)
   - EMI-2024-003: 3 months, 0% interest (promotional rate)

6. **Payments (5 total)**
   - Various payment methods: card, cash, UPI, bank transfer
   - Includes full payments, partial payments, and EMI installments

## Running the Seed Script

### Option 1: Using npm script
```bash
cd server
npm run seed
```

### Option 2: Using Prisma CLI
```bash
cd server
npx prisma db seed
```

### Option 3: Direct execution
```bash
cd server
npx ts-node prisma/seed.ts
```

## Important Notes

- **Data Cleanup**: The seed script automatically clears all existing data before seeding
- **Idempotent**: Safe to run multiple times - it will reset the database each time
- **Development Only**: This seed data is for development/testing purposes only
- **Password Security**: All users share the same password (`password123`) for easy testing

## Testing Scenarios

The seed data supports various testing scenarios:

### 1. User Role Testing
- Test different permission levels with the 4 user roles
- Verify RBAC (Role-Based Access Control) functionality

### 2. Credit Scoring
- Test low, medium, and high-risk credit assessments
- Verify credit score calculations and factor breakdowns

### 3. EMI Plans
- Test different interest rates based on credit scores
- Verify installment calculations and payment tracking
- Test 0% promotional rates for excellent credit

### 4. Payment Processing
- Test various payment methods
- Verify payment status updates
- Test partial and full payment scenarios

### 5. Bill Management
- Test different bill statuses (pending, paid, partial, EMI)
- Verify insurance claim processing
- Test itemized charges

## Database Schema

The complete database schema is defined in `schema.prisma`. Key tables include:

- `users` - Authentication and user management
- `patients` - Patient demographics and insurance
- `bills` - Medical bills and charges
- `bill_items` - Itemized charges for bills
- `credit_scores` - Credit assessment data
- `emi_plans` - EMI payment plans
- `emi_installments` - Individual installment schedules
- `payments` - Payment transactions

## Resetting the Database

To completely reset the database and re-seed:

```bash
cd server
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script automatically
