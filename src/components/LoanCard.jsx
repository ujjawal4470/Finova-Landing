export default function LoanCard({ loan, actionButton }) {
  // Format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Loan Amount</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatMoney(loan.amount || 0)}</h3>
        </div>
        <span className="bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full">
          {loan.status || 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
          <p className="font-semibold text-gray-800">{loan.interestRate}% <span className="text-xs font-normal">p.a.</span></p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Duration</p>
          <p className="font-semibold text-gray-800">{loan.durationMonths} Months</p>
        </div>
      </div>
      
      {/* If a lender ID is provided, show it */}
      {loan.lender && (
        <p className="text-xs text-gray-400 mb-4">Posted by: {loan.lender}</p>
      )}

      {/* Render whatever action button (Apply, Delete, etc.) is passed down */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        {actionButton}
      </div>
    </div>
  );
}