# Loan Management System

A comprehensive web-based loan management platform built with React and Vite. This application provides tools for borrowers, lenders, analysts, and administrators to manage loans efficiently.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multi-Role Authentication**: Secure login and registration for different user types
- **Admin Panel**: Comprehensive administration dashboard for system management
- **Borrower Dashboard**: View and manage loan applications and payments
- **Lender Dashboard**: Monitor loans issued and track portfolio performance
- **Analyst Dashboard**: Analyze loan data and generate insights
- **Loan Management**: Create, view, and manage loan applications
- **Profile Management**: User profile customization and management
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Local Storage Support**: Persist user data across sessions

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **CSS Processing**: PostCSS
- **State Management**: Context API
- **Routing**: React Router (implied)
- **Storage**: Local Storage API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── LoanCard.jsx
│   └── Navigation.jsx
├── context/            # Context API for state management
│   ├── AuthContext.jsx
│   └── LoanContext.jsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.js
├── pages/              # Page components for different routes
│   ├── AdminPanel.jsx
│   ├── AnalystDashboard.jsx
│   ├── BorrowerDashboard.jsx
│   ├── HomePage.jsx
│   ├── LenderDashboard.jsx
│   ├── LoginPage.jsx
│   ├── ProfilePage.jsx
│   └── RegisterPage.jsx
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
├── index.css          # Global styles
└── styles.css         # Additional styles
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Loan-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS (if not already installed)**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

## Getting Started

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Building for Production

Build the project for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## User Roles

### 1. **Borrower**
- View loan applications and status
- Submit new loan applications
- Track payment schedules
- Manage personal profile
- View loan history

### 2. **Lender**
- Review loan applications
- Approve or reject applications
- Monitor issued loans
- Track repayment status
- Analyze loan performance

### 3. **Analyst**
- View comprehensive loan analytics
- Generate reports
- Analyze borrower and lender data
- Track portfolio metrics
- Export analysis reports

### 4. **Admin**
- Manage users and accounts
- Configure system settings
- View all loans and transactions
- Monitor system activity
- Manage user roles and permissions

## Usage

1. **Register** a new account with your email and credentials
2. **Login** with your credentials
3. **Select your role** during registration (Borrower, Lender, Analyst, or Admin)
4. **Navigate** to the relevant dashboard based on your role
5. **Manage loans** using the provided tools and interfaces
6. **View profile** and update personal information as needed

## File Descriptions

- **App.jsx**: Main application wrapper with routing
- **AuthContext.jsx**: Manages authentication state and user sessions
- **LoanContext.jsx**: Manages loan data and operations
- **useLocalStorage.js**: Custom hook for persistent local storage
- **Layout.jsx**: Main layout wrapper with navigation and footer
- **Navigation.jsx**: Navigation bar component
- **LoanCard.jsx**: Reusable loan display component
- **Footer.jsx**: Footer component

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Last Updated**: February 2026

For questions or support, please open an issue on the repository.
