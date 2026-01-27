# 🏨 HotelSphere - Full Stack Hotel Management System

HotelSphere is a comprehensive web application designed to streamline hotel operations. It features a dual-interface system for **Guests** to search and book rooms, and **Admins** to manage inventory, revenue, and services.

Built with **Spring Boot** (Backend) and **React.js** (Frontend) with a MySQL database.

## 🚀 Tech Stack

- **Frontend:** React.js, Bootstrap 5, Axios, React Router v6
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA
- **Database:** MySQL (Relational Data Model)
- **Tools:** Maven, Lombok, Postman, Eclipse/IntelliJ

## ✨ Key Features

### 👤 User Panel

- **Smart Search:** Filter rooms by dates and type (Luxury, Deluxe, Suite).
- **Secure Booking:** Real-time availability checks preventing double bookings.
- **Payment Gateway:** Integrated mock payment processing (Card/UPI) with status tracking.
- **Service Ordering:** Guests can order food or laundry directly to their room bill.

### 🛠 Admin Dashboard

- **Live Analytics:** View Total Revenue, Active Bookings, and Occupancy rates instantly.
- **Room Management:** Add, update, or delete rooms and set pricing.
- **Booking Control:** View all bookings and handle cancellations.

## ⚙️ Setup & Run

### 1. Backend (Spring Boot)

1.  Clone the repo and open the `backend` folder in Eclipse/IntelliJ.
2.  Update `application.properties` with your MySQL credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/hotel_db
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```
3.  Run `HotelApplication.java`. The server starts at `http://localhost:8080`.

### 2. Frontend (React)

1.  Open the `frontend` folder in VS Code.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the app:
    ```bash
    npm start
    ```
4.  Access the app at `http://localhost:3000`.
