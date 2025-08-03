# 🔍 Code Sample Guide – Payd App – Salary On-Demand System

Due to confidentiality, this project structure contains mostly placeholder files. Below are selected files that include actual code samples demonstrating key features such as KYC, user onboarding, authentication, and wage withdrawal logic.

---

## ✅ React (Frontend) Code Sample Files

- [`client/src/App.js`](./client/src/App.js)  
  Renders the main UI layout and integrates core components.

- [`client/src/routes.js`](./client/src/routes.js)  
  Defines application routing structure for different user flows.

- [`client/src/components/UnlockApp.js`](./client/src/components/UnlockApp.js)  
  Handles app unlocking logic via secure PIN verification.

- [`client/src/components/KYC/index.js`](./client/src/components/KYC/index.js)  
  KYC verification logic using Aadhaar, PAN, and Driving License APIs.

- [`client/src/components/Registration/index.js`](./client/src/components/Registration/index.js)  
  Manages user registration, OTP verification, and account setup.

---

## ✅ Node.js (Backend) Code Sample Files

- [`api_node/app.js`](./api_node/app.js)  
  Entry point for the Node.js app; configures middleware, routes, and server.

- [`api_node/routes/worker.js`](./api_node/routes/worker.js)  
  Defines routes for worker actions such as withdrawal, KYC, and profile management.

- [`api_node/middleware/auth.js`](./api_node/middleware/auth.js)  
  Middleware for validating JWT tokens and securing API endpoints.

- [`api_node/controllers/worker.js`](./api_node/controllers/worker.js)  
  Controller logic for handling worker operations: withdrawal, transactions, and profile updates.

---

## 📌 Notes

- All other files are empty or contain dummy content to reflect the real project structure.
- Screenshots and walkthrough video are available upon request.
