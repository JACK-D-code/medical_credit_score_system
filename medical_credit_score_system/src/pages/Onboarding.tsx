import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const onboardingSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(2, 'Last name is too short'),
    age: z.number().min(18, 'Must be at least 18').max(120, 'Invalid age'),
    income: z.number().min(0, 'Income cannot be negative'),
    creditHistory: z.number().min(300, 'Minimum credit score is 300').max(850, 'Maximum credit score is 850'),
    bmi: z.number().min(10, 'Invalid BMI').max(60, 'Invalid BMI'),
    bloodPressureSys: z.number().min(70).max(250),
    bloodPressureDia: z.number().min(40).max(150),
    cholesterol: z.number().min(100).max(600),
    smoking: z.boolean(),
    exerciseHours: z.number().min(0).max(40),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            age: undefined,
            income: undefined,
            creditHistory: undefined,
            bmi: undefined,
            bloodPressureSys: undefined,
            bloodPressureDia: undefined,
            cholesterol: undefined,
            smoking: false,
            exerciseHours: undefined,
        },
    });

    const onSubmit = async (data: OnboardingFormValues) => {
        try {
            const registerRes = await api.post('/auth/register', {
                email: data.email,
                password: data.password,
                role: 'PATIENT',
                firstName: data.firstName,
                lastName: data.lastName
            });

            const { token, user } = registerRes.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // 2. Update the newly created patient profile with medical/financial data
            await api.put(`/patients/${user.id}`, {
                firstName: data.firstName,
                lastName: data.lastName,
                age: data.age,
                bmi: data.bmi,
                bloodPressureSys: data.bloodPressureSys,
                bloodPressureDia: data.bloodPressureDia,
                cholesterol: data.cholesterol,
                smoking: data.smoking,
                exerciseHours: data.exerciseHours,
                annualIncome: data.income,
                creditHistory: data.creditHistory
            });

            // 3. Trigger the Scoring Engine
            const scoreRes = await api.post(`/scores/calculate/${user.id}`);

            // Navigate to Dashboard passing the computed score payload
            navigate('/dashboard', { state: { scoreData: scoreRes.data } });

        } catch (error: any) {
            console.error("Onboarding failed", error.response?.data || error);
            alert("Failed to submit assessment: " + (error.response?.data?.error || "Server connection issue"));
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="glass-panel">
                <h1 className="text-3xl font-bold mb-2">Patient Onboarding & Assessment</h1>
                <p className="text-gray-400 mb-8">Please provide your health and financial information to generate your Medical Credit Score.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Section 1: Personal Info */}
                    <div>
                        <h3 className="text-xl font-semibold border-b border-[rgba(255,255,255,0.1)] pb-2 mb-4 text-[#00f2fe]">Personal & Financial Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" {...register('email')} className={`form-input ${errors.email ? 'border-red-500' : ''}`} placeholder="user@example.com" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" {...register('password')} className={`form-input ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input {...register('firstName')} className={`form-input ${errors.firstName ? 'border-red-500' : ''}`} placeholder="John" />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input {...register('lastName')} className={`form-input ${errors.lastName ? 'border-red-500' : ''}`} placeholder="Doe" />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input type="number" {...register('age', { valueAsNumber: true })} className={`form-input ${errors.age ? 'border-red-500' : ''}`} placeholder="35" />
                                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Annual Income ($)</label>
                                <input type="number" {...register('income', { valueAsNumber: true })} className={`form-input ${errors.income ? 'border-red-500' : ''}`} placeholder="65000" />
                                {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income.message}</p>}
                            </div>

                            <div className="form-group md:col-span-2">
                                <label className="form-label">Financial Credit Score (300 - 850)</label>
                                <input type="number" {...register('creditHistory', { valueAsNumber: true })} className={`form-input ${errors.creditHistory ? 'border-red-500' : ''}`} placeholder="720" />
                                {errors.creditHistory && <p className="text-red-500 text-sm mt-1">{errors.creditHistory.message}</p>}
                                <p className="text-xs text-gray-400 mt-1">This is securely integrated via soft-pull in a real application.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Medical Info */}
                    <div>
                        <h3 className="text-xl font-semibold border-b border-[rgba(255,255,255,0.1)] pb-2 mb-4 text-[#8b5cf6]">Health Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">BMI (Body Mass Index)</label>
                                <input type="number" step="0.1" {...register('bmi', { valueAsNumber: true })} className={`form-input ${errors.bmi ? 'border-red-500' : ''}`} placeholder="24.5" />
                                {errors.bmi && <p className="text-red-500 text-sm mt-1">{errors.bmi.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cholesterol (mg/dL)</label>
                                <input type="number" {...register('cholesterol', { valueAsNumber: true })} className={`form-input ${errors.cholesterol ? 'border-red-500' : ''}`} placeholder="180" />
                                {errors.cholesterol && <p className="text-red-500 text-sm mt-1">{errors.cholesterol.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Systolic Blood Pressure</label>
                                <input type="number" {...register('bloodPressureSys', { valueAsNumber: true })} className={`form-input ${errors.bloodPressureSys ? 'border-red-500' : ''}`} placeholder="120" />
                                {errors.bloodPressureSys && <p className="text-red-500 text-sm mt-1">{errors.bloodPressureSys.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Diastolic Blood Pressure</label>
                                <input type="number" {...register('bloodPressureDia', { valueAsNumber: true })} className={`form-input ${errors.bloodPressureDia ? 'border-red-500' : ''}`} placeholder="80" />
                                {errors.bloodPressureDia && <p className="text-red-500 text-sm mt-1">{errors.bloodPressureDia.message}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Weekly Exercise (Hours)</label>
                                <input type="number" {...register('exerciseHours', { valueAsNumber: true })} className={`form-input ${errors.exerciseHours ? 'border-red-500' : ''}`} placeholder="3" />
                                {errors.exerciseHours && <p className="text-red-500 text-sm mt-1">{errors.exerciseHours.message}</p>}
                            </div>

                            <div className="form-group flex flex-col justify-end">
                                <label className="form-label flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.2)] hover:border-[#00f2fe] transition-colors">
                                    <input type="checkbox" {...register('smoking')} className="w-5 h-5 accent-[#00f2fe]" />
                                    <span className="text-white text-base">Tobacco / Smoking Usage</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-btn md:w-auto md:min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Processing...' : 'Generate Score & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
