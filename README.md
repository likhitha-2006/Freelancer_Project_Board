# Freelancer Project Board

A full-stack freelancing marketplace that connects clients with freelancers through project postings, proposals, milestone tracking, real-time communication, and escrow-related workflows.

🔗 **Live Demo:** https://effortless-truffle-5b1a33.netlify.app/

---

## 📌 Overview

Freelancer Project Board is a web-based marketplace designed to simplify collaboration between clients and freelancers.

Clients can publish projects, review freelancer proposals, manage project milestones, and communicate with freelancers. Freelancers can explore available opportunities, submit proposals, manage their work, and interact with clients.

The platform also includes user authentication, role-based access, identity verification, dispute management, reviews, and administrative features.

---

## ✨ Key Features

### 👤 User Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected routes and role-based access.

### 💼 Project Management
- Clients can create and manage projects.
- Freelancers can browse available projects.
- Project details and status management.
- Dedicated dashboards for clients and freelancers.

### 📄 Proposal Management
- Freelancers can submit project proposals.
- Clients can review submitted proposals.
- Proposal-related project workflows.

### 📊 Milestone Management
- Organize projects into milestones.
- Track milestone progress and status.
- Manage milestone-related workflows.

### 💰 Escrow Management
- Escrow transaction records and management workflows.
- Dedicated escrow interface.
- Integration with project milestone workflows.

*Note: The escrow module represents application-level functionality; it should not be interpreted as a live payment gateway integration.*

### 💬 Real-Time Communication
- Socket.IO-based communication infrastructure.
- Real-time messaging functionality.
- Client and freelancer communication.

### 🛡️ Dispute Management
- Dispute-related project workflows.
- Dedicated dispute management interface.
- Administrative dispute handling.

### ⭐ Reviews and Ratings
- Review management.
- Feedback functionality for marketplace interactions.

### 🪪 Identity Verification
- Identity verification workflow.
- Verification status and badges.

### ⚙️ Admin Dashboard
- Dedicated administrative dashboard.
- User and marketplace management functionality.
- Administrative controls for platform operations.

### 📧 Email Notifications
- Nodemailer-based email notification functionality.
- SMTP configuration support.

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | Component-based user interface |
| JavaScript | Frontend application logic |
| Vite 5 | Development server and build tool |
| Tailwind CSS 3 | UI styling |
| React Router DOM 6 | Client-side routing |
| Axios | API communication |
| Socket.IO Client 4 | Real-time communication |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js 4 | Backend server and API framework |
| MongoDB | Database |
| Mongoose 8 | MongoDB object modelling |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Socket.IO 4 | Real-time communication |
| Multer | File upload handling |
| Nodemailer | Email notifications |
| dotenv | Environment configuration |
| CORS | Cross-origin resource sharing |

### Development Dependencies
- MongoDB Memory Server
- PostCSS
- Autoprefixer
- Vite React Plugin

---

## 🏗️ Application Architecture

The application follows a frontend-backend architecture.

```text
             CLIENT / FREELANCER
                     |
                     v
             React Frontend
             (Vite + Tailwind)
                     |
          +----------+----------+
          |                     |
          v                     v
     REST API              Socket.IO
          |               Real-Time Events
          v
     Express Server
          |
    +-----+------------------+
    |     |        |         |
    v     v        v         v
  Routes Controllers Middleware
    |        |
    +--------+
         |
         v
       Models
         |
         v
      MongoDB
```

---

## 📂 Project Structure

```text
Freelancer_Project_Board/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── jwt.js
│   │   └── multer.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── disputeController.js
│   │   ├── escrowController.js
│   │   ├── messageController.js
│   │   ├── milestoneController.js
│   │   ├── projectController.js
│   │   ├── proposalController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   └── verificationController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Dispute.js
│   │   ├── EscrowTransaction.js
│   │   ├── Message.js
│   │   ├── Milestone.js
│   │   ├── Project.js
│   │   ├── Proposal.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Verification.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── disputeRoutes.js
│   │   ├── escrowRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── milestoneRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── proposalRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   └── verificationRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── seedData.js
│   │   └── sendEmail.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   ├── EscrowModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MilestoneModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProposalModal.jsx
│   │   │   └── VerificationBadge.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── DisputesPage.jsx
│   │   │   ├── EditProject.jsx
│   │   │   ├── FreelancerDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── IdentityVerification.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PostProject.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── ProjectsList.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── .gitignore
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB (local installation or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/likhitha-2006/Freelancer_Project_Board.git
```

```bash
cd Freelancer_Project_Board
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

SMTP variables are optional if email notifications are not being configured.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite will display the local development URL in your terminal, usually:

```text
http://localhost:5173
```

---

## 📜 Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm start` | Starts the backend server |
| `npm run dev` | Starts the server in Node.js watch mode |
| `npm run seed` | Runs the seed data script |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build |
| `npm run preview` | Previews the production build |
| `npm run lint` | Runs ESLint |

---

## 🗄️ Database Models

The backend contains the following Mongoose models:

| Model | Responsibility |
|---|---|
| User | User account information |
| Project | Project details |
| Proposal | Freelancer proposals |
| Milestone | Project milestone records |
| EscrowTransaction | Escrow transaction records |
| Message | Communication records |
| Dispute | Dispute records |
| Review | Review and feedback records |
| Verification | Identity verification records |

---

## 🔐 Security and Access Control

The application includes:

- JWT-based authentication.
- Password hashing using bcryptjs.
- Authentication middleware.
- Role-based authorization middleware.
- Protected frontend routes.
- Environment-based configuration.

---

## 🌐 Deployment

**Live Application:**  
https://effortless-truffle-5b1a33.netlify.app/

**GitHub Repository:**  
https://github.com/likhitha-2006/Freelancer_Project_Board

The frontend is deployed on Netlify. Backend functionality requires a reachable backend service and correctly configured database, environment variables, and API/socket connectivity.

---

## 🔮 Future Enhancements

- Payment gateway integration.
- Advanced project recommendation system.
- Enhanced analytics and reporting.
- Improved notification management.
- Additional marketplace automation features.

---

## 👩‍💻 Author

**Likhitha**

GitHub: https://github.com/likhitha-2006

---

⭐ If you find this project interesting, consider giving the repository a star!
