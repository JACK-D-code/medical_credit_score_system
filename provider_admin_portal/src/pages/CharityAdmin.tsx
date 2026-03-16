import { useState, useEffect } from 'react';
import api from '../lib/api';

const CharityAdmin = () => {
    const [grants, setGrants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGrants = async () => {
            try {
                const res = await api.get('/admin/charity/grants');
                setGrants(res.data.grants);
            } catch (err: any) {
                setError('Failed to fetch charity grants');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGrants();
    }, []);

    const totalCharityAwarded = grants.reduce((sum, g) => sum + g.amount, 0);

    return (
        <div className="max-w-7xl mx-auto text-white animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading mb-2">Charity & Sponsorships Hub</h1>
                    <p className="text-gray-400">Track 100% Charity Grants automatically issued by the POS to high-score patients.</p>
                </div>
                <div className="mt-4 md:mt-0 bg-[#1a1c23] border border-emerald-500/30 px-6 py-4 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <p className="text-sm text-gray-400 font-semibold mb-1">Total Charity Issued</p>
                    <p className="text-3xl font-black text-emerald-400">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalCharityAwarded)}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="bg-[#1a1c23] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                           <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                           Approved Grants Log
                        </h2>
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
                            {grants.length} Grants
                        </span>
                    </div>
                    {grants.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4 M12 20V4"></path></svg>
                            <p>No charity sponsorships have been issued yet.</p>
                            <p className="text-sm mt-2">Scan a highly-ranked PH-ID (Score &gt;800) in the POS to issue a grant.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-black/50 text-gray-400 text-sm">
                                        <th className="p-4 rounded-tl-xl font-medium">Patient</th>
                                        <th className="p-4 font-medium">PH-ID</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium min-w-[200px]">Description</th>
                                        <th className="p-4 font-medium text-right rounded-tr-xl">Amount Waived</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 flex-1">
                                    {grants.map((grant) => (
                                        <tr key={grant.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <p className="font-semibold text-white">{grant.patientName}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="font-mono text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                                    {grant.phid}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {new Date(grant.date).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="p-4 text-sm text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    {grant.description}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(grant.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CharityAdmin;
