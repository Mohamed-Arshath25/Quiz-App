#  Quiz AI — AI Powered Quiz SaaS Platform


---

##  Overview

**Quiz AI** is a full-stack SaaS-style web application that allows users to generate and take quizzes dynamically using AI. Built with the MERN stack, it provides a modern dashboard experience, real-time quiz generation, and performance tracking.

The platform is designed to simulate real-world learning systems with a clean UI, scalable backend, and intelligent quiz generation.

---

##  Features

###  User Features

* User Authentication (JWT)
* Generate quizzes by topic (AI-powered)
* Timed quiz system
* View scores instantly
* Track performance history

###  Admin Features

*  Admin dashboard
* Add / Edit / Delete questions
* Manage users
*  View quiz analytics

###  AI Features

* Dynamic quiz generation
* Image-based quiz support
* Fallback system (ensures no crashes)

---

## Tech Stack

### Frontend

* React (Vite)
* Bootstrap / Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication

### AI Integration

* Google Gemini API (AI quiz generation)

---

##  Project Structure

```
QuizAI/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   └── layout/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── middleware/
```

---

##  Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/quiz-ai.git
cd quiz-ai
```

---

###  Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

###  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

### Backend `.env`

```env
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

##  Deployment

### Frontend

Deployed on **Vercel**

### Backend

Deployed on **Render**

### Database

Hosted on **MongoDB Atlas**

---

##  Screenshots

> Add screenshots here (dashboard, quiz page, admin panel)

---

## Future Improvements

*  AI explanation for answers
*  Advanced analytics dashboard
*  Multi-language support
*  Mobile app version
*  Real-time multiplayer quizzes

---

##  Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---


##  Acknowledgements

* Google Gemini API
* MongoDB Atlas
* Vercel & Render

---

##  Author

Mohamed Arshath S
📧 [arshatsadiq77@gmail.com)
(https://www.linkedin.com/in/mohamed-arshath-9b2566266/)

---

