🏠 SafeStay – Smart Hostel Management Network

«One platform. Every hostel operation. Safer stays.»

SafeStay is a full-stack smart hostel and PG management platform designed to connect Students, Parents, Wardens, and Administrators through a unified digital ecosystem.

It simplifies hostel operations such as room allocation, fee management, attendance, complaints, announcements, emergency safety monitoring, and communication through a responsive web application and companion mobile app.

---

🌐 Platform Overview

SafeStay consists of two connected platforms:

💻 SafeStay Web Application

A responsive web platform for:

- 👨‍🎓 Students
- 👨‍👩‍👧 Parents
- 👮 Wardens
- 🛡️ Administrators

📱 SafeStay Mobile Application

A mobile-first companion application that allows students and other users to access important hostel services directly from their smartphones.

---

✨ Key Features

👨‍🎓 Student Module

- 🔐 Secure authentication
- 🏠 View room details and allocation
- 💰 Hostel fee and payment tracking
- 📝 Submit complaints and maintenance requests
- 📅 Attendance and check-in tracking
- 📢 View hostel announcements
- 🚨 Emergency / SOS assistance
- 👤 Manage personal profile
- 📊 View hostel-related information from a single dashboard

👨‍👩‍👧 Parent Module

- 📊 Monitor student's hostel activity
- 💰 View fee/payment information
- 📅 Track attendance
- 📢 Receive important announcements
- 🚨 Access emergency information
- 👤 View student details

👮 Warden Module

- 👥 Manage students
- 🏠 Monitor rooms and occupancy
- 📅 Track attendance
- 📝 Manage complaints
- 🔧 Track maintenance requests
- 📢 Publish announcements
- 🚨 Monitor emergency alerts
- 📊 Access hostel activity dashboards

🛡️ Admin Module

- 👥 User management
- 🏢 Hostel management
- 🏠 Room and bed allocation
- 💳 Fee and payment management
- 📋 Complaint management
- 📢 Announcement management
- 📊 Hostel analytics and dashboards
- 🔐 Role-Based Access Control
- 🚨 Emergency monitoring

---

🚨 Smart Safety System

Safety is one of the core components of SafeStay.

The platform includes an emergency monitoring workflow designed to help identify and respond to student distress situations.

Safety Workflow

Student
   ↓
Emergency / SOS Trigger
   ↓
Safety Monitoring System
   ↓
Warden / Admin Alert
   ↓
Emergency Response
   ↓
Parent / Relevant Contact Notification

The system is designed to provide a structured digital workflow for handling hostel safety incidents.

---

🏗️ System Architecture

                  ┌─────────────────────┐
                  │     SafeStay        │
                  │   Smart Platform    │
                  └──────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
       ┌──────▼──────┐               ┌──────▼──────┐
       │   Website   │               │ Mobile App  │
       │   Frontend  │               │   Frontend  │
       └──────┬──────┘               └──────┬──────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                      ┌──────▼──────┐
                      │ REST APIs   │
                      │ Spring Boot │
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼─────┐
        │ MySQL DB  │  │ FastAPI /  │  │ External │
        │           │  │ ML Service │  │ Services │
        └───────────┘  └────────────┘  └──────────┘

---

🛠️ Technology Stack

Frontend – Web

- React.js
- HTML5
- CSS3
- JavaScript
- Responsive UI
- Modern component-based architecture

Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- REST APIs
- JWT Authentication
- Role-Based Access Control

Database

- MySQL

AI / Safety Services

- Python
- FastAPI
- Machine Learning integration
- Audio distress detection workflow

Mobile Application

- Flutter
- Dart
- REST API integration
- Responsive mobile UI

Development Tools

- Git
- GitHub
- VS Code
- IntelliJ IDEA
- Postman

---

🔐 Authentication & Authorization

SafeStay uses secure authentication and role-based authorization.

                    Login
                      │
                      ▼
               Authentication
                      │
                      ▼
                 JWT Token
                      │
                      ▼
              Role Identification
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Student       Warden         Admin
        │             │             │
        └─────────────┼─────────────┘
                      ▼
               Authorized APIs

Different users receive access only to the features relevant to their role.

---

📱 Mobile Application

SafeStay also includes a dedicated mobile application for convenient access to hostel services.

Mobile App Features

- 🔐 Login & authentication
- 🏠 Hostel / room information
- 📅 Attendance
- 💰 Fee information
- 📝 Complaints
- 📢 Announcements
- 🚨 Emergency assistance
- 👤 Profile management
- 📊 Dashboard

---

💻 Web Application

The SafeStay web platform provides role-specific dashboards for managing hostel operations.

Main Web Modules

Dashboard
│
├── Students
├── Parents
├── Wardens
├── Admin
│
├── Rooms & Allocation
├── Attendance
├── Fees & Payments
├── Complaints
├── Maintenance
├── Announcements
└── Emergency Monitoring

