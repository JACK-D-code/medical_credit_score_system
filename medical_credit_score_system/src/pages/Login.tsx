export default function Login() {

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <div className="glass-panel w-full max-w-md text-center py-12">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M10.29 3.86l-6.58 11.4A2 2 0 005.44 18h13.12a2 2 0 001.73-3l-6.58-11.4a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-3 text-white">System Restructuring</h1>
                <p className="text-gray-400 leading-relaxed px-4">
                    The Provider authentication portals have been temporarily disabled for planned infrastructure restructuring.
                </p>
            </div>
        </div>
    );
}
