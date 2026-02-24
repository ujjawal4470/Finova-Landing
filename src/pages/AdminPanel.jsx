import { useLoans } from '../context/LoanContext';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { loans, applications, transactions } = useLoans();
  const { systemLogs } = useAuth(); // Pull the live logs from Context

  return (
    <div className="space-y-8">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Platform Operations Oversight</h1>
        <p className="text-gray-500 mt-2">Monitor live system health, data security, and real-time platform usage.</p>
      </header>

      {/* High-Level System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Loans Created</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{loans.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Applications</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Transactions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{transactions.length}</p>
        </div>
      </div>

      {/* LIVE Security Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live Security Logs
          </h2>
          <span className="text-xs text-gray-400">Tracking Real-time IPs & Timestamps</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Action & User</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Exact Time</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {(!systemLogs || systemLogs.length === 0) ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                    No activity logged yet. Log in or register to see live tracking.
                  </td>
                </tr>
              ) : (
                systemLogs.map(log => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{log.action}</td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-600 bg-gray-50">{log.ip}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        log.status === 'Success' || log.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}