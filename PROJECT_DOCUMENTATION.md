# RideShare Connect - Project Documentation

## 1. Project Overview
**RideShare Connect** is a modern, full-stack web application designed to facilitate carpooling. It connects drivers with empty seats to passengers traveling in the same direction, promoting cost-saving, eco-friendly travel, and community building.

---

## 2. Technology Stack & Rationale

### Frontend (Client)
*   **Framework**: **React.js (Vite)**
    *   *Why*: React provides a component-based architecture for building interactive UIs. Vite is used as the build tool for its lightning-fast hot module replacement (HMR) and optimized production builds.
*   **Styling**: **Tailwind CSS**
    *   *Why*: A utility-first CSS framework that allows for rapid UI development, consistent design systems, and easy responsiveness without writing custom CSS files.
*   **Routing**: **React Router DOM (v6)**
    *   *Why*: Standard library for declarative routing in React, enabling single-page application (SPA) navigation without page reloads.
*   **State Management**: **React Context API**
    *   *Why*: Built-in solution for managing global state (like user authentication) without the complexity of Redux.
*   **Form Handling**: **React Hook Form** + **Yup**
    *   *Why*: `react-hook-form` offers performant, flexible forms with minimal re-renders. `yup` provides robust schema-based validation for form inputs.
*   **Maps**: **Leaflet** + **React-Leaflet**
    *   *Why*: An open-source, lightweight alternative to Google Maps for displaying interactive maps and markers.
*   **Icons**: **Lucide React**
    *   *Why*: A clean, consistent, and lightweight icon library that integrates seamlessly with React.
*   **HTTP Client**: **Axios**
    *   *Why*: Promise-based HTTP client for making API requests, offering better error handling and interceptor support than the native `fetch` API.

### Backend (Server)
*   **Runtime**: **Node.js**
    *   *Why*: JavaScript runtime built on Chrome's V8 engine, allowing for unified language usage (JS) across full stack.
*   **Framework**: **Express.js**
    *   *Why*: Minimalist web framework for Node.js, simplifying route handling, middleware integration, and API creation.
*   **Database**: **MongoDB** + **Mongoose**
    *   *Why*: NoSQL database offering flexibility with JSON-like documents. Mongoose provides schema-based modeling to enforce data structure and validation.
*   **Authentication**: **JWT (JSON Web Tokens)**
    *   *Why*: Stateless authentication mechanism ideal for SPAs, allowing secure transmission of user information.
*   **Security**:
    *   **Argon2**: For secure password hashing (superior to bcrypt in resistance to GPU cracking).
    *   **Helmet**: Sets various HTTP headers to secure the app.
    *   **Cors**: Enables Cross-Origin Resource Sharing for client-server communication.
*   **Validation**: **Joi**
    *   *Why*: Powerful schema description language and data validator for JavaScript, ensuring API inputs are correct before processing.
*   **Email Service**: **Nodemailer**
    *   *Why*: Module for sending emails (used for OTP verification) easily from Node.js applications.

---

## 3. Project Structure

### Root Directory
*   `client/`: Frontend React application.
*   `server/`: Backend Node.js/Express application.
*   `package.json`: Root configuration, includes scripts to run both client and server concurrently.

### Client Structure (`/client/src`)
*   `assets/`: Static assets like images (`hero.png`, `logo.png`) and global styles.
*   `components/`: Reusable UI components.
    *   `layout/`: `Navbar`, `Footer`.
    *   `ui/`: Generic UI elements like `Button`, `Input`, `Card`.
    *   `map/`: Map-related components (`RideMap`).
*   `context/`: Global state providers (`AuthContext` for user sessions).
*   `pages/`: Main application views.
    *   `Home.jsx`: Landing page with hero, roadmap, and reviews.
    *   `Login.jsx` / `Register.jsx`: Authentication pages.
    *   `Dashboard.jsx`: User overview (rides, stats).
    *   `CreateRide.jsx`: Form to offer a new ride.
    *   `SearchRides.jsx`: Interface to find rides with filters.
    *   `Profile.jsx`: User profile management.
    *   `ForgotPassword.jsx`: Password recovery flow.
