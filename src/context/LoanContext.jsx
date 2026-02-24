import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LoanContext = createContext();

export const useLoans = () => useContext(LoanContext);

export const LoanProvider = ({ children }) => {
  const [loans, setLoans] = useLocalStorage('finova_loans', []);
  const [applications, setApplications] = useLocalStorage('finova_applications', []);
  const [transactions, setTransactions] = useLocalStorage('finova_transactions', []);

  // --- CREATE ---
  const addLoan = (loanData) => {
    setLoans([{ ...loanData, id: Date.now().toString(), status: 'active' }, ...loans]);
  };

  const applyForLoan = (loanId, borrower, amount, applicationData) => {
    setApplications([{ id: Date.now().toString(), loanId, borrower, amount, status: 'pending', ...applicationData }, ...applications]);
  };

  // --- UPDATE ---
  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
  };

  const editLoan = (loanId, updatedData) => {
    setLoans(loans.map(loan => loan.id === loanId ? { ...loan, ...updatedData } : loan));
  };

  const editApplication = (appId, updatedData) => {
    setApplications(applications.map(app => app.id === appId ? { ...app, ...updatedData } : app));
  };

  // --- DELETE ---
  const deleteLoan = (loanId) => {
    setLoans(loans.filter(loan => loan.id !== loanId));
    // Also clean up any pending applications attached to this deleted loan
    setApplications(applications.filter(app => app.loanId !== loanId || app.status !== 'pending'));
  };

  const deleteApplication = (appId) => {
    setApplications(applications.filter(app => app.id !== appId));
  };

  // --- TRANSACTIONS ---
  const recordTransaction = (applicationId, amount, type) => {
    setTransactions([...transactions, { id: Date.now().toString(), applicationId, amount, type, date: new Date().toISOString() }]);
  };

  return (
    <LoanContext.Provider value={{ 
      loans, applications, transactions, 
      addLoan, editLoan, deleteLoan, 
      applyForLoan, editApplication, deleteApplication, updateApplicationStatus,
      recordTransaction
    }}>
      {children}
    </LoanContext.Provider>
  );
};