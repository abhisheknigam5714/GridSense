# ⚡ Smart Local Power Outage Tracker

A full-stack web application that enables citizens to report, track, and get real-time alerts about power outages in their locality — identified by **pincode**. Built with **Spring Boot** on the backend and **React.js** on the frontend, featuring WebSocket-based live updates, JWT security, email notifications, and outage risk prediction.

> 🚧 **Status:** In Active Development

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [WebSocket Events](#-websocket-events)
- [Role-Based Access](#-role-based-access)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)

---

## ✨ Features

### 👤 User Features
- Register and login with pincode-based area mapping
- Report a new power outage in your locality
- View all active outages filtered by your pincode
- Get real-time push notifications via WebSocket when outage status changes
- See a **risk prediction badge** (Low / Medium / High) for your area based on 30-day history
- Receive automatic **email alerts** when an outage is confirmed in your pincode

### 🛡️ Admin Features
- View all reported outages across all pincodes
- Confirm and resolve outages
- Broadcast **planned maintenance alerts** to all users of a pincode (via email + WebSocket)
- Access live statistics: today's reported, confirmed, and resolved counts
- Full admin dashboard with `AdminTable` and outage management controls

### ⚙️ System Features
- Stateless JWT authentication with BCrypt password hashing
- Role-based access control (`ROLE_USER` / `ROLE_ADMIN`)
- Real-time WebSocket channels per pincode (`/topic/outages/{pincode}`)
- Outage lifecycle: `REPORTED → CONFIRMED → RESOLVED`
- Automated email delivery via JavaMailSender
- Risk engine analysing last 30 days of outage frequency per pincode
- Swagger / OpenAPI 3.0 interactive API documentation
- Auto-seeded default admin user on startup
- CORS configured for frontend origin

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Language | Java 17+ |
| Framework | Spring Boot, Spring MVC |
| Security | Spring Security, JWT (jjwt), BCrypt |
| Real-time | WebSocket, STOMP, SockJS |
| Database | MySQL, Spring Data JPA, Hibernate ORM |
| Email | JavaMailSender, SMTP |
| API Docs | Swagger UI, OpenAPI 3.0 |
| Build | Maven |
| Utilities | Lombok, Bean Validation |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React.js |
| Routing | React Router DOM |
| State | Context API |
| HTTP | Axios |
| Real-time | SockJS + STOMP client |
| Maps | Leaflet.js |
| Styling | TailwindCSS / Bootstrap 5 |
| Notifications | Toast Alerts |

---

## 📁 Project Structure

```
smart-outage-tracker/
│
├── backend/
│   └── src/main/java/com/outage/tracker/
│       ├── config/
│       │   ├── DataSeeder.java           # Seeds default admin on startup
│       │   └── OpenApiConfig.java        # Swagger/OpenAPI 3.0 config
│       ├── security/
│       │   ├── JwtUtil.java              # JWT generation & validation
│       │   ├── JwtAuthFilter.java        # Request-level JWT filter
│       │   ├── SecurityConfig.java       # Spring Security config + CORS
│       │   └── CustomUserDetailsService.java
│       ├── service/
│       │   ├── AuthService.java          # Register, login, current user
│       │   ├── OutageService.java        # Outage lifecycle management
│       │   ├── PredictionService.java    # 30-day risk prediction engine
│       │   ├── EmailService.java         # Outage + maintenance email alerts
│       │   └── MaintenanceAlertService.java
│       ├── websocket/
│       │   ├── WebSocketConfig.java      # STOMP + SockJS config
│       │   └── OutageWebSocketController.java
│       ├── dto/
│       │   ├── AuthResponse.java
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   ├── OutageRequest.java
│       │   ├── OutageResponse.java
│       │   ├── PredictionResponse.java
│       │   ├── MaintenanceAlertRequest.java
│       │   ├── MaintenanceAlertResponse.java
│       │   ├── WebSocketMessage.java
│       │   └── MessageResponse.java
│       ├── model/
│       │   ├── User.java
│       │   ├── OutageReport.java
│       │   ├── OutageStatus.java         # REPORTED | CONFIRMED | RESOLVED
│       │   └── Role.java                 # ROLE_USER | ROLE_ADMIN
│       └── repository/
│           ├── UserRepository.java
│           └── OutageReportRepository.java
│
└── frontend/
    └── src/
        ├── components/
        │   ├── AdminTable.jsx            # Admin outage management table
        │   ├── OutageCard.jsx            # Outage detail card
        │   ├── PredictionBadge.jsx       # Low/Medium/High risk badge
        │   ├── ReportForm.jsx            # Citizen outage report form
        │   └── ToastAlert.jsx            # Real-time toast notifications
        └── pages/
            ├── Home.jsx                  # Landing + active outages view
            ├── Login.jsx                 # User login
            ├── Register.jsx              # User registration
            ├── Report.jsx                # Report a new outage
            ├── Admin.jsx                 # Admin dashboard
            └── MapView.jsx               # Geographic outage map
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-outage-tracker.git
cd smart-outage-tracker
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE outage_tracker;
```

### 3. Set Environment Variables

Create `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/outage_tracker
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your_super_secret_key_minimum_32_characters
jwt.expiration=86400000

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# App
app.frontend-url=http://localhost:5173
cors.allowed-origins=http://localhost:5173
```

### 4. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

Default admin credentials (auto-seeded):
```
Email:    admin@outage.com
Password: admin123
```

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: `http://localhost:5173`

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `spring.datasource.url` | MySQL connection URL |
| `spring.datasource.username` | DB username |
| `spring.datasource.password` | DB password |
| `jwt.secret` | Secret key for JWT signing (min 32 chars) |
| `jwt.expiration` | JWT expiry in milliseconds (default: 24h) |
| `spring.mail.username` | Gmail address for sending alerts |
| `spring.mail.password` | Gmail App Password (not your account password) |
| `app.frontend-url` | Frontend URL for email links |
| `cors.allowed-origins` | Comma-separated allowed CORS origins |

---

## 📖 API Documentation

Once the backend is running, visit:

```
http://localhost:8080/swagger-ui/index.html
```

### Key Endpoints

#### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and get JWT token |

#### Outages
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/outages/active` | Public | Get active outages (filter by `?pincode=`) |
| `POST` | `/api/outages/report` | User | Report a new outage |
| `GET` | `/api/outages/all` | Admin | Get all outages |
| `PUT` | `/api/outages/resolve/{id}` | Admin | Resolve an outage |
| `GET` | `/api/outages/predict` | Public | Get risk prediction for pincode |

#### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/admin/maintenance-alert` | Admin | Send planned maintenance alert |

---

## 🔌 WebSocket Events

Connect to: `ws://localhost:8080/ws` (via SockJS)

Subscribe to pincode-specific channel:
```
/topic/outages/{pincode}
```

### Message Types

| Type | Trigger | Description |
|------|---------|-------------|
| `OUTAGE_REPORTED` | New outage submitted | Outage reported in your area |
| `OUTAGE_CONFIRMED` | Admin confirms outage | Outage confirmed — email also sent |
| `OUTAGE_RESOLVED` | Admin resolves outage | Power restored in your area |
| `MAINTENANCE_ALERT` | Admin broadcasts | Planned maintenance incoming |
| `SUBSCRIPTION_CONFIRMED` | On subscribe | Channel subscription acknowledged |

---

## 👥 Role-Based Access

| Endpoint | `ROLE_USER` | `ROLE_ADMIN` |
|----------|-------------|--------------|
| View active outages | ✅ | ✅ |
| Report outage | ✅ | ✅ |
| Confirm / resolve outage | ❌ | ✅ |
| View all outages | ❌ | ✅ |
| Send maintenance alert | ❌ | ✅ |
| Access admin dashboard | ❌ | ✅ |

---

## 📸 Screenshots

> Coming soon — frontend UI in progress.

---

## 🗺 Roadmap

- [x] JWT authentication with RBAC
- [x] Outage reporting and lifecycle management
- [x] Real-time WebSocket notifications
- [x] Email alerts on confirmation and maintenance
- [x] Risk prediction engine (30-day history)
- [x] Admin maintenance broadcast
- [x] Swagger / OpenAPI documentation
- [ ] Frontend map integration (Leaflet.js)
- [ ] Mobile responsive UI
- [ ] Push notification support
- [ ] Docker Compose deployment
- [ ] Admin analytics dashboard with charts
- [ ] Multi-language support

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abhishek Nigam**
- LinkedIn: [linkedin.com/in/abhishek-nigam100](https://linkedin.com/in/abhishek-nigam100)
- Email: an5714170@gmail.com

---

> ⚡ Built with passion to solve a real problem — because nobody should be left in the dark without answers.
