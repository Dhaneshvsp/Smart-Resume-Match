# Smart Resume Match: AI-Powered Recruitment Solution

![Smart Resume Match Hero](./assests/hero-screenshot.png)

**Live Demo:** https://smart-resume-match-rfpe.onrender.com <!-- Replace with your deployed frontend URL -->

---

## About The Project

In today's competitive job market, recruiters spend countless hours manually sifting through hundreds, sometimes thousands, of resumes for a single job opening. This process is not only time-consuming but also prone to human bias and inconsistency.

**Smart Resume Match** is a modern, AI-powered Applicant Tracking System (ATS) designed to solve this problem. It leverages Natural Language Processing (NLP) to intelligently analyze and rank multiple resumes against a job description, providing recruiters with an instant, data-driven shortlist of the most qualified candidates. This allows hiring managers to focus their valuable time on interviewing the best talent, not just finding them.

The system is built on a robust microservice architecture, ensuring scalability and maintainability. It also features a unique "Continuous Learning" mechanism, where the AI's scoring adapts and improves based on the recruiter's feedback (approving or rejecting candidates), making the system smarter with every hire.

### Key Features

* **🤖 AI-Powered Analysis:** Utilizes a custom NLP engine (Python & spaCy) to perform semantic matching that goes beyond simple keywords.
* **🚀 Bulk Candidate Shortlisting:** Upload dozens of resumes at once and receive an instantly ranked list of candidates based on their match score.
* **🧠 Adaptive Learning:** The AI learns from recruiter feedback. Skills from "Approved" candidates are given more weight in future analyses, tailoring the results to the recruiter's preferences.
* **🗂️ Job Analysis History:** Every analysis is saved. Recruiters can revisit past jobs, view ranked lists, and manage their candidate pipeline.
* **📝 Recruiter Notes & Candidate Status:** Add private notes to each candidate and track their status (Pending, Approved, Rejected) directly within the system.
* **🔐 Secure Authentication:** Full user management system with JWT-based authentication, profile updates.
* **✨ Modern UI/UX:** A clean, responsive, and intuitive user interface built with React and Tailwind CSS.

---

## Built With

This project is a full-stack application with a microservice architecture.

* **Frontend:**
    * [React.js](https://reactjs.org/)
    * [Vite](https://vitejs.dev/)
    * [Tailwind CSS](https://tailwindcss.com/)
    * [Axios](https://axios-http.com/)
* **Backend (API Gateway):**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
    * [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
    * [JSON Web Token (JWT)](https://jwt.io/) for authentication
    * [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) for password hashing
* **Backend (NLP Service):**
    * [Python](https://www.python.org/)
    * [Flask](https://flask.palletsprojects.com/)
    * [spaCy](https://spacy.io/) for Natural Language Processing

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* **Node.js** (v16 or later)
* **npm** (Node Package Manager)
* **Python** (v3.9 or later) & **pip**
* **MongoDB Atlas Account** or a local MongoDB instance

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://Dhaneshvsp/smart-resume-match.git
    cd smart-resume-match
    ```

2.  **Setup the Backend (Node.js):**
    * Navigate to the backend folder: `cd backend`
    * Install npm packages: `npm install`
    * Create a `.env` file in the `/backend` directory and add the following variables:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        # This should point to your local Python service
        NLP_SERVICE_URL=http://127.0.0.1:5001/analyze
        ```

3.  **Setup the NLP Service (Python):**
    * Navigate to the NLP service folder: `cd ../nlp-service`
    * Create and activate a virtual environment:
        ```sh
        python -m venv venv
        # On Windows
        .\venv\Scripts\activate
        # On macOS/Linux
        source venv/bin/activate
        ```
    * Install Python packages: `pip install -r requirements.txt`
    * Create a `.env` file in the `/nlp-service` directory for the email feature (you can use dummy values if you don't want to set it up now):
        ```env
        MAIL_SERVER=smtp.gmail.com
        MAIL_PORT=587
        MAIL_USE_TLS=true
        MAIL_USERNAME=your-email@gmail.com
        MAIL_PASSWORD=your_gmail_app_password
        ```

4.  **Setup the Frontend (React):**
    * Navigate to the frontend folder: `cd ../frontend`
    * Install npm packages: `npm install`
    * The frontend is configured to use a proxy in `vite.config.js` for local development, so no `.env` file is needed.

### Running the Application

You need to run all three services concurrently in separate terminal windows.

1.  **Start the Backend:**
    * In the `/backend` directory, run:
        ```sh
        npm start
        ```

2.  **Start the NLP Service:**
    * In the `/nlp-service` directory (with your virtual environment activated), run:
        ```sh
        python app.py
        ```

3.  **Start the Frontend:**
    * In the `/frontend` directory, run:
        ```sh
        npm run dev
        ```

Your application should now be running! Open your browser to `http://localhost:3000` (or the port specified in your terminal).

---
