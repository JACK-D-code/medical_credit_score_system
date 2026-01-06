export default function Sidebar() {
    return (
      <aside className="w-72 bg-gradient-to-b from-gray-900 to-black text-white p-6">
        <h1 className="text-2xl font-bold tracking-wide">MedScore Pro</h1>
        <nav className="mt-10 space-y-4 text-gray-300">
          <p className="hover:text-white cursor-pointer">Dashboard</p>
          <p className="hover:text-white cursor-pointer">Billing</p>
          <p className="hover:text-white cursor-pointer">Analytics</p>
          <p className="hover:text-white cursor-pointer">Eligibility</p>
        </nav>
      </aside>
    );
  }
  