---

📸 Screenshots

Web Application

Add your website screenshots here:

docs/
├── web-dashboard.png
├── student-dashboard.png
├── parent-dashboard.png
├── warden-dashboard.png
└── admin-dashboard.png

Example:

"SafeStay Web Dashboard" (docs/web-dashboard.png)

---

📱 Mobile Application

Add your mobile screenshots here:

docs/
├── mobile-login.png
├── mobile-dashboard.png
├── mobile-attendance.png
├── mobile-fees.png
└── mobile-sos.png

Example:

"SafeStay Mobile App" (docs/mobile-dashboard.png)

---

🌐 Live Demo

💻 Website

Live Website:
"PASTE_YOUR_DEPLOYED_WEBSITE_LINK_HERE"

📱 Mobile App

App Demo / APK:
"PASTE_YOUR_APP_LINK_HERE"

🎥 Project Demo

Demo Video:
"PASTE_YOUR_DEMO_VIDEO_LINK_HERE"

---

📲 QR Code

Scan the QR code to open the SafeStay application/demo.

Add your QR image to:

docs/safestay-qr.png

Then add:

![SafeStay QR Code](docs/safestay-qr.png)

---

📂 Project Structure

SafeStay/
│
├── frontend/
│   └── safestay-web/
│
├── mobile/
│   └── safestay-app/
│
├── backend/
│   └── safestay-api/
│
├── ai-service/
│   └── safety-monitoring/
│
├── database/
│   └── schema.sql
│
├── docs/
│   ├── web-dashboard.png
│   ├── mobile-dashboard.png
│   ├── mobile-sos.png
│   └── safestay-qr.png
│
└── README.md

---

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/YOUR_USERNAME/SafeStay.git

cd SafeStay

---

2️⃣ Backend Setup

Navigate to the backend:

cd backend/safestay-api

Configure your database credentials in:

application.properties

Example:

spring.datasource.url=jdbc:mysql://localhost:3306/safestay
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update

Run the Spring Boot application:

./mvnw spring-boot:run

The backend will run on:

http://localhost:8080

---

🐍 AI Service Setup

Navigate to the AI service:

cd ai-service/safety-monitoring

Install dependencies:

pip install -r requirements.txt

Run FastAPI:

uvicorn main:app --reload

The service will be available at:

http://localhost:8000

---

💻 Web Setup

Navigate to the frontend:

cd frontend/safestay-web

Install dependencies:

npm install

Start development server:

npm run dev

Open:

http://localhost:5173

---

📱 Mobile App Setup

Navigate to the Flutter project:

cd mobile/safestay-app

Install packages:

flutter pub get

Run the application:

flutter run

---

🔄 Application Flow

User
 │
 ▼
Login / Registration
 │
 ▼
Role Verification
 │
 ├───────────────┐
 │               │
 ▼               ▼
Student        Staff/Admin
 │               │
 ▼               ▼
Dashboard      Management
 │               │
 ├── Room        ├── Rooms
 ├── Fees        ├── Students
 ├── Attendance  ├── Fees
 ├── Complaints  ├── Complaints
 ├── Announcements
 └── SOS         └── Safety

---

🎯 Problem Statement

Traditional hostel management often depends on disconnected systems, manual records, paper-based processes, and communication through multiple channels.

This can make it difficult to:

- Track hostel occupancy
- Monitor attendance
- Manage fees
- Resolve complaints
- Communicate announcements
- Handle emergency situations
- Provide parents with relevant information

SafeStay addresses these challenges by bringing the major hostel operations into one centralized digital platform.

---

💡 Solution

SafeStay provides a unified platform where:

Students can access hostel services.

Parents can monitor important student information.

Wardens can manage daily hostel operations.

Administrators can manage the complete hostel ecosystem.

The web application and mobile application work together through backend APIs to provide a consistent experience across devices.

---

🌟 Future Enhancements

- 🤖 Advanced AI-based safety detection
- 📍 Real-time location sharing during emergencies
- 🔔 Push notifications
- 💳 Online payment gateway integration
- 📷 Smart CCTV integration
- 🧑‍💻 AI chatbot for hostel support
- 📊 Advanced predictive analytics
- 🏢 Multi-hostel / multi-campus management
- 🪪 Digital hostel ID
- 📈 AI-powered occupancy prediction

---

👩‍💻 Developer

Soniya Kamireddy

B.Tech – Information Technology

Interested in:

- Full Stack Development
- Java Backend Development
- AI/ML
- Software Engineering

Connect

- GitHub: "https://github.com/Soniyakamireddy388"
- LinkedIn: "https://linkedin.com/in/soniya-kamireddy-6507382a1/"

---

📜 License

This project is developed for academic, learning, and demonstration purposes.

© 2026 Soniya Kamireddy. All rights reserved.

---

⭐ SafeStay

Smart Hostel Management Network

«Manage smarter. Stay safer.»
