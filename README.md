
# Expense Tracker App

A modern, responsive **Expense Tracker Web Application** built with React that helps users manage income, expenses, wallets, and financial insights using interactive charts and real-time state management.

---

##  Features

-  Interactive financial dashboard
-  Add, edit, and delete expenses
-  Income tracking with wallet breakdown
-  Transaction history management
-  Smart search with suggestions & history
- Sorting (amount, date, category)
-  Data visualization using charts
-  Multi-wallet support
- Real-time state updates
- Fully responsive UI
- Nested routing with React Router v6
- Layout system with persistent sidebar
- Toast notifications system

---

## Tech Stack

### Frontend
- React (Vite / CRA)
- React Router v6 (Nested Routes + `<Outlet />`)
- Recharts (Charts & Data Visualization)
- Tailwind CSS (Styling)
- JavaScript (ES6+)

### Backend
- JSON Server (`db.json`)
- REST API simulation
- Separate backend folder inside project

---

##  Project Structure

```

expense-tracker/
│
├── backend/
│   └── db.json
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── App.jsx
│   └── main.jsx
│
└── README.md

```

---

##  Routing (React Router v6)

This project uses **React Router v6** with a nested layout system.

### Main Layout
- `MainLayout.jsx` wraps all pages
- Uses `<Outlet />` to render child routes
- Persistent sidebar across all pages

### Routes

| Route | Page |
|------|------|
| `/` | Dashboard |
| `/add-expense` | Add Expense |
| `/expenses` | Expenses |
| `/income` | Income |
| `/wallets` | Wallets |
| `/transactions` | Transactions |

---

## Layout System

### MainLayout Features

- Sticky sidebar (always visible)
- Scrollable main content area
- Global footer across all pages:
```
---

##  Dashboard Features

### Financial Overview
- Total Balance
- Total Income
- Total Expenses
- Savings Rate

### Charts (Recharts)
-  Bar Chart → Income vs Expenses per day
- Line Chart → Cash flow trend over time

### Smart UI Enhancements
- Sticky search + sort bar
- Scrollable expense list (fixed height)
- Recent transactions table (limited height with scroll)

---

##  Smart Search System

- Auto-suggestions from transaction titles
- Search history saved in `localStorage`
- Live filtering of expenses
- Animated placeholder rotation
- Click-to-select suggestions

---

##  Wallet System

- Create multiple wallets
- Track:
  - Income per wallet
  - Expenses per wallet
  - Wallet balance
- Prevent duplicate wallet creation
- Wallet deletion with confirmation

---

##  Expense Management

- Add new expenses
- Edit existing expenses
- Delete with confirmation
- Category system with dynamic creation
- Validation handling

---

##  Income Tracking

- Add income entries
- Wallet-based income breakdown
- Total income calculation
- Linked to transactions system

---

##  Transactions Module

- Unified record of income + expenses
- Scrollable table view
- Sticky table headers
- Clean financial history view

---

##  Toast System

Custom toast hook:

- Success messages
- Error alerts
- Warning notifications
- Auto-dismiss after 3 seconds

---

## Backend Setup (JSON Server)

Inside `/backend/db.json`

### Run backend:
```bash
json-server --watch db.json --port 3001
````

---

## Frontend Setup

```bash
npm install
npm run dev
```

---

## Key UI/UX Decisions

* Sticky sidebar for navigation
* Sticky search & filter bar
* Scrollable data containers (no layout overflow)
* Clean financial card-based design
* Responsive grid system
* Minimal but modern UI

---

## Future Improvements

* Authentication system (login/signup)
* Real database integration (MongoDB / PostgreSQL)
* Export to PDF / Excel
* Budget planning module
* Monthly analytics dashboard

---

##  Author

**Brian**