*   `utils/`: Helper functions and validation schemas (`validation.js`).

### Server Structure (`/server`)
*   `controllers/`: Logic for handling API requests.
    *   `authController.js`: Login, register.
    *   `rideController.js`: CRUD operations for rides.
    *   `requestController.js`: Handling booking requests.
    *   `profileController.js`: User profile management.
    *   `forgotPasswordController.js`: OTP and password reset logic.
*   `models/`: Mongoose database schemas.
    *   `User.js`: User data (name, email, password, profile).
    *   `Ride.js`: Ride details (origin, destination, price, seats).
    *   `Request.js`: Booking request status.
*   `routes/`: API route definitions mapping URLs to controllers.
*   `middleware/`: Custom middleware (e.g., `auth.js` for verifying JWTs).
*   `utils/`: Helper utilities (`emailService.js`, `generateOtp.js`).

---

## 4. API Documentation

### Authentication (`/api/auth`)
*   **POST** `/register`: Create a new user account.
*   **POST** `/login`: Authenticate user and return JWT.
*   **POST** `/forgot-password`: Send OTP to user's email.
*   **POST** `/verify-otp`: Verify the received OTP.
*   **POST** `/reset-password`: Set a new password after verification.

### Rides (`/api/rides`)
*   **GET** `/`: Search for rides (supports query params: `from`, `to`, `date`).
*   **POST** `/`: Create a new ride (Protected).
*   **GET** `/my-rides`: Get rides created by the logged-in user (Protected).
*   **DELETE** `/:id`: Cancel a ride (Protected).

### Requests (`/api/requests`)
*   **POST** `/`: Request a seat on a ride (Protected).
*   **GET** `/my-requests`: Get requests made by the user (Protected).
*   **GET** `/ride/:rideId`: Get all requests for a specific ride (Protected, Driver only).
*   **PATCH** `/:id/status`: Update request status (Accept/Reject) (Protected, Driver only).

### Profile (`/api/profile`)
*   **GET** `/`: Get logged-in user's profile.
*   **PUT** `/`: Update profile details (bio, address, etc.).
*   **GET** `/:userId`: Get public profile of another user.
*   **POST** `/:userId/rate`: Rate a user (Protected).

---

## 5. Key Features & Pages

1.  **Home Page (`/`)**:
    *   Professional landing page with a "How It Works" roadmap.
    *   Testimonials/Reviews section with generated user avatars.
    *   Call-to-action buttons for finding or offering rides.

2.  **Authentication**:
    *   Secure Login and Registration with form validation.
    *   "Forgot Password" flow using email OTP (ZeptoMail integration).

3.  **Dashboard (`/dashboard`)**:
    *   Overview of user activity.
    *   Quick links to manage rides and view stats.

4.  **Find a Ride (`/rides`)**:
    *   Search interface with filters for destination, date, and seat count.
    *   Interactive map showing ride routes.
    *   List of available rides with driver details and price.

5.  **Offer a Ride (`/create-ride`)**:
    *   Form to publish a ride.
    *   Auto-fills user contact info.
    *   Geocoding integration to select precise locations.

6.  **Profile (`/profile`)**:
    *   View and edit personal information.
    *   See ratings and reviews from other users.

---

## 6. Setup & Running

The project is configured to run both client and server with a single command.

1.  **Prerequisites**: Node.js and MongoDB installed.
2.  **Installation**:
    ```bash
    npm install              # Install root dependencies
    cd client && npm install # Install frontend dependencies
    cd ../server && npm install # Install backend dependencies
    ```
3.  **Environment Variables**: Ensure `.env` files are set up in `server/` (DB URI, JWT Secret, Email Config).
4.  **Run**:
    ```bash
    npm run dev              # Runs both Client (Vite) and Server (Nodemon)
    ```
