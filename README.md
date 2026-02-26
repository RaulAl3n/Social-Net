# 👥 Social Net

**Social Net** is a web application that was made initially to test and enhance my abilities in database queries and Java backend integration.

---

## 🌍 Overview

Social Net currently allows users to:

- Create an account
- Store user data in a SQLite database
- Create posts
- Display posts on the application's main page

This first version focuses on backend structure and database integration.
Future versions will introduce authentication, improved querying, and additional social media features.

---

## 🌐 Base Architecture — SQLite × Maven x Java

The backend was built using:

- ☕ Java
- 📦 Maven
- 🗄 SQLite
- 🌱 Spring Boot (if you're using it — remove if not)

### Architecture Goals

- Clear separation of concerns
- Organized package structure
- Database normalization
- SQL query practice
- Local persistence without external dependencies

The project uses SQLite as a lightweight relational database, ideal for development and testing environments.

## 🗄 Database Structure

```
   -- SQLite
CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
   ```
# How to run the project

## 1. Clone and install:
```
git clone https://github.com/yourusername/social-net.git
cd social-net
```

## 2. Run the backend
   If using Maven:
```
mvn spring-boot:run
```
Or run directly on your IDE

## 3. Run Locally
```
npm run dev
```

## Owner
- Raul Scalassara Alencar




