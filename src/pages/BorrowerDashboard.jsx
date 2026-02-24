import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoans } from '../context/LoanContext';
import LoanCard from '../components/LoanCard';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const { 
    loans, 
    applications, 
    transactions, 
    applyForLoan, 
    recordTransaction, 
    editApplication, 
    deleteApplication 
  } = useLoans();
  
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  
  const [formData, setFormData] = useState({
    name: user.username || user.name || '',
    age: '',
    income: '',
    idType: 'aadhar',
    idNumber: '',
    address: '',
    accountDetails: '',
    collateral: ''
  });

  const availableLoans = loans.filter(l => l.status === 'active');
  const myApplications = applications.filter(a => a.borrower === user.username);
  
  const formatMoney = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const calculateEMI = (principal, rate, months) => {
    const p = Number(principal);
    const r = Number(rate) / (12 * 100); 
    const n = Number(months);
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? 0 : emi;
  };

  const handleInputChange = (e, isEdit = false) => {
    if (isEdit) {
      setEditingApp({ ...editingApp, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (selectedLoan) {
      applyForLoan(selectedLoan.id, user.username, selectedLoan.amount, formData);
      setSelectedLoan(null);
      setFormData({ ...formData, age: '', income: '', idNumber: '', address: '', accountDetails: '', collateral: '' });
      alert("Application submitted successfully!");
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    editApplication(editingApp.id, editingApp);
    setEditingApp(null);
  };

  const handleWithdraw = (appId) => {
    if (window.confirm("Are you sure you want to withdraw and delete this loan application?")) {
      deleteApplication(appId);
    }
  };

  const handleMakePayment = (applicationId, emiAmount) => {
    recordTransaction(applicationId, emiAmount, 'payment');
    alert(`EMI Payment of ${formatMoney(emiAmount)} processed successfully!`);
  };

  return (
    <div className="space-y-12 animate-fade-in relative">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Borrower Dashboard</h1>
        <p className="text-gray-500 mt-2">Browse offers, apply with your details, track progress, and pay EMIs.</p>
      </header>

      {/* Available Loans Section */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-6">Available Loan Offers</h2>
        {availableLoans.length === 0 ? (
          <p className="text-gray-500 italic bg-white p-6 rounded-lg border border-gray-200">No active loans available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableLoans.map(loan => {
              const hasApplied = myApplications.some(app => app.loanId === loan.id);
              return (
                <LoanCard 
                  key={loan.id} 
                  loan={loan} 
                  actionButton={
                    <button 
                      disabled={hasApplied}
                      onClick={() => setSelectedLoan(loan)}
                      className={`w-full py-2.5 rounded-lg font-bold transition-all shadow-sm ${
                        hasApplied 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-primary hover:bg-blue-800 text-white hover:shadow-md'
                      }`}
                    >
                      {hasApplied ? 'Application Submitted' : 'Calculate & Apply'}
                    </button>
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Track Progress & Pay EMIs */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Progress & EMI Payments</h2>
        
        {myApplications.length === 0 ? (
          <p className="text-gray-500 italic">You haven't applied for any loans yet.</p>
        ) : (
          <div className="space-y-6">
            {myApplications.map(app => {
              const loanInfo = loans.find(l => l.id === app.loanId);
              if (!loanInfo) return null;

              const emi = calculateEMI(loanInfo.amount, loanInfo.interestRate, loanInfo.durationMonths);
              const totalPaymentsMade = transactions
                .filter(t => t.applicationId === app.id && t.type === 'payment')
                .reduce((sum, t) => sum + Number(t.amount), 0);

              let statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
              let statusText = "Pending Review";
              
              if (app.status === 'approved' || app.status === 'granted') {
                statusColor = "bg-green-100 text-green-800 border-green-200";
                statusText = "Loan Granted";
              } else if (app.status === 'rejected') {
                statusColor = "bg-red-100 text-red-800 border-red-200";
                statusText = "Application Rejected";
              } else if (app.status === 'hold') {
                statusColor = "bg-orange-100 text-orange-800 border-orange-200";
                statusText = "On Hold (Action Required)";
              }

              return (
                <div key={app.id} className="border border-gray-200 rounded-xl p-6 flex flex-col lg:flex-row gap-6 justify-between items-center bg-gray-50 hover:bg-white transition-colors">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{formatMoney(loanInfo.amount)}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Lender: {loanInfo.lender} • Interest: {loanInfo.interestRate}% • Duration: {loanInfo.durationMonths} mo</p>
                    <p className="text-sm font-medium text-gray-700">Estimated EMI: <span className="text-primary">{formatMoney(emi)}/mo</span></p>
                  </div>

                  <div className="flex-shrink-0 w-full lg:w-auto text-right">
                    {(app.status === 'approved' || app.status === 'granted') ? (
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center lg:items-end">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-bold">Total Repaid: {formatMoney(totalPaymentsMade)}</p>
                        <button 
                          onClick={() => handleMakePayment(app.id, emi)}
                          className="bg-secondary hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                        >
                          Pay EMI Now
                        </button>
                      </div>
                    ) : (app.status === 'pending' || app.status === 'hold') ? (
                      <div className="flex gap-3 w-full lg:w-auto justify-end">
                        <button onClick={() => setEditingApp(app)} className="px-6 py-2 bg-white text-primary border border-primary hover:bg-blue-50 rounded-lg font-bold shadow-sm transition-colors">
                          Edit Profile
                        </button>
                        <button onClick={() => handleWithdraw(app.id)} className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold shadow-sm transition-colors">
                          Withdraw
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic p-4">
                        Payments unlock when granted.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* EDIT APPLICATION MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-primary p-5 text-white shrink-0">
              <h3 className="text-xl font-bold">Edit Loan Application</h3>
              <p className="text-blue-200 text-sm mt-1">Update your application details below</p>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="editAppForm" onSubmit={handleSaveEdit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Financial Income (₹)</label>
                  <input type="number" name="income" value={editingApp.income} onChange={(e) => handleInputChange(e, true)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="e.g., 5000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Details</label>
                  <input type="text" name="accountDetails" value={editingApp.accountDetails} onChange={(e) => handleInputChange(e, true)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="Bank Name & Account Number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collateral Offered</label>
                  <input type="text" name="collateral" value={editingApp.collateral} onChange={(e) => handleInputChange(e, true)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="e.g., FD, Land Paper, Gold, None" />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3 shrink-0 justify-end">
              <button type="button" onClick={() => setEditingApp(null)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" form="editAppForm" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors font-bold shadow-sm">
                Update Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW APPLICATION MODAL */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            <div className="bg-primary p-5 text-white shrink-0">
              <h3 className="text-xl font-bold">Loan Application Form</h3>
              <p className="text-blue-200 text-sm mt-1">Applying for {formatMoney(selectedLoan.amount)} from {selectedLoan.lender}</p>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-600 uppercase font-bold">Calculated EMI</p>
                  <p className="text-2xl font-black text-primary">
                    {formatMoney(calculateEMI(selectedLoan.amount, selectedLoan.interestRate, selectedLoan.durationMonths))} <span className="text-sm font-normal text-gray-600">/ month</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Duration: {selectedLoan.durationMonths} mo</p>
                  <p className="text-xs text-gray-500">Rate: {selectedLoan.interestRate}% p.a.</p>
                </div>
              </div>

              <form id="loanAppForm" onSubmit={handleApply} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input type="number" name="age" min="18" required value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Financial Income (₹)</label>
                  <input type="number" name="income" required value={formData.income} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="e.g., 5000" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Identity Type</label>
                    <select name="idType" value={formData.idType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none bg-white">
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    <input type="text" name="idNumber" required value={formData.idNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="Enter ID number" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                  <textarea name="address" required rows="2" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="Full address"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Details</label>
                  <input type="text" name="accountDetails" required value={formData.accountDetails} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="Bank Name & Account Number" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Can you grant collateral? (Optional)</label>
                  <input type="text" name="collateral" value={formData.collateral} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary outline-none" placeholder="e.g., FD, Land Paper, Gold, None" />
                </div>
              </form>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200 flex gap-3 shrink-0 justify-end">
              <button type="button" onClick={() => setSelectedLoan(null)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" form="loanAppForm" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors font-bold shadow-sm">
                Submit Application
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}