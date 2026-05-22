# E-Commerce Platform

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js). This platform provides a seamless shopping experience with modern UI/UX, integrated secure payments, and robust backend security.

## Features

- **Modern & Responsive UI**: Built with React, Tailwind CSS, and Framer Motion/GSAP for smooth animations.
- **Secure Authentication**: JWT-based user authentication and secure password storage.
- **Product Management**: Browse, view, and manage products.
- **Shopping Cart**: Add, remove, and update products in the cart.
- **Payment Processing**: Integrated with Stripe for secure and seamless checkout.
- **Image Handling**: File uploads supported via Multer on the backend.

## Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS v4, CLSX, Tailwind Merge
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React
- **Payments**: Stripe React Stripe JS
- **API Client**: Axios

### Backend (Server)
- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **File Uploads**: Multer
- **Payments**: Stripe Node.js SDK

## Security Planning & Implementation

Security has been a primary focus during the development of this application. Here are the key security measures implemented:

1. **Password Hashing (`bcryptjs`)**:
   - All user passwords are mathematically hashed before being stored in the database.
   - Prevents exposure of plaintext passwords in case of a data breach.

2. **JSON Web Tokens (`jsonwebtoken`)**:
   - Used for stateless, secure user authentication.
   - Protects protected routes ensuring only authorized users can access sensitive API endpoints.
   - Tokens contain non-sensitive user identity payloads.

3. **Cross-Origin Resource Sharing (`cors`)**:
   - Backend APIs are protected against unauthorized domains making cross-site requests.
   - Allows only designated frontend clients to communicate with the Express server.

4. **Environment Variables (`dotenv`)**:
   - Critical secrets (Database URIs, JWT Secrets, Stripe Secret Keys) are isolated outside the source code.
   - Prevents accidental leakage of credentials into version control.

5. **Payment Security (`stripe`)**:
   - PCI-DSS compliant payment processing.
   - Sensitive credit card information never touches the application servers; it is directly tokenized by Stripe elements on the frontend.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (local or Atlas)
- Stripe Developer Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KrChiranjeevi/e-commerce.git
   cd e-commerce
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

### Running Locally

1. **Environment Setup:**
   - Create a `.env` file in the `server` directory.
   - Add your MongoDB URI, JWT Secret, and Stripe keys.
   - Create a `.env` file in the `client` directory for your Stripe publishable key and Vite backend URL.

2. **Start the Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

3. **Start the Frontend Application:**
   ```bash
   cd client
   npm run dev
   ```

## License
ISC
