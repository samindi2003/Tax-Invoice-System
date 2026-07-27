# Tax Invoice System

A full-stack web application designed for generating, managing, and printing professional tax invoices.

## Features
- Create, view, and manage tax invoices
- Maintain a database of customers and products
- Professional, printable PDF invoice templates (with dedicated space for company seals and signatures)
- Dashboard for tracking revenue and VAT summaries

## Technologies Used
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Styling:** CSS

## Getting Started

### Prerequisites
Make sure you have Node.js installed on your computer.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/samindi2003/Tax-Invoice-System.git
   cd Tax-Invoice-System
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder and add your environment variables (e.g., `PORT`, `MONGO_URI`).
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
Once both the frontend and backend servers are running, open your browser to the local URL provided by Vite (usually `http://localhost:5173`) to use the application.
