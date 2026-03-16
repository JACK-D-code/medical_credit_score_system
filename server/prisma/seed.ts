import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.eMIInstallment.deleteMany();
  await prisma.eMIPlan.deleteMany();
  await prisma.creditScore.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.billItem.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Existing data cleaned');

  // ============================================
  // 1. Create Users with Different Roles
  // ============================================
  console.log('👥 Creating users...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@hospital.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Admin',
      role: 'super_admin',
      phone: '+1234567890',
      isActive: true,
    },
  });

  const financialAdmin = await prisma.user.create({
    data: {
      email: 'finance@hospital.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Finance',
      role: 'financial_admin',
      phone: '+1234567891',
      isActive: true,
    },
  });

  const provider = await prisma.user.create({
    data: {
      email: 'doctor@hospital.com',
      passwordHash: hashedPassword,
      firstName: 'Michael',
      lastName: 'Doctor',
      role: 'provider',
      phone: '+1234567892',
      isActive: true,
    },
  });

  const billingStaff = await prisma.user.create({
    data: {
      email: 'billing@hospital.com',
      passwordHash: hashedPassword,
      firstName: 'Emily',
      lastName: 'Billing',
      role: 'billing_staff',
      phone: '+1234567893',
      isActive: true,
    },
  });

  console.log('✅ Created 4 users with different roles');

  // ============================================
  // 2. Create Sample Patients
  // ============================================
  console.log('🏥 Creating patients...');

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        patientId: 'PAT-001',
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Female',
        email: 'alice.johnson@email.com',
        phone: '+1555001001',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: 'BCBS-123456',
        insuranceGroupNumber: 'GRP-001',
        insuranceStatus: 'active',
        insuranceVerifiedAt: new Date(),
        relationshipStartDate: new Date('2019-01-15'),
        referralSource: 'Online',
        createdBy: provider.id,
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-002',
        firstName: 'Bob',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-07-22'),
        gender: 'Male',
        email: 'bob.smith@email.com',
        phone: '+1555001002',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        insuranceProvider: 'Aetna',
        insurancePolicyNumber: 'AET-789012',
        insuranceGroupNumber: 'GRP-002',
        insuranceStatus: 'active',
        insuranceVerifiedAt: new Date(),
        relationshipStartDate: new Date('2020-06-10'),
        referralSource: 'Referral',
        createdBy: provider.id,
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-003',
        firstName: 'Carol',
        lastName: 'Williams',
        dateOfBirth: new Date('1978-11-30'),
        gender: 'Female',
        email: 'carol.williams@email.com',
        phone: '+1555001003',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        insuranceProvider: 'UnitedHealthcare',
        insurancePolicyNumber: 'UHC-345678',
        insuranceGroupNumber: 'GRP-003',
        insuranceStatus: 'active',
        insuranceVerifiedAt: new Date(),
        relationshipStartDate: new Date('2015-03-20'),
        referralSource: 'Walk-in',
        createdBy: provider.id,
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-004',
        firstName: 'David',
        lastName: 'Brown',
        dateOfBirth: new Date('1995-05-18'),
        gender: 'Male',
        email: 'david.brown@email.com',
        phone: '+1555001004',
        address: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        insuranceStatus: 'inactive',
        relationshipStartDate: new Date('2023-01-10'),
        referralSource: 'Online',
        createdBy: provider.id,
      },
    }),
    prisma.patient.create({
      data: {
        patientId: 'PAT-005',
        firstName: 'Emma',
        lastName: 'Davis',
        dateOfBirth: new Date('1988-09-25'),
        gender: 'Female',
        email: 'emma.davis@email.com',
        phone: '+1555001005',
        address: '654 Maple Dr',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        insuranceProvider: 'Cigna',
        insurancePolicyNumber: 'CIG-901234',
        insuranceGroupNumber: 'GRP-004',
        insuranceStatus: 'active',
        insuranceVerifiedAt: new Date(),
        relationshipStartDate: new Date('2021-08-15'),
        referralSource: 'Referral',
        createdBy: provider.id,
      },
    }),
  ]);

  console.log(`✅ Created ${patients.length} patients`);

  // ============================================
  // 3. Create Sample Bills and Bill Items
  // ============================================
  console.log('💰 Creating bills...');

  const bill1 = await prisma.bill.create({
    data: {
      billNumber: 'BILL-2024-001',
      patientId: patients[0].id,
      providerId: provider.id,
      billDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      serviceDate: new Date('2024-01-10'),
      serviceDescription: 'Annual Physical Examination',
      subtotal: 500.00,
      taxAmount: 25.00,
      discountAmount: 0,
      totalAmount: 525.00,
      insuranceClaimAmount: 400.00,
      insurancePaidAmount: 400.00,
      patientResponsibility: 125.00,
      paidAmount: 125.00,
      outstandingAmount: 0,
      status: 'paid',
      paymentMethod: 'card',
      createdBy: provider.id,
      billItems: {
        create: [
          {
            itemCode: 'CPT-99213',
            description: 'Office Visit - Established Patient',
            quantity: 1,
            unitPrice: 300.00,
            totalPrice: 300.00,
            cptCode: '99213',
          },
          {
            itemCode: 'LAB-001',
            description: 'Blood Work - Complete Panel',
            quantity: 1,
            unitPrice: 200.00,
            totalPrice: 200.00,
            cptCode: '80053',
          },
        ],
      },
    },
  });

  const bill2 = await prisma.bill.create({
    data: {
      billNumber: 'BILL-2024-002',
      patientId: patients[1].id,
      providerId: provider.id,
      billDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-20'),
      serviceDate: new Date('2024-01-18'),
      serviceDescription: 'Emergency Room Visit',
      subtotal: 2500.00,
      taxAmount: 125.00,
      discountAmount: 100.00,
      totalAmount: 2525.00,
      insuranceClaimAmount: 2000.00,
      insurancePaidAmount: 1800.00,
      patientResponsibility: 725.00,
      paidAmount: 0,
      outstandingAmount: 725.00,
      status: 'pending',
      createdBy: provider.id,
      billItems: {
        create: [
          {
            itemCode: 'ER-001',
            description: 'Emergency Room Visit - Level 3',
            quantity: 1,
            unitPrice: 1500.00,
            totalPrice: 1500.00,
            cptCode: '99283',
          },
          {
            itemCode: 'XRAY-001',
            description: 'X-Ray - Chest',
            quantity: 1,
            unitPrice: 500.00,
            totalPrice: 500.00,
            cptCode: '71046',
          },
          {
            itemCode: 'LAB-002',
            description: 'Urinalysis',
            quantity: 1,
            unitPrice: 500.00,
            totalPrice: 500.00,
            cptCode: '81000',
          },
        ],
      },
    },
  });

  const bill3 = await prisma.bill.create({
    data: {
      billNumber: 'BILL-2024-003',
      patientId: patients[2].id,
      providerId: provider.id,
      billDate: new Date('2024-01-25'),
      dueDate: new Date('2024-02-25'),
      serviceDate: new Date('2024-01-22'),
      serviceDescription: 'Surgical Procedure - Minor',
      subtotal: 8000.00,
      taxAmount: 400.00,
      discountAmount: 200.00,
      totalAmount: 8200.00,
      insuranceClaimAmount: 6500.00,
      insurancePaidAmount: 6000.00,
      patientResponsibility: 2200.00,
      paidAmount: 500.00,
      outstandingAmount: 1700.00,
      status: 'emi',
      createdBy: provider.id,
      billItems: {
        create: [
          {
            itemCode: 'SURG-001',
            description: 'Minor Surgical Procedure',
            quantity: 1,
            unitPrice: 5000.00,
            totalPrice: 5000.00,
            cptCode: '10060',
          },
          {
            itemCode: 'ANES-001',
            description: 'Anesthesia Services',
            quantity: 1,
            unitPrice: 1500.00,
            totalPrice: 1500.00,
            cptCode: '00300',
          },
          {
            itemCode: 'SUPPLY-001',
            description: 'Surgical Supplies',
            quantity: 1,
            unitPrice: 1500.00,
            totalPrice: 1500.00,
          },
        ],
      },
    },
  });

  const bill4 = await prisma.bill.create({
    data: {
      billNumber: 'BILL-2024-004',
      patientId: patients[3].id,
      providerId: provider.id,
      billDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      serviceDate: new Date('2024-01-28'),
      serviceDescription: 'Specialist Consultation',
      subtotal: 3500.00,
      taxAmount: 175.00,
      discountAmount: 0,
      totalAmount: 3675.00,
      insuranceClaimAmount: 0,
      insurancePaidAmount: 0,
      patientResponsibility: 3675.00,
      paidAmount: 0,
      outstandingAmount: 3675.00,
      status: 'pending',
      createdBy: provider.id,
      billItems: {
        create: [
          {
            itemCode: 'CONS-001',
            description: 'Specialist Consultation - Cardiology',
            quantity: 1,
            unitPrice: 2000.00,
            totalPrice: 2000.00,
            cptCode: '99244',
          },
          {
            itemCode: 'ECG-001',
            description: 'Electrocardiogram',
            quantity: 1,
            unitPrice: 800.00,
            totalPrice: 800.00,
            cptCode: '93000',
          },
          {
            itemCode: 'ECHO-001',
            description: 'Echocardiogram',
            quantity: 1,
            unitPrice: 700.00,
            totalPrice: 700.00,
            cptCode: '93306',
          },
        ],
      },
    },
  });

  const bill5 = await prisma.bill.create({
    data: {
      billNumber: 'BILL-2024-005',
      patientId: patients[4].id,
      providerId: provider.id,
      billDate: new Date('2024-02-05'),
      dueDate: new Date('2024-03-05'),
      serviceDate: new Date('2024-02-03'),
      serviceDescription: 'Dental Procedure',
      subtotal: 1200.00,
      taxAmount: 60.00,
      discountAmount: 50.00,
      totalAmount: 1210.00,
      insuranceClaimAmount: 800.00,
      insurancePaidAmount: 700.00,
      patientResponsibility: 510.00,
      paidAmount: 210.00,
      outstandingAmount: 300.00,
      status: 'partial',
      paymentMethod: 'cash',
      createdBy: provider.id,
      billItems: {
        create: [
          {
            itemCode: 'DENT-001',
            description: 'Dental Filling - Composite',
            quantity: 2,
            unitPrice: 400.00,
            totalPrice: 800.00,
            cptCode: 'D2391',
          },
          {
            itemCode: 'DENT-002',
            description: 'Dental Cleaning',
            quantity: 1,
            unitPrice: 400.00,
            totalPrice: 400.00,
            cptCode: 'D1110',
          },
        ],
      },
    },
  });

  console.log('✅ Created 5 bills with itemized charges');

  // ============================================
  // 4. Create Credit Scores
  // ============================================
  console.log('📊 Creating credit scores...');

  const creditScores = await Promise.all([
    // High credit score - Low risk
    prisma.creditScore.create({
      data: {
        patientId: patients[0].id,
        score: 780,
        riskLevel: 'low',
        paymentHistoryScore: 95.0,
        incomeStabilityScore: 88.0,
        medicalDebtScore: 92.0,
        insuranceCoverageScore: 90.0,
        longTermPatientBonus: 10,
        perfectPaymentBonus: 15,
        premiumInsuranceBonus: 10,
        referralBonus: 0,
        totalBonus: 35,
        paymentHistoryDetails: JSON.stringify({
          onTimePayments: 12,
          totalPayments: 12,
          defaultCount: 0,
          averagePaymentDelay: 0,
        }),
        incomeDetails: JSON.stringify({
          annualIncome: 85000,
          employmentStatus: 'full-time',
          incomeToDebtRatio: 0.25,
        }),
        debtDetails: JSON.stringify({
          existingMedicalDebt: 0,
          totalDebt: 15000,
          debtToIncomeRatio: 0.18,
        }),
        insuranceDetails: JSON.stringify({
          provider: 'Blue Cross Blue Shield',
          coverageType: 'Premium',
          coverageLimit: 500000,
        }),
        calculationVersion: 'v1.0',
        calculatedBy: financialAdmin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    // Good credit score - Low risk
    prisma.creditScore.create({
      data: {
        patientId: patients[1].id,
        score: 680,
        riskLevel: 'low',
        paymentHistoryScore: 82.0,
        incomeStabilityScore: 75.0,
        medicalDebtScore: 78.0,
        insuranceCoverageScore: 85.0,
        longTermPatientBonus: 0,
        perfectPaymentBonus: 0,
        premiumInsuranceBonus: 10,
        referralBonus: 5,
        totalBonus: 15,
        paymentHistoryDetails: JSON.stringify({
          onTimePayments: 8,
          totalPayments: 10,
          defaultCount: 0,
          averagePaymentDelay: 5,
        }),
        incomeDetails: JSON.stringify({
          annualIncome: 65000,
          employmentStatus: 'full-time',
          incomeToDebtRatio: 0.35,
        }),
        debtDetails: JSON.stringify({
          existingMedicalDebt: 2000,
          totalDebt: 25000,
          debtToIncomeRatio: 0.38,
        }),
        insuranceDetails: JSON.stringify({
          provider: 'Aetna',
          coverageType: 'Standard',
          coverageLimit: 250000,
        }),
        calculationVersion: 'v1.0',
        calculatedBy: financialAdmin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    // Medium credit score - Medium risk
    prisma.creditScore.create({
      data: {
        patientId: patients[2].id,
        score: 590,
        riskLevel: 'medium',
        paymentHistoryScore: 68.0,
        incomeStabilityScore: 70.0,
        medicalDebtScore: 55.0,
        insuranceCoverageScore: 75.0,
        longTermPatientBonus: 10,
        perfectPaymentBonus: 0,
        premiumInsuranceBonus: 10,
        referralBonus: 0,
        totalBonus: 20,
        paymentHistoryDetails: JSON.stringify({
          onTimePayments: 15,
          totalPayments: 25,
          defaultCount: 2,
          averagePaymentDelay: 15,
        }),
        incomeDetails: JSON.stringify({
          annualIncome: 48000,
          employmentStatus: 'full-time',
          incomeToDebtRatio: 0.45,
        }),
        debtDetails: JSON.stringify({
          existingMedicalDebt: 8000,
          totalDebt: 35000,
          debtToIncomeRatio: 0.73,
        }),
        insuranceDetails: JSON.stringify({
          provider: 'UnitedHealthcare',
          coverageType: 'Standard',
          coverageLimit: 200000,
        }),
        calculationVersion: 'v1.0',
        calculatedBy: financialAdmin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    // Low credit score - High risk
    prisma.creditScore.create({
      data: {
        patientId: patients[3].id,
        score: 450,
        riskLevel: 'high',
        paymentHistoryScore: 45.0,
        incomeStabilityScore: 50.0,
        medicalDebtScore: 35.0,
        insuranceCoverageScore: 20.0,
        longTermPatientBonus: 0,
        perfectPaymentBonus: 0,
        premiumInsuranceBonus: 0,
        referralBonus: 0,
        totalBonus: 0,
        paymentHistoryDetails: JSON.stringify({
          onTimePayments: 2,
          totalPayments: 8,
          defaultCount: 3,
          averagePaymentDelay: 45,
        }),
        incomeDetails: JSON.stringify({
          annualIncome: 32000,
          employmentStatus: 'part-time',
          incomeToDebtRatio: 0.65,
        }),
        debtDetails: JSON.stringify({
          existingMedicalDebt: 15000,
          totalDebt: 45000,
          debtToIncomeRatio: 1.41,
        }),
        insuranceDetails: JSON.stringify({
          provider: 'None',
          coverageType: 'Uninsured',
          coverageLimit: 0,
        }),
        calculationVersion: 'v1.0',
        calculatedBy: financialAdmin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    // Good credit score - Low risk
    prisma.creditScore.create({
      data: {
        patientId: patients[4].id,
        score: 720,
        riskLevel: 'low',
        paymentHistoryScore: 88.0,
        incomeStabilityScore: 82.0,
        medicalDebtScore: 85.0,
        insuranceCoverageScore: 88.0,
        longTermPatientBonus: 0,
        perfectPaymentBonus: 0,
        premiumInsuranceBonus: 10,
        referralBonus: 5,
        totalBonus: 15,
        paymentHistoryDetails: JSON.stringify({
          onTimePayments: 10,
          totalPayments: 11,
          defaultCount: 0,
          averagePaymentDelay: 2,
        }),
        incomeDetails: JSON.stringify({
          annualIncome: 72000,
          employmentStatus: 'full-time',
          incomeToDebtRatio: 0.28,
        }),
        debtDetails: JSON.stringify({
          existingMedicalDebt: 1500,
          totalDebt: 20000,
          debtToIncomeRatio: 0.28,
        }),
        insuranceDetails: JSON.stringify({
          provider: 'Cigna',
          coverageType: 'Premium',
          coverageLimit: 400000,
        }),
        calculationVersion: 'v1.0',
        calculatedBy: financialAdmin.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`✅ Created ${creditScores.length} credit scores`);

  // ============================================
  // 5. Create EMI Plans and Installments
  // ============================================
  console.log('💳 Creating EMI plans...');

  // EMI Plan for bill3 (Carol Williams - Medium Risk)
  const emiPlan1 = await prisma.eMIPlan.create({
    data: {
      planNumber: 'EMI-2024-001',
      patientId: patients[2].id,
      billId: bill3.id,
      creditScoreId: creditScores[2].id,
      principalAmount: 1700.00,
      downPayment: 500.00,
      financedAmount: 1200.00,
      interestRate: 10.0,
      durationMonths: 6,
      monthlyInstallment: 210.00,
      totalAmount: 1260.00,
      totalInterest: 60.00,
      paidInstallments: 2,
      totalPaid: 420.00,
      outstandingBalance: 840.00,
      nextDueDate: new Date('2024-05-01'),
      status: 'active',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-01'),
      approvedAt: new Date('2024-02-28'),
      approvedBy: financialAdmin.id,
      termsAcceptedAt: new Date('2024-02-28'),
      createdBy: financialAdmin.id,
    },
  });

  // Create installments for EMI Plan 1
  const installments1 = [];
  for (let i = 1; i <= 6; i++) {
    const dueDate = new Date('2024-03-01');
    dueDate.setMonth(dueDate.getMonth() + i - 1);
    
    const principalComponent = 200.00;
    const interestComponent = 10.00;
    
    installments1.push({
      emiPlanId: emiPlan1.id,
      installmentNumber: i,
      dueDate,
      amount: 210.00,
      principalComponent,
      interestComponent,
      status: i <= 2 ? 'paid' : 'pending',
      paidAmount: i <= 2 ? 210.00 : 0,
      paidDate: i <= 2 ? new Date(dueDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
    });
  }

  await prisma.eMIInstallment.createMany({
    data: installments1,
  });

  // EMI Plan for bill4 (David Brown - High Risk - Requires co-signer)
  const emiPlan2 = await prisma.eMIPlan.create({
    data: {
      planNumber: 'EMI-2024-002',
      patientId: patients[3].id,
      billId: bill4.id,
      creditScoreId: creditScores[3].id,
      principalAmount: 3675.00,
      downPayment: 1100.00,
      financedAmount: 2575.00,
      interestRate: 12.0,
      durationMonths: 12,
      monthlyInstallment: 230.00,
      totalAmount: 2760.00,
      totalInterest: 185.00,
      paidInstallments: 0,
      totalPaid: 0,
      outstandingBalance: 2760.00,
      nextDueDate: new Date('2024-03-15'),
      status: 'active',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2025-02-15'),
      approvedAt: new Date('2024-02-14'),
      approvedBy: financialAdmin.id,
      termsAcceptedAt: new Date('2024-02-14'),
      notes: 'Approved with co-signer due to high risk',
      createdBy: financialAdmin.id,
    },
  });

  // Create installments for EMI Plan 2
  const installments2 = [];
  for (let i = 1; i <= 12; i++) {
    const dueDate = new Date('2024-02-15');
    dueDate.setMonth(dueDate.getMonth() + i);
    
    const principalComponent = 214.58;
    const interestComponent = 15.42;
    
    installments2.push({
      emiPlanId: emiPlan2.id,
      installmentNumber: i,
      dueDate,
      amount: 230.00,
      principalComponent,
      interestComponent,
      status: 'pending',
      paidAmount: 0,
    });
  }

  await prisma.eMIInstallment.createMany({
    data: installments2,
  });

  // EMI Plan for bill5 (Emma Davis - Low Risk - 0% interest)
  const emiPlan3 = await prisma.eMIPlan.create({
    data: {
      planNumber: 'EMI-2024-003',
      patientId: patients[4].id,
      billId: bill5.id,
      creditScoreId: creditScores[4].id,
      principalAmount: 300.00,
      downPayment: 0,
      financedAmount: 300.00,
      interestRate: 0.0,
      durationMonths: 3,
      monthlyInstallment: 100.00,
      totalAmount: 300.00,
      totalInterest: 0,
      paidInstallments: 1,
      totalPaid: 100.00,
      outstandingBalance: 200.00,
      nextDueDate: new Date('2024-04-05'),
      status: 'active',
      startDate: new Date('2024-03-05'),
      endDate: new Date('2024-06-05'),
      approvedAt: new Date('2024-03-04'),
      approvedBy: financialAdmin.id,
      termsAcceptedAt: new Date('2024-03-04'),
      notes: '0% interest promotional rate for excellent credit',
      createdBy: financialAdmin.id,
    },
  });

  // Create installments for EMI Plan 3
  const installments3 = [];
  for (let i = 1; i <= 3; i++) {
    const dueDate = new Date('2024-03-05');
    dueDate.setMonth(dueDate.getMonth() + i);
    
    installments3.push({
      emiPlanId: emiPlan3.id,
      installmentNumber: i,
      dueDate,
      amount: 100.00,
      principalComponent: 100.00,
      interestComponent: 0,
      status: i === 1 ? 'paid' : 'pending',
      paidAmount: i === 1 ? 100.00 : 0,
      paidDate: i === 1 ? new Date('2024-03-06') : null,
    });
  }

  await prisma.eMIInstallment.createMany({
    data: installments3,
  });

  console.log('✅ Created 3 EMI plans with installment schedules');

  // ============================================
  // 6. Create Sample Payments
  // ============================================
  console.log('💵 Creating payments...');

  const payments = await Promise.all([
    // Payment for bill1 (fully paid)
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-001',
        patientId: patients[0].id,
        billId: bill1.id,
        amount: 125.00,
        paymentMethod: 'card',
        paymentDate: new Date('2024-01-20'),
        transactionId: 'TXN-STRIPE-001',
        gatewayName: 'Stripe',
        gatewayResponse: JSON.stringify({
          status: 'succeeded',
          cardBrand: 'visa',
          last4: '4242',
        }),
        status: 'completed',
        receiptUrl: 'https://receipts.example.com/PAY-2024-001.pdf',
        createdBy: billingStaff.id,
      },
    }),
    // Partial payment for bill5
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-002',
        patientId: patients[4].id,
        billId: bill5.id,
        amount: 210.00,
        paymentMethod: 'cash',
        paymentDate: new Date('2024-02-10'),
        status: 'completed',
        receiptUrl: 'https://receipts.example.com/PAY-2024-002.pdf',
        createdBy: billingStaff.id,
      },
    }),
    // EMI installment payment 1 for emiPlan1
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-003',
        patientId: patients[2].id,
        emiPlanId: emiPlan1.id,
        amount: 210.00,
        paymentMethod: 'upi',
        paymentDate: new Date('2024-03-02'),
        transactionId: 'TXN-UPI-001',
        gatewayName: 'Razorpay',
        gatewayResponse: JSON.stringify({
          status: 'captured',
          method: 'upi',
          vpa: 'patient@upi',
        }),
        status: 'completed',
        receiptUrl: 'https://receipts.example.com/PAY-2024-003.pdf',
        createdBy: billingStaff.id,
      },
    }),
    // EMI installment payment 2 for emiPlan1
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-004',
        patientId: patients[2].id,
        emiPlanId: emiPlan1.id,
        amount: 210.00,
        paymentMethod: 'bank_transfer',
        paymentDate: new Date('2024-04-03'),
        transactionId: 'TXN-BANK-001',
        gatewayName: 'Bank Transfer',
        status: 'completed',
        receiptUrl: 'https://receipts.example.com/PAY-2024-004.pdf',
        createdBy: billingStaff.id,
      },
    }),
    // EMI installment payment 1 for emiPlan3
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-005',
        patientId: patients[4].id,
        emiPlanId: emiPlan3.id,
        amount: 100.00,
        paymentMethod: 'card',
        paymentDate: new Date('2024-03-06'),
        transactionId: 'TXN-STRIPE-002',
        gatewayName: 'Stripe',
        gatewayResponse: JSON.stringify({
          status: 'succeeded',
          cardBrand: 'mastercard',
          last4: '5555',
        }),
        status: 'completed',
        receiptUrl: 'https://receipts.example.com/PAY-2024-005.pdf',
        createdBy: billingStaff.id,
      },
    }),
  ]);

  console.log(`✅ Created ${payments.length} payment records`);

  // ============================================
  // Summary
  // ============================================
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - Users: 4 (1 super admin, 1 financial admin, 1 provider, 1 billing staff)`);
  console.log(`   - Patients: ${patients.length}`);
  console.log(`   - Bills: 5 with itemized charges`);
  console.log(`   - Credit Scores: ${creditScores.length}`);
  console.log(`   - EMI Plans: 3 with installment schedules`);
  console.log(`   - Payments: ${payments.length}`);
  console.log('\n🔐 Login credentials (all users):');
  console.log('   Email: admin@hospital.com, finance@hospital.com, doctor@hospital.com, billing@hospital.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
