"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const phid_service_1 = __importDefault(require("../services/phid.service"));
const prisma = new client_1.PrismaClient();
async function seedPHIDData() {
    console.log('🌱 Seeding PHID demo data...');
    try {
        // Demo patient data with complete module information
        const demoPatients = [
            {
                id: 'P001',
                firstName: 'Rahul',
                lastName: 'Sharma',
                dateOfBirth: new Date('1990-03-15'),
                bloodGroup: 'B+',
                phone: '+91-9876543210',
                address: '123 MG Road, Bangalore, Karnataka 560001',
                emergencyContact: '+91-9876543211 (Sister - Priya Sharma)',
                issuedBy: 'ADMIN_001'
            },
            {
                id: 'P002',
                firstName: 'Priya',
                lastName: 'Patel',
                dateOfBirth: new Date('1996-07-22'),
                bloodGroup: 'A+',
                phone: '+91-9876543212',
                address: '456 Brigade Road, Bangalore, Karnataka 560025',
                emergencyContact: '+91-9876543213 (Husband - Raj Patel)',
                issuedBy: 'ADMIN_001'
            },
            {
                id: 'P003',
                firstName: 'Amit',
                lastName: 'Kumar',
                dateOfBirth: new Date('1979-11-08'),
                bloodGroup: 'O+',
                phone: '+91-9876543214',
                address: '789 Residency Road, Bangalore, Karnataka 560034',
                emergencyContact: '+91-9876543215 (Wife - Sunita Kumar)',
                issuedBy: 'ADMIN_001'
            }
        ];
        // Create PHIDs for demo patients
        const phids = [];
        for (const patient of demoPatients) {
            try {
                const phid = await phid_service_1.default.createPHID(patient);
                phids.push(phid);
                console.log(`✅ Created PHID: ${phid} for ${patient.firstName} ${patient.lastName}`);
            }
            catch (error) {
                console.log(`ℹ️ PHID for ${patient.firstName} ${patient.lastName} may already exist`);
            }
        }
        // Create comprehensive patient data for each PHID
        await createPatientModuleData('P001', 'PHID-1K4J2A8-XYZ123');
        await createPatientModuleData('P002', 'PHID-1K4J2B9-ABC456');
        await createPatientModuleData('P003', 'PHID-1K4J2C7-DEF789');
        console.log('🎉 PHID demo data seeding completed successfully!');
        console.log('\n📋 Demo PHIDs created:');
        console.log('1. PHID-1K4J2A8-XYZ123 → Rahul Sharma (Age: 34, Score: 750)');
        console.log('2. PHID-1K4J2B9-ABC456 → Priya Patel (Age: 28, Score: 720)');
        console.log('3. PHID-1K4J2C7-DEF789 → Amit Kumar (Age: 45, Score: 680)');
    }
    catch (error) {
        console.error('❌ Error seeding PHID data:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
async function createPatientModuleData(patientId, phid) {
    console.log(`📊 Creating module data for patient ${patientId}...`);
    // Create User account
    const user = await prisma.user.upsert({
        where: { email: `patient${patientId}@demo.com` },
        update: {},
        create: {
            email: `patient${patientId}@demo.com`,
            password: 'demo123', // In production, this would be hashed
            role: 'PATIENT',
            isActive: true
        }
    });
    // Create Patient Profile
    const patient = await prisma.patient.upsert({
        where: { patientId },
        update: {},
        create: {
            patientId,
            userId: user.id,
            firstName: patientId === 'P001' ? 'Rahul' : patientId === 'P002' ? 'Priya' : 'Amit',
            lastName: patientId === 'P001' ? 'Sharma' : patientId === 'P002' ? 'Patel' : 'Kumar',
            age: patientId === 'P001' ? 34 : patientId === 'P002' ? 28 : 45,
            bmi: 24.5,
            bloodPressureSys: 120,
            bloodPressureDia: 80,
            cholesterol: 180,
            bloodGroup: patientId === 'P001' ? 'B+' : patientId === 'P002' ? 'A+' : 'O+',
            phone: patientId === 'P001' ? '+91-9876543210' : patientId === 'P002' ? '+91-9876543212' : '+91-9876543214',
            address: patientId === 'P001' ? '123 MG Road, Bangalore' : patientId === 'P002' ? '456 Brigade Road, Bangalore' : '789 Residency Road, Bangalore',
            emergencyContact: patientId === 'P001' ? '+91-9876543211' : patientId === 'P002' ? '+91-9876543213' : '+91-9876543215',
            createdBy: user.id
        }
    });
    // Create Credit Score
    const scoreValue = patientId === 'P001' ? 750 : patientId === 'P002' ? 720 : 680;
    await prisma.creditScore.upsert({
        where: { patientId },
        update: {},
        create: {
            patientId,
            score: scoreValue,
            riskLevel: scoreValue >= 750 ? 'LOW' : scoreValue >= 650 ? 'MEDIUM' : 'HIGH',
            paymentHistoryScore: 85,
            insuranceScore: 90,
            incomeScore: 70,
            medicalRiskScore: 60,
            calculatedAt: new Date(),
            calculatedBy: user.id
        }
    });
    // Create Medical Activities
    const activities = [
        {
            activityType: 'MEDICINE',
            activityTitle: 'Morning Medicine',
            points: 5,
            description: 'Took morning medicine as prescribed',
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            activityType: 'EXERCISE',
            activityTitle: 'Morning Walk',
            points: 8,
            description: 'Completed 30-minute morning walk',
            completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
        },
        {
            activityType: 'DIET',
            activityTitle: 'Healthy Breakfast',
            points: 5,
            description: 'Had healthy breakfast with fruits',
            completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
            activityType: 'CHECKUP',
            activityTitle: 'Blood Pressure Check',
            points: 5,
            description: 'Regular blood pressure monitoring',
            completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
        }
    ];
    for (const activity of activities) {
        await prisma.patientActivity.create({
            data: {
                patientId,
                ...activity,
                metadata: {
                    trackedVia: 'PHID_SYSTEM',
                    location: 'Home'
                }
            }
        });
    }
    // Create Health Tasks
    const healthTasks = [
        {
            title: 'Morning Blood Pressure Check',
            taskType: 'DAILY',
            points: 5,
            status: 'COMPLETED',
            dueDate: new Date(),
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
            title: 'Evening Walk - 30 mins',
            taskType: 'DAILY',
            points: 8,
            status: 'PENDING',
            dueDate: new Date(),
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
            title: 'Medicine Adherence',
            taskType: 'DAILY',
            points: 10,
            status: 'COMPLETED',
            dueDate: new Date(),
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
            title: 'Weekly Weight Tracking',
            taskType: 'WEEKLY',
            points: 15,
            status: 'PENDING',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
            title: 'Monthly Blood Test',
            taskType: 'MONTHLY',
            points: 25,
            status: 'PENDING',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
    ];
    for (const task of healthTasks) {
        await prisma.healthTask.create({
            data: {
                patientId,
                ...task
            }
        });
    }
    // Create Appointments
    const appointments = [
        {
            providerId: 'PROV_001',
            appointmentType: 'FOLLOW_UP',
            title: 'Follow-up Consultation',
            scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            duration: 30,
            status: 'SCHEDULED',
            cost: 500
        },
        {
            providerId: 'PROV_002',
            appointmentType: 'CHECKUP',
            title: 'General Health Checkup',
            scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            duration: 45,
            status: 'SCHEDULED',
            cost: 800
        },
        {
            providerId: 'PROV_001',
            appointmentType: 'EMERGENCY',
            title: 'Emergency Consultation',
            scheduledFor: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
            duration: 60,
            status: 'SCHEDULED',
            cost: 1500
        }
    ];
    for (const appointment of appointments) {
        await prisma.appointment.create({
            data: {
                patientId,
                ...appointment
            }
        });
    }
    // Create Billing Records
    const bills = [
        {
            hospitalName: 'City Hospital',
            treatmentType: 'General Consultation',
            billAmount: 500,
            subtotal: 500,
            patientResponsibility: 500,
            outstanding: 500,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'PENDING',
            createdBy: user.id
        },
        {
            hospitalName: 'City Hospital',
            treatmentType: 'Lab Tests',
            billAmount: 1200,
            subtotal: 1200,
            patientResponsibility: 1200,
            outstanding: 1200,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'PENDING',
            createdBy: user.id
        }
    ];
    for (const bill of bills) {
        await prisma.billingRecord.create({
            data: {
                patientId,
                ...bill
            }
        });
    }
    // Create EMI Plans
    const emiPlans = [
        {
            billId: null, // Will be set after bill creation
            planNumber: 'EMI001',
            principalAmount: 25000,
            interestRate: 0,
            emiAmount: 5000,
            duration: 5,
            status: 'ACTIVE',
            nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    ];
    for (const plan of emiPlans) {
        await prisma.eMIPlan.create({
            data: {
                patientId,
                ...plan
            }
        });
    }
    // Create Notifications
    const notifications = [
        {
            title: 'Welcome to Medical Credit Score System',
            message: 'Your PHID has been activated. Start tracking your health activities to earn points!',
            type: 'INFO',
            isRead: false
        },
        {
            title: 'Health Task Reminder',
            message: 'Don\'t forget your evening walk today. Earn 8 points!',
            type: 'REMINDER',
            isRead: false
        },
        {
            title: 'Appointment Confirmed',
            message: 'Your follow-up consultation has been scheduled for next week.',
            type: 'APPOINTMENT',
            isRead: false
        }
    ];
    for (const notification of notifications) {
        await prisma.notification2.create({
            data: {
                userId: user.id,
                ...notification
            }
        });
    }
    console.log(`✅ Complete module data created for patient ${patientId}`);
}
// Run the seed function
if (require.main === module) {
    seedPHIDData();
}
exports.default = seedPHIDData;
