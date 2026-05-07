# Expense Tracker App

A modern and responsive Expense Tracker built with React and Tailwind CSS.  
The application helps users manage expenses efficiently with smart search, category management, sorting, editing, dashboard analytics, and real-time notifications.

---

# Features

## Dashboard Analytics
- View total expenses
- Daily expense summary
- Weekly expense summary
- Monthly expense summary
- Yearly expense summary

## Smart Search
- Google-style smart search bar
- Dynamic search suggestions
- Search history stored in localStorage
- Search icon trigger
- Clear search button
- Auto placeholder animation
- Dropdown suggestions and recent searches

## Expense Management
- Add expenses
- Edit expenses
- Delete expenses
- Real-time updates

## Category Management
- Create custom categories
- Reuse existing categories
- Delete categories with all related expenses

## Sorting
Sort expenses by:
- Amount
- Date
- Category

## Validation
- Required field validation
- Positive amount validation
- Duplicate category prevention

## Notifications
Beautiful toast notifications using React Toastify:
- Success messages
- Error messages
- Warning messages

---

# Tech Stack

- React
- Tailwind CSS
- React Hooks
- React Toastify
- JSON Server
- LocalStorage

---

# Project Structure

```bash
src/
│
├── components/
│   ├── Sidebar.jsx
│   ├── SmartSearch.jsx
│   └── Toast.jsx
│
├── hooks/
│   └── useToast.js
│
├── pages/
│   ├── AddExpense.jsx
│   ├── Dashboard.jsx
│   └── Expenses.jsx
│
├── App.jsx
└── main.jsx

Installation
1. Clone the Repository
git clone 
2. Navigate into the Project
cd expense-tracker
3. Install Dependencies
npm install

Running the Project
Start React App
npm run dev
Start JSON Server
Make sure you have JSON Server installed:
npm install -g json-server
Run the backend server:
json-server --watch db.json --port 3001

API Endpoint
http://localhost:3001/expenses

Main Components
Sidebar
Handles application navigation:
    • Dashboard
    • Add Expense
    • Expenses List

SmartSearch
Advanced search component with:
    • Search suggestions
    • Search history
    • Search icon action
    • Auto placeholder rotation
    • Search dropdown
    • Sort functionality

Dashboard
Displays:
    • Expense analytics
    • Filtered results
    • Search and sorting
    • Expense summaries

AddExpense
Features:
    • Form validation
    • Custom categories
    • Category deletion
    • Expense submission

Expenses
Allows users to:
    • View all expenses
    • Edit expenses
    • Delete expenses

Search Features
The smart search system includes:
    • Live filtering
    • Auto suggestions
    • Search history persistence
    • Enter key search
    • Click-to-search icon
    • Google-style UI behavior

Validation Rules
Field
Validation
Title
Required
Description
Required
Category
Required
Amount
Must be greater than 0
Date
Required

Toast Notifications
The app uses React Toastify for notifications.
Examples:
    • Expense added successfully
    • Expense updated successfully
    • Delete failed
    • Validation errors

State Management
The application uses React Hooks:
    • useState
    • useEffect
    • useMemo
    • useCallback
    • useRef

Performance Optimizations
    • useMemo for expensive calculations
    • useCallback for stable functions
    • Optimized rendering
    • Local state separation

UI Design
Built with Tailwind CSS:
    • Responsive layout
    • Modern dashboard
    • Rounded cards
    • Smooth transitions
    • Sticky search bar
    • Clean typography

Future Improvements
Possible future upgrades:
    • Authentication
    • Charts and graphs
    • Export to PDF/CSV
    • Dark mode
    • Pagination
    • Backend database integration
    • Mobile app version

Author
Developed by [Brian]


