# SimBusiness 🚀

A modern e-commerce and dropshipping business simulation platform built with Next.js. SimBusiness helps users learn entrepreneurship, test pricing strategies, manage inventory, forecast demand, and operate a virtual business without real financial risk.

## Live Demo

- Website: https://simbusiness.vercel.app
- Demo Admin Login: `jatindudhani07@gmail.com`
- Demo Password: `admin123`

## Overview

SimBusiness is a full-stack business simulation app designed to model real-world online retail operations. The platform includes a product catalog, supplier sourcing, revenue tracking, orders management, market analysis, and financial planning tools. It is built as a practical B.Tech project to demonstrate full-stack web development, product thinking, and business strategy modeling in a digital environment.

The app is structured around a realistic store-management workflow where users can:

- Sign in to a simulated business dashboard
- Explore and manage products and inventory
- Evaluate profit margins and unit economics
- View market trends and competitive insights
- Track supplier reliability and fulfillment timelines
- Run operational and financial planning simulations
- Use a calculator and planning tools for business decisions

---

## Key Features

- Dashboard-based store operations simulation
- Product catalog with pricing and sourcing analysis
- Supplier management with shipping and fulfillment details
- Market intelligence and trend monitoring
- Orders and fulfillment tracking
- Financial metrics and business calculator
- Authentication flow with demo login
- Responsive UI built with Tailwind CSS
- Real-time analytics and business KPI views

---

## Tech Stack

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Chart.js / react-chartjs-2
- React Icons

### Backend / App Layer
- Next.js API routes
- Mongoose
- MongoDB integration support
- Context-based auth state management

### Tools / Utilities
- ESLint
- PostCSS
- Vercel deployment

---

## Project Structure

```bash
simbusiness/
├── .env.example
├── .eslintrc.json
├── .gitignore
├── INSTALL.md
├── LICENSE
├── README.md
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
├── screenshots/
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── calculator/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── faq/
│   │   ├── landing/
│   │   ├── login/
│   │   ├── market/
│   │   ├── orders/
│   │   ├── platform/
│   │   ├── products/
│   │   ├── settings/
│   │   ├── suppliers/
│   │   ├── tools/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   ├── config/
│   ├── contexts/
│   ├── models/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── ...
└── public/
```

---

## Main Application Modules

- `/landing` — product marketing and platform overview
- `/login` — authentication and demo access
- `/dashboard` — operational analytics and business control center
- `/platform` — platform overview and module navigation
- `/products` — catalog and product management
- `/market` — market intelligence and trend insights
- `/suppliers` — supplier directory and logistics data
- `/orders` — order and fulfillment workflows
- `/tools` — business calculators and utility tools
- `/faq` — guidance and support info

---

## Installation and Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Install dependencies

```bash
git clone https://github.com/Jatin-dudhani/simbusiness.git
cd simbusiness
npm install
```

### Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update values if needed for your local setup.

### Run the app

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

---

## Demo Access

The project includes a ready-to-use demo admin login for quick testing:

- Email: `jatindudhani07@gmail.com`
- Password: `admin123`

---

## Screenshots

The project includes visual assets in the `screenshots/` folder for dashboard and landing page previews.

---

## Future Enhancements

- Multiplayer business competition mode
- AI-powered market analysis and strategy recommendations
- Advanced financial forecasting dashboard
- Expanded supplier and inventory systems
- User accounts and persistent business data
- Mobile-first optimization and enhanced reporting

---

## Author

### Jatin Dudhani

- GitHub: https://github.com/Jatin-dudhani

---

## License

This project is created for educational and learning purposes.
