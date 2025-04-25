# SimBusiness Installation Guide

This guide will help you set up and run the SimBusiness dropshipping simulation application.

## Prerequisites

- Node.js 18.17.0 or later
- npm or yarn package manager

## Installation Steps

1. Clone the repository or download the source code:

```bash
git clone https://github.com/yourusername/simbusiness.git
cd simbusiness
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/src/app`: Application pages using Next.js App Router
- `/src/components`: Reusable UI components
- `/src/styles`: Global styles and Tailwind CSS config
- `/src/models`: Data models for the application
- `/src/utils`: Utility functions
- `/src/lib`: Third-party library configurations
- `/src/hooks`: Custom React hooks
- `/src/services`: Service functions for API calls
- `/src/types`: TypeScript type definitions

## Available Features

- Interactive dashboard with business metrics
- Market analysis and trend visualization
- Supplier management
- Inventory tracking
- Financial metrics and reporting
- Business settings configuration

## Note

This is a simulation application and does not process real financial transactions. It's designed for educational purposes to help users understand dropshipping business operations.

## License

MIT 