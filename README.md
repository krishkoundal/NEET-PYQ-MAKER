# NEET PYQ Maker

A comprehensive web application designed to help students prepare for the NEET exam by generating custom practice papers from a vast bank of Previous Year Questions (PYQs).

## Key Features

- **OTP Verification**: Secure account creation and login with 6-digit email OTP.
- **Custom Paper Generation**: Assemble practice papers by subject, specific chapters, difficulty, and year.
- **Diagram Repair System**: Robust automated scraping and repair logic for missing or broken question diagrams.
- **PDF Export**: Generate professional PDF practice papers and answer keys with one click.
- **Premium UI**: Modern, animated interface built with React, Framer Motion, and Tailwind CSS.

## Project Structure

- `frontend/`: React + Vite application with Tailwind and Lucide icons.
- `backend/`: Node.js + Express API with MongoDB integration and PDF generation.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Gmail account (for OTP email delivery)

### Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/neet-pyq-maker.git
   cd neet-pyq-maker
   ```

2. **Backend Configuration**:
   - Navigate to the `backend/` directory.
   - Install dependencies: `npm install`.
   - Create a `.env` file from the `.env.example`:
     ```env
     JWT_SECRET=your_jwt_secret
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     MONGODB_URI=mongodb://localhost:27017/neet-pyq
     ```
   - Start the backend server: `node server.js`.

3. **Frontend Configuration**:
   - Navigate to the `frontend/` directory.
   - Install dependencies: `npm install`.
   - Start the development server: `npm run dev`.

4. **Access the application**: Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **Frontend**: React, Vite, Framer Motion, Tailwind CSS, Lucide React.
- **Backend**: Express.js, MongoDB (Mongoose), Nodemailer, PDFKit.
- **Tools**: Axios, JWT, Bcrypt.

## License

This project is licensed under the MIT License.
