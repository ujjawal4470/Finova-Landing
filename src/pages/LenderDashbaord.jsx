import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoans } from '../context/LoanContext';
import LoanCard from '../components/LoanCard';

export default function LenderDashboard() {
  const { user } = useAuth();
  // Combined contexts
  const { 
    loans, 
    applications, 
    transactions, 
    addLoan, 
    editLoan, 
    deleteLoan, 
    updateApplicationStatus 
  } = useLoans();
  
  // Advanced Form State for Loan Posting
  const [loanForm, setLoanForm] = useState({
    amount: '',
    interestRate: '',
    durationMonths: '',
    minIncome: '',
    collateralRequired: 'no',
    conditions: ''
  });

  // Modal States
  const [reviewApp, setReviewApp] = useState(null);
  const [editingLoan, setEditingLoan] = useState(null); // NEW: Track loan being edited

  // Filter data specifically for the logged-in lender
  const myLoans = loans.filter(loan => loan.lender === user.username);
  const myLoanIds = myLoans.map(l => String(l.id));
  
  // Categorize applications safely
  const pendingApplications = applications.filter(app => myLoanIds.includes(String(app.loanId)) && app.status === 'pending');
  const processedApplications = applications.filter(app => myLoanIds.includes(String(app.loanId)) && app.status !== 'pending');
  
  // Find payments received
  const receivedPayments = transactions.filter(t => {
    const app = applications.find(a => a.id === t.applicationId);
    return app && myLoanIds.includes(String(app.loanId)) && t.type === 'payment';
  });

  const formatMoney = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  // Merged input handler for both creating and editing
  const handleInputChange = (e, isEdit = false) => {
    if (isEdit) {
      setEditingLoan({ ...editingLoan, [e.target.name]: e.target.value });
    } else {
      setLoanForm({ ...loanForm, [e.target.name]: e.target.value });
    }
  };

  const handleCreateLoan = (e) => {
    e.preventDefault();
    if (!loanForm.amount || !loanForm.interestRate || !loanForm.durationMonths) return;
    
    addLoan({
      amount: Number(loanForm.amount),
      interestRate: Number(loanForm.interestRate),
      durationMonths: Number(loanForm.durationMonths),
      minIncome: Number(loanForm.minIncome),
      collateralRequired: loanForm.collateralRequired,
      conditions: loanForm.conditions,
      lender: user.username
    });

    // Reset form
    setLoanForm({ amount: '', interestRate: '', durationMonths: '', minIncome: '', collateralRequired: 'no', conditions: '' });
    alert("Loan offer posted successfully with your conditions!");
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    editLoan(editingLoan.id, { 
      ...editingLoan, 
      amount: Number(editingLoan.amount), 
      interestRate: Number(editingLoan.interestRate), 
      durationMonths: Number(editingLoan.durationMonths), 
      minIncome: Number(editingLoan.minIncome) 
    });
    setEditingLoan(null);
  };

  const handleDeleteLoan = (loanId) => {
    if (window.confirm("Are you sure you want to delete this loan offer? Any pending applications for it will also be removed.")) {
      deleteLoan(loanId);
    }
  };

  const handleDecision = (appId, status) => {
    updateApplicationStatus(appId, status);
    setReviewApp(null); // Close modal
  };

  return (
    <div className="space-y-10 relative animate-fade-in">
      <header className="border-b pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage advanced loan offers, set conditions, and strictly review borrower details.</p>
        </div>
        <div className="bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100 text-right">
          <p className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Total Repayments Collected</p>
          <p className="text-3xl font-extrabold text-emerald-700">
            {formatMoney(receivedPayments.reduce((sum, t) => sum + Number(t.amount), 0))}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Advanced Create Loan Form */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Post Structured Loan
            </h2>
            <form onSubmit={handleCreateLoan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                <input type="number" name="amount" min="100" required value={loanForm.amount} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., 10000" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest (%)</label>
                  <input type="number" name="interestRate" step="0.1" min="1" required value={loanForm.interestRate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., 7.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Mo)</label>
                  <input type="number" name="durationMonths" min="1" required value={loanForm.durationMonths} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., 24" />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-2">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Lender Conditions</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Income Req. (₹)</label>
                    <input type="number" name="minIncome" value={loanForm.minIncome} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., 3000" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Is Collateral Required?</label>
                    <select name="collateralRequired" value={loanForm.collateralRequired} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                      <option value="no">No</option>
                      <option value="yes">Yes, Mandatory</option>
                      <option value="preferred">Preferred but not required</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Conditions / Penalties</label>
                    <textarea name="conditions" rows="2" value={loanForm.conditions} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., Late fee of 2% applies."></textarea>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors mt-4 shadow-sm">
                Publish Loan Offer
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Applications & Active Offers */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Required: Pending Applications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-orange-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">{pendingApplications.length}</span>
              Pending Review
            </h2>
            
            {pendingApplications.length === 0 ? (
              <p className="text-gray-500 italic">No pending applications.</p>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map(app => {
                  const appliedLoan = myLoans.find(l => l.id === app.loanId);
                  return (
                    <div key={app.id} className="flex justify-between items-center p-4 border border-orange-100 rounded-lg bg-orange-50/30">
                      <div>
                        <p className="font-bold text-gray-900">{app.name || app.borrower}</p>
                        <p className="text-sm text-gray-600">Requested: <span className="font-bold text-primary">{formatMoney(app.amount)}</span></p>
                        <p className="text-xs text-gray-500">For Loan ID: {appliedLoan?.id.slice(-6)}</p>
                      </div>
                      <button 
                        onClick={() => setReviewApp({ app, loan: appliedLoan })}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
                      >
                        Review Full Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Processed History Log */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Processed Applications History</h2>
            {processedApplications.length === 0 ? (
              <p className="text-gray-500 italic">You have not processed any applications yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 font-medium">Borrower</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Decision</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {processedApplications.map(app => {
                      const appliedLoan = myLoans.find(l => l.id === app.loanId);
                      return (
                        <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-3 font-bold text-gray-800">{app.name || app.borrower}</td>
                          <td className="px-4 py-3 font-medium">{formatMoney(app.amount)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              app.status === 'approved' || app.status === 'granted' ? 'bg-green-100 text-green-800' : 
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => setReviewApp({ app, loan: appliedLoan })}
                              className="text-primary hover:underline text-xs"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* My Active Offers WITH EDIT/DELETE ACTIONS */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">My Active Postings</h2>
            {myLoans.length === 0 ? (
              <p className="text-gray-500 italic bg-white p-6 rounded-xl border border-gray-100">You haven't posted any loan offers yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myLoans.map(loan => (
                  <LoanCard 
                    key={loan.id} 
                    loan={loan} 
                    actionButton={
                      <div className="flex gap-2 pt-2 mt-2">
                        <button onClick={() => setEditingLoan(loan)} className="flex-1 bg-blue-50 text-primary hover:bg-blue-100 py-2 rounded-lg font-bold text-sm transition-colors border border-blue-200">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteLoan(loan.id)} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg font-bold text-sm transition-colors border border-red-200">
                          Delete
                        </button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- MODAL: Edit Loan Scheme ---------------- */}
      {editingLoan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Edit Loan Offer</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                <input type="number" name="amount" required value={editingLoan.amount} onChange={(e) => handleInputChange(e, true)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest (%)</label>
                  <input type="number" name="interestRate" step="0.1" required value={editingLoan.interestRate} onChange={(e) => handleInputChange(e, true)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Mo)</label>
                  <input type="number" name="durationMonths" required value={editingLoan.durationMonths} onChange={(e) => handleInputChange(e, true)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Income Req (₹)</label>
                <input type="number" name="minIncome" value={editingLoan.minIncome} onChange={(e) => handleInputChange(e, true)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collateral Required?</label>
                <select name="collateralRequired" value={editingLoan.collateralRequired || 'no'} onChange={(e) => handleInputChange(e, true)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                  <option value="no">No</option>
                  <option value="yes">Yes, Mandatory</option>
                  <option value="preferred">Preferred but not required</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Conditions</label>
                <textarea name="conditions" rows="2" value={editingLoan.conditions || ''} onChange={(e) => handleInputChange(e, true)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setEditingLoan(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-bold shadow-sm transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: Detailed Application Review ---------------- */}
      {reviewApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-bold">Reviewing Applicant: {reviewApp.app.name || reviewApp.app.borrower}</h3>
                <p className="text-gray-400 text-sm mt-1">Applying for {formatMoney(reviewApp.app.amount)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                reviewApp.app.status === 'pending' ? 'bg-orange-500 text-white' : 
                reviewApp.app.status === 'approved' || reviewApp.app.status === 'granted' ? 'bg-green-500 text-white' : 
                reviewApp.app.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-gray-900'
              }`}>
                Current Status: {reviewApp.app.status.toUpperCase()}
              </span>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-gray-50">
              
              {/* Loan Context */}
              <div className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Loan Parameters</p>
                  <p className="text-lg font-bold text-primary">{reviewApp.loan?.durationMonths} Months @ {reviewApp.loan?.interestRate}% p.a.</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Min Income Req: {reviewApp.loan?.minIncome ? formatMoney(reviewApp.loan.minIncome) : 'None'}</p>
                  <p>Collateral Req: <span className="capitalize font-medium">{reviewApp.loan?.collateralRequired || 'None'}</span></p>
                </div>
              </div>

              {/* Borrower Details Grid */}
              <h4 className="font-bold text-gray-900 border-b pb-2">Borrower Financial & KYC Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">Declared Monthly Income</p>
                  <p className={`font-bold text-lg ${
                    reviewApp.loan?.minIncome && Number(reviewApp.app.income) < Number(reviewApp.loan.minIncome) 
                    ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {reviewApp.app.income ? formatMoney(reviewApp.app.income) : 'Not Provided'}
                    {reviewApp.loan?.minIncome && Number(reviewApp.app.income) < Number(reviewApp.loan.minIncome) && 
                      <span className="text-xs text-red-500 ml-2">(Below Requirement)</span>
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Offered Collateral</p>
                  <p className="font-semibold text-gray-800 capitalize">{reviewApp.app.collateral || 'None provided'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Age & Identity</p>
                  <p className="font-semibold text-gray-800">{reviewApp.app.age || 'N/A'} years old</p>
                  <p className="text-sm text-gray-600 capitalize">{reviewApp.app.idType}: {reviewApp.app.idNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Bank Account</p>
                  <p className="font-semibold text-gray-800">{reviewApp.app.accountDetails || 'Not Provided'}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Residential Address</p>
                  <p className="font-medium text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">{reviewApp.app.address || 'Not Provided'}</p>
                </div>

              </div>
            </div>

            {/* Modal Footer / Action Buttons */}
            <div className="bg-white p-6 border-t border-gray-200 flex flex-wrap gap-4 shrink-0 justify-end items-center">
              <button onClick={() => setReviewApp(null)} className="px-4 py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors mr-auto">
                Close Viewer
              </button>
              
              <button 
                onClick={() => handleDecision(reviewApp.app.id, 'rejected')} 
                className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-bold transition-colors"
              >
                Reject
              </button>
              
              <button 
                onClick={() => handleDecision(reviewApp.app.id, 'hold')} 
                className="px-6 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-bold transition-colors"
              >
                Put on Hold
              </button>
              
              <button 
                onClick={() => handleDecision(reviewApp.app.id, 'granted')} 
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-sm transition-colors"
              >
                Approve & Grant Loan
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}