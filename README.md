# 🧑‍💻 Fullstack Developer Assessment – User Management Dashboard

## 📌 Objective

To build a full-stack mini web application that simulates a user management dashboard, showcasing proficiency in backend development, REST API integration, authentication, and server-side rendering with Next.js.

---

## 📂 Tech Stack

| Layer          | Tech/Tools                              |
| -------------- | --------------------------------------- |
| **Frontend**   | Next.js (TypeScript, SSR), Tailwind CSS |
| **Backend**    | Node.js (Next.js API Routes)            |
| **Database**   | MongoDB Atlas                           |
| **Auth**       | JWT-based Authentication                |
| **Deployment** | Vercel (Frontend + API)                 |

---

## 🚀 Live Demo

🔗 **Live App**: [https://user-management-dashboard-sooty-one.vercel.app/](#)
📹 **Demo Video**: [Link to 3–5 min video](#)
📁 **GitHub Repo**: [https://github.com/proto-codes/user-management-dashboard](#)

---

## ✅ Features

### 🔐 Authentication

* JWT-based login and protected routes.
* Users must log in to access the dashboard.
* Logout functionality.

### 👤 User Management (CRUD)

* View all users in a paginated table.
* Add new users with form validation.
* Edit user information (name, email, role, status).
* Delete users.
* Upload or simulate profile photos.

### 📋 Dashboard

* Paginated user listing.
* User cards or table layout.
* Mobile responsive.
* Form validation (required fields, email format).

---

## 🔧 Project Structure

```
.
├── /pages
│   ├── /auth
│   │   └── login.tsx
│   ├── /dashboard
│   │   └── index.tsx
│   └── api
│       └── /users (CRUD routes)
├── /components
├── /lib (helpers, db, auth)
├── /models (MongoDB models)
├── /types
├── /styles
├── /public
└── .env
```

---

## 🛠️ Backend Overview

* Built with **Next.js API Routes**.
* MongoDB for user data.
* **JWT** for secure authentication.
* CRUD API Endpoints:

  * `POST /api/auth/login` – Authenticate user.
  * `GET /api/users` – Paginated fetch.
  * `POST /api/users` – Add user.
  * `PUT /api/users/:id` – Update user.
  * `DELETE /api/users/:id` – Remove user.

---

## 💾 Frontend Overview

* Built with **Next.js** and **Tailwind CSS**.
* SSR used on key pages.
* Login page: `/auth/login`
* Dashboard page: `/dashboard`
* Add/Edit modal or page for managing user data.
* Client-side form validation (with react-hook-form or custom logic).

---

## 🧪 Validation & Error Handling

* Backend validation for input fields (e.g., email format).
* Proper error messages for 400/401/500 responses.
* Graceful UI messages on form errors or network failures.

---

## ⚙️ Environment Configuration

```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
NEXT_PUBLIC_API_BASE=<url-if-using-separate-backend>
```

---

## 🧊 Bonus Features

* ✅ Role-based access (Admin can view/edit users).
* ✅ Profile photo upload (mocked).
* ✅ Search/filter users by name, role, or status.
* 🛠️ Basic CI/CD setup with GitHub Actions (optional).

---

## 🐛 Debugging Report

* **Issue**: JWT token was not persisting in SSR pages.

  * **Solution**: Used HttpOnly cookies to manage token securely on both client and server.
* **Issue**: MongoDB connection retries in serverless environment.

  * **Solution**: Reused MongoDB client instance to avoid reinitialization errors.
* **Issue**: Page flicker on protected routes.

  * **Solution**: Added auth guard and loading state in `_app.tsx`.

---

## 📦 Deployment

* **Frontend + API** deployed on **Vercel** using Next.js full-stack capabilities.
* No need for separate backend hosting due to API Routes.

---

## 📄 Submission Checklist

* [x] ✅ CRUD Functionality
* [x] ✅ Authentication with JWT
* [x] ✅ MongoDB Integration
* [x] ✅ Responsive UI
* [x] ✅ Deployment on Vercel
* [x] ✅ GitHub Repository
* [x] ✅ Demo Video
* [x] ✅ Debugging Report

---

## 🧠 Evaluation Criteria Summary

| Category            | Description                                     |
| ------------------- | ----------------------------------------------- |
| **Functionality**   | All key features work (CRUD, auth, pagination). |
| **Code Quality**    | Clean, reusable, modular TypeScript code.       |
| **Backend Design**  | Secure, well-structured API with validation.    |
| **UI/UX**           | Simple, clean, and responsive interface.        |
| **Problem-Solving** | Clear handling of challenges with solutions.    |
| **Deployment**      | Fully deployed and live.                        |

---

## 🔗 Useful Links

* Submission Portal: [https://tinyurl.com/assessmentsubmissionapril2025](https://tinyurl.com/assessmentsubmissionapril2025)
* Support: [https://tinyurl.com/cyzygyrecruitmentsupport2025](https://tinyurl.com/cyzygyrecruitmentsupport2025)

---

**Good luck to everyone participating!**
Feel free to fork or contribute if you're reviewing this project 🌱
