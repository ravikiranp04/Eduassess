# EduAssess — Scalable Online Assessment Platform

A scalable online assessment platform built with a microservices architecture, featuring JWT-based authentication, role-based access control, and high-performance Redis caching. Includes an AI-powered **proctoring microservice** using **Facebook's DETR (DEtection TRansformer)** with a ResNet-50 backbone — detects people and mobile phones in the webcam feed during assessments. The React frontend calls `POST /detect` on each frame, checks the returned labels, and flags a cheating attempt if more than one person or a mobile phone is detected. After 3 flags the test auto-submits. Load tested with 200+ concurrent users.

---

## Performance Highlights

| Metric | Before | After |
|---|---|---|
| API Response Time | ~200 ms | **8 ms** |
| Architecture | Monolithic | Microservices |
| Concurrent Users Tested | — | **200+** |

Redis caching was applied across all microservices, achieving a **96% reduction in API response time**.

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   React.js  │────▶│   Node.js Backend    │────▶│   MongoDB   │
│  Frontend   │     │  (JWT · RBAC · REST) │     │  Database   │
└─────────────┘     └──────────┬───────────┘     └─────────────┘
                               │
                        ┌──────▼──────┐
                        │    Redis    │
                        │    Cache    │
                        └──────┬──────┘
                               │
                    ┌──────────▼──────────────────┐
                    │   Flask Proctoring Service   │
                    │  DETR (ResNet-50)            │
                    │  POST /detect → labels[]     │
                    └──────────────────────────────┘
                    (flag logic: React frontend checks
                     >1 person or mobile → 3 flags
                     → auto-submit)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express |
| Proctoring Service | Flask, Facebook DETR (ResNet-50 backbone), HuggingFace Transformers |
| Database | MongoDB |
| Caching | Redis |
| Auth | JWT, Role-Based Access Control |

---

## Key Features

- **Stateless, scalable microservices** — each service independently deployable
- **JWT Authentication** with role-based access control (Admin / Teacher / Student)
- **Redis caching** across all microservices — cuts response time from 200ms → 8ms
- **AI proctoring** via Facebook's DETR (ResNet-50) — Flask service detects objects at 0.9 confidence threshold and returns labels; React frontend checks for >1 person or any mobile phone and increments a flag counter. After 3 flags, the test auto-submits
- **Integration tested** across all microservices to ensure cross-service reliability
- **Load tested** with 200+ concurrent users

---

## Getting Started

### Prerequisites

- Node.js `16.x` or above
- MongoDB (local or Atlas)
- Redis server running locally (`redis-server`)
- Python 3.8+ (for AI microservice)

### 1. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```
PORT=5000
DB_URL=<your_mongodb_connection_string>
SECRET_KEY=<your_jwt_secret>
REDIS_URL=redis://localhost:6379
```

Start the server:

```bash
node server.js
```

### 2. AI Microservice Setup

```bash
cd AI_model
pip install flask flask-cors torch torchvision transformers pillow
python app.py
```

> On first run, `facebook/detr-resnet-50` weights (~160MB) will be downloaded automatically from HuggingFace.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Project Structure

```
EduAssess/
├── Backend/          # Node.js REST API with JWT auth & Redis caching
├── AI_model/         # Flask proctoring service — DETR cheating detection (POST /detect)
├── frontend/         # React.js UI
└── requests.http     # API test collection
```

---

## Author

**Ravikiran Pedapalli**  
[LinkedIn](https://linkedin.com/in/pedapalli-ravi-kiran-ab5006254)
