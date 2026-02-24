import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-24 py-8">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="inline-block bg-blue-50 text-primary font-bold px-4 py-1.5 rounded-full text-sm border border-blue-100 mb-2">
            🚀 The Future of Loan Management
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Effortless Lending. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Transparent Borrowing.
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Finova Landing bridges the gap between borrowers and lenders. Our intelligent platform tracks payments, calculates interest, and manages records securely—all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            {!user ? (
              <>
                <Link to="/register" className="bg-primary hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center">
                  Create Free Account
                </Link>
                <Link to="/login" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm text-center">
                  Login to Portal
                </Link>
              </>
            ) : (
              <Link to={`/${user.role}`} className="bg-secondary hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center inline-flex items-center justify-center gap-2">
                Go to My Dashboard
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Professionals reviewing financial data" 
            className="relative z-10 rounded-3xl shadow-2xl border-4 border-white object-cover h-[500px] w-full"
          />
        </div>
      </section>

      {/* ---------------- HOW IT WORKS SECTION ---------------- */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">One Platform, Four Powerful Roles</h2>
          <p className="text-lg text-gray-600">
            Finova Landing is designed to handle the entire lifecycle of a loan, providing custom tools tailored specifically to what you need to do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Borrower */}
          <div className="bg-gray-50 p-6 rounded-2xl hover:bg-blue-50 transition-colors border border-gray-100 group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Borrowers</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Browse loan offers, calculate your EMI instantly, and apply with a comprehensive financial profile. Track your approval status and make scheduled payments seamlessly.
            </p>
          </div>

          {/* Lender */}
          <div className="bg-gray-50 p-6 rounded-2xl hover:bg-emerald-50 transition-colors border border-gray-100 group">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lenders</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create structured loan offers with custom interest rates and conditions. Scrutinize applicant profiles, manage approvals, and track the real-time return of your capital.
            </p>
          </div>

          {/* Analyst */}
          <div className="bg-gray-50 p-6 rounded-2xl hover:bg-purple-50 transition-colors border border-gray-100 group">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Analysts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Access platform-wide financial data. Monitor the total capital in the market, assess high-interest risk flags, and instantly export comprehensive financial reports.
            </p>
          </div>

          {/* Admin */}
          <div className="bg-gray-50 p-6 rounded-2xl hover:bg-orange-50 transition-colors border border-gray-100 group">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">System Admins</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Oversee all platform operations. Monitor real-time security logs, track live user interactions and IP addresses, and ensure absolute data integrity across the system.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- BOTTOM CTA ---------------- */}
      {!user && (
        <section className="bg-primary rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to take control of your finances?</h2>
            <p className="text-blue-100 text-lg">Join thousands of users managing loans effortlessly on Finova Landing.</p>
            <div className="pt-4">
              <Link to="/register" className="bg-secondary hover:bg-emerald-400 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg inline-block">
                Start Your Journey Today
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}